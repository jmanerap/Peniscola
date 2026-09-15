"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  ACTIVITIES, CHALLENGES, DAYS, ENVELOPES, QUESTIONS, SURPRISES,
  TRIP_END, TRIP_START, iconFor,
} from "./data";

type Tab = "home" | "itinerary" | "challenges" | "journal" | "us";
type JournalEntry = { id: string; title: string; body: string; location: string; photos: string[]; reactions: Record<string, number>; createdAt: string };
type TripState = {
  completedActivities: string[];
  completedChallenges: Record<string, { completedAt: string; photo?: string }>;
  openedEnvelopes: string[];
  unlockedSurprises: string[];
  journal: JournalEntry[];
  moments: { day: string; member: string; answer: string }[];
  questionAnswers: { questionId: string; member: string; answer: string }[];
  dailyPhotos: { day: string; photoUrl: string }[];
};

const EMPTY_STATE: TripState = {
  completedActivities: [], completedChallenges: {}, openedEnvelopes: [], unlockedSurprises: [],
  journal: [], moments: [], questionAnswers: [], dailyPhotos: [],
};

// This fixed value keeps the server HTML identical to the first Safari render.
// The current time replaces it immediately after hydration.
const HYDRATION_TIME = new Date("2026-09-14T12:00:00+02:00");

const NAV: { id: Tab; label: string; icon: string }[] = [
  { id: "home", label: "Inicio", icon: "⌂" },
  { id: "itinerary", label: "Itinerario", icon: "≋" },
  { id: "challenges", label: "Retos", icon: "◇" },
  { id: "journal", label: "Diario", icon: "▤" },
  { id: "us", label: "Nosotros", icon: "♡" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function greeting(now: Date) {
  const hour = now.getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Hora de explorar";
  if (hour < 21) return "Se acerca el atardecer";
  return "Hora de guardar recuerdos del día";
}

function countdown(now: Date) {
  const distance = new Date(TRIP_START).getTime() - now.getTime();
  if (distance <= 0) return null;
  const days = Math.floor(distance / 86_400_000);
  const hours = Math.floor((distance / 3_600_000) % 24);
  const minutes = Math.floor((distance / 60_000) % 60);
  return { days, hours, minutes };
}

function Modal({ children, onClose, wide = false }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`modal-sheet ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        {children}
      </section>
    </div>
  );
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "wine" | "green" }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function AppIcon({ children }: { children: React.ReactNode }) {
  return <span className="app-icon" aria-hidden="true">{children}</span>;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [now, setNow] = useState(HYDRATION_TIME);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<TripState>(EMPTY_STATE);
  const [intro, setIntro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [journalOpen, setJournalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/trip", { cache: "no-store" });
      if (response.ok) setState(await response.json() as TripState);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    setIntro(localStorage.getItem("peniscola-intro-seen") !== "yes");
    setNow(new Date());
    setReady(true);
    void refresh();
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const mutate = useCallback(async (payload: Record<string, unknown>, success?: string) => {
    const response = await fetch("/api/trip", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json() as TripState & { error?: string; correct?: boolean };
    if (!response.ok) throw new Error(data.error ?? "No se pudo guardar");
    setState(data);
    if (success) { setToast(success); window.setTimeout(() => setToast(""), 2600); }
    return data;
  }, []);

  const navigate = (next: Tab) => {
    setTab(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar">
        <button className="brand" onClick={() => navigate("home")} aria-label="Ir al inicio">
          <span className="brand-mark">P</span><span>Peñíscola · 2026</span>
        </button>
        <Pill tone={loading ? "neutral" : "green"}>{loading ? "Conectando" : "Todo guardado"}</Pill>
      </header>

      <div className="screen" key={tab}>
        {!ready && <AppLoadingScreen />}
        {ready && tab === "home" && <HomeScreen now={now} state={state} onNavigate={navigate} mutate={mutate} />}
        {ready && tab === "itinerary" && <ItineraryScreen now={now} state={state} mutate={mutate} />}
        {ready && tab === "challenges" && <ChallengesScreen now={now} state={state} mutate={mutate} />}
        {ready && tab === "journal" && <JournalScreen state={state} mutate={mutate} onNew={() => { setEditingEntry(null); setJournalOpen(true); }} onEdit={(entry) => { setEditingEntry(entry); setJournalOpen(true); }} />}
        {ready && tab === "us" && <UsScreen now={now} state={state} mutate={mutate} onCode={() => setCodeOpen(true)} />}
      </div>

      <nav className="bottom-nav" aria-label="Navegación principal">
        {NAV.map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => navigate(item.id)}><span>{item.icon}</span>{item.label}</button>)}
      </nav>

      {intro && <Intro onDone={() => { localStorage.setItem("peniscola-intro-seen", "yes"); setIntro(false); }} />}
      {journalOpen && <JournalEditor entry={editingEntry} onClose={() => setJournalOpen(false)} mutate={mutate} />}
      {codeOpen && <SecretCode onClose={() => setCodeOpen(false)} mutate={mutate} />}
      {toast && <div className="toast" role="status">{toast}</div>}
      <div className="desktop-note">Diseñada para llevar nuestro viaje en el bolsillo.</div>
    </main>
  );
}

function Intro({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const screens = [
    { eyebrow: "Un fin de semana nuestro", title: "Todo el viaje, en un solo lugar.", body: "Esta app va a acompañarnos durante nuestro primer viaje juntos.", visual: "18 · 20" },
    { eyebrow: "Planes y recuerdos", title: "Descubrir, jugar, guardar.", body: "Aquí encontrarás nuestros planes, retos compartidos y los recuerdos que vayamos creando.", visual: "♡" },
    { eyebrow: "Hay más de lo que parece", title: "Algunas cosas esperan su momento.", body: "No todo estará disponible desde el principio. Unas sorpresas aparecerán solas y otras tendremos que descubrirlas.", visual: "✦" },
  ];
  const current = screens[step];
  return <div className="intro-wrap"><section className="intro-card">
    <div className="intro-orbit"><span>{current.visual}</span></div>
    <div className="intro-copy"><p className="eyebrow">{current.eyebrow}</p><h1>{current.title}</h1><p>{current.body}</p></div>
    <div className="intro-footer"><div className="dots">{screens.map((_, i) => <i key={i} className={i === step ? "on" : ""} />)}</div>
      <button className="primary-button" onClick={() => step < screens.length - 1 ? setStep(step + 1) : onDone()}>{step < screens.length - 1 ? "Continuar" : "Empezar el viaje"}<span>→</span></button>
    </div>
  </section></div>;
}

function AppLoadingScreen() {
  return <section className="app-loading" aria-live="polite">
    <span className="loading-mark">P</span>
    <p>Preparando nuestra escapada…</p>
  </section>;
}

function HomeScreen({ now, state, onNavigate, mutate }: { now: Date; state: TripState; onNavigate: (tab: Tab) => void; mutate: (payload: Record<string, unknown>, success?: string) => Promise<TripState> }) {
  const count = countdown(now);
  const upcoming = ACTIVITIES.find((activity) => new Date(activity.date) > now) ?? ACTIVITIES.at(-1)!;
  const started = now >= new Date(TRIP_START);
  const ended = now > new Date(TRIP_END);
  const total = new Date(TRIP_END).getTime() - new Date(TRIP_START).getTime();
  const progress = ended ? 100 : Math.max(0, Math.min(100, ((now.getTime() - new Date(TRIP_START).getTime()) / total) * 100));
  const todayEnvelope = ENVELOPES.find((envelope) => !state.openedEnvelopes.includes(envelope.id)) ?? ENVELOPES[2];
  const envelopeReady = now >= new Date(todayEnvelope.unlockAt);
  const opened = state.openedEnvelopes.includes(todayEnvelope.id);

  return <>
    <section className="hero-card">
      <div className="hero-sky"><div className="sun-disc" /><div className="castle-shape"><i/><i/><i/></div><div className="sea-lines"><i/><i/><i/></div></div>
      <div className="hero-content"><p className="eyebrow light">Nuestro primer viaje</p><h1>Peñíscola</h1><p className="date-line">18—20 septiembre 2026</p>
        <div className="countdown-card">
          {ended ? <div className="journey-live">Un viaje para recordar <span>♡</span></div> : started ? <div className="journey-live">Ya estamos de viaje <span>♥</span></div> : <>
            <span className="count-label">Faltan</span><div className="count-grid"><strong>{count?.days}<small>días</small></strong><b>:</b><strong>{String(count?.hours).padStart(2,"0")}<small>horas</small></strong><b>:</b><strong>{String(count?.minutes).padStart(2,"0")}<small>min</small></strong></div>
          </>}
        </div>
      </div>
    </section>

    <section className="welcome-row"><div><p className="eyebrow wine">{greeting(now)}</p><h2>{started ? "¿Qué hacemos ahora?" : "Nuestra escapada se acerca."}</h2></div><span className="mini-weather">☼ <b>24°</b></span></section>

    <section className="section-block">
      <div className="section-heading"><div><p className="eyebrow">Lo siguiente</p><h3>{upcoming.title}</h3></div><button className="text-button" onClick={() => onNavigate("itinerary")}>Ver todo</button></div>
      <article className="next-card"><div className="time-block"><span>{upcoming.time}</span><small>{DAYS.find((d) => d.id === upcoming.day)?.label}</small></div><div className="next-copy"><p>{upcoming.description}</p><span>⌖ {upcoming.location}</span></div><button onClick={() => onNavigate("itinerary")} aria-label="Ver actividad">›</button></article>
    </section>

    <section className="stats-grid">
      <article><AppIcon>↗</AppIcon><strong>{Math.round(progress)}%</strong><span>del viaje</span><div className="mini-progress"><i style={{ width: `${progress}%` }} /></div></article>
      <article><AppIcon>◇</AppIcon><strong>{Object.keys(state.completedChallenges).length}<small> / {CHALLENGES.length}</small></strong><span>retos juntos</span></article>
      <article><AppIcon>▤</AppIcon><strong>{state.journal.length}</strong><span>recuerdos</span></article>
    </section>

    <button className="journal-cta" onClick={() => onNavigate("journal")}><span className="journal-cta-icon">＋</span><span><small>Diario del viaje</small><strong>Guardar un momento</strong></span><b>→</b></button>

    <section className={`envelope-card ${opened ? "opened" : ""}`}>
      <div className="envelope-visual"><div className="envelope-flap"/><span>♡</span></div>
      <div className="envelope-copy"><p className="eyebrow">Sobre del {todayEnvelope.day.toLowerCase()}</p><h3>{opened ? todayEnvelope.title : envelopeReady ? "Hay algo para vosotros" : "Todavía no es el momento"}</h3><p>{opened ? todayEnvelope.message : envelopeReady ? "El sobre ya está listo. Solo queda abrirlo." : `Podréis abrirlo el ${formatDate(todayEnvelope.unlockAt)}.`}</p>
        {envelopeReady && !opened && <button className="secondary-button" onClick={() => void mutate({ action: "envelope", id: todayEnvelope.id }, "Sobre abierto")}>Abrir sobre <span>✦</span></button>}
      </div>
    </section>
  </>;
}

function ItineraryScreen({ now, state, mutate }: { now: Date; state: TripState; mutate: (payload: Record<string, unknown>, success?: string) => Promise<TripState> }) {
  const [day, setDay] = useState<(typeof DAYS)[number]["id"]>("viernes");
  const activities = ACTIVITIES.filter((activity) => activity.day === day);
  return <>
    <PageTitle eyebrow="De principio a fin" title="Nuestro itinerario" body="Los planes se irán descubriendo cuando llegue su momento." />
    <div className="day-switcher">{DAYS.map((item) => <button key={item.id} className={day === item.id ? "active" : ""} onClick={() => setDay(item.id)}><span>{item.label}</span><small>{item.date}</small></button>)}</div>
    <section className="timeline">
      {activities.map((activity, index) => {
        const available = now >= new Date(activity.date);
        const completed = state.completedActivities.includes(activity.id);
        return <article className={`timeline-item ${available ? "available" : "locked"} ${completed ? "completed" : ""}`} key={activity.id}>
          <div className="timeline-rail"><span>{completed ? "✓" : available ? iconFor(activity.accent) : "·"}</span>{index < activities.length - 1 && <i/>}</div>
          <div className="timeline-card"><div className="timeline-meta"><strong>{activity.time}</strong><Pill tone={completed ? "green" : available ? "wine" : "neutral"}>{completed ? "Realizada" : available ? "Disponible" : "Pendiente"}</Pill></div><h3>{activity.title}</h3><p>{activity.description}</p><a href={activity.maps} target="_blank" rel="noreferrer">⌖ {activity.location}<span>↗</span></a>
            {available && <button className={`complete-button ${completed ? "done" : ""}`} onClick={() => void mutate({ action: "activity", id: activity.id }, completed ? "Actividad marcada como pendiente" : "Momento completado")}>{completed ? "✓ Realizada" : "Marcar como realizada"}</button>}
            {!available && <div className="unlock-note">⌕ Se desbloquea a las {activity.time}</div>}
          </div>
        </article>;
      })}
    </section>
    <p className="edit-hint">Los planes son orientativos. Lo mejor del viaje puede ser lo que no estaba previsto.</p>
  </>;
}

function ChallengesScreen({ now, state, mutate }: { now: Date; state: TripState; mutate: (payload: Record<string, unknown>, success?: string) => Promise<TripState> }) {
  const [active, setActive] = useState<string | null>(null);
  const completed = Object.keys(state.completedChallenges).length;
  return <>
    <PageTitle eyebrow="Solo se consiguen juntos" title="Retos de pareja" body="Cinco pequeñas misiones para hacer este viaje todavía más nuestro." />
    <section className="challenge-progress"><div className="ring" style={{ "--progress": `${completed / CHALLENGES.length * 360}deg` } as React.CSSProperties}><span>{completed}<small>de {CHALLENGES.length}</small></span></div><div><p className="eyebrow wine">Nuestro progreso</p><h3>{completed === CHALLENGES.length ? "Misión cumplida" : completed === 0 ? "Todo está por descubrir" : "Vamos por buen camino"}</h3><p>{completed === CHALLENGES.length ? "Ya tenemos una colección de historias." : `Quedan ${CHALLENGES.length - completed} retos y muchas risas.`}</p></div></section>
    <section className="challenge-list">{CHALLENGES.map((challenge, index) => {
      const available = now >= new Date(challenge.unlockAt);
      const record = state.completedChallenges[challenge.id];
      return <article key={challenge.id} className={`challenge-card ${!available ? "locked" : ""} ${record ? "completed" : ""}`}>
        {record?.photo && <img className="challenge-photo" src={record.photo} alt={`Prueba de ${challenge.title}`} />}
        <div className="challenge-top"><span className="challenge-number">{String(index + 1).padStart(2,"0")}</span><AppIcon>{record ? "✓" : available ? challenge.icon : "⌕"}</AppIcon></div><h3>{challenge.title}</h3><p>{challenge.description}</p>
        {record ? <div className="completed-date">Completado · {formatDate(record.completedAt)}</div> : available ? <button className="secondary-button wide" onClick={() => setActive(challenge.id)}>Completar reto <span>→</span></button> : <div className="unlock-note">Disponible {formatDate(challenge.unlockAt)}</div>}
      </article>;
    })}</section>
    <section className="reward-note"><span>✦</span><div><strong>Algo se desbloqueará</strong><p>Completad 3 retos para descubrir una sorpresa.</p></div></section>
    {active && <ChallengeComplete challengeId={active} mutate={mutate} onClose={() => setActive(null)} />}
  </>;
}

function ChallengeComplete({ challengeId, mutate, onClose }: { challengeId: string; mutate: (payload: Record<string, unknown>, success?: string) => Promise<TripState>; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null); const [busy, setBusy] = useState(false);
  const challenge = CHALLENGES.find((item) => item.id === challengeId)!;
  const submit = async () => {
    setBusy(true);
    try {
      let photo = "";
      if (file) { const form = new FormData(); form.append("file", file); const upload = await fetch("/api/upload", { method: "POST", body: form }); const result = await upload.json() as { url?: string; error?: string }; if (!upload.ok) throw new Error(result.error); photo = result.url ?? ""; }
      await mutate({ action: "challenge", id: challengeId, photo }, "¡Reto completado juntos!"); onClose();
    } finally { setBusy(false); }
  };
  return <Modal onClose={onClose}><div className="modal-kicker">{challenge.icon}</div><p className="eyebrow wine">Completar reto</p><h2>{challenge.title}</h2><p className="modal-text">Podéis añadir una foto como prueba ahora o guardar el reto sin ella.</p><label className="photo-drop"><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /><span>＋</span><strong>{file ? file.name : "Añadir fotografía"}</strong><small>{file ? "Lista para guardar" : "Desde la cámara o el carrete"}</small></label><button className="primary-button wine-button" disabled={busy} onClick={() => void submit()}>{busy ? "Guardando…" : "Completar reto"}<span>✓</span></button></Modal>;
}

function JournalScreen({ state, mutate, onNew, onEdit }: { state: TripState; mutate: (payload: Record<string, unknown>, success?: string) => Promise<TripState>; onNew: () => void; onEdit: (entry: JournalEntry) => void }) {
  const allPhotos = state.journal.flatMap((entry) => entry.photos);
  return <>
    <div className="journal-title"><PageTitle eyebrow="Nuestro pequeño archivo" title="Diario del viaje" body="Fotos, frases y momentos para volver aquí cuando queramos." /><button className="round-add" onClick={onNew} aria-label="Añadir recuerdo">＋</button></div>
    {state.journal.length === 0 ? <section className="empty-journal"><div className="empty-polaroid"><span>♡</span></div><p className="eyebrow wine">La primera página está en blanco</p><h2>El primer recuerdo lo escribimos juntos.</h2><p>Guarda una foto, una frase o ese detalle que no quieres olvidar.</p><button className="primary-button wine-button" onClick={onNew}>Crear primer recuerdo <span>＋</span></button></section> : <section className="journal-feed">
      {state.journal.map((entry) => <article className="memory-card" key={entry.id}><div className="memory-meta"><span>{formatDate(entry.createdAt)}</span><button onClick={() => onEdit(entry)} aria-label="Editar recuerdo">•••</button></div>{entry.title && <h2>{entry.title}</h2>}<p>{entry.body}</p>{entry.location && <small>⌖ {entry.location}</small>}
        {entry.photos.length > 0 && <div className={`memory-photos count-${Math.min(3, entry.photos.length)}`}>{entry.photos.map((photo, i) => <img key={photo} src={photo} alt={`Recuerdo ${i + 1}`} />)}</div>}
        <div className="reaction-row">{["❤️","😂","🥹","⭐"].map((emoji) => <button key={emoji} onClick={() => void mutate({ action: "react", id: entry.id, emoji })}>{emoji}{entry.reactions[emoji] ? <small>{entry.reactions[emoji]}</small> : null}</button>)}</div>
      </article>)}
    </section>}
    {allPhotos.length > 0 && <DailyPhotoPicker photos={allPhotos} state={state} mutate={mutate} />}
  </>;
}

function JournalEditor({ entry, onClose, mutate }: { entry: JournalEntry | null; onClose: () => void; mutate: (payload: Record<string, unknown>, success?: string) => Promise<TripState> }) {
  const [title, setTitle] = useState(entry?.title ?? ""); const [body, setBody] = useState(entry?.body ?? ""); const [location, setLocation] = useState(entry?.location ?? "");
  const [files, setFiles] = useState<File[]>([]); const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!body.trim() && files.length === 0 && (entry?.photos.length ?? 0) === 0) return;
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) { const form = new FormData(); form.append("file", file); const response = await fetch("/api/upload", { method: "POST", body: form }); const result = await response.json() as { url?: string; error?: string }; if (!response.ok) throw new Error(result.error); if (result.url) uploaded.push(result.url); }
      await mutate({ action: "journal", id: entry?.id, title, body, location, photos: [...(entry?.photos ?? []), ...uploaded], createdAt: entry?.createdAt }, entry ? "Recuerdo actualizado" : "Recuerdo guardado"); onClose();
    } finally { setBusy(false); }
  };
  const remove = async () => { if (!entry) return; await mutate({ action: "deleteJournal", id: entry.id }, "Recuerdo eliminado"); onClose(); };
  return <Modal onClose={onClose} wide><form className="journal-form" onSubmit={(event) => void submit(event)}><p className="eyebrow wine">{entry ? "Editar recuerdo" : "Nuevo recuerdo"}</p><h2>{entry ? "Volvamos a este momento" : "¿Qué queréis guardar?"}</h2><label>Título <span>opcional</span><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Un atardecer inesperado" /></label><label>El momento<textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Escribe lo que no quieres olvidar…" rows={5} /></label><label>Ubicación <span>opcional</span><input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Peñíscola" /></label><label className="compact-photo"><input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))} /><span>▧</span><strong>{files.length ? `${files.length} foto${files.length > 1 ? "s" : ""} seleccionada${files.length > 1 ? "s" : ""}` : "Añadir fotografías"}</strong></label><button className="primary-button wine-button" disabled={busy}>{busy ? "Guardando…" : "Guardar recuerdo"}<span>→</span></button>{entry && <button type="button" className="delete-button" onClick={() => void remove()}>Eliminar recuerdo</button>}</form></Modal>;
}

function DailyPhotoPicker({ photos, state, mutate }: { photos: string[]; state: TripState; mutate: (payload: Record<string, unknown>, success?: string) => Promise<TripState> }) {
  const [day, setDay] = useState("viernes"); const selected = state.dailyPhotos.find((item) => item.day === day)?.photoUrl;
  return <section className="photo-day"><p className="eyebrow wine">La foto del día</p><h2>Elegid la que lo cuente todo.</h2><div className="photo-day-tabs">{DAYS.map((item) => <button className={day === item.id ? "active" : ""} key={item.id} onClick={() => setDay(item.id)}>{item.label}</button>)}</div><div className="photo-strip">{photos.map((photo) => <button key={photo} className={selected === photo ? "selected" : ""} onClick={() => void mutate({ action: "dailyPhoto", day, photoUrl: photo }, "Foto del día elegida")}><img src={photo} alt="Candidata a foto del día"/><span>★</span></button>)}</div></section>;
}

function UsScreen({ now, state, mutate, onCode }: { now: Date; state: TripState; mutate: (payload: Record<string, unknown>, success?: string) => Promise<TripState>; onCode: () => void }) {
  const completed = Object.keys(state.completedChallenges).length;
  const openSurprises = SURPRISES.filter((surprise) => surprise.type === "time" ? now >= new Date(surprise.unlockAt!) : surprise.type === "challenges" ? completed >= surprise.required! : state.unlockedSurprises.includes("code")).length;
  return <>
    <PageTitle eyebrow="Lo que vamos construyendo" title="Nosotros" body="Preguntas, sorpresas y nuestras dos versiones del mismo día." />
    <section className="us-portrait"><span className="us-mono">P</span><div><small>Nuestra escapada</small><strong>18 · 09 · 26</strong><p>Peñíscola, el principio de una colección de viajes.</p></div></section>
    <section className="section-block"><div className="section-heading"><div><p className="eyebrow">Sorpresas</p><h3>Solo cuando toque</h3></div><span className="tiny-label">{openSurprises} abiertas</span></div><div className="surprise-grid">{SURPRISES.map((surprise) => {
      const unlocked = surprise.type === "time" ? now >= new Date(surprise.unlockAt!) : surprise.type === "challenges" ? completed >= surprise.required! : state.unlockedSurprises.includes("code");
      return <article key={surprise.id} className={unlocked ? "unlocked" : ""}><AppIcon>{unlocked ? surprise.icon : "⌕"}</AppIcon><small>{surprise.subtitle}</small><h3>{surprise.title}</h3>{unlocked ? <p>{surprise.reveal}</p> : <p>{surprise.type === "time" ? "Todavía no es el momento." : surprise.type === "challenges" ? `${completed} de ${surprise.required} retos completados.` : "Necesitas una fecha importante."}</p>}{surprise.type === "code" && !unlocked && <button onClick={onCode}>Introducir código →</button>}</article>;
    })}</div></section>
    <MomentSection now={now} state={state} mutate={mutate} />
    <QuestionSection now={now} state={state} mutate={mutate} />
    <section className="privacy-card"><span>⌾</span><div><strong>Este rincón es solo nuestro</strong><p>El contenido se guarda en un espacio privado y no aparece en ningún listado público.</p></div></section>
  </>;
}

function MomentSection({ now, state, mutate }: { now: Date; state: TripState; mutate: (payload: Record<string, unknown>, success?: string) => Promise<TripState> }) {
  const [day, setDay] = useState("viernes"); const [member, setMember] = useState("uno"); const [answer, setAnswer] = useState("");
  const dayAnswers = state.moments.filter((item) => item.day === day); const both = dayAnswers.some((a) => a.member === "uno") && dayAnswers.some((a) => a.member === "dos");
  const unlocks: Record<string, string> = { viernes: "2026-09-18T21:30:00+02:00", sabado: "2026-09-19T21:30:00+02:00", domingo: "2026-09-20T17:00:00+02:00" };
  const available = now >= new Date(unlocks[day]);
  const submit = async (event: FormEvent) => { event.preventDefault(); if (!answer.trim()) return; await mutate({ action: "moment", day, member, answer }, "Respuesta guardada en secreto"); setAnswer(""); };
  return <section className="moment-card"><p className="eyebrow light">Momento del día</p><h2>¿Cuál ha sido tu momento favorito de hoy?</h2><div className="moment-tabs">{DAYS.map((d) => <button key={d.id} className={day === d.id ? "active" : ""} onClick={() => setDay(d.id)}>{d.label}</button>)}</div>
    {!available ? <div className="moment-locked">⌕ Podréis responder al final del día.</div> : both ? <div className="answer-pair">{dayAnswers.map((item) => <blockquote key={item.member}><small>{item.member === "uno" ? "Mi respuesta" : "Tu respuesta"}</small>“{item.answer}”</blockquote>)}</div> : <form onSubmit={(event) => void submit(event)}><div className="person-switch"><button type="button" className={member === "uno" ? "active" : ""} onClick={() => setMember("uno")}>Persona 1</button><button type="button" className={member === "dos" ? "active" : ""} onClick={() => setMember("dos")}>Persona 2</button></div>{dayAnswers.some((item) => item.member === member) ? <p className="secret-saved">Tu respuesta está guardada. Se mostrará cuando responda la otra persona.</p> : <><textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Mi momento favorito ha sido…" rows={3}/><button className="light-button">Guardar en secreto</button></>}</form>}
  </section>;
}

function QuestionSection({ now, state, mutate }: { now: Date; state: TripState; mutate: (payload: Record<string, unknown>, success?: string) => Promise<TripState> }) {
  const available = QUESTIONS.filter((question) => now >= new Date(question.unlockAt)); const question = available.at(-1);
  const [member, setMember] = useState("uno"); const [answer, setAnswer] = useState("");
  if (!question) return <section className="question-card locked-question"><span>?</span><p>La primera pregunta aparecerá durante la primera noche.</p></section>;
  const answers = state.questionAnswers.filter((item) => item.questionId === question.id); const mine = answers.find((item) => item.member === member); const both = answers.length >= 2;
  const submit = async (event: FormEvent) => { event.preventDefault(); if (!answer.trim()) return; await mutate({ action: "question", questionId: question.id, member, answer }, "Respuesta guardada"); setAnswer(""); };
  return <section className="question-card"><p className="eyebrow wine">Pregunta para los dos · {available.length}/{QUESTIONS.length}</p><h2>“{question.text}”</h2><div className="person-switch pale"><button type="button" className={member === "uno" ? "active" : ""} onClick={() => setMember("uno")}>Persona 1</button><button type="button" className={member === "dos" ? "active" : ""} onClick={() => setMember("dos")}>Persona 2</button></div>{both ? <div className="question-answers">{answers.map((item) => <p key={item.member}><small>{item.member === "uno" ? "Persona 1" : "Persona 2"}</small>{item.answer}</p>)}</div> : mine ? <p className="waiting-answer">Respuesta guardada. Falta la otra mitad.</p> : <form onSubmit={(event) => void submit(event)}><textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Escribe tu respuesta…" rows={3}/><button className="secondary-button">Guardar respuesta <span>→</span></button></form>}</section>;
}

function SecretCode({ onClose, mutate }: { onClose: () => void; mutate: (payload: Record<string, unknown>, success?: string) => Promise<TripState> }) {
  const [code, setCode] = useState(""); const [attempts, setAttempts] = useState(0); const [success, setSuccess] = useState(false); const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus(); }, []);
  const submit = async (event: FormEvent) => { event.preventDefault(); try { await mutate({ action: "secretCode", code }); setSuccess(true); window.setTimeout(onClose, 1900); } catch { setAttempts((value) => value + 1); setCode(""); } };
  return <Modal onClose={onClose}>{success ? <div className="code-success"><span>♡</span><h2>Era esa.</h2><p>Sorpresa desbloqueada.</p><div className="sparkles">✦ · ✧ · ✦</div></div> : <form className="code-form" onSubmit={(event) => void submit(event)}><div className="modal-kicker">⌁</div><p className="eyebrow wine">Solo nosotros</p><h2>¿Qué fecha guarda la llave?</h2><p className="modal-text">Escribe seis u ocho números, sin espacios.</p><input ref={input} inputMode="numeric" autoComplete="off" maxLength={8} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g,""))} placeholder="DDMMYYYY" aria-label="Código secreto"/><div className="hints"><p><span>1</span> Ese día empezó algo importante.</p>{attempts >= 1 && <p><span>2</span> No ocurrió durante este viaje.</p>}{attempts >= 2 && <p><span>3</span> Piensa en nosotros.</p>}</div>{attempts > 0 && <p className="code-error">Esa no es. Prueba con otra fecha.</p>}<button className="primary-button wine-button" disabled={code.length < 6}>Descubrir <span>→</span></button></form>}</Modal>;
}

function PageTitle({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return <header className="page-title"><p className="eyebrow wine">{eyebrow}</p><h1>{title}</h1><p>{body}</p></header>;
}
