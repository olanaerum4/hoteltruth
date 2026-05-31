import { HTLogo } from "../components/Logo";
import { HTIcon } from "../components/Icon";
import { HTSearch } from "../components/Search";
import { HTScoreBig, HTScoreTrack } from "../components/Score";
import { HTStatRow } from "../components/Stats";
import { HTComplaint } from "../components/Complaint";
import { HT_DATA, HT_TONE, htScoreColor } from "../data";

function HTPhoto({ h = 320, radius = 20 }) {
  return (
    <div style={{
      position: "relative", width: "100%", height: h, borderRadius: radius, overflow: "hidden",
      background: "repeating-linear-gradient(135deg, var(--line-wash) 0 14px, var(--surface) 14px 28px)",
      border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{
        fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--muted)",
        background: "var(--bg)", padding: "4px 10px", borderRadius: 99, border: "1px solid var(--line)",
      }}>hotel photo</span>
    </div>
  );
}

function Skeleton({ w = "100%", h = 20, radius = 8 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: "linear-gradient(90deg, var(--line-wash) 25%, var(--line) 50%, var(--line-wash) 75%)",
      backgroundSize: "200% 100%",
      animation: "ht-shimmer 1.5s ease-in-out infinite",
    }} />
  );
}

// Animated dots for the status message
function StatusDot() {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center", marginLeft: 2 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 4, height: 4, borderRadius: "50%", background: "var(--truth)",
          animation: `ht-dot 1.2s ${i * 0.2}s ease-in-out infinite`,
          display: "inline-block",
        }} />
      ))}
    </span>
  );
}

const LOADING_STYLES = `
  @keyframes ht-shimmer {
    0%   { background-position: 200% 0 }
    100% { background-position: -200% 0 }
  }
  @keyframes ht-dot {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40%           { transform: scale(1);   opacity: 1; }
  }
`;

function LoadingState({ statusMsg, query }) {
  return (
    <>
      <style>{LOADING_STYLES}</style>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        {/* status message */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "24px 44px 0",
          fontFamily: "var(--mono)", fontSize: 13, color: "var(--truth)",
        }}>
          <span>{statusMsg || `Searching for "${query}"…`}</span>
          <StatusDot />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 44, padding: "28px 44px 32px", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Skeleton w={160} h={13} radius={4} />
            <Skeleton w="70%" h={42} radius={6} />
            <Skeleton w={180} h={88} radius={8} />
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <Skeleton w="95%" h={15} radius={4} />
              <Skeleton w="85%" h={15} radius={4} />
              <Skeleton w="60%" h={15} radius={4} />
            </div>
          </div>
          <HTPhoto h={340} />
        </div>

        <div style={{ margin: "0 44px", padding: "22px 28px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20 }}>
          <div style={{ display: "flex", gap: 36 }}>
            {[96, 96, 96, 96].map((w, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Skeleton w={w} h={30} radius={6} />
                <Skeleton w={w * 0.75} h={12} radius={4} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 30, padding: "34px 44px 56px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Skeleton w={240} h={28} radius={6} />
            {[1, 2, 3].map((i) => <Skeleton key={i} h={76} radius={16} />)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Skeleton h={100} radius={20} />
            <Skeleton h={100} radius={20} />
          </div>
        </div>
      </div>
    </>
  );
}

function ErrorState({ message, onRetry, onHome }) {
  return (
    <div style={{
      maxWidth: 480, margin: "80px auto", padding: "0 44px", textAlign: "center",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: "50%", background: "var(--alert-wash)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--alert)", fontWeight: 800, fontSize: 24,
      }}>!</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", letterSpacing: -0.5, margin: 0 }}>
        Couldn't load that hotel
      </h2>
      <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>{message}</p>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button className="ht-btn ht-btn-primary" onClick={onRetry}>Try again</button>
        <button className="ht-btn ht-btn-ghost" onClick={onHome}>Back to search</button>
      </div>
    </div>
  );
}

export function Result({ tone = "calm", heroStyle = "gauge", query, setQuery, onSearch, onHome,
  hotelData, loading, statusMsg, error }) {

  const c = HT_TONE[tone];
  const d = hotelData || HT_DATA;
  const hotelName = hotelData?.name || query || "Hotel";
  const location = hotelData?.address
    ? hotelData.address.split(",").slice(-2).join(",").trim()
    : "Bangkok, Thailand";

  // Use AI verdict if available, otherwise fall back to tone-based copy
  const verdict = hotelData?.verdict || c.verdict;

  return (
    <div>
      {/* topbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 22, padding: "18px 44px",
        borderBottom: "1px solid var(--line)",
      }}>
        <span onClick={onHome} style={{ cursor: "pointer" }}><HTLogo size={21} /></span>
        <div style={{ flex: 1, maxWidth: 440 }}>
          <HTSearch value={query} onChange={setQuery} onSubmit={onSearch} size="sm" />
        </div>
        <div style={{ flex: 1 }} />
        <span className="ht-btn ht-btn-ghost" onClick={onHome}>New search</span>
      </div>

      {loading && <LoadingState statusMsg={statusMsg} query={query} />}
      {!loading && error && <ErrorState message={error} onRetry={() => onSearch(query)} onHome={onHome} />}

      {!loading && !error && (
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>

          {/* hero */}
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 44, padding: "40px 44px 32px", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span className="ht-eyebrow">Honest report</span>
                {location && <span style={{ fontSize: 13, color: "var(--muted)" }}>· {location}</span>}
                {hotelData && (
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: 11, color: "var(--truth-deep)",
                    background: "color-mix(in oklch, var(--truth) 12%, transparent)",
                    padding: "2px 8px", borderRadius: 99, fontWeight: 600,
                  }}>AI-analysed</span>
                )}
              </div>

              <h1 style={{ fontSize: 44, fontWeight: 800, color: "var(--ink)", letterSpacing: -1.4, margin: "0 0 18px", lineHeight: 1.02 }}>
                {hotelName}
              </h1>

              {heroStyle === "gauge" ? (
                <HTScoreBig value={d.honest ?? 0} size={104} />
              ) : (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 26 }}>
                  {d.advertised != null && (
                    <>
                      <div>
                        <div style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600, marginBottom: 4 }}>Advertised</div>
                        <div style={{
                          fontFamily: "var(--sans)", fontWeight: 800, fontSize: 52, letterSpacing: -2,
                          color: "var(--muted)", textDecoration: "line-through",
                          textDecorationColor: "var(--alert)", textDecorationThickness: 3, lineHeight: 0.85,
                        }}>{d.advertised.toFixed(1)}</div>
                      </div>
                      <span style={{ color: "var(--muted)", paddingBottom: 8 }}>
                        <HTIcon name="arrow" size={24} />
                      </span>
                    </>
                  )}
                  <HTScoreBig value={d.honest ?? 0} size={92} />
                </div>
              )}

              <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.5, marginTop: 22, maxWidth: 480 }}>
                {c.resultLede[0]}
                <b style={{ color: "var(--ink)" }}>{d.advertised?.toFixed(1) ?? "—"}</b>
                {c.resultLede[1]}
                <b style={{ color: "var(--ink)" }}>{d.reviews?.toLocaleString()}</b>
                {c.resultLede[2]}
                <b style={{ color: "var(--ink)" }}>
                  {d.complaints?.length > 0
                    ? d.complaints.slice(0, 2).map((c) => c.label.toLowerCase()).join(" and ")
                    : c.resultLede[3]}
                </b>
                {c.resultLede[4]}
              </p>
            </div>
            <HTPhoto h={340} />
          </div>

          {/* stat strip */}
          <div style={{
            margin: "0 44px", padding: "22px 28px", background: "var(--surface)",
            border: "1px solid var(--line)", borderRadius: 20,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 30,
          }}>
            <HTStatRow items={[
              { value: d.honest?.toFixed(1) ?? "—", label: "honest score", accent: d.honest ? htScoreColor(d.honest) : "var(--muted)" },
              { value: d.reviews?.toLocaleString() ?? "—", label: "reviews analyzed" },
              { value: d.complaintPct != null ? d.complaintPct + "%" : "—", label: "are complaints", accent: "var(--alert)" },
              { value: d.advertised?.toFixed(1) ?? "—", label: "advertised" },
            ]} />
            {d.honest != null && d.advertised != null && (
              <div style={{ flex: 1, maxWidth: 320, paddingTop: 16 }}>
                <HTScoreTrack honest={d.honest} advertised={d.advertised} />
              </div>
            )}
          </div>

          {/* body */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 30, padding: "34px 44px 56px", alignItems: "start" }}>

            {/* complaints */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 className="ht-h2">What actually goes wrong</h2>
                <div style={{ display: "flex", gap: 8 }}>
                  <span className="ht-chip ht-chip-on">All</span>
                  <span className="ht-chip">Serious</span>
                  <span className="ht-chip">Safety</span>
                </div>
              </div>

              {d.complaints?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {d.complaints.map((cc) => <HTComplaint key={cc.id} c={cc} />)}
                </div>
              ) : (
                <div style={{
                  padding: "32px 24px", border: "1px solid var(--line)", borderRadius: 16,
                  color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 13, textAlign: "center",
                }}>
                  No significant complaint patterns found in the reviews pulled.
                </div>
              )}
            </div>

            {/* right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* verdict — AI-generated or fallback */}
              <div style={{ background: "var(--invert-bg)", borderRadius: 20, padding: "24px", color: "var(--invert-fg)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--amber)" }}>
                    The verdict
                  </div>
                  {hotelData?.verdict && (
                    <div style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase",
                      color: "rgba(255,255,255,.45)", borderLeft: "1px solid rgba(255,255,255,.15)", paddingLeft: 8,
                    }}>AI</div>
                  )}
                </div>
                <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.35, letterSpacing: -0.3 }}>
                  {verdict}
                </div>
              </div>

              {/* what's good */}
              {d.goods?.length > 0 && (
                <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, padding: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <span style={{ color: "var(--good)" }}><HTIcon name="check" size={18} stroke={2.2} /></span>
                    <span style={{ fontWeight: 700, fontSize: 15.5, color: "var(--ink)" }}>What's actually good</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {d.goods.map((g, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 15, color: "var(--ink-soft)" }}>{g.label}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--good)" }}>×{g.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* methodology */}
              <div style={{ border: "1px dashed var(--line-strong)", borderRadius: 20, padding: "20px 22px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
                  HOW WE GOT {d.honest?.toFixed(1) ?? "THIS SCORE"}
                </div>
                <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                  {hotelData
                    ? `KIMI AI read ${d.reviewsFetched ?? d.reviews} real Google Maps reviews, detected complaint patterns in ${d.complaintPct}% of them, and scored ${d.honest?.toFixed(1)} — without any platform weighting.`
                    : "Every review is read for concrete problems, weighted by severity and how often it repeats — then the marketing-driven inflation is stripped out."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
