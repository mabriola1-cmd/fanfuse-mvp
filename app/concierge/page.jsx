"use client";

import { useEffect, useState } from "react";

export default function ConciergePage() {
  const [creators, setCreators] = useState([]);
  const [form, setForm] = useState({ userId: "", creatorId: "", title: "", details: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    fetch("/api/creators", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setCreators(Array.isArray(data) ? data : []))
      .catch(() => setCreators([]));
    refreshList();
  }, []);

  async function refreshList() {
    try {
      const r = await fetch("/api/concierge", { cache: "no-store" });
      const data = await r.json();
      setRecent(Array.isArray(data) ? data.slice(-5).reverse() : []);
    } catch { setRecent([]); }
  }

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setResult(data);
      setForm({ userId: "", creatorId: "", title: "", details: "" });
      refreshList();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Concierge</h2>

      <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 480 }}>
        <input placeholder="Your user ID" value={form.userId}
               onChange={(e) => setForm({ ...form, userId: e.target.value })} required />
        <select value={form.creatorId}
                onChange={(e) => setForm({ ...form, creatorId: e.target.value })} required>
          <option value="">Select a creator…</option>
          {creators.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Title" value={form.title}
               onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea placeholder="Details" rows={5} value={form.details}
               onChange={(e) => setForm({ ...form, details: e.target.value })} required />
        <button disabled={submitting} type="submit">
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </form>

      {error && <p style={{ color: "tomato" }}>Error: {error}</p>}
      {result && (
        <>
          <h3>Submitted</h3>
          <pre style={{ background: "#111", color: "#0f0", padding: 8 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </>
      )}

      <h3 style={{ marginTop: 20 }}>Recent requests</h3>
      <ul>
        {recent.map((r) => (
          <li key={r.id}>
            <strong>{r.title}</strong> — {r.userId} → {r.creatorId} — <em>{r.status}</em>
          </li>
        ))}
      </ul>
    </main>
  );
}
