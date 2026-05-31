import { useState, useEffect, useRef, useCallback } from "react";

const STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:9999;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.9);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none;border-bottom:.5px solid rgba(0,0,0,.08)}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:pointer;font-size:13px;line-height:22px}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:10px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;min-height:0;scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:6px 0 0}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row!important;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{font-weight:500;color:rgba(41,38,27,.72);font-size:11.5px}
  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s,width .15s}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:pointer;padding:4px 6px;line-height:1.2}
  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:pointer;padding:0;flex-shrink:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s;display:block}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}
  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:36px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:pointer;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s,box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 2px rgba(0,0,0,.85),0 2px 6px rgba(0,0,0,.15)}
  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:pointer;width:100%}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
`;

function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <span className="twk-lbl">{label}</span>
      <button className="twk-toggle" data-on={value ? "1" : "0"} onClick={() => onChange(!value)}>
        <i />
      </button>
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  const idx = Math.max(0, options.indexOf(value));
  const n = options.length;
  return (
    <div className="twk-row">
      <span className="twk-lbl">{label}</span>
      <div className="twk-seg">
        <div className="twk-seg-thumb" style={{
          left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
          width: `calc((100% - 4px) / ${n})`,
        }} />
        {options.map((o) => (
          <button key={o} onClick={() => onChange(o)}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function TweakColor({ label, value, options, onChange }) {
  return (
    <div className="twk-row">
      <span className="twk-lbl">{label}</span>
      <div className="twk-chips">
        {options.map((o, i) => (
          <button
            key={i}
            className="twk-chip"
            data-on={o === value ? "1" : "0"}
            style={{ background: o }}
            onClick={() => onChange(o)}
            title={o}
          />
        ))}
      </div>
    </div>
  );
}

function TweakButton({ label, onClick }) {
  return <button className="twk-btn" onClick={onClick}>{label}</button>;
}

export function TweaksPanel({ tweaks, setTweak, view, onJump }) {
  const [open, setOpen] = useState(true);
  const panelRef = useRef(null);
  const offsetRef = useRef({ x: 16, y: 16 });

  const clamp = useCallback(() => {
    const p = panelRef.current;
    if (!p) return;
    const maxX = Math.max(16, window.innerWidth - p.offsetWidth - 16);
    const maxY = Math.max(16, window.innerHeight - p.offsetHeight - 16);
    offsetRef.current = {
      x: Math.min(maxX, Math.max(16, offsetRef.current.x)),
      y: Math.min(maxY, Math.max(16, offsetRef.current.y)),
    };
    p.style.right = offsetRef.current.x + "px";
    p.style.bottom = offsetRef.current.y + "px";
  }, []);

  useEffect(() => {
    if (open) { clamp(); window.addEventListener("resize", clamp); }
    return () => window.removeEventListener("resize", clamp);
  }, [open, clamp]);

  const onDragStart = (e) => {
    const p = panelRef.current;
    if (!p) return;
    const r = p.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = { x: startRight - (ev.clientX - sx), y: startBottom - (ev.clientY - sy) };
      clamp();
    };
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        position: "fixed", right: 16, bottom: 16, zIndex: 9999,
        background: "rgba(250,249,247,.9)", border: ".5px solid rgba(255,255,255,.6)",
        borderRadius: 10, padding: "8px 14px", cursor: "pointer",
        fontFamily: "ui-sans-serif,system-ui,sans-serif", fontSize: 12, fontWeight: 600,
        color: "#29261b", backdropFilter: "blur(20px)", boxShadow: "0 4px 16px rgba(0,0,0,.14)",
      }}>Tweaks ↑</button>
    );
  }

  return (
    <>
      <style>{STYLE}</style>
      <div ref={panelRef} className="twk-panel" style={{ right: 16, bottom: 16 }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>Tweaks</b>
          <button className="twk-x" onMouseDown={(e) => e.stopPropagation()} onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="twk-body">
          <div className="twk-sect">Brand</div>
          <TweakColor
            label="Accent color"
            value={tweaks.accent}
            options={["oklch(0.60 0.105 185)", "oklch(0.60 0.11 150)", "oklch(0.58 0.11 250)", "oklch(0.58 0.12 305)"]}
            onChange={(v) => setTweak("accent", v)}
          />
          <TweakToggle label="Dark mode" value={tweaks.dark} onChange={(v) => setTweak("dark", v)} />
          <div className="twk-sect">Voice &amp; content</div>
          <TweakRadio label="Copy tone" value={tweaks.tone} options={["calm", "blunt"]} onChange={(v) => setTweak("tone", v)} />
          <TweakRadio label="Score hero" value={tweaks.heroStyle} options={["gauge", "compare"]} onChange={(v) => setTweak("heroStyle", v)} />
          <div className="twk-sect">Flow</div>
          <TweakButton
            label={view === "landing" ? "Jump to report →" : "← Back to landing"}
            onClick={onJump}
          />
        </div>
      </div>
    </>
  );
}
