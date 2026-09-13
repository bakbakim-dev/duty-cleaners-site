import { seal, unseal } from "./crypto.ts";

const websiteOrigins = new Set([
  "https://dutycleaners.ca", "https://www.dutycleaners.ca",
  "https://duty-cleaners-preview.netlify.app", "https://mikaily131.sg-host.com",
  "http://127.0.0.1:5173", "http://localhost:5173",
]);
const bookingOrigins = new Set(["https://dutycleaners.bookingkoala.com", "https://book.dutycleaners.ca"]);
// Defense in depth only: edge instances do not share this limiter. No database,
// customer or booking access is granted by this public sealing endpoint.
export function createHandler(getSecret: () => string) {
const buckets = new Map<string, { count: number; until: number }>();
return async (request: Request) => {
  const origin = request.headers.get("origin") ?? "";
  const allowed = websiteOrigins.has(origin) || bookingOrigins.has(origin);
  const headers = {
    "Content-Type": "application/json", "Cache-Control": "no-store",
    "Vary": "Origin", "Access-Control-Allow-Origin": allowed ? origin : "null",
    "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
  const reply = (status: number, data: unknown) => new Response(JSON.stringify(data), { status, headers });
  if (!allowed) return reply(403, { error: "origin" });
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return reply(405, { error: "method" });
  const secret = getSecret();
  if (secret.length < 32) return reply(503, { error: "unavailable" });
  const now = Date.now();
  for (const [key, value] of buckets) if (value.until <= now) buckets.delete(key);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const bucket = buckets.get(ip) ?? { count: 0, until: now + 60_000 };
  if (bucket.count >= 30 || (!buckets.has(ip) && buckets.size >= 2000)) return reply(429, { error: "retry" });
  bucket.count += 1;
  buckets.set(ip, bucket);
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 16384) return reply(413, { error: "size" });
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { error: "invalid" });
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 16384) { await reader.cancel(); return reply(413, { error: "size" }); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const body = JSON.parse(new TextDecoder().decode(bytes));
    if (body.action === "seal" && websiteOrigins.has(origin)) return reply(200, { token: await seal(body.fields, secret, now) });
    if (body.action === "unseal" && bookingOrigins.has(origin) && typeof body.token === "string") return reply(200, { fields: await unseal(body.token, secret, now) });
    return reply(400, { error: "invalid" });
  } catch {
    // Never return or log the payload, token, decryption error or key.
    return reply(400, { error: "invalid_or_expired" });
  }
};
}
