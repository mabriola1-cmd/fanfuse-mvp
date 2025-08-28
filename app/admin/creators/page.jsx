"use client";

import { useEffect, useState } from "react";

export default function AdminCreatorsPage() {
  const [list, setList] = useState([]);
  const [busy, setBusy] = useState("");
  const [form, setForm] = useState({ name: "", bio: "", avatarUrl: "" });
  const [edit, setEdit] = useState(null);

  async function load() {
    const r = await fetch("/api/creators", { cache: "no-store" });
    const data = await r.json();
    setList(Array.isArray(data) ? data : []);
  }
  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    setBusy("add");
    try {
      const r = await fetch("/api/creators", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "add_failed");
      setForm({ name: "", bio: "", avatarUrl: "" });
      await load();
    } catch (e) {
      alert(e.message || "add failed");
    } finally {
      setBusy("");
    }
  }

  async function saveRow(id, patch) {
    setBusy(id);
    try {
      const r = await fetch(`/api/creators/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "update_failed");
      setEdit(null);
      await load();
    } catch (e) {
      alert(e.message || "update failed");
    } finally {
      setBusy("");
    }
  }

  async function remove(id) {
    if (!confirm("Delete this creator?")) return;
    setBusy(id);
    try {
      const r = await fetch(`/api/creators/${id}`, { method: "DELETE" });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "delete_failed");
      await load();
    } catch (e) {
      alert(e.message || "delete failed");
    } finally {
      setBusy("");
    }
  }

  return (
    <main style={{ padding: 24, display: "grid", gap: 16, maxWidth: 900 }}>
      <h2>Admin: Creators</h2>

      <form onSubmit={add} style={{ display: "grid", gap: 8, border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
        <strong>Add Creator</strong>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Avatar URL (optional)" value={form.avatarUrl} onChange={e=>setForm({ ...form, avatarUrl: e.target.value })} />
        <textarea placeholder="Bio (optional)" rows={3} value={form.bio} onChange={e=>setForm({ ...form, bio: e.target.value })} />
        <button disabled={busy === "add"} type="submit">{busy === "add" ? "Adding…" : "Add"}</button>
      </form>

      <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
        <strong>Existing Creators</strong>
        <ul style={{ display: "grid", gap: 10, marginTop: 10 }}>
          {list.map((c) => (
            <li key={c.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 10 }}>
              {edit === c.id ? (
                <div style={{ display: "grid", gap: 6 }}>
                  <input defaultValue={c.name} onChange={e => (c._newName = e.target.value)} />
                  <input defaultValue={c.avatarUrl || ""} onChange={e => (c._newAvatar = e.target.value)} />
                  <textarea defaultValue={c.bio || ""} rows={2} onChange={e => (c._newBio = e.target.value)} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button disabled={busy === c.id}
                            onClick={() => saveRow(c.id, { name: c._newName ?? c.name, bio: c._newBio ?? c.bio, avatarUrl: c._newAvatar ?? c.avatarUrl })}>
                      {busy === c.id ? "Saving…" : "Save"}
                    </button>
                    <button onClick={() => setEdit(null)} type="button">Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 6 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <img src={c.avatarUrl || `https://i.pravatar.cc/80?u=${c.id}`} alt={c.name}
                         style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ color: "#666", fontSize: 13 }}>{c.bio || "—"}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEdit(c.id)} type="button">Edit</button>
                    <button onClick={() => remove(c.id)} type="button" style={{ color: "#b00" }}>
                      {busy === c.id ? "Deleting…" : "Delete"}
                    </button>
                    <a href={`/creators/${c.id}`} style={{ marginLeft: "auto" }}>View</a>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
