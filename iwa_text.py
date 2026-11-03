"""Extract readable text from Apple iWork .iwa files (snappy-framed protobuf).
Usage: python -I iwa_text.py <extracted_dir>
"""
import os, sys, re, json


def snappy_decompress(data: bytes) -> bytes:
    """Decompress a raw snappy block."""
    pos = 0
    # varint uncompressed length
    ulen = 0; shift = 0
    while True:
        b = data[pos]; pos += 1
        ulen |= (b & 0x7F) << shift
        if b < 0x80: break
        shift += 7
    out = bytearray()
    n = len(data)
    while pos < n:
        tag = data[pos]; pos += 1
        t = tag & 3
        if t == 0:  # literal
            ln = tag >> 2
            if ln < 60:
                ln += 1
            else:
                nb = ln - 59
                ln = int.from_bytes(data[pos:pos+nb], 'little') + 1
                pos += nb
            out += data[pos:pos+ln]; pos += ln
        else:
            if t == 1:
                ln = ((tag >> 2) & 7) + 4
                off = ((tag >> 5) << 8) | data[pos]; pos += 1
            elif t == 2:
                ln = (tag >> 2) + 1
                off = int.from_bytes(data[pos:pos+2], 'little'); pos += 2
            else:
                ln = (tag >> 2) + 1
                off = int.from_bytes(data[pos:pos+4], 'little'); pos += 4
            if off == 0 or off > len(out):
                raise ValueError('bad offset')
            start = len(out) - off
            for i in range(ln):
                out.append(out[start + i])
    return bytes(out)


def iwa_decompress(path: str) -> bytes:
    data = open(path, 'rb').read()
    out = bytearray()
    pos = 0
    while pos < len(data):
        typ = data[pos]
        ln = int.from_bytes(data[pos+1:pos+4], 'little')
        chunk = data[pos+4:pos+4+ln]
        pos += 4 + ln
        if typ == 0:
            out += snappy_decompress(chunk)
        else:
            out += chunk
    return bytes(out)


def read_varint(buf, pos):
    v = 0; shift = 0
    while True:
        b = buf[pos]; pos += 1
        v |= (b & 0x7F) << shift
        if b < 0x80: return v, pos
        shift += 7
        if shift > 70: raise ValueError


TEXT_RE = re.compile(r'[A-Za-zА-Яа-яЁё0-9]')


def walk(buf, depth, acc, maxdepth=12):
    """Generic protobuf walk collecting plausible UTF-8 strings."""
    pos = 0; n = len(buf)
    while pos < n:
        try:
            key, pos = read_varint(buf, pos)
        except Exception:
            return False
        fld, wt = key >> 3, key & 7
        if fld == 0: return False
        if wt == 0:
            try: _, pos = read_varint(buf, pos)
            except Exception: return False
        elif wt == 1:
            pos += 8
        elif wt == 5:
            pos += 4
        elif wt == 2:
            try: ln, pos = read_varint(buf, pos)
            except Exception: return False
            if ln < 0 or pos + ln > n: return False
            sub = buf[pos:pos+ln]; pos += ln
            # try string
            s = None
            try:
                s = sub.decode('utf-8')
            except Exception:
                s = None
            if s is not None and len(s) >= 2 and TEXT_RE.search(s) and all((c.isprintable() or c in '\n\t\r  ') for c in s):
                acc.append(s)
            elif depth < maxdepth and ln > 0:
                sub_acc = []
                if walk(sub, depth + 1, sub_acc, maxdepth):
                    acc.extend(sub_acc)
        else:
            return False
    return True


def parse_archive_info(buf):
    """Return list of message lengths (and types) from an ArchiveInfo message."""
    infos=[]; pos=0; n=len(buf)
    while pos<n:
        key,pos=read_varint(buf,pos); fld,wt=key>>3,key&7
        if wt==0: _,pos=read_varint(buf,pos)
        elif wt==1: pos+=8
        elif wt==5: pos+=4
        elif wt==2:
            ln,pos=read_varint(buf,pos); sub=buf[pos:pos+ln]; pos+=ln
            if fld==2:
                t=None; L=None; p2=0
                while p2<len(sub):
                    k2,p2=read_varint(sub,p2); f2,w2=k2>>3,k2&7
                    if w2==0:
                        v,p2=read_varint(sub,p2)
                        if f2==1: t=v
                        elif f2==3: L=v
                    elif w2==1: p2+=8
                    elif w2==5: p2+=4
                    elif w2==2:
                        l2,p2=read_varint(sub,p2); p2+=l2
                infos.append((t,L))
    return infos


def iter_messages(raw):
    pos=0; n=len(raw)
    while pos<n:
        ln,pos=read_varint(raw,pos)
        ai=raw[pos:pos+ln]; pos+=ln
        for t,L in parse_archive_info(ai):
            L=L or 0
            yield t, raw[pos:pos+L]; pos+=L


def main():
    root = sys.argv[1]
    result = {}
    for dirpath, _, files in os.walk(root):
        for fn in sorted(files):
            if not fn.endswith('.iwa'): continue
            p = os.path.join(dirpath, fn)
            try:
                raw = iwa_decompress(p)
            except Exception as e:
                print(f'!! {fn}: {e}', file=sys.stderr); continue
            rel = os.path.relpath(p, root)
            msgs=[]
            try:
                for t,payload in iter_messages(raw):
                    acc=[]; walk(payload,0,acc)
                    if acc: msgs.append({'type':t,'strings':acc})
            except Exception as e:
                print(f'!! {rel}: parse {e}', file=sys.stderr)
            result[rel]=msgs
    json.dump(result, open(os.path.join(root, '_strings.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for k, v in result.items():
        if v:
            print(f'=== {k}')
            for m in v:
                print(f'  -- type {m["type"]}')
                for s in m['strings']:
                    print('     ' + s.replace(chr(10), '\n')[:400])

if __name__ == '__main__':
    main()
