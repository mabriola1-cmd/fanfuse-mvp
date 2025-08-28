import { listRequests, addRequest } from "../../../lib/data";

export async function GET() {
  const list = await listRequests();
  return new Response(JSON.stringify(list), {
    headers: { "content-type": "application/json" },
  });
}

export async function POST(req) {
  let body = null;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 }); }

  const row = await addRequest({
    userId: body?.userId,
    creatorId: body?.creatorId,
    title: body?.title || "",
    details: body?.details || "",
    targetAtoms: body?.targetAtoms || null,
  });
  return new Response(JSON.stringify(row), {
    status: 201,
    headers: { "content-type": "application/json" },
  });
}
