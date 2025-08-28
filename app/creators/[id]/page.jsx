import { getCreator } from "../../../lib/data";

export default async function CreatorView({ params }) {
  const c = await getCreator(params.id);
  if (!c) return <main style={{ padding: 24 }}>Creator not found</main>;

  return (
    <main style={{ padding: 24, display: "grid", gap: 16, maxWidth: 820 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <img
          src={c.avatarUrl || `https://i.pravatar.cc/160?u=${c.id}`}
          alt={c.name}
          style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 12 }}
        />
        <div>
          <h1 style={{ margin: 0 }}>{c.name}</h1>
          <div style={{ color: "#666" }}>{c.bio || "—"}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <a href={`/creators/${c.id}/requests`}>Requests & Pledges</a>
        <a href={`/creators/${c.id}/manage`}>Manage</a>
      </div>
    </main>
  );
}
