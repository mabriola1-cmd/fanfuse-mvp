import { updateConciergeStatus } from "../../../../lib/db";

export async function PATCH(req, { params }) {
  const { id } = params;
  let body = null;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 }); }

  const next = updateConciergeStatus(id, String(body?.status || "").toLowerCase());
  if (!next) return new Response(JSON.stringify({ error: "not found or bad status" }), { status: 400 });
  return new Response(JSON.stringify(next), {
    headers: { "content-type": "application/json" },
  });
}
