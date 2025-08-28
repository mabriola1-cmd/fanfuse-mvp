import { cancel } from "../../../../../../lib/data";

export async function POST(_req, { params }) {
  const res = await cancel(params.id);
  const status = res?.error ? 400 : 200;
  return new Response(JSON.stringify(res), {
    status,
    headers: { "content-type": "application/json" },
  });
}
