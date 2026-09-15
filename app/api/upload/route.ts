import { env } from "cloudflare:workers";
import { TRIP_ID } from "../../data";
import { hasSupabase, supabaseUpload } from "../../../lib/supabase-trip";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({ error: "Falta la fotografía" }, { status: 400 });
    if (!file.type.startsWith("image/")) return Response.json({ error: "El archivo debe ser una imagen" }, { status: 400 });
    if (file.size > 12 * 1024 * 1024) return Response.json({ error: "La imagen supera los 12 MB" }, { status: 413 });
    const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
    const key = `${TRIP_ID}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    if (hasSupabase()) {
      await supabaseUpload(key, file);
    } else {
      await env.PHOTOS.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
      await env.DB.prepare("INSERT INTO uploads (key, trip_id, content_type, size) VALUES (?, ?, ?, ?)")
        .bind(key, TRIP_ID, file.type, file.size).run();
    }
    return Response.json({ url: `/api/photo?key=${encodeURIComponent(key)}` }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "No se pudo subir la imagen" }, { status: 500 });
  }
}
