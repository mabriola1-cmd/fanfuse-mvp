"use client";
import { useEffect, useState } from "react";

export default function MessagesPage() {
  const [form, setForm] = useState({ userId: "u1", creatorId: "c1", text: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState([]);

  async function load() {
    const r = await fetch("/api/messages?limit=20", { cache: "no-store" });
    const data = await r.json();
    setRecent(Array.isArray(data) ? data.slice().reverse() : []);
  }
  useEffect(() => { load(); }, []);

  async function send(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const r = await fetch("/api/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "failed");
      setForm({ ...form, text: "" });
      await load();
      alert(`Sent! Cost: ${data?.message?.costAtoms ?? 0}, remainingAtoms: ${data?.remainingAtoms ?? "?"}`);
    } catch (err) {
      setError(err.message || "send failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <h2>Messages</h2>
      <form onSubmit={send} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        <label>User ID
          <input value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required />
        </label>
        <label>Creator ID
          <input value={form.creatorId} onChange={(e) => setForm({ ...form, creatorId: e.target.value })} required />
        </label>
        <label>Message
          <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} required rows={3} />
        </label>
        <button disabled={busy} type="submit">{busy ? "Sending…" : "Send"}</button>
        {error && <p style={{ color: "tomato" }}>Error: {error}</p>}
      </form>

      <h3>Recent</h3>
      <ul style={{ display:"grid", gap: 8 }}>
        {recent.map((m) => (
          <li key={m.id} style={{ border:"1px solid #eee", borderRadius: 8, padding: 8 }}>
            <div><strong>{m.userId}</strong> → <strong>{m.creatorId}</strong></div>
            <div>{m.text}</div>
            <div style={{ fontSize:12, color:"#666" }}>cost: {m.costAtoms} · {new Date(m.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
