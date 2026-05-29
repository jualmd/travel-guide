import { useState, useEffect, useRef } from "react";

// ─── Icons ─────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, stroke = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);
const Icons = {
  map: "M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z M9 4v13 M15 7v13",
  compass: ["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z", "M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"],
  calendar: ["M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
  dollar: ["M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"],
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  check: ["M20 6 9 17l-5-5"],
  plus: ["M12 5v14 M5 12h14"],
  trash: ["M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6"],
  edit: ["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  x: ["M18 6 6 18 M6 6l12 12"],
  sun: ["M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42", "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"],
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  home: ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  plane: "M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z",
  cloud: "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z",
  clock: ["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z", "M12 6v6l4 2"],
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  menu: ["M3 12h18 M3 6h18 M3 18h18"],
  chevron: "M6 9l6 6 6-6",
  photo: ["M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z", "M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  wallet: ["M21 12V7H5a2 2 0 0 1 0-4h14v4", "M3 5v14a2 2 0 0 0 2 2h16v-5", "M18 12a2 2 0 0 0 0 4h4v-4z"],
  map2: ["M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z", "M8 2v16 M16 6v16"],
  bell: ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
};

// ─── Data & Storage ─────────────────────────────────────────────────────────
const useLocalStorage = (key, init) => {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
};

const DESTINATIONS = [
  { name: "Paris, França", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80", desc: "Cidade Luz, Eiffel e romance" },
  { name: "Tokyo, Japão", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", desc: "Tradição e modernidade" },
  { name: "Santorini, Grécia", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", desc: "Ilhas brancas no Mediterrâneo" },
  { name: "Machu Picchu, Peru", img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80", desc: "Cidadela inca nas nuvens" },
  { name: "Bali, Indonésia", img: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80", desc: "Templos, selva e praias" },
  { name: "Nova York, EUA", img: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800&q=80", desc: "A cidade que nunca dorme" },
];

const MOCK_WEATHER = { temp: 22, cond: "Parcialmente nublado", icon: "☁️", humid: 65, wind: 14 };
const EXPENSE_CATS = ["🍽️ Alimentação", "🏨 Hotel", "✈️ Transporte", "🎭 Passeio", "🛍️ Compras", "💊 Saúde"];

// ─── Toast ───────────────────────────────────────────────────────────────────
const ToastCtx = ({ toasts, remove }) => (
  <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        background: t.type === "error" ? "#ff4757" : "var(--accent)", color: "#fff",
        padding: "12px 20px", borderRadius: 12, fontFamily: "var(--font-body)", fontSize: 14,
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 10,
        animation: "slideIn .3s ease",
      }}>
        <span>{t.type === "error" ? "✕" : "✓"}</span>{t.msg}
        <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", marginLeft: 4, opacity: .7 }}>×</button>
      </div>
    ))}
  </div>
);

// ─── Navbar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home", label: "Início", icon: "home" },
  { id: "dashboard", label: "Dashboard", icon: "compass" },
  { id: "itinerary", label: "Roteiros", icon: "calendar" },
  { id: "finance", label: "Finanças", icon: "dollar" },
  { id: "favorites", label: "Favoritos", icon: "heart" },
];

const Navbar = ({ page, setPage, dark, setDark }) => {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "var(--nav-bg)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border)", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", fontFamily: "var(--font-body)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ background: "var(--accent)", borderRadius: 10, padding: "6px 8px", display: "flex" }}>
          <Icon d={Icons.plane} size={18} stroke="#fff" />
        </div>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--fg)" }}>TravelGuide</span>
      </div>

      {/* Desktop nav */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="desktop-nav">
        {NAV_ITEMS.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            background: page === n.id ? "var(--accent-soft)" : "none",
            border: "none", borderRadius: 10, padding: "8px 14px",
            color: page === n.id ? "var(--accent)" : "var(--fg-muted)",
            cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500,
            display: "flex", alignItems: "center", gap: 6, transition: "all .2s",
          }}>
            <Icon d={Icons[n.icon]} size={16} />
            {n.label}
          </button>
        ))}
        <button onClick={() => setDark(!dark)} style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "8px 10px", cursor: "pointer",
          color: "var(--fg)", marginLeft: 8, display: "flex",
        }}>
          <Icon d={dark ? Icons.sun : Icons.moon} size={16} />
        </button>
      </div>

      {/* Mobile */}
      <div style={{ display: "none" }} className="mobile-nav">
        <button onClick={() => setDark(!dark)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg)", marginRight: 8 }}>
          <Icon d={dark ? Icons.sun : Icons.moon} size={18} />
        </button>
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg)" }}>
          <Icon d={Icons.menu} size={22} />
        </button>
      </div>

      {open && (
        <div style={{
          position: "absolute", top: 64, left: 0, right: 0,
          background: "var(--bg)", borderBottom: "1px solid var(--border)",
          padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4,
        }}>
          {NAV_ITEMS.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setOpen(false); }} style={{
              background: page === n.id ? "var(--accent-soft)" : "none",
              border: "none", borderRadius: 10, padding: "10px 14px",
              color: page === n.id ? "var(--accent)" : "var(--fg)", cursor: "pointer",
              fontFamily: "var(--font-body)", fontSize: 14, textAlign: "left",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <Icon d={Icons[n.icon]} size={16} />
              {n.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

// ─── Footer ──────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{
    borderTop: "1px solid var(--border)", padding: "32px 24px",
    textAlign: "center", fontFamily: "var(--font-body)", color: "var(--fg-muted)",
    fontSize: 13, marginTop: 60,
  }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
      <div style={{ background: "var(--accent)", borderRadius: 8, padding: "4px 6px", display: "flex" }}>
        <Icon d={Icons.plane} size={14} stroke="#fff" />
      </div>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--fg)" }}>TravelGuide</span>
    </div>
    <p>Organize suas aventuras com elegância · {new Date().getFullYear()}</p>
  </footer>
);

// ─── Home Page ───────────────────────────────────────────────────────────────
const HomePage = ({ setPage }) => {
  const features = [
    { icon: "calendar", title: "Roteiros", desc: "Planeje cada dia da sua viagem com atividades organizadas por horário." },
    { icon: "heart", title: "Lugares Favoritos", desc: "Salve destinos incríveis e crie sua lista dos sonhos." },
    { icon: "dollar", title: "Controle de Gastos", desc: "Acompanhe seu orçamento em tempo real com gráficos visuais." },
    { icon: "check", title: "Checklist", desc: "Nunca esqueça nada com sua lista de verificação personalizada." },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{
        position: "relative", minHeight: "92vh", display: "flex",
        alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80)",
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.4)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(10,10,20,.7) 0%, rgba(20,30,60,.4) 100%)",
        }} />

        <div style={{ position: "relative", textAlign: "center", padding: "0 24px", maxWidth: 680, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,.1)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,.2)", borderRadius: 40,
            padding: "8px 18px", marginBottom: 28, color: "#fff", fontSize: 13,
            fontFamily: "var(--font-body)",
          }}>
            ✈️ &nbsp;Seu guia de viagens pessoal
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 6vw, 4rem)",
            fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 20,
            letterSpacing: "-1px",
          }}>
            Organize suas viagens<br />
            <span style={{ color: "var(--accent-light)" }}>de forma simples</span>
          </h1>
          <p style={{
            color: "rgba(255,255,255,.75)", fontSize: 18, marginBottom: 36,
            fontFamily: "var(--font-body)", lineHeight: 1.6,
          }}>
            Do planejamento ao último dia — roteiros, gastos, favoritos e checklists em um só lugar.
          </p>
          <button onClick={() => setPage("dashboard")} style={{
            background: "var(--accent)", color: "#fff", border: "none",
            borderRadius: 14, padding: "16px 40px", fontSize: 16, fontWeight: 600,
            cursor: "pointer", fontFamily: "var(--font-body)",
            boxShadow: "0 8px 32px rgba(99,102,241,.4)", transition: "transform .2s, box-shadow .2s",
          }}
            onMouseOver={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 40px rgba(99,102,241,.5)"; }}
            onMouseOut={e => { e.target.style.transform = ""; e.target.style.boxShadow = "0 8px 32px rgba(99,102,241,.4)"; }}>
            Começar agora →
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "var(--fg)", marginBottom: 12 }}>
            Tudo que você precisa
          </h2>
          <p style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)", fontSize: 16 }}>
            Funcionalidades pensadas para tornar cada viagem inesquecível
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 20, padding: 28, transition: "transform .2s, box-shadow .2s",
              cursor: "default",
            }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px var(--shadow)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, background: "var(--accent-soft)",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
              }}>
                <Icon d={Icons[f.icon]} size={22} stroke="var(--accent)" />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--fg)", marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: "var(--fg-muted)", fontSize: 14, lineHeight: 1.6, fontFamily: "var(--font-body)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Destinations showcase */}
      <div style={{ padding: "0 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,3vw,2.2rem)", color: "var(--fg)", marginBottom: 8 }}>
          Inspire-se
        </h2>
        <p style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)", marginBottom: 32 }}>Destinos que não saem da cabeça</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
          {DESTINATIONS.slice(0, 3).map((d, i) => (
            <div key={i} style={{ borderRadius: 20, overflow: "hidden", position: "relative", height: 220, cursor: "pointer" }}>
              <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }}
                onMouseOver={e => e.target.style.transform = "scale(1.06)"}
                onMouseOut={e => e.target.style.transform = ""} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 60%)",
                display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 20,
              }}>
                <div style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: 16, fontWeight: 700 }}>{d.name}</div>
                <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13, fontFamily: "var(--font-body)" }}>{d.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard Page ──────────────────────────────────────────────────────────
const DashboardPage = ({ toast }) => {
  const [trip, setTrip] = useLocalStorage("tg_trip", {
    name: "Paris, França", start: "2025-08-10", end: "2025-08-18", budget: 8000,
  });
  const [checklist, setChecklist] = useLocalStorage("tg_checklist", [
    { id: 1, text: "Reservar hotel", done: true },
    { id: 2, text: "Comprar passagens", done: true },
    { id: 3, text: "Fazer seguro viagem", done: false },
    { id: 4, text: "Separar documentos", done: false },
    { id: 5, text: "Trocar moeda", done: false },
  ]);
  const [newItem, setNewItem] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...trip });

  const expenses = JSON.parse(localStorage.getItem("tg_expenses") || "[]");
  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);

  const daysLeft = trip.start ? Math.max(0, Math.ceil((new Date(trip.start) - new Date()) / 86400000)) : null;
  const tripDays = trip.start && trip.end
    ? Math.ceil((new Date(trip.end) - new Date(trip.start)) / 86400000) : 0;

  const toggleCheck = id => setChecklist(c => c.map(i => i.id === id ? { ...i, done: !i.done } : i));
  const addItem = () => {
    if (!newItem.trim()) return;
    setChecklist(c => [...c, { id: Date.now(), text: newItem.trim(), done: false }]);
    setNewItem(""); toast("Item adicionado!");
  };
  const saveTrip = () => { setTrip(form); setEditing(false); toast("Viagem atualizada!"); };

  const Card = ({ children, style = {} }) => (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 24, ...style }}>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 0" }}>
      {/* Trip Header */}
      <div style={{
        borderRadius: 24, overflow: "hidden", marginBottom: 24, position: "relative", minHeight: 180,
      }}>
        <img
          src={DESTINATIONS.find(d => d.name.includes(trip.name?.split(",")[0]?.trim()))?.img || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80"}
          alt="" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,.75) 0%, rgba(0,0,0,.2) 100%)" }} />
        <div style={{ position: "relative", padding: "32px 32px", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, opacity: .7, fontFamily: "var(--font-body)", marginBottom: 6 }}>DESTINO</div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, margin: 0 }}>
                {trip.name || "Minha Viagem"}
              </h1>
              {trip.start && <div style={{ fontSize: 14, opacity: .8, marginTop: 6, fontFamily: "var(--font-body)" }}>
                {new Date(trip.start).toLocaleDateString("pt-BR")} → {new Date(trip.end).toLocaleDateString("pt-BR")} · {tripDays} dias
              </div>}
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              {daysLeft !== null && (
                <div style={{ background: "rgba(255,255,255,.15)", backdropFilter: "blur(10px)", borderRadius: 14, padding: "12px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)" }}>{daysLeft}</div>
                  <div style={{ fontSize: 11, opacity: .8, fontFamily: "var(--font-body)" }}>DIAS</div>
                </div>
              )}
              <button onClick={() => setEditing(true)} style={{
                background: "rgba(255,255,255,.15)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,.3)", color: "#fff", borderRadius: 12,
                padding: "10px 18px", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-body)",
              }}>
                Editar viagem
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }}>
          <div style={{ background: "var(--bg)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480 }}>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--fg)", marginBottom: 20 }}>Editar Viagem</h2>
            {[["Destino", "name", "text"], ["Início", "start", "date"], ["Fim", "end", "date"], ["Orçamento (R$)", "budget", "number"]].map(([label, key, type]) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, color: "var(--fg-muted)", marginBottom: 6, fontFamily: "var(--font-body)" }}>{label}</label>
                <input type={type} value={form[key] || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg)", fontFamily: "var(--font-body)", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setEditing(false)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontFamily: "var(--font-body)", color: "var(--fg)" }}>Cancelar</button>
              <button onClick={saveTrip} style={{ background: "var(--accent)", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontFamily: "var(--font-body)", color: "#fff", fontWeight: 600 }}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Orçamento", val: `R$ ${Number(trip.budget || 0).toLocaleString("pt-BR")}`, icon: "wallet", color: "#6366f1" },
          { label: "Gasto", val: `R$ ${totalSpent.toLocaleString("pt-BR")}`, icon: "dollar", color: "#f59e0b" },
          { label: "Restante", val: `R$ ${Math.max(0, (trip.budget || 0) - totalSpent).toLocaleString("pt-BR")}`, icon: "star", color: "#10b981" },
          { label: "Duração", val: `${tripDays} dias`, icon: "calendar", color: "#8b5cf6" },
        ].map((s, i) => (
          <Card key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--fg-muted)", fontFamily: "var(--font-body)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".5px" }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--fg)" }}>{s.val}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: s.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={Icons[s.icon]} size={18} stroke={s.color} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        {/* Weather */}
        <Card>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--fg)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon d={Icons.cloud} size={18} stroke="var(--accent)" />
            Clima · {trip.name?.split(",")[0]}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 48 }}>{MOCK_WEATHER.icon}</div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--fg)" }}>{MOCK_WEATHER.temp}°C</div>
              <div style={{ fontSize: 14, color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>{MOCK_WEATHER.cond}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
            <div style={{ fontSize: 13, color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>💧 {MOCK_WEATHER.humid}% umidade</div>
            <div style={{ fontSize: 13, color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>💨 {MOCK_WEATHER.wind} km/h</div>
          </div>
        </Card>

        {/* Budget bar */}
        <Card>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--fg)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon d={Icons.wallet} size={18} stroke="var(--accent)" />
            Orçamento
          </div>
          <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>Utilizado</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)", fontFamily: "var(--font-body)" }}>
              {trip.budget > 0 ? Math.round((totalSpent / trip.budget) * 100) : 0}%
            </span>
          </div>
          <div style={{ height: 10, background: "var(--border)", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
            <div style={{
              height: "100%", borderRadius: 10,
              background: `linear-gradient(90deg, var(--accent), #8b5cf6)`,
              width: `${Math.min(100, trip.budget > 0 ? (totalSpent / trip.budget) * 100 : 0)}%`,
              transition: "width .6s ease",
            }} />
          </div>
          <div style={{ fontSize: 13, color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>
            R$ {totalSpent.toLocaleString("pt-BR")} de R$ {Number(trip.budget || 0).toLocaleString("pt-BR")}
          </div>
        </Card>
      </div>

      {/* Checklist */}
      <Card style={{ marginBottom: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--fg)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon d={Icons.check} size={18} stroke="var(--accent)" />
          Checklist da Viagem
          <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--fg-muted)", fontFamily: "var(--font-body)", fontWeight: 400 }}>
            {checklist.filter(i => i.done).length}/{checklist.length}
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === "Enter" && addItem()}
            placeholder="Adicionar item..." style={{
              flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)",
              background: "var(--surface)", color: "var(--fg)", fontFamily: "var(--font-body)", fontSize: 14,
            }} />
          <button onClick={addItem} style={{
            background: "var(--accent)", border: "none", borderRadius: 10,
            padding: "10px 16px", cursor: "pointer", color: "#fff",
          }}><Icon d={Icons.plus} size={18} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {checklist.map(item => (
            <div key={item.id} onClick={() => toggleCheck(item.id)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
              background: "var(--surface-2)", borderRadius: 10, cursor: "pointer",
              transition: "opacity .2s", opacity: item.done ? .6 : 1,
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6, border: `2px solid ${item.done ? "var(--accent)" : "var(--border)"}`,
                background: item.done ? "var(--accent)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {item.done && <Icon d={Icons.check} size={12} stroke="#fff" strokeWidth={2.5} />}
              </div>
              <span style={{
                fontFamily: "var(--font-body)", fontSize: 14, color: "var(--fg)",
                textDecoration: item.done ? "line-through" : "none",
              }}>{item.text}</span>
              <button onClick={e => { e.stopPropagation(); setChecklist(c => c.filter(i => i.id !== item.id)); }}
                style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--fg-muted)", opacity: .5 }}>
                <Icon d={Icons.x} size={14} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ─── Itinerary Page ──────────────────────────────────────────────────────────
const ItineraryPage = ({ toast }) => {
  const [trip] = useLocalStorage("tg_trip", { start: "2025-08-10", end: "2025-08-18" });
  const [activities, setActivities] = useLocalStorage("tg_activities", [
    { id: 1, day: 0, time: "09:00", title: "Chegada ao aeroporto", desc: "Charles de Gaulle", cat: "✈️ Transporte" },
    { id: 2, day: 0, time: "14:00", title: "Check-in no hotel", desc: "Hotel Le Marais, centro histórico", cat: "🏨 Hotel" },
    { id: 3, day: 1, time: "10:00", title: "Torre Eiffel", desc: "Visita ao icônico monumento", cat: "🎭 Passeio" },
    { id: 4, day: 1, time: "13:00", title: "Almoço em Bistrot", desc: "Restaurante típico parisiense", cat: "🍽️ Alimentação" },
  ]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ time: "", title: "", desc: "", cat: EXPENSE_CATS[0] });

  const days = trip.start && trip.end
    ? Array.from({ length: Math.ceil((new Date(trip.end) - new Date(trip.start)) / 86400000) }, (_, i) => {
      const d = new Date(trip.start); d.setDate(d.getDate() + i);
      return d;
    }) : [new Date()];

  const dayActs = activities.filter(a => a.day === selectedDay).sort((a, b) => a.time.localeCompare(b.time));

  const addAct = () => {
    if (!form.title.trim()) return;
    setActivities(a => [...a, { ...form, id: Date.now(), day: selectedDay }]);
    setForm({ time: "", title: "", desc: "", cat: EXPENSE_CATS[0] });
    setShowForm(false); toast("Atividade adicionada!");
  };

  const CAT_COLORS = { "✈️ Transporte": "#6366f1", "🏨 Hotel": "#f59e0b", "🎭 Passeio": "#10b981", "🍽️ Alimentação": "#ef4444", "🛍️ Compras": "#8b5cf6", "💊 Saúde": "#06b6d4" };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 0", display: "grid", gridTemplateColumns: "260px 1fr", gap: 24 }}>
      {/* Day Sidebar */}
      <div>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--fg)", fontSize: 18, marginBottom: 16 }}>Dias da Viagem</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {days.map((d, i) => (
            <button key={i} onClick={() => setSelectedDay(i)} style={{
              background: selectedDay === i ? "var(--accent)" : "var(--surface)",
              border: `1px solid ${selectedDay === i ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 14, padding: "14px 16px", cursor: "pointer", textAlign: "left",
              color: selectedDay === i ? "#fff" : "var(--fg)", transition: "all .2s",
            }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700 }}>
                Dia {i + 1}
              </div>
              <div style={{ fontSize: 12, opacity: .8, fontFamily: "var(--font-body)", marginTop: 2 }}>
                {d.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })}
              </div>
              <div style={{ fontSize: 11, opacity: .6, marginTop: 4, fontFamily: "var(--font-body)" }}>
                {activities.filter(a => a.day === i).length} atividade(s)
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--fg)", fontSize: 18 }}>
            Dia {selectedDay + 1} — {days[selectedDay]?.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </h2>
          <button onClick={() => setShowForm(true)} style={{
            background: "var(--accent)", border: "none", borderRadius: 12, padding: "10px 18px",
            color: "#fff", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Icon d={Icons.plus} size={16} />Adicionar Atividade
          </button>
        </div>

        {showForm && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--fg)", marginBottom: 16, fontSize: 16 }}>Nova Atividade</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              {[["Horário", "time", "time"], ["Título", "title", "text"]].map(([l, k, t]) => (
                <div key={k}>
                  <label style={{ fontSize: 12, color: "var(--fg-muted)", fontFamily: "var(--font-body)", display: "block", marginBottom: 4 }}>{l}</label>
                  <input type={t} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--fg)", fontFamily: "var(--font-body)", fontSize: 14, boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "var(--fg-muted)", fontFamily: "var(--font-body)", display: "block", marginBottom: 4 }}>Descrição</label>
              <input value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--fg)", fontFamily: "var(--font-body)", fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "var(--fg-muted)", fontFamily: "var(--font-body)", display: "block", marginBottom: 4 }}>Categoria</label>
              <select value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--fg)", fontFamily: "var(--font-body)", fontSize: 14 }}>
                {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowForm(false)} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontFamily: "var(--font-body)", color: "var(--fg)" }}>Cancelar</button>
              <button onClick={addAct} style={{ background: "var(--accent)", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontFamily: "var(--font-body)", color: "#fff", fontWeight: 600 }}>Salvar</button>
            </div>
          </div>
        )}

        {dayActs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
            <p>Nenhuma atividade para este dia.<br />Clique em "Adicionar Atividade" para começar!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {dayActs.map(act => (
              <div key={act.id} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 16, padding: 20, display: "flex", gap: 16, alignItems: "flex-start",
              }}>
                <div style={{
                  minWidth: 60, background: "var(--accent-soft)", borderRadius: 10,
                  padding: "8px 6px", textAlign: "center",
                }}>
                  <Icon d={Icons.clock} size={16} stroke="var(--accent)" />
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-display)", marginTop: 4 }}>{act.time || "--:--"}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--fg)", marginBottom: 4 }}>{act.title}</div>
                  {act.desc && <div style={{ fontSize: 13, color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>{act.desc}</div>}
                  {act.cat && (
                    <div style={{
                      display: "inline-block", marginTop: 8, fontSize: 12,
                      background: (CAT_COLORS[act.cat] || "#6366f1") + "20",
                      color: CAT_COLORS[act.cat] || "#6366f1", borderRadius: 20, padding: "2px 10px",
                      fontFamily: "var(--font-body)",
                    }}>{act.cat}</div>
                  )}
                </div>
                <button onClick={() => { setActivities(a => a.filter(x => x.id !== act.id)); toast("Removido"); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg-muted)", opacity: .5, padding: 4 }}>
                  <Icon d={Icons.trash} size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Finance Page ─────────────────────────────────────────────────────────────
const FinancePage = ({ toast }) => {
  const [trip] = useLocalStorage("tg_trip", { budget: 8000 });
  const [expenses, setExpenses] = useLocalStorage("tg_expenses", [
    { id: 1, desc: "Passagem aérea", amount: 2400, cat: "✈️ Transporte", date: "2025-06-01" },
    { id: 2, desc: "Hotel Le Marais", amount: 1800, cat: "🏨 Hotel", date: "2025-08-10" },
    { id: 3, desc: "Tour Versalhes", amount: 120, cat: "🎭 Passeio", date: "2025-08-12" },
  ]);
  const [form, setForm] = useState({ desc: "", amount: "", cat: EXPENSE_CATS[0], date: new Date().toISOString().slice(0, 10) });
  const [showForm, setShowForm] = useState(false);

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const budget = Number(trip.budget || 0);
  const remaining = budget - total;

  const byCategory = EXPENSE_CATS.map(c => ({
    cat: c, total: expenses.filter(e => e.cat === c).reduce((s, e) => s + Number(e.amount), 0),
  })).filter(c => c.total > 0);

  const addExpense = () => {
    if (!form.desc.trim() || !form.amount) return;
    setExpenses(e => [...e, { ...form, id: Date.now(), amount: Number(form.amount) }]);
    setForm({ desc: "", amount: "", cat: EXPENSE_CATS[0], date: new Date().toISOString().slice(0, 10) });
    setShowForm(false); toast("Gasto registrado!");
  };

  const maxCat = Math.max(...byCategory.map(c => c.total), 1);
  const CAT_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4"];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--fg)" }}>Controle Financeiro</h1>
        <button onClick={() => setShowForm(true)} style={{
          background: "var(--accent)", border: "none", borderRadius: 12, padding: "10px 18px",
          color: "#fff", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Icon d={Icons.plus} size={16} />Adicionar Gasto
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Orçamento Total", val: `R$ ${budget.toLocaleString("pt-BR")}`, color: "#6366f1" },
          { label: "Total Gasto", val: `R$ ${total.toLocaleString("pt-BR")}`, color: "#ef4444" },
          { label: "Saldo Restante", val: `R$ ${Math.max(0, remaining).toLocaleString("pt-BR")}`, color: "#10b981" },
        ].map((s, i) => (
          <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 24 }}>
            <div style={{ fontSize: 12, color: "var(--fg-muted)", fontFamily: "var(--font-body)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".5px" }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "var(--font-display)", color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Budget bar */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--fg)" }}>Progresso do orçamento</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--fg-muted)" }}>
            {budget > 0 ? Math.round((total / budget) * 100) : 0}% utilizado
          </span>
        </div>
        <div style={{ height: 14, background: "var(--border)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 10,
            background: total > budget ? "#ef4444" : "linear-gradient(90deg, var(--accent), #8b5cf6)",
            width: `${Math.min(100, budget > 0 ? (total / budget) * 100 : 0)}%`,
            transition: "width .8s ease",
          }} />
        </div>
        {remaining < 0 && <div style={{ color: "#ef4444", fontSize: 13, marginTop: 10, fontFamily: "var(--font-body)" }}>
          ⚠️ Orçamento excedido em R$ {Math.abs(remaining).toLocaleString("pt-BR")}
        </div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        {/* Chart */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 24 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--fg)", marginBottom: 20 }}>Por Categoria</h3>
          {byCategory.length === 0 ? (
            <div style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)", textAlign: "center", padding: "20px 0" }}>Sem dados</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {byCategory.map((c, i) => (
                <div key={c.cat}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--fg)" }}>{c.cat}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>R$ {c.total.toLocaleString("pt-BR")}</span>
                  </div>
                  <div style={{ height: 8, background: "var(--border)", borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(c.total / maxCat) * 100}%`, background: CAT_COLORS[i % CAT_COLORS.length], borderRadius: 6, transition: "width .6s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent expenses */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 24 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--fg)", marginBottom: 16 }}>Lançamentos Recentes</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 260, overflowY: "auto" }}>
            {expenses.length === 0 ? (
              <div style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)", textAlign: "center", padding: "20px 0" }}>Nenhum gasto registrado</div>
            ) : (
              [...expenses].reverse().map(e => (
                <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "var(--surface-2)", borderRadius: 10 }}>
                  <div style={{ fontSize: 20 }}>{e.cat?.split(" ")[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--fg)", fontWeight: 500 }}>{e.desc}</div>
                    <div style={{ fontSize: 11, color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}>{e.date}</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "#ef4444" }}>
                    R$ {Number(e.amount).toLocaleString("pt-BR")}
                  </div>
                  <button onClick={() => { setExpenses(ex => ex.filter(x => x.id !== e.id)); toast("Removido"); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg-muted)", opacity: .5 }}>
                    <Icon d={Icons.trash} size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--bg)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480 }}>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--fg)", marginBottom: 20 }}>Novo Gasto</h2>
            {[["Descrição", "desc", "text"], ["Valor (R$)", "amount", "number"], ["Data", "date", "date"]].map(([l, k, t]) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, color: "var(--fg-muted)", marginBottom: 5, fontFamily: "var(--font-body)" }}>{l}</label>
                <input type={t} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg)", fontFamily: "var(--font-body)", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, color: "var(--fg-muted)", marginBottom: 5, fontFamily: "var(--font-body)" }}>Categoria</label>
              <select value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}
                style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg)", fontFamily: "var(--font-body)", fontSize: 14, width: "100%" }}>
                {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontFamily: "var(--font-body)", color: "var(--fg)" }}>Cancelar</button>
              <button onClick={addExpense} style={{ background: "var(--accent)", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontFamily: "var(--font-body)", color: "#fff", fontWeight: 600 }}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Favorites Page ──────────────────────────────────────────────────────────
const FavoritesPage = ({ toast }) => {
  const [favs, setFavs] = useLocalStorage("tg_favorites", [
    { id: 1, name: "Paris, França", img: DESTINATIONS[0].img, desc: "A Cidade Luz me encantou com sua arquitetura, gastronomia e arte incomparáveis." },
    { id: 2, name: "Tokyo, Japão", img: DESTINATIONS[1].img, desc: "Uma mistura perfeita de tradição milenar e tecnologia futurista." },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", img: "", desc: "" });
  const [selected, setSelected] = useState(null);

  const saveFav = () => {
    if (!form.name.trim()) return;
    const dest = DESTINATIONS.find(d => d.name.toLowerCase().includes(form.name.toLowerCase()));
    setFavs(f => [...f, { ...form, id: Date.now(), img: form.img || dest?.img || "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80" }]);
    setForm({ name: "", img: "", desc: "" });
    setShowForm(false); toast("Favorito salvo! ⭐");
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--fg)", marginBottom: 4 }}>Lugares Favoritos</h1>
          <p style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)", fontSize: 14 }}>Destinos que ficaram no coração</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          background: "var(--accent)", border: "none", borderRadius: 12, padding: "10px 18px",
          color: "#fff", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Icon d={Icons.heart} size={16} fill="#fff" stroke="#fff" />Salvar Favorito
        </button>
      </div>

      {/* Suggestions */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--fg)", marginBottom: 16 }}>✨ Sugestões de Destinos</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12 }}>
          {DESTINATIONS.map((d, i) => {
            const isSaved = favs.some(f => f.name === d.name);
            return (
              <div key={i} style={{ position: "relative", borderRadius: 14, overflow: "hidden", height: 120, cursor: "pointer" }}
                onClick={() => {
                  if (!isSaved) {
                    setFavs(f => [...f, { id: Date.now(), ...d }]);
                    toast(`${d.name} adicionado! ⭐`);
                  }
                }}>
                <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "var(--font-display)", lineHeight: 1.2 }}>{d.name}</div>
                </div>
                {isSaved && (
                  <div style={{ position: "absolute", top: 8, right: 8, background: "var(--accent)", borderRadius: 20, padding: "2px 8px", fontSize: 11, color: "#fff", fontFamily: "var(--font-body)" }}>
                    ⭐ Salvo
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
        {favs.map(fav => (
          <div key={fav.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ position: "relative", height: 180, cursor: "pointer" }} onClick={() => setSelected(fav)}>
              <img src={fav.img} alt={fav.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 50%)" }} />
              <button onClick={e => { e.stopPropagation(); setFavs(f => f.filter(x => x.id !== fav.id)); toast("Removido dos favoritos"); }}
                style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,.4)", border: "none", borderRadius: 8, padding: "6px", cursor: "pointer", color: "#fff" }}>
                <Icon d={Icons.x} size={14} />
              </button>
            </div>
            <div style={{ padding: 20 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--fg)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon d={Icons.map2} size={15} stroke="var(--accent)" />{fav.name}
              </h3>
              {fav.desc && <p style={{ fontSize: 13, color: "var(--fg-muted)", fontFamily: "var(--font-body)", lineHeight: 1.5 }}>{fav.desc}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Add form modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--bg)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480 }}>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--fg)", marginBottom: 20 }}>Novo Favorito</h2>
            {[["Nome do Lugar", "name", "text"], ["URL da Imagem (opcional)", "img", "text"]].map(([l, k, t]) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, color: "var(--fg-muted)", marginBottom: 5, fontFamily: "var(--font-body)" }}>{l}</label>
                <input type={t} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg)", fontFamily: "var(--font-body)", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, color: "var(--fg-muted)", marginBottom: 5, fontFamily: "var(--font-body)" }}>Descrição</label>
              <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={3}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg)", fontFamily: "var(--font-body)", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontFamily: "var(--font-body)", color: "var(--fg)" }}>Cancelar</button>
              <button onClick={saveFav} style={{ background: "var(--accent)", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontFamily: "var(--font-body)", color: "#fff", fontWeight: 600 }}>Salvar ⭐</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => setSelected(null)}>
          <div style={{ background: "var(--bg)", borderRadius: 24, overflow: "hidden", maxWidth: 560, width: "100%" }} onClick={e => e.stopPropagation()}>
            <img src={selected.img} alt={selected.name} style={{ width: "100%", height: 260, objectFit: "cover" }} />
            <div style={{ padding: 28 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--fg)", marginBottom: 12 }}>{selected.name}</h2>
              <p style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>{selected.desc}</p>
              <button onClick={() => setSelected(null)} style={{ marginTop: 20, background: "var(--accent)", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontFamily: "var(--font-body)", color: "#fff", fontWeight: 600 }}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [dark, setDark] = useLocalStorage("tg_dark", false);
  const [toasts, setToasts] = useState([]);

  const toast = (msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --font-display: 'Playfair Display', Georgia, serif;
      --font-body: 'DM Sans', system-ui, sans-serif;
      --accent: #6366f1;
      --accent-light: #a5b4fc;
      --accent-soft: #6366f120;
      --radius: 16px;
    }

    .light {
      --bg: #f8f7f4;
      --surface: #ffffff;
      --surface-2: #f3f2ef;
      --fg: #1a1a2e;
      --fg-muted: #6b7280;
      --border: #e5e3df;
      --nav-bg: rgba(248,247,244,.85);
      --shadow: rgba(0,0,0,.08);
    }

    .dark {
      --bg: #0f0f17;
      --surface: #1a1a2e;
      --surface-2: #242438;
      --fg: #f0eff5;
      --fg-muted: #8b8fa8;
      --border: #2a2a3e;
      --nav-bg: rgba(15,15,23,.85);
      --shadow: rgba(0,0,0,.3);
    }

    body { background: var(--bg); color: var(--fg); transition: background .3s, color .3s; }

    input, textarea, select { outline: none; }
    input:focus, textarea:focus, select:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px var(--accent-soft); }

    @keyframes slideIn {
      from { transform: translateX(40px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @media (max-width: 768px) {
      .desktop-nav { display: none !important; }
      .mobile-nav { display: flex !important; }
      [style*="gridTemplateColumns: 260px"] { grid-template-columns: 1fr !important; }
      [style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  `;

  return (
    <div className={dark ? "dark" : "light"} style={{ minHeight: "100vh", background: "var(--bg)", transition: "background .3s" }}>
      <style>{CSS}</style>
      <Navbar page={page} setPage={setPage} dark={dark} setDark={setDark} />
      <main style={{ paddingTop: 64 }}>
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "dashboard" && <DashboardPage toast={toast} />}
        {page === "itinerary" && <ItineraryPage toast={toast} />}
        {page === "finance" && <FinancePage toast={toast} />}
        {page === "favorites" && <FavoritesPage toast={toast} />}
      </main>
      {page !== "home" && <Footer />}
      <ToastCtx toasts={toasts} remove={id => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  );
}
