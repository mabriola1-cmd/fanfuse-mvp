import { createConciergeRequestBasic } from "../../../../lib/db";

export async function POST(req) {
  let body = null;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 }); }

  const { fanId, creatorId, message, atomsOffered, groupFunding } = body || {};
  if (!fanId || !creatorId || !message) {
    return new Response(JSON.stringify({ error: "fanId, creatorId, message required" }), { status: 400 });
  }

  const created = createConciergeRequestBasic({
    fanId, creatorId, message,
    atomsOffered: typeof atomsOffered === "number" ? atomsOffered : 0,
    groupFunding: !!groupFunding
  });

  return new Response(JSON.stringify(created), {
    status: 201,
    headers: { "content-type": "application/json" }
  });
}
