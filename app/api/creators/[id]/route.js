import { getCreatorById, updateCreator, deleteCreator } from "@/lib/data";

export async function GET(_, { params }) {
  const creator = await getCreatorById(params.id);
  return new Response(JSON.stringify(creator), {
    headers: { "content-type": "application/json" },
  });
}

export async function PUT(req, { params }) {
  const body = await req.json();

  const updated = await updateCreator(params.id, {
    name: body?.name,
    bio: body?.bio || "",
    avatarUrl: body?.avatarUrl || "",
  });

  const status = updated?.error ? 400 : 200;
  return new Response(JSON.stringify(updated), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function DELETE(_, { params }) {
  const deleted = await deleteCreator(params.id);

  const status = deleted?.error ? 400 : 200;
  return new Response(JSON.stringify(deleted), {
    status,
    headers: { "content-type": "application/json" },
  });
}
