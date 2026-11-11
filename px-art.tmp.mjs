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

const F = process.argv[2];
const Y0 = Number(process.argv[3]);
const Y1 = Number(process.argv[4]);
const X0 = Number(process.argv[5] || 0);
const X1 = Number(process.argv[6] || 1440);
const STEP = Number(process.argv[7] || 8);

const { w, h, px } = decodePNG(F);

function cls(x, y) {
  const c = px(x, y);
  const [r, g, b] = c;
  if (r < 80 && g < 80 && b < 80) return "#";             // ink / dark
  if (Math.abs(r - 185) < 32 && Math.abs(g - 195) < 32 && Math.abs(b - 243) < 24) return "o"; // blue pill
  if (Math.abs(r - 30) < 34 && Math.abs(g - 62) < 34 && Math.abs(b - 217) < 40) return "B";   // page blue
  if (Math.abs(r - 203) < 14 && Math.abs(g - 200) < 14 && Math.abs(b - 197) < 14) return "."; // cream
  if (r > 240 && g > 240 && b > 240) return " ";         // white
  return "+";
}

// header ruler
let ruler = "     ";
for (let x = X0; x < X1; x += STEP * 10) ruler += String(x).padEnd(10 * 1);
console.log(ruler.slice(0, 200));

for (let y = Y0; y <= Y1; y += STEP) {
  let line = "";
  for (let x = X0; x < X1; x += STEP) {
    // sample the STEPxSTEP cell, majority vote on a 3-point sample
    const votes = {};
    for (const [dx, dy] of [[0, 0], [STEP >> 1, STEP >> 1], [STEP - 1, 0]]) {
      const k = cls(Math.min(X1 - 1, x + dx), Math.min(Y1, y + dy));
      votes[k] = (votes[k] || 0) + 1;
    }
    const best = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
    line += best;
  }
  console.log(String(y).padStart(4) + " " + line);
}
