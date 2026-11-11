import fs from "node:fs";
import zlib from "node:zlib";

/* Minimal PNG decoder (8-bit, non-interlaced) using only node:zlib */
function decodePNG(file) {
  const buf = fs.readFileSync(file);
  if (buf.toString("hex", 0, 8) !== "89504e470d0a1a0a") throw new Error("not a png");
  let p = 8;
  let w, h, bitDepth, colorType, interlace;
  const idat = [];
  let plte = null;
  while (p < buf.length) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString("ascii", p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === "IHDR") {
      w = data.readUInt32BE(0);
      h = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "IDAT") idat.push(data);
    else if (type === "PLTE") plte = Buffer.from(data);
    else if (type === "IEND") break;
    p += 12 + len;
  }
  if (bitDepth !== 8) throw new Error("bitDepth " + bitDepth + " unsupported");
  if (interlace !== 0) throw new Error("interlaced unsupported");

  const raw = zlib.inflateSync(Buffer.concat(idat));
  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 4 ? 2 : 1;
  const bpp = channels;
  const stride = w * channels;
  const out = Buffer.alloc(stride * h);
  let pos = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[pos++];
    const line = raw.subarray(pos, pos + stride);
    pos += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0;
      const b = prev[x];
      const c = x >= bpp ? prev[x - bpp] : 0;
      let v = line[x];
      switch (f) {
        case 1: v = (v + a) & 255; break;
        case 2: v = (v + b) & 255; break;
        case 3: v = (v + ((a + b) >> 1)) & 255; break;
        case 4: {
          const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
          v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
          break;
        }
      }
      cur[x] = v;
    }
  }
  const px = (x, y) => {
    const i = y * stride + x * bpp;
    if (colorType === 3) { const k = out[i] * 3; return [plte[k], plte[k + 1], plte[k + 2]]; }
    if (colorType === 0 || colorType === 4) return [out[i], out[i], out[i]];
    return [out[i], out[i + 1], out[i + 2]];
  };
  return { w, h, bitDepth, colorType, px };
}

const near = (c, t, tol) => Math.abs(c[0] - t[0]) <= tol && Math.abs(c[1] - t[1]) <= tol && Math.abs(c[2] - t[2]) <= tol;

function analyze(file) {
  const img = decodePNG(file);
  const { w, h, px } = img;
  console.log("=".repeat(70));
  console.log("FILE:", file);
  console.log("SIZE:", w, "x", h);

  // dominant colors
  const counts = new Map();
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const [r, g, b] = px(x, y);
      const key = [r >> 3 << 3, g >> 3 << 3, b >> 3 << 3].join(",");
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  console.log("DOMINANT COLORS:");
  for (const [k, n] of top) {
    const [r, g, b] = k.split(",").map(Number);
    const hex = "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    console.log(`  ${hex}  ${((n / total) * 100).toFixed(1)}%`);
  }

  const CREAM = [203, 200, 197];
  const isDark = (x, y) => { const c = px(x, y); return c[0] < 70 && c[1] < 70 && c[2] < 70; };

  // panel bbox (cream region)
  let minX = w, maxX = -1, minY = h, maxY = -1;
  for (let y = 0; y < h; y += 1) {
    let rowCream = 0;
    for (let x = 0; x < w; x += 1) if (near(px(x, y), CREAM, 6)) rowCream++;
    if (rowCream > w * 0.5) { if (y < minY) minY = y; if (y > maxY) maxY = y; }
  }
  for (let x = 0; x < w; x += 1) {
    let colCream = 0;
    for (let y = 0; y < h; y += 1) if (near(px(x, y), CREAM, 6)) colCream++;
    if (colCream > h * 0.3) { if (x < minX) minX = x; if (x > maxX) maxX = x; }
  }
  console.log("PANEL BBOX:", { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 });

  // horizontal border lines: rows with lots of dark pixels inside the panel
  console.log("DARK ROWS (count>120) — grouped:");
  let groups = [];
  for (let y = minY; y <= maxY; y++) {
    let n = 0, first = -1, last = -1;
    for (let x = minX; x <= maxX; x++) if (isDark(x, y)) { n++; if (first < 0) first = x; last = x; }
    if (n > 120) {
      const g = groups[groups.length - 1];
      if (g && y - g.y2 <= 2) { g.y2 = y; g.n = Math.max(g.n, n); g.x1 = Math.min(g.x1, first); g.x2 = Math.max(g.x2, last); }
      else groups.push({ y1: y, y2: y, n, x1: first, x2: last });
    }
  }
  for (const g of groups) console.log(`  y=${g.y1}-${g.y2}  darkCount=${g.n}  x=${g.x1}..${g.x2}`);

  console.log("DARK COLS (count>80) — grouped:");
  groups = [];
  for (let x = minX; x <= maxX; x++) {
    let n = 0, first = -1, last = -1;
    for (let y = minY; y <= maxY; y++) if (isDark(x, y)) { n++; if (first < 0) first = y; last = y; }
    if (n > 80) {
      const g = groups[groups.length - 1];
      if (g && x - g.x2 <= 2) { g.x2 = x; g.n = Math.max(g.n, n); g.y1 = Math.min(g.y1, first); g.y2 = Math.max(g.y2, last); }
      else groups.push({ x1: x, x2: x, n, y1: first, y2: last });
    }
  }
  for (const g of groups) console.log(`  x=${g.x1}-${g.x2}  darkCount=${g.n}  y=${g.y1}..${g.y2}`);

  // blue pill bboxes
  const BLUE_PILL = [185, 195, 243];
  console.log("BLUE (#B9C3F3) REGIONS:");
  const seen = new Uint8Array(w * h);
  const regions = [];
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      if (seen[y * w + x]) continue;
      if (!near(px(x, y), BLUE_PILL, 14)) continue;
      // flood fill bbox
      let x1 = x, x2 = x, y1 = y, y2 = y, stack = [[x, y]], n = 0;
      seen[y * w + x] = 1;
      while (stack.length) {
        const [cx, cy] = stack.pop();
        n++;
        if (cx < x1) x1 = cx; if (cx > x2) x2 = cx;
        if (cy < y1) y1 = cy; if (cy > y2) y2 = cy;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = cx + dx, ny = cy + dy;
          if (nx < minX || nx > maxX || ny < minY || ny > maxY) continue;
          const idx = ny * w + nx;
          if (seen[idx]) continue;
          if (!near(px(nx, ny), BLUE_PILL, 14)) continue;
          seen[idx] = 1;
          stack.push([nx, ny]);
        }
      }
      if (n > 400) regions.push({ x1, y1, w: x2 - x1 + 1, h: y2 - y1 + 1, n });
    }
  }
  regions.sort((a, b) => a.y1 - b.y1 || a.x1 - b.x1);
  for (const r of regions) console.log(`  x=${r.x1} y=${r.y1}  ${r.w} x ${r.h}  (px ${r.n})`);
}

for (const f of process.argv.slice(2)) {
  try { analyze(f); } catch (e) { console.log("FAILED", f, e.message); }
}
