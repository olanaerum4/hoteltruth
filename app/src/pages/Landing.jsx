import { HTLogo } from "../components/Logo";
import { HTIcon } from "../components/Icon";
import { HTSearch } from "../components/Search";
import { HTScoreBig } from "../components/Score";
import { HTStat } from "../components/Stats";
import { HTComplaint } from "../components/Complaint";
import { HT_DATA, HT_HOTEL, HT_QUOTES, HT_EXAMPLES, HT_STEPS, HT_TONE } from "../data";

function HTPreview() {
  const d = HT_DATA;
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20,
      boxShadow: "0 18px 50px -22px rgba(20,30,45,.28)", overflow: "hidden",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 18px",
        borderBottom: "1px solid var(--line)", background: "var(--bg)",
      }}>
        <span style={{ width: 9, height: 9, borderRadius: 99, background: "var(--line-strong)" }} />
        <span style={{ width: 9, height: 9, borderRadius: 99, background: "var(--line-strong)" }} />
        <span style={{ width: 9, height: 9, borderRadius: 99, background: "var(--line-strong)" }} />
        <span style={{ marginLeft: 10, fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
          hoteltruth.app/hotel-sunrise-bangkok
        </span>
      </div>
      <div style={{ padding: "22px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div className="ht-eyebrow" style={{ marginBottom: 8 }}>Honest report</div>
            <div style={{ fontSize: 21, fontWeight: 800, color: "var(--ink)", letterSpacing: -0.5 }}>{HT_HOTEL}</div>
          </div>
          <HTScoreBig value={d.honest} size={58} sub={null} />
        </div>
        <div style={{
          display: "flex", gap: 24, paddingBottom: 16, marginBottom: 6,
          borderBottom: "1px solid var(--line)",
        }}>
          <HTStat value={d.reviews} label="reviews analyzed" />
          <HTStat value={d.complaintPct + "%"} label="complaints" accent="var(--alert)" />
          <HTStat value={d.advertised.toFixed(1)} label="advertised" />
        </div>
        {d.complaints.slice(0, 3).map((c) => (
          <HTComplaint key={c.id} c={c} variant="line" />
        ))}
      </div>
    </div>
  );
}

function HTQuoteCard({ q }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--line)",
      borderRadius: 18, padding: "22px 24px",
    }}>
      <span style={{ color: "var(--alert)", display: "block", marginBottom: 8 }}>
        <HTIcon name="quote" size={26} />
      </span>
      <div style={{ fontSize: 17, lineHeight: 1.5, color: "var(--ink)", fontWeight: 500, marginBottom: 14 }}>
        {q.t}
      </div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--muted)" }}>— {q.s}</div>
    </div>
  );
}

function HTSteps() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
      {HT_STEPS.map((s) => (
        <div key={s.n} style={{ borderTop: "2px solid var(--ink)", paddingTop: 18 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--truth)", fontWeight: 700, marginBottom: 12 }}>{s.n}</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: "var(--ink)", letterSpacing: -0.4, marginBottom: 8 }}>{s.t}</div>
          <div style={{ fontSize: 15, lineHeight: 1.5, color: "var(--ink-soft)" }}>{s.d}</div>
        </div>
      ))}
    </div>
  );
}

export function Landing({ tone = "calm", query, setQuery, onSearch, onHome }) {
  const c = HT_TONE[tone];

  const focusSearch = () => {
    const el = document.querySelector(".ht-hero-search input");
    if (el) el.focus();
  };

  return (
    <div>
      {/* nav */}
      <div style={{ display: "flex", alignItems: "center", padding: "20px 48px", maxWidth: 1320, margin: "0 auto" }}>
        <span onClick={onHome} style={{ cursor: "pointer" }}>
          <HTLogo size={22} />
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["How it works", "Why scores lie", "About"].map((x) => (
            <span key={x} className="ht-navlink" style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink-soft)" }}>{x}</span>
          ))}
          <span className="ht-btn ht-btn-primary" onClick={focusSearch}>Search a hotel</span>
        </div>
      </div>

      {/* hero */}
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, padding: "44px 48px 64px", alignItems: "center" }}>
          <div>
            <span className="ht-eyebrow">For travelers who read the 1-star reviews</span>
            <h1 style={{ fontSize: 60, fontWeight: 800, color: "var(--ink)", letterSpacing: -2.4, lineHeight: 0.98, margin: "16px 0 0" }}>
              {c.h1a}<br /><span style={{ color: "var(--truth)" }}>{c.h1b}</span> {c.h1c}
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--ink-soft)", margin: "22px 0 30px", maxWidth: 470 }}>
              {c.sub}
            </p>
            <div className="ht-hero-search" style={{ maxWidth: 540 }}>
              <HTSearch value={query} onChange={setQuery} onSubmit={onSearch} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>Try:</span>
              {HT_EXAMPLES.map((x) => (
                <span key={x} className="ht-chip" onClick={() => { setQuery(x); onSearch(x); }}>{x}</span>
              ))}
            </div>
          </div>
          <div onClick={() => onSearch()} style={{ cursor: "pointer" }} title="See the full report">
            <HTPreview />
          </div>
        </div>
      </div>

      {/* problem section */}
      <div style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "60px 48px" }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "var(--ink)", letterSpacing: -1, margin: "0 0 8px" }}>The 8.2 problem</h2>
          <p style={{ fontSize: 17, color: "var(--ink-soft)", maxWidth: 640, lineHeight: 1.5, margin: "0 0 32px" }}>
            Booking.com and TripAdvisor scores are inflated and gamed. The problems that actually ruin a trip are buried in the 1- and 2-star reviews nobody reads.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {HT_QUOTES.map((qq, i) => <HTQuoteCard key={i} q={qq} />)}
          </div>
        </div>
      </div>

      {/* how it works */}
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "60px 48px" }}>
        <h2 className="ht-h2" style={{ marginBottom: 30 }}>From hotel name to the honest truth in seconds</h2>
        <HTSteps />
      </div>

      {/* footer CTA */}
      <div style={{ background: "var(--invert-bg)", color: "var(--invert-fg)", padding: "64px 48px", textAlign: "center" }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1.4, margin: "0 0 10px" }}>{c.footerH}</h2>
        <p style={{ fontSize: 17, opacity: 0.72, margin: "0 auto 28px", maxWidth: 460 }}>{c.footerP}</p>
        <div style={{ maxWidth: 540, margin: "0 auto" }}>
          <HTSearch value={query} onChange={setQuery} onSubmit={onSearch} light />
        </div>
      </div>
    </div>
  );
}
