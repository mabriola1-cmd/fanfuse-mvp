import { contributeToRequestBasic } from "../../../../../../lib/db";

export async function POST(req, { params }) {
  const { requestid } = params;
  let body = null;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 }); }

  const { fanid, atoms } = body || {};
  if (!fanid || !(Number(atoms) > 0)) {
    return new Response(JSON.stringify({ error: "fanid and positive atoms required" }), { status: 400 });
  }

  const res = contributeToRequestBasic(requestid, fanid, atoms);
  const status = res?.error ? 400 : 200;
  return new Response(JSON.stringify(res), {
    status,
    headers: { "content-type": "application/json" }
  });
}
