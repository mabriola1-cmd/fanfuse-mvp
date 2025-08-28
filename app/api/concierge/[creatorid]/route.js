import { getRequestsForCreatorBasic } from "../../../../../lib/db";

export async function GET(_req, { params }) {
  const { creatorid } = params;
  const list = getRequestsForCreatorBasic(creatorid);
  return new Response(JSON.stringify(list), {
    headers: { "content-type": "application/json" }
  });
}
