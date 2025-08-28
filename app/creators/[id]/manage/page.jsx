"use client";
import { useEffect, useState } from "react";

export default function CreatorManagePage({ params }) {
  const { id } = params;
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState("");
  const [earnings, setEarnings] = useState(0);

  async function load() {
    const r = await fetch("/api/concierge", { cache: "no-store" });
    const all = await r.json();
    const mine = (Array.isArray(all) ? all : []).filter((x) => x.creatorid === id).slice().reverse();
    setItems(mine);

    const e = await fetch(`/api/creators/${id}/earnings`, { cache: "no-store" });
    const ej = await e.json();
    setEarnings(ej?.earnedAtoms || 0);
  }

  useEffect(() => { load(); }, [id]);

  async function doAction(kind, reqid) {
    setBusy(reqId);
    try {
      const url =
        kind === "finalize"
          ? `/api/concierge/${reqid}/finalize`
          : `/api/concierge/${reqid}/cancel`;
      const r = await fetch(url, { method: "POST" });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || `${kind} failed`);
      await load();
      alert(`${kind} success!`);
    } catch (e) {
      alert(e.message || `${kind} failed`);
    } finally { setBusy(""); }
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Manage Requests for Creator {id}</h2>

      <div style={{
        padding: 10, border: "1px solid #eee", borderRadius: 8, marginBottom: 12,
        background: "#f9fff5"
      }}>
        <strong>Earnings:</strong> <span>{earnings}</span> atoms
      </div>

      {items.length === 0 ? <p>No requests yet.</p> : null}

      <ul style={{ display: "grid", gap: 12 }}>
        {items.map((rq) => (
          <li key={rq.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
            <div><strong>{rq.title}</strong></div>
            <div style={{ color: "#555" }}>{rq.details}</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>
              id: <code>{rq.id}</code> · status: <code>{rq.status}</code>
            </div>

            {"targetAtoms" in rq ? (
              <div style={{ marginTop: 6 }}>
                progress: <strong>{rq.pledgedAtoms || 0}</strong> / <strong>{rq.targetAtoms}</strong> atoms
                {Array.isArray(rq.pledges) && rq.pledges.length > 0 ? (
                  <details style={{ marginTop: 4 }}>
                    <summary>Show pledges</summary>
                    <ul style={{ marginTop: 4 }}>
                      {rq.pledges.map((p, i) => (
                        <li key={i}>user <code>{p.userId}</code> pledged <strong>{p.amount}</strong></li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </div>
            ) : (
              <div style={{ marginTop: 6, fontStyle: "italic", color: "#666" }}>
                Direct request (not crowdfunded)
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button disabled={busy === rq.id} onClick={() => doAction("finalize", rq.id)}>
                {busy === rq.id ? "Finalizing…" : "Finalize"}
              </button>
              <button disabled={busy === rq.id} onClick={() => doAction("cancel", rq.id)} style={{ color: "#b00" }}>
                {busy === rq.id ? "Canceling…" : "Cancel (refund)"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p style={{ marginTop: 16 }}>
        <a href={`/creators/${id}/requests`}>← Back to Requests</a>
      </p>
    </main>
  );
}
