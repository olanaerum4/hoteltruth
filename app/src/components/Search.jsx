import { HTIcon } from "./Icon";

export function HTSearch({ value = "", placeholder = "Hotel name or paste a Google Maps link…", onChange, onSubmit, size = "lg", light }) {
  const big = size === "lg";
  return (
    <form
      className="ht-search"
      onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(); }}
      style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%",
        background: light ? "rgba(255,255,255,.1)" : "var(--surface)",
        border: `1.5px solid ${light ? "rgba(255,255,255,.25)" : "var(--line)"}`,
        borderRadius: 999,
        padding: big ? "8px 8px 8px 22px" : "6px 6px 6px 16px",
        boxShadow: light ? "none" : "0 1px 2px rgba(20,30,40,.04)",
      }}
    >
      <span style={{ color: light ? "rgba(255,255,255,.7)" : "var(--muted)" }}>
        <HTIcon name="search" size={big ? 22 : 18} />
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{
          flex: 1, border: "none", outline: "none", background: "transparent",
          fontFamily: "var(--sans)", fontWeight: 500,
          fontSize: big ? 18 : 15,
          color: light ? "#fff" : "var(--ink)", minWidth: 0,
        }}
      />
      <button
        type="submit"
        className="ht-btn ht-btn-primary"
        style={{ padding: big ? "12px 22px" : "9px 16px", fontSize: big ? 16 : 14 }}
      >
        Get the truth
      </button>
    </form>
  );
}
