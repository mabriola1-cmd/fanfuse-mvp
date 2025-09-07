import { kv } from "@vercel/kv";

export async function GET(request, { params }) {
  const { id } = params;

  const earnings = await kv.get(`creator:${id}:earnings`);

  return new Response(JSON.stringify({ earnings: earnings ?? 0 }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
