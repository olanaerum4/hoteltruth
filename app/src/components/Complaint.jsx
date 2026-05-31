import { HT_SEV } from "../data";
import { HTIcon } from "./Icon";

export function HTComplaint({ c, expanded = true, variant = "card" }) {
  const sev = HT_SEV[c.sev];

  if (variant === "line") {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 14, padding: "13px 0",
        borderBottom: "1px solid var(--line)",
      }}>
        <span style={{ width: 7, height: 7, borderRadius: 99, background: sev.dot, flexShrink: 0 }} />
        <span style={{ flex: 1, fontWeight: 600, fontSize: 15.5, color: "var(--ink)" }}>{c.label}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--muted)" }}>×{c.count}</span>
      </div>
    );
  }

  return (
    <div
      className="ht-complaint"
      style={{
        background: "var(--surface)", border: "1px solid var(--line)",
        borderRadius: 16, padding: "16px 18px", display: "flex", gap: 14,
      }}
    >
      <span style={{
        width: 42, height: 42, borderRadius: 12, background: sev.bg, color: sev.dot,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <HTIcon name={c.icon} size={21} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)", letterSpacing: -0.2 }}>{c.label}</span>
          <span style={{
            fontFamily: "var(--mono)", fontSize: 11.5, fontWeight: 600, color: sev.dot,
            background: sev.bg, padding: "2px 8px", borderRadius: 99,
          }}>{c.count} reviews</span>
        </div>
        {expanded && (
          <div style={{ fontSize: 14.5, color: "var(--ink-soft)", fontStyle: "italic", lineHeight: 1.45 }}>
            {c.quote}
          </div>
        )}
      </div>
      <span style={{ alignSelf: "center", color: "var(--muted)", opacity: 0.5 }}>
        <HTIcon name="chevron" size={16} />
      </span>
    </div>
  );
}
