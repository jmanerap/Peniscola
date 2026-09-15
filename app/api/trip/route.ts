import { env } from "cloudflare:workers";
import { TRIP_ID } from "../../data";
import { hasSupabase, supabaseMutation, supabaseSnapshot } from "../../../lib/supabase-trip";

type ChallengeRecord = Record<string, { completedAt: string; photo?: string }>;

async function ensureDatabase() {
  const db = env.DB;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS trip_states (
      trip_id TEXT PRIMARY KEY,
      completed_activities TEXT NOT NULL DEFAULT '[]',
      completed_challenges TEXT NOT NULL DEFAULT '{}',
      opened_envelopes TEXT NOT NULL DEFAULT '[]',
      unlocked_surprises TEXT NOT NULL DEFAULT '[]',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      trip_id TEXT NOT NULL,
      title TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      photos TEXT NOT NULL DEFAULT '[]',
      reactions TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS daily_moments (
      trip_id TEXT NOT NULL,
      day TEXT NOT NULL,
      member TEXT NOT NULL,
      answer TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (trip_id, day, member)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS question_answers (
      trip_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      member TEXT NOT NULL,
      answer TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (trip_id, question_id, member)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS daily_photos (
      trip_id TEXT NOT NULL,
      day TEXT NOT NULL,
      photo_url TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (trip_id, day)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS uploads (
      key TEXT PRIMARY KEY,
      trip_id TEXT NOT NULL,
      content_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare("INSERT OR IGNORE INTO trip_states (trip_id) VALUES (?)").bind(TRIP_ID),
  ]);
}

const parse = <T,>(value: unknown, fallback: T): T => {
  try { return JSON.parse(String(value)) as T; } catch { return fallback; }
};

async function snapshot() {
  await ensureDatabase();
  const db = env.DB;
  const state = await db.prepare("SELECT * FROM trip_states WHERE trip_id = ?").bind(TRIP_ID).first<Record<string, unknown>>();
  const journal = await db.prepare("SELECT * FROM journal_entries WHERE trip_id = ? ORDER BY created_at DESC").bind(TRIP_ID).all<Record<string, unknown>>();
  const moments = await db.prepare("SELECT day, member, answer FROM daily_moments WHERE trip_id = ?").bind(TRIP_ID).all<Record<string, string>>();
  const questions = await db.prepare("SELECT question_id, member, answer FROM question_answers WHERE trip_id = ?").bind(TRIP_ID).all<Record<string, string>>();
  const photos = await db.prepare("SELECT day, photo_url FROM daily_photos WHERE trip_id = ?").bind(TRIP_ID).all<Record<string, string>>();

  return {
    completedActivities: parse<string[]>(state?.completed_activities, []),
    completedChallenges: parse<ChallengeRecord>(state?.completed_challenges, {}),
    openedEnvelopes: parse<string[]>(state?.opened_envelopes, []),
    unlockedSurprises: parse<string[]>(state?.unlocked_surprises, []),
    journal: journal.results.map((entry) => ({
      id: String(entry.id), title: String(entry.title ?? ""), body: String(entry.body ?? ""),
      location: String(entry.location ?? ""), photos: parse<string[]>(entry.photos, []),
      reactions: parse<Record<string, number>>(entry.reactions, {}), createdAt: String(entry.created_at),
    })),
    moments: moments.results,
    questionAnswers: questions.results.map((row) => ({ questionId: row.question_id, member: row.member, answer: row.answer })),
    dailyPhotos: photos.results.map((row) => ({ day: row.day, photoUrl: row.photo_url })),
  };
}

export async function GET() {
  try { return Response.json(hasSupabase() ? await supabaseSnapshot() : await snapshot()); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudieron cargar los recuerdos" }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (hasSupabase()) return Response.json(await supabaseMutation(body));
    await ensureDatabase();
    const db = env.DB;
    const action = String(body.action ?? "");
    const now = new Date().toISOString();

    if (action === "activity") {
      const row = await db.prepare("SELECT completed_activities FROM trip_states WHERE trip_id = ?").bind(TRIP_ID).first<{ completed_activities: string }>();
      const list = parse<string[]>(row?.completed_activities, []);
      const id = String(body.id);
      const next = list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
      await db.prepare("UPDATE trip_states SET completed_activities = ?, updated_at = ? WHERE trip_id = ?").bind(JSON.stringify(next), now, TRIP_ID).run();
    } else if (action === "challenge") {
      const row = await db.prepare("SELECT completed_challenges FROM trip_states WHERE trip_id = ?").bind(TRIP_ID).first<{ completed_challenges: string }>();
      const records = parse<ChallengeRecord>(row?.completed_challenges, {});
      records[String(body.id)] = { completedAt: now, ...(body.photo ? { photo: String(body.photo) } : {}) };
      await db.prepare("UPDATE trip_states SET completed_challenges = ?, updated_at = ? WHERE trip_id = ?").bind(JSON.stringify(records), now, TRIP_ID).run();
    } else if (action === "envelope") {
      const row = await db.prepare("SELECT opened_envelopes FROM trip_states WHERE trip_id = ?").bind(TRIP_ID).first<{ opened_envelopes: string }>();
      const list = parse<string[]>(row?.opened_envelopes, []);
      const id = String(body.id);
      if (!list.includes(id)) list.push(id);
      await db.prepare("UPDATE trip_states SET opened_envelopes = ?, updated_at = ? WHERE trip_id = ?").bind(JSON.stringify(list), now, TRIP_ID).run();
    } else if (action === "secretCode") {
      if (String(body.code).replace(/\D/g, "") !== (process.env.TRIP_SECRET_CODE ?? "140226")) {
        return Response.json({ correct: false }, { status: 422 });
      }
      const row = await db.prepare("SELECT unlocked_surprises FROM trip_states WHERE trip_id = ?").bind(TRIP_ID).first<{ unlocked_surprises: string }>();
      const list = parse<string[]>(row?.unlocked_surprises, []);
      if (!list.includes("code")) list.push("code");
      await db.prepare("UPDATE trip_states SET unlocked_surprises = ?, updated_at = ? WHERE trip_id = ?").bind(JSON.stringify(list), now, TRIP_ID).run();
    } else if (action === "journal") {
      const id = String(body.id || crypto.randomUUID());
      await db.prepare(`INSERT INTO journal_entries (id, trip_id, title, body, location, photos, reactions, created_at)
        VALUES (?, ?, ?, ?, ?, ?, '{}', ?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, body=excluded.body, location=excluded.location, photos=excluded.photos`)
        .bind(id, TRIP_ID, String(body.title ?? ""), String(body.body ?? ""), String(body.location ?? ""), JSON.stringify(body.photos ?? []), String(body.createdAt || now)).run();
    } else if (action === "deleteJournal") {
      await db.prepare("DELETE FROM journal_entries WHERE id = ? AND trip_id = ?").bind(String(body.id), TRIP_ID).run();
    } else if (action === "react") {
      const row = await db.prepare("SELECT reactions FROM journal_entries WHERE id = ? AND trip_id = ?").bind(String(body.id), TRIP_ID).first<{ reactions: string }>();
      const reactions = parse<Record<string, number>>(row?.reactions, {});
      const emoji = String(body.emoji);
      reactions[emoji] = (reactions[emoji] ?? 0) + 1;
      await db.prepare("UPDATE journal_entries SET reactions = ? WHERE id = ? AND trip_id = ?").bind(JSON.stringify(reactions), String(body.id), TRIP_ID).run();
    } else if (action === "moment") {
      await db.prepare(`INSERT INTO daily_moments (trip_id, day, member, answer, updated_at) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(trip_id, day, member) DO UPDATE SET answer=excluded.answer, updated_at=excluded.updated_at`)
        .bind(TRIP_ID, String(body.day), String(body.member), String(body.answer), now).run();
    } else if (action === "question") {
      await db.prepare(`INSERT INTO question_answers (trip_id, question_id, member, answer, updated_at) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(trip_id, question_id, member) DO UPDATE SET answer=excluded.answer, updated_at=excluded.updated_at`)
        .bind(TRIP_ID, String(body.questionId), String(body.member), String(body.answer), now).run();
    } else if (action === "dailyPhoto") {
      await db.prepare(`INSERT INTO daily_photos (trip_id, day, photo_url, updated_at) VALUES (?, ?, ?, ?)
        ON CONFLICT(trip_id, day) DO UPDATE SET photo_url=excluded.photo_url, updated_at=excluded.updated_at`)
        .bind(TRIP_ID, String(body.day), String(body.photoUrl), now).run();
    } else {
      return Response.json({ error: "Acción no válida" }, { status: 400 });
    }

    return Response.json(await snapshot());
  } catch (error) {
    if (error instanceof Error && error.message === "CODE_INCORRECT") return Response.json({ correct: false }, { status: 422 });
    return Response.json({ error: error instanceof Error ? error.message : "No se pudo guardar" }, { status: 500 });
  }
}
