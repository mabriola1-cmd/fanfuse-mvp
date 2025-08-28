import { addPledge } from "../../../../../lib/data";

export async function POST(req, { params }) {
  const { id } = params;
  let body = null;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 }); }

  const res = await addPledge(id, body?.userId, body?.amount);
  if (res?.error) return new Response(JSON.stringify(res), { status: 400 });
  return new Response(JSON.stringify(res), {
    status: 201,
    headers: { "content-type": "application/json" },
  });
}
