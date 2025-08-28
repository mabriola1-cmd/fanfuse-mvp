"use client";

import { useEffect, useState } from "react";

export default function AdminConciergePage() {
  const [list, setList] = useState([]);
  const [busy, setBusy] = useState("");

  async function load() {
    const r = await fetch("/api/concierge", { cache: "no-store" });
    const data = await r.json();
    setList(Array.isArray(data) ? data : []);
  }
  useEffect(() => { load(); }, []);

  async function finalizeRow(id) {
    setBusy(id);
    try {
      const r = await fetch(`/api/concierge/${id}/finalize`, { method: "POST" });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "finalize_failed");
      await load();
    } catch (e) {
      alert(e.message || "finalize failed");
    } finally {
      setBusy("");
    }
  }

  async function cancelRow(id) {
    setBusy(id);
    try {
      const r = await fetch(`/api/concierge/${id}/cancel`, { method: "POST" });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "cancel_failed");
      await load();
    } catch (e) {
      alert(e.message || "cancel failed");
    } finally {
      setBusy("");
    }
  }

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <h2>Admin: Concierge Requests</h2>
      <ul style={{ display: "grid", gap: 10 }}>
        {list.map((r) => (
          <li key={r.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 10 }}>
            <div><b>{r.title}</b> — {r.details}</div>
            <div style={{ fontSize: 13, color: "#666" }}>
              creator={r.creatorId} | user={r.userId} | status={r.status}
            </div>
            {"targetAtoms" in r && (
              <div style={{ fontSize: 13 }}>pledged {r.pledgedAtoms}/{r.targetAtoms}</div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button disabled={busy === r.id} onClick={() => finalizeRow(r.id)}>
                {busy === r.id ? "Finalizing…" : "Finalize"}
              </button>
              <button disabled={busy === r.id} onClick={() => cancelRow(r.id)} style={{ color: "#b00" }}>
                {busy === r.id ? "Canceling…" : "Cancel"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
