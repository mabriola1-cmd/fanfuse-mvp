import { addMessage, listMessages } from "../../../lib/db";

export async function GET(req) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") || undefined;
  const creatorId = url.searchParams.get("creatorId") || undefined;
  const limit = Number(url.searchParams.get("limit") || 20);
  const out = listMessages({ userId, creatorId, limit });
  return new Response(JSON.stringify(out), { headers: { "content-type": "application/json" } });
}

export async function POST(req) {
  let body = null;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 }); }

  const { userId, creatorId, text } = body || {};
  if (!userId || !creatorId || !text) {
    return new Response(JSON.stringify({ error: "userId, creatorId, text required" }), { status: 400 });
  }

  const res = addMessage({ userId, creatorId, text });
  if (res?.error) return new Response(JSON.stringify(res), { status: 400 });
  return new Response(JSON.stringify(res), { status: 201, headers: { "content-type": "application/json" } });
}
