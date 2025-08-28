import { sendGift } from "@/lib/data";

export async function POST(req) {
  const body = await req.json();
  const { creatorId, amountAtoms } = body; // ✅ camelCase

  if (!creatorId || !amountAtoms) {
    return new Response(JSON.stringify({ error: "Missing data" }), {
      status: 400,
    });
  }

  const result = await sendGift(creatorId, amountAtoms);

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
