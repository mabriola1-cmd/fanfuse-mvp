import { topUp } from "../../../../lib/data";

export async function POST(req) {
  let body = null;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 }); }

  const res = await topUp(body?.userId, body?.amount);
  const status = res?.error ? 400 : 201;
  return new Response(JSON.stringify(res), {
    status,
    headers: { "content-type": "application/json" },
  });
}
