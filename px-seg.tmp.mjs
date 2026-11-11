import fs from "node:fs";
import zlib from "node:zlib";

function decodePNG(file) {
  const buf = fs.readFileSync(file);
  let p = 8, w, h, bitDepth, colorType, interlace, plte = null;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString("ascii", p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); bitDepth = data[8]; colorType = data[9]; interlace = data[12]; }
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

const F = '../Admin_Resources (1)/Registry.png';
const { w, h, px } = decodePNG(F);
const dark = (x, y) => { const c = px(x, y); return c[0] < 80 && c[1] < 80 && c[2] < 80; };

const Y0 = Number(process.argv[2] || 700);
const Y1 = Number(process.argv[3] || 1500);
const MINLEN = Number(process.argv[4] || 150);

console.log(`HORIZONTAL DARK SEGMENTS  y=${Y0}..${Y1}  minLen=${MINLEN}`);
for (let y = Y0; y <= Y1; y++) {
  const segs = [];
  let s = -1;
  for (let x = 0; x < w; x++) {
    if (dark(x, y)) { if (s < 0) s = x; }
    else if (s >= 0) { if (x - s >= MINLEN) segs.push(`${s}..${x - 1}(${x - s})`); s = -1; }
  }
  if (s >= 0 && w - s >= MINLEN) segs.push(`${s}..${w - 1}(${w - s})`);
  if (segs.length) console.log(`  y=${y}  ${segs.join("  |  ")}`);
}

console.log(`\nVERTICAL DARK SEGMENTS  minLen=${MINLEN}`);
for (let x = 0; x < w; x++) {
  const segs = [];
  let s = -1;
  for (let y = Y0; y <= Y1; y++) {
    if (dark(x, y)) { if (s < 0) s = y; }
    else if (s >= 0) { if (y - s >= MINLEN) segs.push(`${s}..${y - 1}(${y - s})`); s = -1; }
  }
  if (s >= 0 && Y1 - s >= MINLEN) segs.push(`${s}..${Y1}(${Y1 - s + 1})`);
  if (segs.length) console.log(`  x=${x}  ${segs.join("  |  ")}`);
}
