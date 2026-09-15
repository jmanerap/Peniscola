import { env } from "cloudflare:workers";
import { TRIP_ID } from "../../data";
import { hasSupabase, supabaseDownload } from "../../../lib/supabase-trip";

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key") ?? "";
  if (!key.startsWith(`${TRIP_ID}/`)) return new Response("Not found", { status: 404 });
  if (hasSupabase()) {
    const response = await supabaseDownload(key);
    if (!response.ok) return new Response("Not found", { status: 404 });
    const headers = new Headers(response.headers);
    headers.set("cache-control", "private, max-age=31536000, immutable");
    headers.set("x-content-type-options", "nosniff");
    return new Response(response.body, { headers });
  }
  const object = await env.PHOTOS.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("cache-control", "private, max-age=31536000, immutable");
  headers.set("x-content-type-options", "nosniff");
  return new Response(object.body, { headers });
}
