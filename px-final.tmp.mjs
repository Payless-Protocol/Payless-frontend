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

const { w, h, px } = decodePNG('../Admin_Resources (1)/Registry.png');
const P = (x, y) => px(x, y);
const isBlueTxt = (c) => c[2] > 135 && c[2] - c[0] > 55 && c[2] - c[1] > 45;
const isDark = (c) => c[0] < 95 && c[1] < 95 && c[2] < 95;
const isPageBlue = (c) => Math.abs(c[0] - 24) < 48 && Math.abs(c[1] - 56) < 48 && Math.abs(c[2] - 216) < 48;

/* A. panel vertical extent + edge insets */
console.log("A. PANEL EDGE PROFILE (first..last non-page-blue x)");
for (let y = 700; y <= 1390; y += 10) {
  let f = -1, l = -1;
  for (let x = 0; x < w; x++) if (!isPageBlue(P(x, y))) { if (f < 0) f = x; l = x; }
  console.log(`   y=${y}  ${f}..${l}  (inset L=${f}, R=${w - 1 - l})`);
}

/* B. heading text lines */
function lineGroups(y0, y1, x0, x1, pred, minPx = 2) {
  const rows = [];
  for (let y = y0; y <= y1; y++) {
    let n = 0, f = -1, l = -1;
    for (let x = x0; x <= x1; x++) if (pred(P(x, y))) { n++; if (f < 0) f = x; l = x; }
    rows.push({ y, n, f, l });
  }
  const out = [];
  let g = null;
  for (const r of rows) {
    if (r.n >= minPx) {
      if (g && r.y - g.y2 <= 3) { g.y2 = r.y; g.x1 = Math.min(g.x1, r.f); g.x2 = Math.max(g.x2, r.l); g.max = Math.max(g.max, r.n); }
      else { g = { y1: r.y, y2: r.y, x1: r.f, x2: r.l, max: r.n }; out.push(g); }
    }
  }
  return out;
}
const txt = (c) => isBlueTxt(c) || isDark(c);

console.log("\nB. HEADING LINES  (y1..y2  h  x1..x2  w)");
for (const g of lineGroups(800, 1015, 100, 1340, txt)) {
  console.log(`   y=${g.y1}..${g.y2}  h=${g.y2 - g.y1 + 1}  x=${g.x1}..${g.x2}  w=${g.x2 - g.x1 + 1}`);
}
console.log("   first-glyph 'S' bbox (x 102..145):");
for (const g of lineGroups(800, 900, 102, 145, txt)) {
  console.log(`     y=${g.y1}..${g.y2}  h=${g.y2 - g.y1 + 1}  x=${g.x1}..${g.x2}`);
}

/* C. vertical card borders */
console.log("\nC. VERTICAL CARD BORDERS (dark column runs >= 90 in y 1000..1360)");
const cols = [];
for (let x = 60; x <= 1395; x++) {
  let s = -1, best = 0, bestS = 0, bestE = 0;
  for (let y = 1000; y <= 1360; y++) {
    if (isDark(P(x, y))) { if (s < 0) s = y; if (y - s + 1 > best) { best = y - s + 1; bestS = s; bestE = y; } }
    else s = -1;
  }
  if (best >= 90) cols.push({ x, best, bestS, bestE });
}
let g = null;
const cg = [];
for (const c of cols) {
  if (g && c.x - g.x2 <= 1) { g.x2 = c.x; g.best = Math.max(g.best, c.best); g.y1 = Math.min(g.y1, c.bestS); g.y2 = Math.max(g.y2, c.bestE); }
  else { g = { x1: c.x, x2: c.x, best: c.best, y1: c.bestS, y2: c.bestE }; cg.push(g); }
}
for (const c of cg) console.log(`   x=${c.x1}..${c.x2}  runLen=${c.best}  y=${c.y1}..${c.y2}`);

/* D. description text lines per card column */
const CARDX = [[104, 492, "card1"], [526, 914, "card2"], [948, 1335, "card3"]];
console.log("\nD. DESCRIPTION LINES per card");
for (const [x0, x1, name] of CARDX) {
  const gs = lineGroups(1120, 1240, x0, x1, isDark);
  console.log(`   ${name} (x ${x0}..${x1}):`);
  for (const q of gs) console.log(`     y=${q.y1}..${q.y2}  h=${q.y2 - q.y1 + 1}  x=${q.x1}..${q.x2}  w=${q.x2 - q.x1 + 1}`);
}

/* E. pill label text bbox */
console.log("\nE. PILL INNER TEXT (dark bbox inside pill 2)");
for (const q of lineGroups(1105, 1143, 575, 742, isDark)) {
  console.log(`     y=${q.y1}..${q.y2}  h=${q.y2 - q.y1 + 1}  x=${q.x1}..${q.x2}`);
}

/* F. colours */
console.log("\nF. COLOUR SAMPLES");
const samples = [["page bg", 20, 1200], ["panel cream", 300, 1000], ["pill blue", 200, 1070], ["card border", 102, 1150], ["button ink", 350, 1225], ["heading blue", 0, 0]];
for (const [label, x, y] of samples) {
  if (label === "heading blue") continue;
  const c = P(x, y);
  console.log(`   ${label} @(${x},${y}) = rgb(${c.join(",")})  #${c.map(v => v.toString(16).padStart(2, "0")).join("")}`);
}
