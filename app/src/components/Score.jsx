import { htScoreColor } from "../data";
import { HTIcon } from "./Icon";

export function HTScoreBig({ value = 4.1, size = 116, label = "Honest score", sub }) {
  const c = htScoreColor(value);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
      <div style={{
        display: "flex", alignItems: "baseline", gap: 6, color: c,
        fontFamily: "var(--sans)", fontWeight: 800, lineHeight: 0.9, letterSpacing: -3,
      }}>
        <span style={{ fontSize: size }}>{value.toFixed(1)}</span>
        <span style={{ fontSize: size * 0.28, fontWeight: 700, opacity: 0.5, letterSpacing: -0.5 }}>/10</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
        <span className="ht-verified">
          <HTIcon name="check" size={13} stroke={2.4} /> {label}
        </span>
        {sub && <span style={{ fontSize: 13, color: "var(--muted)" }}>{sub}</span>}
      </div>
    </div>
  );
}

export function HTScoreTrack({ honest = 4.1, advertised = 8.4 }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ position: "relative", height: 10, borderRadius: 999, background: "var(--line-wash)" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${honest * 10}%`, borderRadius: 999, background: htScoreColor(honest),
        }} />
        <div style={{
          position: "absolute", left: `${advertised * 10}%`, top: -5, bottom: -5,
          width: 2, background: "var(--ink)", opacity: 0.35,
        }} />
        <div style={{
          position: "absolute", left: `${advertised * 10}%`, top: -22,
          transform: "translateX(-50%)", fontFamily: "var(--mono)", fontSize: 11,
          color: "var(--muted)", whiteSpace: "nowrap",
        }}>
          adv. {advertised.toFixed(1)}
        </div>
      </div>
    </div>
  );
}
