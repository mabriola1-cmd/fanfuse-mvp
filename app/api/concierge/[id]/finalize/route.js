import { finalize } from "../../../../../../lib/data";

export async function POST(_req, { params }) {
  const res = await finalize(params.id);
  const status = res?.error ? 400 : 200;
  return new Response(JSON.stringify(res), {
    status,
    headers: { "content-type": "application/json" },
  });
}
