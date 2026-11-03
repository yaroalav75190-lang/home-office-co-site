"""Reconstruct table cells (row/col -> text) from an extracted Apple Pages package.
Usage: python -I -X utf8 pages_tables.py <extracted_dir>
Prints each table as rows of cells, in table-name order, and writes tables.json.
"""
import os, sys, json, re, struct
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from iwa_text import iwa_decompress, read_varint  # noqa


def parse(buf):
    """Parse one protobuf message into a list of (field, wiretype, value)."""
    out = []; pos = 0; n = len(buf)
    while pos < n:
        key, pos = read_varint(buf, pos)
        fld, wt = key >> 3, key & 7
        if fld == 0: raise ValueError('field 0')
        if wt == 0:
            v, pos = read_varint(buf, pos)
        elif wt == 1:
            v = buf[pos:pos+8]; pos += 8
        elif wt == 5:
            v = buf[pos:pos+4]; pos += 4
        elif wt == 2:
            ln, pos = read_varint(buf, pos)
            if pos + ln > n: raise ValueError('overrun')
            v = buf[pos:pos+ln]; pos += ln
        else:
            raise ValueError('bad wt %d' % wt)
        out.append((fld, wt, v))
    return out


def get(fields, num):
    return [v for f, w, v in fields if f == num]


def load_objects(root):
    """id -> (type, payload bytes, file)"""
    objs = {}
    for dirpath, _, files in os.walk(root):
        for fn in files:
            if not fn.endswith('.iwa'): continue
            p = os.path.join(dirpath, fn)
            raw = iwa_decompress(p)
            pos = 0
            while pos < len(raw):
                ln, pos = read_varint(raw, pos)
                ai = parse(raw[pos:pos+ln]); pos += ln
                ident = get(ai, 1)[0] if get(ai, 1) else None
                for mi in get(ai, 2):
                    mf = parse(mi)
                    t = get(mf, 1)[0] if get(mf, 1) else None
                    L = get(mf, 3)[0] if get(mf, 3) else 0
                    payload = raw[pos:pos+L]; pos += L
                    objs[ident] = (t, payload, os.path.relpath(p, root))
    return objs


def collect_ids(buf, known, depth=0, acc=None):
    """Collect every varint anywhere in the tree that equals a known object id."""
    if acc is None: acc = []
    try:
        fields = parse(buf)
    except Exception:
        return acc
    for f, w, v in fields:
        if w == 2 and len(v) > 1:
            # a TSP.Reference is a message holding exactly one varint field 1
            try:
                sub = parse(v)
            except Exception:
                continue
            if len(sub) == 1 and sub[0][0] == 1 and sub[0][1] == 0 and sub[0][2] in known:
                if sub[0][2] not in acc: acc.append(sub[0][2])
            elif depth < 8:
                collect_ids(v, known, depth + 1, acc)
    return acc


def plain_strings(buf, depth=0, acc=None):
    """All plausible text strings in a message tree (for rich text payloads)."""
    if acc is None: acc = []
    try:
        fields = parse(buf)
    except Exception:
        return acc
    for f, w, v in fields:
        if w != 2: continue
        s = None
        try: s = v.decode('utf-8')
        except Exception: pass
        if s is not None and s and all(c.isprintable() or c in '\n\t  ' for c in s) and re.search(r'[A-Za-zА-Яа-яЁё0-9☐✓✔xX]', s):
            acc.append(s)
        elif depth < 8 and len(v) > 1:
            plain_strings(v, depth + 1, acc)
    return acc


def parse_cell(buf):
    """Return dict with string_id / rich_id for a v5 cell storage."""
    if len(buf) < 12: return None
    version = buf[0]; ctype = buf[1]
    flags = struct.unpack('<I', buf[8:12])[0]
    off = 12
    res = {'version': version, 'type': ctype}
    if flags & 0x1: off += 16
    if flags & 0x2: res['double'] = struct.unpack('<d', buf[off:off+8])[0]; off += 8
    if flags & 0x4: off += 8
    if flags & 0x8: res['string_id'] = struct.unpack('<I', buf[off:off+4])[0]; off += 4
    if flags & 0x10: res['rich_id'] = struct.unpack('<I', buf[off:off+4])[0]; off += 4
    return res


def main():
    root = sys.argv[1]
    objs = load_objects(root)
    known = set(objs)
    tables = []
    for ident, (t, payload, fn) in objs.items():
        if t != 6001: continue
        fields = parse(payload)
        name = next((v.decode('utf-8') for f, w, v in fields if w == 2 and v[:1] in (b'T', b'\xd0') and b'\xd0\xb0\xd0\xb1\xd0\xbb' in v), '?')
        nrows = ncols = None
        refs = collect_ids(payload, known)
        string_table = {}; rich_table = {}; tiles = []
        for r in refs:
            rt, rp, rf = objs[r]
            if rt == 6005:
                dl = parse(rp)
                list_type = get(dl, 1)[0] if get(dl, 1) else None
                for e in get(dl, 3):
                    ef = parse(e)
                    key = get(ef, 1)[0] if get(ef, 1) else None
                    if key is None: continue
                    strs = [v.decode('utf-8') for f, w, v in ef if f == 3 and w == 2]
                    if strs:
                        string_table[key] = strs[0]
                    else:
                        # rich text: follow references inside the entry
                        sub_ids = collect_ids(e, known)
                        texts = []
                        for sid in sub_ids:
                            st, sp, sf = objs[sid]
                            if st == 2001:
                                texts += plain_strings(sp)
                            else:
                                # maybe a payload wrapper -> storage
                                for sid2 in collect_ids(sp, known):
                                    if objs[sid2][0] == 2001:
                                        texts += plain_strings(objs[sid2][1])
                        if texts:
                            # first string of a StorageArchive is the full text
                            rich_table[key] = texts[0]
            elif rt == 6002:
                tiles.append(r)
        cells = {}
        for tid in tiles:
            tf = parse(objs[tid][1])
            for ri in get(tf, 5):
                rf = parse(ri)
                row = get(rf, 1)[0] if get(rf, 1) else 0
                buf = (get(rf, 6) or get(rf, 3) or [b''])[0]
                offs = (get(rf, 7) or get(rf, 4) or [b''])[0]
                wide = bool(get(rf, 8) and get(rf, 8)[0])
                offsets = struct.unpack('<%dh' % (len(offs) // 2), offs[:len(offs) // 2 * 2])
                for col, o in enumerate(offsets):
                    if o < 0: continue
                    if wide: o *= 4
                    c = parse_cell(buf[o:])
                    if not c: continue
                    txt = None
                    if 'string_id' in c:
                        txt = string_table.get(c['string_id'], f"<str {c['string_id']}>")
                    elif 'rich_id' in c:
                        txt = rich_table.get(c['rich_id'], f"<rich {c['rich_id']}>")
                    elif 'double' in c:
                        txt = str(c['double'])
                    if txt is not None:
                        cells[(row, col)] = txt
        tables.append({'id': ident, 'name': name, 'file': fn, 'cells': cells,
                       'n_strings': len(string_table), 'n_rich': len(rich_table), 'tiles': len(tiles)})

    def tnum(t):
        m = re.search(r'(\d+)', t['name']); return int(m.group(1)) if m else 0
    tables.sort(key=tnum)
    out = []
    for t in tables:
        rows = {}
        for (r, c), v in sorted(t['cells'].items()):
            rows.setdefault(r, {})[c] = v
        print(f"\n########## {t['name']} (id {t['id']}, strings={t['n_strings']}, rich={t['n_rich']}, tiles={t['tiles']})")
        grid = []
        for r in sorted(rows):
            line = []
            for c in sorted(rows[r]):
                line.append(rows[r][c])
            grid.append(line)
            print(f"  row {r}: " + ' | '.join(x.replace('\n', ' / ').replace(' ', ' / ') for x in line))
        out.append({'name': t['name'], 'rows': grid})
    json.dump(out, open(os.path.join(root, '_tables.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
