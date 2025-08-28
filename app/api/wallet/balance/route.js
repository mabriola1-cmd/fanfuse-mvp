import { getBalance } from "../../../../lib/data";

export async function GET(req) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") || "";
  const res = await getBalance(userId);
  const status = res?.error ? 400 : 200;
  return new Response(JSON.stringify(res), {
    status,
    headers: { "content-type": "application/json" },
  });
}
