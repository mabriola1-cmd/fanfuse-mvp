import { getCreators } from "../../lib/data";

export default async function CreatorsPage() {
  const list = await getCreators();

  return (
    <main style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Creators</h2>

      <div style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))"
      }}>
        {list.map((c) => (
          <a key={c.id} href={`/creators/${c.id}`} style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 12,
            textDecoration: "none",
            color: "inherit"
          }}>
            <img
              src={c.avatarUrl || `https://i.pravatar.cc/160?u=${c.id}`}
              alt={c.name}
              style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8 }}
            />
            <div style={{ marginTop: 10 }}>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ color: "#666", fontSize: 14 }}>{c.bio || "—"}</div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
