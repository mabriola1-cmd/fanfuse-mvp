import { getCreatorEarnings } from "../../../../../lib/data";

export async function GET(_req, { params }) {
  const res = await getCreatorEarnings(params.id);
  const status = res?.error ? 400 : 200;
  return new Response(JSON.stringify(res), {
    status,
    headers: { "content-type": "application/json" }
  });
}
