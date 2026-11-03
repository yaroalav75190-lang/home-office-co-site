// Geometry helpers for the coastline pipeline: stitching OSM ways, projection,
// rectangle clipping, Visvalingam–Whyatt simplification and compact SVG path encoding.
// Points are [x, y] arrays. Lat/lon pairs are [lon, lat] until projected.

/**
 * Stitch OSM coastline ways (Overpass `out geom`) into closed rings and open lines.
 * Coastline ways are oriented with land on the left, so consecutive ways share
 * last node -> first node; reversed ways are handled too, just in case.
 * Returns [{ closed, coords: [[lon, lat], ...], ids: [nodeId, ...] }].
 */
export function stitchWays(elements) {
  const ways = elements
    .filter((e) => e.type === "way" && e.geometry && e.nodes && e.nodes.length > 1)
    .map((w) => ({
      id: w.id,
      ids: w.nodes.slice(),
      coords: w.geometry.map((g) => [g.lon, g.lat]),
    }));
  const used = new Set();
  const byFirst = new Map();
  const byLast = new Map();
  for (const w of ways) {
    push(byFirst, w.ids[0], w);
    push(byLast, w.ids[w.ids.length - 1], w);
  }
  const out = [];
  for (const start of ways) {
    if (used.has(start.id)) continue;
    used.add(start.id);
    let ids = start.ids.slice();
    let coords = start.coords.slice();
    // extend forward
    for (;;) {
      const tail = ids[ids.length - 1];
      if (tail === ids[0] && ids.length > 2) break;
      let next = take(byFirst, tail, used);
      let reversed = false;
      if (!next) {
        next = take(byLast, tail, used);
        reversed = true;
      }
      if (!next) break;
      used.add(next.id);
      const nIds = reversed ? next.ids.slice().reverse() : next.ids;
      const nCoords = reversed ? next.coords.slice().reverse() : next.coords;
      ids = ids.concat(nIds.slice(1));
      coords = coords.concat(nCoords.slice(1));
    }
    // extend backward
    if (!(ids[0] === ids[ids.length - 1] && ids.length > 2)) {
      for (;;) {
        const head = ids[0];
        let prev = take(byLast, head, used);
        let reversed = false;
        if (!prev) {
          prev = take(byFirst, head, used);
          reversed = true;
        }
        if (!prev) break;
        used.add(prev.id);
        const pIds = reversed ? prev.ids.slice().reverse() : prev.ids;
        const pCoords = reversed ? prev.coords.slice().reverse() : prev.coords;
        ids = pIds.slice(0, -1).concat(ids);
        coords = pCoords.slice(0, -1).concat(coords);
        if (ids[0] === ids[ids.length - 1]) break;
      }
    }
    const closed = ids.length > 3 && ids[0] === ids[ids.length - 1];
    out.push({ closed, ids, coords });
  }
  return out;
}

function push(map, key, val) {
  const list = map.get(key);
  if (list) list.push(val);
  else map.set(key, [val]);
}
function take(map, key, used) {
  const list = map.get(key);
  if (!list) return null;
  return list.find((w) => !used.has(w.id)) || null;
}

/** Local equirectangular projection (cos(lat0) scaling), y grows southwards like SVG. */
export function makeProjection(bbox) {
  const [s, w, n, e] = bbox;
  const lat0 = (s + n) / 2;
  const kx = Math.cos((lat0 * Math.PI) / 180);
  return {
    project: ([lon, lat]) => [(lon - w) * kx, n - lat],
    width: (e - w) * kx,
    height: n - s,
  };
}

/** Signed shoelace area (positive = counter-clockwise in a y-up frame). */
export function signedArea(pts) {
  let a = 0;
  for (let i = 0, n = pts.length; i < n; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % n];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

export function polylineLength(pts) {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return l;
}

/**
 * Clip a polyline to the rectangle [x0, y0, x1, y1] (Liang–Barsky per segment).
 * Returns an array of polylines (pieces that stay inside).
 */
export function clipPolyline(pts, [x0, y0, x1, y1]) {
  const pieces = [];
  let cur = null;
  for (let i = 1; i < pts.length; i++) {
    const seg = clipSegment(pts[i - 1], pts[i], x0, y0, x1, y1);
    if (!seg) {
      if (cur) pieces.push(cur);
      cur = null;
      continue;
    }
    const [a, b, aClipped, bClipped] = seg;
    if (!cur || aClipped) {
      if (cur) pieces.push(cur);
      cur = [a];
    }
    cur.push(b);
    if (bClipped) {
      pieces.push(cur);
      cur = null;
    }
  }
  if (cur) pieces.push(cur);
  return pieces.filter((p) => p.length > 1);
}

/**
 * Remove the part of a polyline that lies inside the rectangle [x0, y0, x1, y1].
 * Returns the pieces outside it.
 */
export function subtractRect(pts, [x0, y0, x1, y1]) {
  const pieces = [];
  let cur = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = clipSegment(a, b, x0, y0, x1, y1);
    if (!seg) {
      cur.push(b);
      continue;
    }
    const [inA, inB, aClipped, bClipped] = seg;
    if (aClipped) cur.push(inA); // leave the outside part up to the rectangle edge
    if (cur.length > 1) pieces.push(cur);
    cur = bClipped ? [inB, b] : [b];
  }
  if (cur.length > 1) pieces.push(cur);
  // Points strictly inside the rectangle can start a piece (when b ends inside); drop them.
  const inside = ([x, y]) => x > x0 && x < x1 && y > y0 && y < y1;
  return pieces
    .map((p) => (inside(p[0]) ? p.slice(1) : p))
    .map((p) => (p.length && inside(p[p.length - 1]) ? p.slice(0, -1) : p))
    .filter((p) => p.length > 1);
}

function clipSegment([ax, ay], [bx, by], x0, y0, x1, y1) {
  const dx = bx - ax;
  const dy = by - ay;
  let t0 = 0;
  let t1 = 1;
  const p = [-dx, dx, -dy, dy];
  const q = [ax - x0, x1 - ax, ay - y0, y1 - ay];
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) {
      if (q[i] < 0) return null;
    } else {
      const t = q[i] / p[i];
      if (p[i] < 0) {
        if (t > t1) return null;
        if (t > t0) t0 = t;
      } else {
        if (t < t0) return null;
        if (t < t1) t1 = t;
      }
    }
  }
  return [
    [ax + t0 * dx, ay + t0 * dy],
    [ax + t1 * dx, ay + t1 * dy],
    t0 > 0,
    t1 < 1,
  ];
}

/**
 * Visvalingam–Whyatt effective areas. Returns a Float64Array with one value per vertex:
 * the (monotonic) triangle area at which that vertex would be removed. Endpoints and
 * `locked` indices get Infinity. Keeping every vertex with area >= threshold gives a
 * consistent simplification, and one threshold can be shared by many polylines
 * (so a point budget is spent where the coastline is most complex).
 */
export function effectiveAreas(pts, locked = new Set()) {
  const n = pts.length;
  const prev = new Int32Array(n);
  const next = new Int32Array(n);
  const area = new Float64Array(n);
  const alive = new Uint8Array(n).fill(1);
  for (let i = 0; i < n; i++) {
    prev[i] = i - 1;
    next[i] = i + 1;
  }
  const tri = (i) => {
    const a = pts[prev[i]];
    const b = pts[i];
    const c = pts[next[i]];
    return Math.abs((a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1])) / 2;
  };
  const eff = new Float64Array(n).fill(Infinity);
  const heap = new MinHeap();
  for (let i = 1; i < n - 1; i++) {
    if (locked.has(i)) continue;
    area[i] = tri(i);
    heap.push(area[i], i);
  }
  let maxArea = 0;
  while (heap.size) {
    const [a, i] = heap.pop();
    if (!alive[i] || a !== area[i]) continue; // stale entry
    // Monotonic effective area: a neighbour never gets a smaller area than the removed point.
    maxArea = Math.max(maxArea, a);
    eff[i] = maxArea;
    alive[i] = 0;
    const p = prev[i];
    const q = next[i];
    next[p] = q;
    prev[q] = p;
    for (const j of [p, q]) {
      if (j <= 0 || j >= n - 1 || locked.has(j)) continue;
      area[j] = Math.max(tri(j), maxArea);
      heap.push(area[j], j);
    }
  }
  return eff;
}

/**
 * Area threshold that keeps about `target` vertices across several effective-area arrays.
 */
export function thresholdForBudget(areaArrays, target) {
  const all = [];
  let fixed = 0;
  for (const arr of areaArrays) {
    for (const a of arr) {
      if (a === Infinity) fixed++;
      else all.push(a);
    }
  }
  const free = target - fixed;
  if (free >= all.length) return 0;
  if (free <= 0) return Infinity;
  all.sort((a, b) => b - a);
  return all[free - 1];
}

class MinHeap {
  constructor() {
    this.k = [];
    this.v = [];
  }
  get size() {
    return this.k.length;
  }
  push(key, val) {
    const k = this.k;
    const v = this.v;
    let i = k.length;
    k.push(key);
    v.push(val);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (k[p] <= k[i]) break;
      [k[p], k[i]] = [k[i], k[p]];
      [v[p], v[i]] = [v[i], v[p]];
      i = p;
    }
  }
  pop() {
    const k = this.k;
    const v = this.v;
    const top = [k[0], v[0]];
    const lk = k.pop();
    const lv = v.pop();
    if (k.length) {
      k[0] = lk;
      v[0] = lv;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < k.length && k[l] < k[m]) m = l;
        if (r < k.length && k[r] < k[m]) m = r;
        if (m === i) break;
        [k[m], k[i]] = [k[i], k[m]];
        [v[m], v[i]] = [v[i], v[m]];
        i = m;
      }
    }
    return top;
  }
}

/** Index of the vertex of `pts` nearest to point `p`. */
export function nearestIndex(pts, p, from = 0, to = pts.length - 1) {
  let best = -1;
  let bestD = Infinity;
  for (let i = from; i <= to; i++) {
    const d = (pts[i][0] - p[0]) ** 2 + (pts[i][1] - p[1]) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

/** Closest point to `p` on any segment of `pts`. */
export function snapToPolyline(pts, p) {
  let best = pts[0];
  let bestD = Infinity;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2 ? Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / len2)) : 0;
    const q = [ax + t * dx, ay + t * dy];
    const d = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2;
    if (d < bestD) {
      bestD = d;
      best = q;
    }
  }
  return best;
}

/** Drop consecutive duplicates after rounding (keeps first and last). */
export function dedupe(pts) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = out[out.length - 1];
    const b = pts[i];
    if (a[0] !== b[0] || a[1] !== b[1] || i === pts.length - 1) out.push(b);
  }
  return out;
}

/**
 * Encode integer points as a compact SVG path: absolute M, then relative l with
 * implicit repetition. `closed` appends z (the ring's last point equals the first and is dropped).
 */
export function encodePath(pts, closed = false) {
  const p = closed && pts.length > 2 && same(pts[0], pts[pts.length - 1]) ? pts.slice(0, -1) : pts;
  let d = `M${p[0][0]} ${p[0][1]}l`;
  let first = true;
  for (let i = 1; i < p.length; i++) {
    const dx = p[i][0] - p[i - 1][0];
    const dy = p[i][1] - p[i - 1][1];
    d += num(dx, first) + num(dy, false);
    first = false;
  }
  if (closed) d += "z";
  return d;
}

function same(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}
function num(v, first) {
  if (first) return String(v);
  return v < 0 ? String(v) : " " + v;
}
