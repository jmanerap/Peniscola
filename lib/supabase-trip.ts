import { TRIP_ID } from "../app/data";

const url = () => process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
const key = () => process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function hasSupabase() { return Boolean(url() && key()); }

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${url()}${path}`, {
    ...init,
    headers: {
      apikey: key(), authorization: `Bearer ${key()}`, "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
  if (response.status === 204 || response.headers.get("content-length") === "0") return undefined as T;
  return response.json() as Promise<T>;
}

const one = <T,>(rows: T[]) => rows[0];

async function getState() {
  let row = one(await request<Record<string, unknown>[]>(`/rest/v1/trip_states?trip_id=eq.${TRIP_ID}&select=*`));
  if (!row) {
    await request("/rest/v1/trip_states", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ trip_id: TRIP_ID }) });
    row = one(await request<Record<string, unknown>[]>(`/rest/v1/trip_states?trip_id=eq.${TRIP_ID}&select=*`));
  }
  return row;
}

export async function supabaseSnapshot() {
  const state = await getState();
  const [journal, moments, questions, photos] = await Promise.all([
    request<Record<string, unknown>[]>(`/rest/v1/journal_entries?trip_id=eq.${TRIP_ID}&select=*&order=created_at.desc`),
    request<Record<string, string>[]>(`/rest/v1/daily_moments?trip_id=eq.${TRIP_ID}&select=day,member,answer`),
    request<Record<string, string>[]>(`/rest/v1/question_answers?trip_id=eq.${TRIP_ID}&select=question_id,member,answer`),
    request<Record<string, string>[]>(`/rest/v1/daily_photos?trip_id=eq.${TRIP_ID}&select=day,photo_url`),
  ]);
  return {
    completedActivities: state.completed_activities ?? [], completedChallenges: state.completed_challenges ?? {},
    openedEnvelopes: state.opened_envelopes ?? [], unlockedSurprises: state.unlocked_surprises ?? [],
    journal: journal.map((entry) => ({ id: entry.id, title: entry.title ?? "", body: entry.body ?? "", location: entry.location ?? "", photos: entry.photos ?? [], reactions: entry.reactions ?? {}, createdAt: entry.created_at })),
    moments,
    questionAnswers: questions.map((row) => ({ questionId: row.question_id, member: row.member, answer: row.answer })),
    dailyPhotos: photos.map((row) => ({ day: row.day, photoUrl: row.photo_url })),
  };
}

async function patchState(values: Record<string, unknown>) {
  await request(`/rest/v1/trip_states?trip_id=eq.${TRIP_ID}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ ...values, updated_at: new Date().toISOString() }) });
}

export async function supabaseMutation(body: Record<string, unknown>) {
  const action = String(body.action ?? ""); const now = new Date().toISOString();
  if (action === "activity") {
    const state = await getState(); const list = (state.completed_activities ?? []) as string[]; const id = String(body.id);
    await patchState({ completed_activities: list.includes(id) ? list.filter((item) => item !== id) : [...list, id] });
  } else if (action === "challenge") {
    const state = await getState(); const records = { ...(state.completed_challenges as Record<string, unknown> ?? {}) };
    records[String(body.id)] = { completedAt: now, ...(body.photo ? { photo: String(body.photo) } : {}) };
    await patchState({ completed_challenges: records });
  } else if (action === "envelope") {
    const state = await getState(); const list = [...(state.opened_envelopes as string[] ?? [])]; const id = String(body.id); if (!list.includes(id)) list.push(id);
    await patchState({ opened_envelopes: list });
  } else if (action === "secretCode") {
    if (String(body.code).replace(/\D/g, "") !== (process.env.TRIP_SECRET_CODE ?? "140226")) throw new Error("CODE_INCORRECT");
    const state = await getState(); const list = [...(state.unlocked_surprises as string[] ?? [])]; if (!list.includes("code")) list.push("code");
    await patchState({ unlocked_surprises: list });
  } else if (action === "journal") {
    await request("/rest/v1/journal_entries?on_conflict=id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ id: String(body.id || crypto.randomUUID()), trip_id: TRIP_ID, title: String(body.title ?? ""), body: String(body.body ?? ""), location: String(body.location ?? ""), photos: body.photos ?? [], ...(body.createdAt ? { created_at: body.createdAt } : {}) }) });
  } else if (action === "deleteJournal") {
    await request(`/rest/v1/journal_entries?id=eq.${String(body.id)}&trip_id=eq.${TRIP_ID}`, { method: "DELETE" });
  } else if (action === "react") {
    const row = one(await request<{ reactions: Record<string, number> }[]>(`/rest/v1/journal_entries?id=eq.${String(body.id)}&trip_id=eq.${TRIP_ID}&select=reactions`));
    const reactions = { ...(row?.reactions ?? {}) }; const emoji = String(body.emoji); reactions[emoji] = (reactions[emoji] ?? 0) + 1;
    await request(`/rest/v1/journal_entries?id=eq.${String(body.id)}&trip_id=eq.${TRIP_ID}`, { method: "PATCH", body: JSON.stringify({ reactions }) });
  } else if (action === "moment") {
    await request("/rest/v1/daily_moments?on_conflict=trip_id,day,member", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ trip_id: TRIP_ID, day: String(body.day), member: String(body.member), answer: String(body.answer), updated_at: now }) });
  } else if (action === "question") {
    await request("/rest/v1/question_answers?on_conflict=trip_id,question_id,member", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ trip_id: TRIP_ID, question_id: String(body.questionId), member: String(body.member), answer: String(body.answer), updated_at: now }) });
  } else if (action === "dailyPhoto") {
    await request("/rest/v1/daily_photos?on_conflict=trip_id,day", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ trip_id: TRIP_ID, day: String(body.day), photo_url: String(body.photoUrl), updated_at: now }) });
  } else throw new Error("Acción no válida");
  return supabaseSnapshot();
}

export async function supabaseUpload(keyPath: string, file: File) {
  const encoded = keyPath.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(`${url()}/storage/v1/object/trip-photos/${encoded}`, { method: "POST", headers: { apikey: key(), authorization: `Bearer ${key()}`, "content-type": file.type, "x-upsert": "false" }, body: file.stream(), duplex: "half" } as RequestInit & { duplex: string });
  if (!response.ok) throw new Error(await response.text());
}

export async function supabaseDownload(keyPath: string) {
  const encoded = keyPath.split("/").map(encodeURIComponent).join("/");
  return fetch(`${url()}/storage/v1/object/authenticated/trip-photos/${encoded}`, { headers: { apikey: key(), authorization: `Bearer ${key()}` } });
}
