import { kv } from "@vercel/kv";

export async function GET(request, { params }) {
  const { id } = params;

  // Fetch the creator by ID
  const creators = await kv.get("creators");
  const creator = creators?.find(c => c.id === id);

  if (!creator) {
    return new Response(JSON.stringify({ error: "Creator not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(creator), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
