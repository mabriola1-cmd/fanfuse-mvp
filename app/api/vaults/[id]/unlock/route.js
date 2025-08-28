import { unlockVault } from "@/lib/data";

export async function POST(req, { params }) {
  const body = await req.json();
  const { creatorid } = body; // ✅ lowercase 'i'

  if (!creatorid) {
    return new Response(JSON.stringify({ error: "Missing creatorid" }), {
      status: 400,
    });
  }

  const result = await unlockVault(params.id, creatorid);

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
