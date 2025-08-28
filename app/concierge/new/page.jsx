"use client";

import { useEffect, useState } from "react";

export default function ConciergeNewPage() {
  const [creators, setCreators] = useState([]);
  const [form, setForm] = useState({
    userId: "",
    creatorId: "",
    title: "",
    details: "",
    targetAtoms: "", // optional — leave blank for non‑crowdfunded
  });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/creators", { cache: "no-store" })
      .then(r => r.json())
      .then(data => setCreators(Array.isArray(data) ? data : []))
      .catch(() => setCreators([]));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(""); setResult(null);
    try {
      const payload = {
        userId: form.userId,
        creatorId: form.creatorId,
        title: form.title,
        details: form.details,
      };
      if (form.targetAtoms) payload.targetAtoms = Number(form.targetAtoms);
      const r = await fetch("/api/concierge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "create failed");
      setResult(data);
      setForm({ userId:"", creatorId:"", title:"", details:"", targetAtoms:"" });
    } catch (e) {
      setError(e.message || "create failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>New Concierge Request</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        <input placeholder="Your userId (e.g. u1)" value={form.userId} onChange={e=>setForm({ ...form, userId:e.target.value })} required />
        <select value={form.creatorId} onChange={e=>setForm({ ...form, creatorId:e.target.value })} required>
          <option value="">Select a creator…</option>
          {creators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({ ...form, title:e.target.value })} required />
        <textarea placeholder="Details" rows={5} value={form.details} onChange={e=>setForm({ ...form, details:e.target.value })} required />
        <input placeholder="Target atoms (optional)" type="number" min="1" value={form.targetAtoms} onChange={e=>setForm({ ...form, targetAtoms:e.target.value })} />
        <button disabled={busy} type="submit">{busy ? "Creating…" : "Create"}</button>
      </form>

      {error && <p style={{ color: "tomato" }}>{error}</p>}
      {result && (
        <>
          <h3>Created</h3>
          <pre style={{ background:"#111", color:"#0f0", padding:8 }}>{JSON.stringify(result, null, 2)}</pre>
          {"targetAtoms" in result ? (
            <p>
              Crowd‑fund page:{" "}
              <a href={`/creators/${result.creatorId}/requests`}>/creators/{result.creatorId}/requests</a>
            </p>
          ) : null}
        </>
      )}
    </main>
  );
}
