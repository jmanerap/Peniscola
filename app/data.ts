export const TRIP_ID = "peniscola-2026";
export const TRIP_START = "2026-09-18T16:00:00+02:00";
export const TRIP_END = "2026-09-20T20:00:00+02:00";

export type Activity = {
  id: string;
  day: "viernes" | "sabado" | "domingo";
  date: string;
  time: string;
  title: string;
  description: string;
  location: string;
  maps: string;
  accent: string;
};

export const DAYS = [
  { id: "viernes" as const, label: "Viernes", date: "18 sep" },
  { id: "sabado" as const, label: "Sábado", date: "19 sep" },
  { id: "domingo" as const, label: "Domingo", date: "20 sep" },
];

export const ACTIVITIES: Activity[] = [
  {
    id: "salida",
    day: "viernes",
    date: "2026-09-18T16:00:00+02:00",
    time: "16:00",
    title: "Empieza nuestra escapada",
    description: "Salimos desde Callosa d’en Sarrià. Playlist preparada y rumbo al mar.",
    location: "Callosa d’en Sarrià",
    maps: "https://maps.apple.com/?q=Callosa+d%27en+Sarria",
    accent: "car",
  },
  {
    id: "llegada",
    day: "viernes",
    date: "2026-09-18T19:15:00+02:00",
    time: "19:15",
    title: "Llegada y check-in",
    description: "Dejamos las maletas, respiramos un poco y estrenamos el fin de semana.",
    location: "Peñíscola",
    maps: "https://maps.apple.com/?q=Peñíscola",
    accent: "key",
  },
  {
    id: "paseo-noche",
    day: "viernes",
    date: "2026-09-18T21:00:00+02:00",
    time: "21:00",
    title: "Paseo y cena junto al mar",
    description: "Primera noche sin prisas por el casco antiguo. El sitio lo elegimos al llegar.",
    location: "Casco antiguo de Peñíscola",
    maps: "https://maps.apple.com/?q=Casco+Antiguo+Peñíscola",
    accent: "moon",
  },
  {
    id: "desayuno",
    day: "sabado",
    date: "2026-09-19T09:30:00+02:00",
    time: "09:30",
    title: "Desayuno lento",
    description: "Café, algo rico y una pregunta que todavía está por descubrir.",
    location: "Centro de Peñíscola",
    maps: "https://maps.apple.com/?q=Peñíscola+cafetería",
    accent: "coffee",
  },
  {
    id: "castillo",
    day: "sabado",
    date: "2026-09-19T11:00:00+02:00",
    time: "11:00",
    title: "Castillo del Papa Luna",
    description: "Subimos por las calles blancas hasta el castillo y buscamos las mejores vistas.",
    location: "Castillo de Peñíscola",
    maps: "https://maps.apple.com/?q=Castillo+de+Peñíscola",
    accent: "castle",
  },
  {
    id: "calas",
    day: "sabado",
    date: "2026-09-19T17:30:00+02:00",
    time: "17:30",
    title: "Rincones junto al agua",
    description: "Una tarde para perdernos, hacer fotos y encontrar nuestro rincón favorito.",
    location: "Bufador de Peñíscola",
    maps: "https://maps.apple.com/?q=Bufador+de+Peñíscola",
    accent: "wave",
  },
  {
    id: "atardecer",
    day: "sabado",
    date: "2026-09-19T19:45:00+02:00",
    time: "19:45",
    title: "Atardecer para dos",
    description: "Móviles en silencio, una foto juntos y tiempo para mirar el horizonte.",
    location: "Faro de Peñíscola",
    maps: "https://maps.apple.com/?q=Faro+de+Peñíscola",
    accent: "sun",
  },
  {
    id: "domingo-mar",
    day: "domingo",
    date: "2026-09-20T10:30:00+02:00",
    time: "10:30",
    title: "Mañana frente al mar",
    description: "Paseo por la orilla y último rato para completar los retos que queden.",
    location: "Playa Norte",
    maps: "https://maps.apple.com/?q=Playa+Norte+Peñíscola",
    accent: "shell",
  },
  {
    id: "comida-despedida",
    day: "domingo",
    date: "2026-09-20T14:00:00+02:00",
    time: "14:00",
    title: "Comida de despedida",
    description: "Brindis final y elección oficial de la foto del viaje.",
    location: "Peñíscola",
    maps: "https://maps.apple.com/?q=Restaurantes+Peñíscola",
    accent: "glass",
  },
  {
    id: "vuelta",
    day: "domingo",
    date: "2026-09-20T16:30:00+02:00",
    time: "16:30",
    title: "Vuelta a casa",
    description: "Ponemos la playlist del viaje y regresamos con el carrete lleno.",
    location: "Elche",
    maps: "https://maps.apple.com/?q=Elche",
    accent: "home",
  },
];

export const CHALLENGES = [
  { id: "padres", icon: "📷", title: "Padres de vacaciones", description: "Hacernos una foto con la pose más orgullosa de padres de vacaciones.", unlockAt: TRIP_START },
  { id: "romantica", icon: "🌹", title: "Romanticismo nivel película", description: "Recrear una foto romántica exageradamente típica. Cuanto más dramática, mejor.", unlockAt: "2026-09-18T20:00:00+02:00" },
  { id: "rincon", icon: "📍", title: "Nuestro rincón", description: "Encontrar el lugar más bonito de Peñíscola y hacernos una foto allí.", unlockAt: "2026-09-19T10:00:00+02:00" },
  { id: "recuerdo", icon: "🛍️", title: "Tesoro absurdo", description: "Comprar entre los dos un recuerdo absurdo de menos de 5 €.", unlockAt: "2026-09-19T12:00:00+02:00" },
  { id: "tiktok", icon: "🎬", title: "Rodaje improvisado", description: "Grabar juntos un TikTok. No hace falta publicarlo; sí reírnos.", unlockAt: "2026-09-19T18:00:00+02:00" },
];

export const ENVELOPES = [
  { id: "viernes", day: "Viernes", unlockAt: "2026-09-18T19:30:00+02:00", kicker: "Para empezar", title: "La primera regla", message: "Durante diez minutos: nada de móviles. Solo elegir juntos el lugar de la primera foto del viaje." },
  { id: "sabado", day: "Sábado", unlockAt: "2026-09-19T10:00:00+02:00", kicker: "Una pista", title: "Mirad hacia arriba", message: "La sorpresa de hoy vive entre calles estrechas, piedra antigua y una vista que merece una pausa." },
  { id: "domingo", day: "Domingo", unlockAt: "2026-09-20T10:00:00+02:00", kicker: "Antes de volver", title: "Un pequeño pacto", message: "Elegid una canción que os devuelva siempre a este fin de semana. Guardadla con vuestro último recuerdo." },
];

export const QUESTIONS = [
  { id: "repeat", unlockAt: "2026-09-18T22:00:00+02:00", text: "¿Qué momento nuestro repetirías infinitamente?" },
  { id: "next", unlockAt: "2026-09-19T09:00:00+02:00", text: "¿Dónde te gustaría que fuera nuestro próximo viaje?" },
  { id: "small", unlockAt: "2026-09-19T17:00:00+02:00", text: "¿Qué cosa pequeña que hago te hace feliz?" },
  { id: "memory", unlockAt: "2026-09-19T22:00:00+02:00", text: "¿Cuál es uno de tus recuerdos favoritos conmigo?" },
  { id: "ten", unlockAt: "2026-09-20T12:00:00+02:00", text: "¿Cómo nos imaginas dentro de diez años?" },
];

export const SURPRISES = [
  { id: "time", type: "time" as const, icon: "✦", title: "Plan secreto", subtitle: "Se abre el sábado al atardecer", unlockAt: "2026-09-19T18:00:00+02:00", reveal: "Poneos algo bonito. Esta noche la cena tiene vistas y una mesa para dos." },
  { id: "challenges", type: "challenges" as const, icon: "♡", title: "Premio compartido", subtitle: "Completad 3 retos", required: 3, reveal: "Habéis desbloqueado un brindis especial. Elegid dónde y pedid algo que nunca hayáis probado." },
  { id: "code", type: "code" as const, icon: "⌁", title: "Solo nosotros", subtitle: "Protegido por una fecha", reveal: "Hay viajes que duran un fin de semana y recuerdos que cambian todos los que vienen después. Este es el primero de muchos." },
];

export const iconFor = (accent: string) => ({
  car: "↗", key: "⌂", moon: "☾", coffee: "☕", castle: "♜",
  wave: "≈", sun: "☼", shell: "◡", glass: "♢", home: "⌂",
}[accent] ?? "•");
