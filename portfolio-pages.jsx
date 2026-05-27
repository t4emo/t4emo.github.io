/* global React */
const { useState, useEffect, useRef } = React;

/* ============================================================
   Theme tokens — drives light/dark via CSS variables
   ============================================================ */
function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === "light") {
    root.style.setProperty("--bg", "#fafaf7");
    root.style.setProperty("--bg-elev", "#ffffff");
    root.style.setProperty("--bg-sunk", "#f0eee8");
    root.style.setProperty("--text", "#0c0c10");
    root.style.setProperty("--text-muted", "#6a6a72");
    root.style.setProperty("--border", "rgba(12,12,16,0.16)");
    root.style.setProperty("--border-strong", "rgba(12,12,16,0.45)");
    root.style.setProperty("--accent", "#1e5fd6");
    root.style.setProperty("--accent-glow", "rgba(30,95,214,0.25)");
    root.style.setProperty("--accent-ink", "#ffffff");
  } else {
    root.style.setProperty("--bg", "#0a0a0d");
    root.style.setProperty("--bg-elev", "#13131a");
    root.style.setProperty("--bg-sunk", "#06060a");
    root.style.setProperty("--text", "#f1f1f3");
    root.style.setProperty("--text-muted", "#8b8b95");
    root.style.setProperty("--border", "rgba(255,255,255,0.10)");
    root.style.setProperty("--border-strong", "rgba(255,255,255,0.35)");
    root.style.setProperty("--accent", "#5ea0ff");
    root.style.setProperty("--accent-glow", "rgba(94,160,255,0.45)");
    root.style.setProperty("--accent-ink", "#06060a");
  }
}

/* ============================================================
   Button — three styles: sketch / clean / pill
   ============================================================ */
function Btn({
  children,
  onClick,
  primary = false,
  btnStyle = "clean",
  size = "md",
}) {
  const sizes = {
    sm: { px: 14, py: 8, fs: 13 },
    md: { px: 22, py: 13, fs: 15 },
    lg: { px: 30, py: 17, fs: 17 },
  };
  const s = sizes[size];

  if (btnStyle === "sketch") {
    return (
      <SketchButton
        onClick={onClick}
        primary={primary}
        fs={s.fs}
        px={s.px}
        py={s.py}
      >
        {children}
      </SketchButton>
    );
  }

  const radius = btnStyle === "pill" ? 999 : 6;
  return (
    <button
      onClick={onClick}
      className="btn-base"
      style={{
        padding: `${s.py}px ${s.px}px`,
        fontSize: s.fs,
        borderRadius: radius,
        border: primary
          ? "1px solid var(--accent)"
          : "1px solid var(--border-strong)",
        background: primary ? "var(--accent)" : "transparent",
        color: primary ? "var(--accent-ink)" : "var(--text)",
        fontFamily: "inherit",
        fontWeight: 500,
        letterSpacing: 0.2,
        cursor: "pointer",
        transition:
          "transform .18s ease, box-shadow .25s ease, background .2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = primary
          ? "0 8px 24px var(--accent-glow), 0 0 0 1px var(--accent)"
          : "0 6px 18px rgba(0,0,0,0.12), 0 0 0 1px var(--border-strong)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </button>
  );
}

function SketchButton({ children, onClick, primary, fs, px, py }) {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setW(r.width);
    setH(r.height);
  }, [children]);
  const stroke = primary ? "var(--accent)" : "var(--text)";
  return (
    <button
      ref={ref}
      onClick={onClick}
      className="btn-sketch"
      style={{
        position: "relative",
        padding: `${py}px ${px}px`,
        fontSize: fs,
        background: primary ? "var(--accent)" : "transparent",
        color: primary ? "var(--accent-ink)" : "var(--text)",
        fontFamily: "inherit",
        fontWeight: 500,
        letterSpacing: 0.2,
        border: "none",
        cursor: "pointer",
        transition: "transform .18s ease, filter .2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px) rotate(-0.3deg)";
        e.currentTarget.style.filter = primary
          ? "drop-shadow(0 6px 18px var(--accent-glow))"
          : "none";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.filter = "none";
      }}
    >
      {w > 0 && (
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <path
            d={wobblyRectPath(w, h, 8)}
            fill="none"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </button>
  );
}

function wobblyRectPath(w, h, r = 8) {
  const seed = (w * 13 + h * 7) % 100;
  const j = (i) => Math.sin(seed + i * 12.345) * 1.4;
  return [
    `M ${r + j(1)} ${j(2)}`,
    `L ${w - r + j(3)} ${j(4)}`,
    `Q ${w + j(5)} ${j(6)} ${w + j(7)} ${r + j(8)}`,
    `L ${w + j(9)} ${h - r + j(10)}`,
    `Q ${w + j(11)} ${h + j(12)} ${w - r + j(13)} ${h + j(14)}`,
    `L ${r + j(15)} ${h + j(16)}`,
    `Q ${j(17)} ${h + j(18)} ${j(19)} ${h - r + j(20)}`,
    `L ${j(21)} ${r + j(22)}`,
    `Q ${j(23)} ${j(24)} ${r + j(25)} ${j(26)}`,
    "Z",
  ].join(" ");
}

/* ============================================================
   Reveal-on-mount fade-up wrapper
   ============================================================ */
function Reveal({ children, delay = 0, style }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(12px)",
        transition:
          "opacity .55s ease, transform .55s cubic-bezier(.2,.7,.2,1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   Header / nav
   ============================================================ */
function Header({ active, onNav, btnStyle }) {
  const items = ["Home", "About", "Projects", "Skills", "Contact"];
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(10px)",
        background: "color-mix(in oklab, var(--bg), transparent 25%)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "18px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          onClick={() => onNav("Home")}
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: -0.5,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "var(--accent)",
              boxShadow: "0 0 12px var(--accent-glow)",
            }}
          />
          T4emo
        </div>
        <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {items.map((it) => (
            <button
              key={it}
              onClick={() => onNav(it)}
              className="nav-link"
              style={{
                background: "transparent",
                border: "none",
                color: active === it ? "var(--text)" : "var(--text-muted)",
                fontFamily: "inherit",
                fontSize: 14,
                padding: "8px 14px",
                cursor: "pointer",
                letterSpacing: 0.3,
                position: "relative",
                fontWeight: active === it ? 600 : 400,
                transition: "color .2s",
              }}
            >
              {it}
              {active === it && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 2,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 18,
                    height: 2,
                    borderRadius: 2,
                    background: "var(--accent)",
                    boxShadow: "0 0 8px var(--accent-glow)",
                  }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ============================================================
   Page: HOME
   ============================================================ */
function PageHome({ onNav, btnStyle }) {
  return (
    <section
      data-screen-label="01 Home"
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 36px 100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--accent-glow) 0%, transparent 60%)",
          filter: "blur(40px)",
          opacity: 0.5,
          top: "-200px",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", textAlign: "center", maxWidth: 920 }}>
        <Reveal delay={50}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              letterSpacing: 3,
              color: "var(--text-muted)",
              marginBottom: 28,
            }}
          >
            ┌─ PORTFOLIO ─┐
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(72px, 14vw, 200px)",
              fontWeight: 600,
              letterSpacing: -6,
              lineHeight: 0.88,
            }}
          >
            T4emo
          </h1>
        </Reveal>
        <Reveal delay={250}>
          <p
            style={{
              marginTop: 28,
              fontSize: 22,
              lineHeight: 1.45,
              color: "var(--text-muted)",
              maxWidth: 540,
              marginInline: "auto",
              textWrap: "pretty",
            }}
          >
            Learning{" "}
            <span style={{ color: "var(--text)" }}>web development</span>{" "}
            through{" "}
            <span style={{ color: "var(--text)" }}>The Odin Project</span>.
            Building real things from scratch, one project at a time.
          </p>
        </Reveal>
        <Reveal
          delay={380}
          style={{
            marginTop: 42,
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Btn
            primary
            size="lg"
            btnStyle={btnStyle}
            onClick={() => onNav("Contact")}
          >
            Contact me
          </Btn>
          <Btn size="lg" btnStyle={btnStyle}>
            Download CV
          </Btn>
        </Reveal>
        <Reveal delay={500} style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
          <a
            href="https://github.com/t4emo"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              color: "var(--text-muted)",
              textDecoration: "none",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              letterSpacing: 1.5,
              border: "1px solid var(--border)",
              borderRadius: 999,
              padding: "8px 18px",
              transition: "color .2s, border-color .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
            </svg>
            github.com/t4emo
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   Page: ABOUT
   ============================================================ */
function PageAbout({ onNav, btnStyle }) {
  const stats = [
    { value: "1", unit: "year", label: "experience" },
    { value: "5", unit: "", label: "projects" },
  ];
  return (
    <section
      data-screen-label="02 About"
      style={{ maxWidth: 1080, margin: "0 auto", padding: "90px 36px 120px" }}
    >
      <Reveal>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: 3,
            color: "var(--text-muted)",
          }}
        >
          / ABOUT
        </div>
      </Reveal>
      <Reveal delay={80}>
        <h2
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            margin: "12px 0 60px",
            fontWeight: 600,
            letterSpacing: -3,
            lineHeight: 0.95,
          }}
        >
          About me.
        </h2>
      </Reveal>

      <div style={{ maxWidth: 720 }}>
        <Reveal delay={250}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <p
              style={{
                fontSize: 20,
                lineHeight: 1.55,
                color: "var(--text)",
                margin: 0,
                textWrap: "pretty",
              }}
            >
              I'm T4emo — I studied C, C++ and Java at school, and I'm now
              diving into{" "}
              <span style={{ color: "var(--accent)" }}>web development</span>{" "}
              through The Odin Project.
            </p>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.65,
                color: "var(--text-muted)",
                margin: 0,
                textWrap: "pretty",
              }}
            >
              I like building things from scratch and understanding how they
              work. Currently working through HTML, CSS and JavaScript —
              shipping small projects as I go. Open to any opportunity where
              I can keep learning fast.
            </p>

            <div
              style={{
                marginTop: 14,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                maxWidth: 440,
              }}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: "18px 22px",
                    background: "var(--bg-elev)",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "baseline", gap: 6 }}
                  >
                    <span
                      style={{
                        fontSize: 48,
                        fontWeight: 600,
                        letterSpacing: -2,
                        lineHeight: 1,
                        color: "var(--accent)",
                      }}
                    >
                      {s.value}
                    </span>
                    {s.unit && (
                      <span
                        style={{ fontSize: 16, color: "var(--text-muted)" }}
                      >
                        {s.unit}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      letterSpacing: 2,
                      color: "var(--text-muted)",
                      marginTop: 8,
                      textTransform: "uppercase",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   Page: PROJECTS
   ============================================================ */
function PageProjects({ onNav, btnStyle }) {
  const projects = [
    {
      n: "01",
      title: "Rock Paper Scissors",
      desc: "Classic game built in vanilla JavaScript. DOM manipulation, game logic and a clean UI — my first real JS project via The Odin Project.",
      tags: ["JavaScript", "HTML", "CSS"],
      url: "https://github.com/t4emo/odin-Rock-Paper-Scissors",
    },
    {
      n: "02",
      title: "Coming soon",
      desc: "Next project in progress — stay tuned.",
      tags: [],
      coming: true,
    },
    {
      n: "03",
      title: "Coming soon",
      desc: "More to come as the Odin Project journey continues.",
      tags: [],
      coming: true,
    },
  ];
  return (
    <section
      data-screen-label="03 Projects"
      style={{ maxWidth: 1180, margin: "0 auto", padding: "90px 36px 120px" }}
    >
      <Reveal>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: 3,
            color: "var(--text-muted)",
          }}
        >
          / PROJECTS
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            margin: "12px 0 60px",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(48px, 8vw, 96px)",
              margin: 0,
              fontWeight: 600,
              letterSpacing: -3,
              lineHeight: 0.95,
            }}
          >
            My projects.
          </h2>
          <div
            style={{
              color: "var(--text-muted)",
              fontSize: 15,
              maxWidth: 340,
              textWrap: "pretty",
            }}
          >
            A short selection — quality over quantity.
          </div>
        </div>
      </Reveal>

      <div className="grid-projects">
        {projects.map((p, i) => (
          <Reveal key={p.n} delay={150 + i * 100}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  const [hover, setHover] = useState(false);
  const handleClick = () => {
    if (project.url) window.open(project.url, "_blank", "noreferrer");
  };
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClick}
      style={{
        position: "relative",
        border: "1px solid var(--border)",
        borderRadius: 14,
        background: project.coming ? "var(--bg-sunk)" : "var(--bg-elev)",
        padding: 24,
        transition:
          "transform .3s cubic-bezier(.2,.7,.2,1), border-color .3s, box-shadow .3s",
        transform: hover && !project.coming ? "translateY(-4px)" : "translateY(0)",
        borderColor: hover && !project.coming ? "var(--accent)" : "var(--border)",
        boxShadow: hover && !project.coming
          ? "0 24px 60px rgba(0,0,0,0.25), 0 0 0 1px var(--accent-glow)"
          : "none",
        cursor: project.coming ? "default" : "pointer",
        overflow: "hidden",
        opacity: project.coming ? 0.45 : 1,
      }}
    >
      {/* Visual */}
      <div
        style={{
          aspectRatio: "16 / 9",
          borderRadius: 8,
          background: "var(--bg-sunk)",
          marginBottom: 22,
          position: "relative",
          overflow: "hidden",
          border: "1px solid var(--border)",
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <pattern
              id={`stripes-${project.n}`}
              patternUnits="userSpaceOnUse"
              width="18"
              height="18"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="18"
                stroke="var(--border)"
                strokeWidth="2"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#stripes-${project.n})`}
            opacity="0.7"
          />
        </svg>
        <span
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: 2,
            color: "var(--text-muted)",
          }}
        >
          [ project shot · {project.n} ]
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: -0.5,
          }}
        >
          {project.title}
        </h3>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          {project.n}
        </span>
      </div>
      <p
        style={{
          margin: "12px 0 18px",
          fontSize: 15,
          lineHeight: 1.55,
          color: "var(--text-muted)",
          textWrap: "pretty",
        }}
      >
        {project.desc}
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {project.tags.map((t) => (
          <span
            key={t}
            style={{
              padding: "3px 10px 3px 6px",
              border: "1px solid var(--border)",
              borderRadius: 999,
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--text-muted)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {TECH_ICONS[t] && (
              <img
                src={TECH_ICONS[t]}
                alt={t}
                width={14}
                height={14}
                style={{ display: "block" }}
              />
            )}
            {t}
          </span>
        ))}
      </div>
      {!project.coming && (
        <div
          style={{
            position: "absolute",
            right: 18,
            bottom: 18,
            width: 36,
            height: 36,
            borderRadius: 999,
            border: "1px solid var(--border-strong)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            transition: "transform .3s, background .3s, color .3s",
            transform: hover
              ? "translate(0,0) rotate(0)"
              : "translate(0,0) rotate(-30deg)",
            background: hover ? "var(--accent)" : "transparent",
            color: hover ? "var(--accent-ink)" : "var(--text)",
            borderColor: hover ? "var(--accent)" : "var(--border-strong)",
          }}
        >
          ↗
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Page: SKILLS
   ============================================================ */
const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";
const TECH_ICONS = {
  JavaScript: `${DEVICON}/javascript/javascript-original.svg`,
  HTML: `${DEVICON}/html5/html5-original.svg`,
  CSS: `${DEVICON}/css3/css3-original.svg`,
  Git: `${DEVICON}/git/git-original.svg`,
  "C++": `${DEVICON}/cplusplus/cplusplus-original.svg`,
  Java: `${DEVICON}/java/java-original.svg`,
  C: `${DEVICON}/c/c-original.svg`,
};

function PageSkills({ onNav, btnStyle }) {
  const skills = ["JavaScript", "HTML", "CSS", "Git", "C++", "Java", "C"];
  return (
    <section
      data-screen-label="04 Skills"
      style={{ maxWidth: 1080, margin: "0 auto", padding: "90px 36px 120px" }}
    >
      <Reveal>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: 3,
            color: "var(--text-muted)",
          }}
        >
          / SKILLS
        </div>
      </Reveal>
      <Reveal delay={80}>
        <h2
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            margin: "12px 0 60px",
            fontWeight: 600,
            letterSpacing: -3,
            lineHeight: 0.95,
          }}
        >
          Skills.
        </h2>
      </Reveal>

      <div className="grid-skills">
        {skills.map((name, i) => (
          <Reveal key={name} delay={150 + i * 90}>
            <SkillTile name={name} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SkillTile({ name }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        aspectRatio: "1",
        borderRadius: 18,
        border: "1px solid var(--border)",
        background: "var(--bg-elev)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        cursor: "default",
        transition:
          "transform .3s cubic-bezier(.2,.7,.2,1), border-color .3s, box-shadow .3s",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        borderColor: hover ? "var(--accent)" : "var(--border)",
        boxShadow: hover
          ? "0 24px 60px rgba(0,0,0,0.30), 0 0 0 1px var(--accent-glow), inset 0 0 40px var(--accent-glow)"
          : "none",
        overflow: "hidden",
      }}
    >
      <img
        src={TECH_ICONS[name]}
        alt={name}
        style={{
          width: "55%",
          height: "55%",
          objectFit: "contain",
          transition: "transform .4s cubic-bezier(.2,.7,.2,1)",
          transform: hover ? "scale(1.08) rotate(-4deg)" : "scale(1)",
        }}
      />
    </div>
  );
}

/* ============================================================
   Page: CONTACT
   ============================================================ */
function PageContact({ onNav, btnStyle }) {
  return (
    <section
      data-screen-label="05 Contact"
      style={{ maxWidth: 880, margin: "0 auto", padding: "90px 36px 120px" }}
    >
      <Reveal>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: 3,
            color: "var(--text-muted)",
          }}
        >
          / CONTACT
        </div>
      </Reveal>
      <Reveal delay={80}>
        <h2
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            margin: "12px 0 30px",
            fontWeight: 600,
            letterSpacing: -3,
            lineHeight: 0.95,
          }}
        >
          Let's talk.
        </h2>
      </Reveal>
      <Reveal delay={160}>
        <p
          style={{
            fontSize: 18,
            color: "var(--text-muted)",
            margin: "0 0 50px",
            maxWidth: 560,
            textWrap: "pretty",
          }}
        >
          Open to internships, freelance and side-projects. Drop a line and I'll
          get back to you.
        </p>
      </Reveal>
      <Reveal delay={240}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Field label="Name" />
          <Field label="Email" />
          <Field label="Message" textarea />
          <div style={{ marginTop: 10 }}>
            <Btn primary size="lg" btnStyle={btnStyle}>
              Send →
            </Btn>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Field({ label, textarea }) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: 2,
          color: "var(--text-muted)",
        }}
      >
        {label.toUpperCase()}
      </span>
      {textarea ? (
        <textarea
          rows={5}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            background: "var(--bg-elev)",
            border: `1px solid ${focus ? "var(--accent)" : "var(--border)"}`,
            borderRadius: 8,
            padding: "14px 16px",
            color: "var(--text)",
            fontFamily: "inherit",
            fontSize: 15,
            outline: "none",
            resize: "vertical",
            transition: "border .2s, box-shadow .2s",
            boxShadow: focus ? "0 0 0 3px var(--accent-glow)" : "none",
          }}
        />
      ) : (
        <input
          type="text"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            background: "var(--bg-elev)",
            border: `1px solid ${focus ? "var(--accent)" : "var(--border)"}`,
            borderRadius: 8,
            padding: "14px 16px",
            color: "var(--text)",
            fontFamily: "inherit",
            fontSize: 15,
            outline: "none",
            transition: "border .2s, box-shadow .2s",
            boxShadow: focus ? "0 0 0 3px var(--accent-glow)" : "none",
          }}
        />
      )}
    </label>
  );
}

/* ============================================================
   Footer
   ============================================================ */
function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "30px 36px",
        marginTop: 80,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "var(--text-muted)",
            letterSpacing: 1,
          }}
        >
          © 2026 · T4EMO
        </div>
        <div
          style={{
            display: "flex",
            gap: 18,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          <a href="https://github.com/t4emo" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
            github
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            linkedin
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            email
          </a>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  applyTheme,
  Header,
  Footer,
  PageHome,
  PageAbout,
  PageProjects,
  PageSkills,
  PageContact,
  Reveal,
  Btn,
});
