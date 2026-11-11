// TEMP zero-dependency CDP measurement harness. Delete after use.
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import fs from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9333;
const URL = "http://127.0.0.1:3010/";
const WIDTH = Number(process.argv[2] || 1440);
const HEIGHT = Number(process.argv[3] || 1200);

const child = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-gpu",
  "--hide-scrollbars",
  "--user-data-dir=" + process.env.TEMP + "\\rt-cdp-profile",
  `--window-size=${WIDTH},${HEIGHT}`,
  "about:blank",
], { stdio: "ignore" });

async function getWsUrl() {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const j = await r.json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch {}
    await sleep(300);
  }
  throw new Error("CDP endpoint never came up");
}

let idc = 0;
function makeClient(ws) {
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    }
  });
  return (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = ++idc;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
}

const EXPR = `(() => {
  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x:+b.x.toFixed(1), y:+b.y.toFixed(1), w:+b.width.toFixed(1), h:+b.height.toFixed(1) }; };
  const cs = (el, props) => { if (!el) return null; const c = getComputedStyle(el); const o = {}; for (const p of props) o[p] = c[p]; return o; };
  const panel = document.querySelector('.rt-panel');
  const grid  = document.querySelector('.rt-grid');
  if (!panel) return { error: 'no .rt-panel' };
  const tag   = panel.querySelector('span');
  const h2    = panel.querySelector('h2');
  const cards = [...document.querySelectorAll('.rt-card')];
  const pills = [...document.querySelectorAll('.rt-pill')];
  const descs = [...document.querySelectorAll('.rt-desc')];
  const btns  = [...document.querySelectorAll('.rt-btn')];
  const pw = panel.getBoundingClientRect().width;
  const pct = (v) => pw ? +(v / pw * 100).toFixed(2) : null;
  const c0 = cards[0] ? cards[0].getBoundingClientRect() : null;
  const cardRel = cards.map((c, i) => {
    const cr = c.getBoundingClientRect();
    const b = btns[i] ? btns[i].getBoundingClientRect() : null;
    return {
      i: i + 1,
      box: r(c),
      widthPct: pct(cr.width),
      heightPct: pct(cr.height),
      topOffsetFromCard1: c0 ? +(cr.top - c0.top).toFixed(1) : null,
      topOffsetPct: c0 ? pct(cr.top - c0.top) : null,
      radius: getComputedStyle(c).borderRadius,
      border: getComputedStyle(c).borderTopWidth + ' ' + getComputedStyle(c).borderTopColor,
      btn: b ? {
        box: r(btns[i]),
        centreVsCardBottomBorder: +(((b.top + b.height/2) - cr.bottom)).toFixed(1),
        rightInsetFromCard: +(cr.right - b.right).toFixed(1),
        leftInsetFromCard: +(b.left - cr.left).toFixed(1),
        topGapBelowCard: +(b.top - cr.bottom).toFixed(1),
      } : null,
    };
  });
  return {
    viewport: { w: innerWidth, h: innerHeight },
    panel: { ...r(panel), width: pw },
    panelStyle: cs(panel, ['borderRadius','paddingTop','paddingLeft','backgroundColor','minHeight']),
    tag: { ...r(tag), ...cs(tag, ['fontFamily','fontSize','fontWeight','backgroundColor','borderTopWidth','paddingLeft']) },
    heading: { ...r(h2), ...cs(h2, ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color']) },
    grid: { ...r(grid), ...cs(grid, ['gridTemplateColumns','columnGap','rowGap','marginTop']) },
    gridTopFromPanelTop: +(grid.getBoundingClientRect().top - panel.getBoundingClientRect().top).toFixed(1),
    gridTopFromPanelTopPct: pct(grid.getBoundingClientRect().top - panel.getBoundingClientRect().top),
    cards: cardRel,
    pills: pills.map((p, i) => ({ i: i+1, box: r(p), ...cs(p, ['fontFamily','fontSize','fontWeight','height','backgroundColor','borderTopWidth','gap']),
      insetLeftFromCard: cards[i] ? +(p.getBoundingClientRect().left - cards[i].getBoundingClientRect().left).toFixed(1) : null,
      insetTopFromCard: cards[i] ? +(p.getBoundingClientRect().top - cards[i].getBoundingClientRect().top).toFixed(1) : null })),
    descs: descs.map((d, i) => { const st = getComputedStyle(d); const lh = parseFloat(st.lineHeight); return { i: i+1, box: r(d), fontFamily: st.fontFamily, fontSize: st.fontSize, fontWeight: st.fontWeight, lineHeight: st.lineHeight, color: st.color,
      lines: lh ? Math.round(d.getBoundingClientRect().height / lh) : null,
      gapBelowPill: pills[i] ? +(d.getBoundingClientRect().top - pills[i].getBoundingClientRect().bottom).toFixed(1) : null }; }),
    btns: btns.map((b, i) => ({ i: i+1, text: b.textContent.trim(), ...cs(b, ['fontFamily','fontSize','fontWeight','height','backgroundColor','color','paddingLeft','gap']) })),
    pageBg: getComputedStyle(document.body).backgroundColor,
  };
})()`;

(async () => {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.addEventListener("open", res); ws.addEventListener("error", rej); });
  const send = makeClient(ws);

  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

  await send("Page.enable", {}, sessionId);
  await send("Runtime.enable", {}, sessionId);
  await send("Emulation.setDeviceMetricsOverride", { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false }, sessionId);

  await send("Page.navigate", { url: URL }, sessionId);
  for (let i = 0; i < 120; i++) {
    const r = await send("Runtime.evaluate", { expression: "!!document.querySelector('.rt-panel')", returnByValue: true }, sessionId);
    if (r.result.value) break;
    await sleep(300);
  }
  await sleep(1500);

  const out = await send("Runtime.evaluate", { expression: EXPR, returnByValue: true }, sessionId);
  if (out.exceptionDetails) console.log("EVAL ERROR:", JSON.stringify(out.exceptionDetails, null, 2));
  else console.log(JSON.stringify(out.result.value, null, 2));

  if (process.argv[4]) {
    const box = await send("Runtime.evaluate", {
      expression: "(()=>{const p=document.querySelector('.rt-panel').getBoundingClientRect();return {x:p.x,y:p.y+scrollY,w:p.width,h:p.height};})()",
      returnByValue: true,
    }, sessionId);
    const rect = box.result.value;
    const shot = await send("Page.captureScreenshot", {
      format: "png", captureBeyondViewport: true,
      clip: { x: rect.x, y: rect.y, width: rect.w, height: rect.h, scale: 1 },
    }, sessionId);
    fs.writeFileSync(process.argv[4], Buffer.from(shot.data, "base64"));
    console.log("SCREENSHOT:", process.argv[4], JSON.stringify(rect));
  }

  ws.close();
  child.kill();
  process.exit(0);
})().catch((e) => { console.error("FAILED:", e.message); child.kill(); process.exit(1); });
