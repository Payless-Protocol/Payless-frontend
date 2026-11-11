import fs from "node:fs";
import zlib from "node:zlib";

function decodePNG(file) {
  const buf = fs.readFileSync(file);
  let p = 8, w, h, colorType, plte = null;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString("ascii", p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); colorType = data[9]; }
    else if (type === "IDAT") idat.push(data);
    else if (type === "PLTE") plte = Buffer.from(data);
    else if (type === "IEND") break;
    p += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const ch = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 4 ? 2 : 1;
  const stride = w * ch;
  const out = Buffer.alloc(stride * h);
  let pos = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[pos++];
    const line = raw.subarray(pos, pos + stride); pos += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? cur[x - ch] : 0, b = prev[x], c = x >= ch ? prev[x - ch] : 0;
      let v = line[x];
      if (f === 1) v = (v + a) & 255;
      else if (f === 2) v = (v + b) & 255;
      else if (f === 3) v = (v + ((a + b) >> 1)) & 255;
      else if (f === 4) {
        const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
        v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
      cur[x] = v;
    }
  }
  const px = (x, y) => {
    const i = y * stride + x * ch;
    if (colorType === 3) { const k = out[i] * 3; return [plte[k], plte[k + 1], plte[k + 2]]; }
    if (colorType === 0 || colorType === 4) return [out[i], out[i], out[i]];
    return [out[i], out[i + 1], out[i + 2]];
  };
  return { w, h, px };
}

const F = process.argv[2] || '../Admin_Resources (1)/Registry.png';
const { w, h, px } = decodePNG(F);

const isBlue = (x, y) => { const c = px(x, y); return Math.abs(c[0] - 185) < 30 && Math.abs(c[1] - 195) < 30 && Math.abs(c[2] - 243) < 20; };
const isDark = (x, y) => { const c = px(x, y); return c[0] < 80 && c[1] < 80 && c[2] < 80; };

/* Pass 1: per-row blue extents inside the panel content area */
const Y0 = 700, Y1 = 1450, X0 = 60, X1 = 1385;
const blueRows = [];
for (let y = Y0; y <= Y1; y++) {
  let n = 0, first = -1, last = -1;
  const runs = [];
  let s = -1;
  for (let x = X0; x <= X1; x++) {
    if (isBlue(x, y)) { n++; if (first < 0) first = x; last = x; if (s < 0) s = x; }
    else if (s >= 0) { if (x - s > 8) runs.push([s, x - 1]); s = -1; }
  }
  if (s >= 0 && X1 - s > 8) runs.push([s, X1]);
  if (n > 10) blueRows.push({ y, n, first, last, runs });
}
console.log("=== BLUE ROW GROUPS (vertical extent of each blue shape) ===");
let g = null;
const groups = [];
for (const r of blueRows) {
  if (g && r.y - g.y2 <= 2) { g.y2 = r.y; g.x1 = Math.min(g.x1, r.first); g.x2 = Math.max(g.x2, r.last); g.maxN = Math.max(g.maxN, r.n); }
  else { g = { y1: r.y, y2: r.y, x1: r.first, x2: r.last, maxN: r.n }; groups.push(g); }
}
for (const q of groups) console.log(`  y=${q.y1}..${q.y2}  h=${q.y2 - q.y1 + 1}  x=${q.x1}..${q.x2}  w=${q.x2 - q.x1 + 1}`);

/* Pass 2: dark ROW runs per row in a specific band, small minLen, to locate card borders */
const argY = Number(process.argv[3] || 0);
if (argY) {
  console.log(`\n=== DARK ROW RUNS at y=${argY} (minLen 20) ===`);
  for (let y = argY; y < argY + 40; y++) {
    const runs = [];
    let s = -1;
    for (let x = X0; x <= X1; x++) {
      if (isDark(x, y)) { if (s < 0) s = x; }
      else if (s >= 0) { if (x - s >= 20) runs.push(`${s}..${x - 1}(${x - s})`); s = -1; }
    }
    if (s >= 0 && X1 - s >= 20) runs.push(`${s}..${X1}(${X1 - s + 1})`);
    if (runs.length) console.log(`  y=${y}: ${runs.join(" | ")}`);
  }
}

/* Pass 3: dark COLUMN runs, small minLen, to locate vertical card borders */
const colMin = Number(process.argv[4] || 0);
if (colMin) {
  console.log(`\n=== DARK COLUMN RUNS (>= ${colMin}) ===`);
  for (let x = X0; x <= X1; x++) {
    const runs = [];
    let s = -1;
    for (let y = 950; y <= 1450; y++) {
      if (isDark(x, y)) { if (s < 0) s = y; }
      else if (s >= 0) { if (y - s >= colMin) runs.push(`${s}..${y - 1}(${y - s})`); s = -1; }
    }
    if (s >= 0 && 1450 - s >= colMin) runs.push(`${s}..1450(${1450 - s + 1})`);
    if (runs.length) console.log(`  x=${x}: ${runs.join(" | ")}`);
  }
}
