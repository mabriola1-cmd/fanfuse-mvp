import { getUserById, updateUserBalance } from "@/lib/data";

export async function POST(req) {
  const body = await req.json();
  const { userId, bundleId, amountUSD } = body;

  if (!userId || !amountUSD) {
    return new Response(
      JSON.stringify({ error: "Missing userId or amountUSD" }),
      { status: 400 }
    );
  }

  // simulate purchase logic
  const result = await updateUserBalance(userId, amountUSD);

  return new Response(JSON.stringify({ success: true, result }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
