import { getCreators, addCreator } from "../../../lib/data";

export async function GET() {
  const list = await getCreators();
  return new Response(JSON.stringify(list), {
    headers: { "content-type": "application/json" },
  });
}

export async function POST(req) {
  let body = null;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 }); }

  const res = await addCreator({
    name: body?.name,
    bio: body?.bio || "",
    avatarUrl: body?.avatarUrl || "",
  });
  const status = res?.error ? 400 : 201;
  return new Response(JSON.stringify(res), {
    status,
    headers: { "content-type": "application/json" },
  });
}
