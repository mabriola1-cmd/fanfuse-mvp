"use client";

import { useEffect, useState } from "react";

export default function CreatorRequestsPage({ params }) {
  const { id } = params;
  const [requests, setRequests] = useState([]);
  const [pledgeBusy, setPledgeBusy] = useState("");

  async function load() {
    // Pull all requests and filter client‑side (simple for now)
    const r = await fetch("/api/concierge", { cache: "no-store" });
    const all = await r.json();
    setRequests((Array.isArray(all) ? all : []).filter(x => x.creatorId === id));
  }

  useEffect(() => { load(); }, [id]);

  async function pledge(reqId, userId, amount) {
    setPledgeBusy(reqId);
    try {
      const r = await fetch(`/api/concierge/${reqId}/pledge`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, amount }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "pledge failed");
      await load();
      alert("Pledge successful!");
    } catch (e) {
      alert(e.message || "pledge failed");
    } finally {
      setPledgeBusy("");
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Requests for Creator {id}</h2>
      {requests.length === 0 ? <p>No requests yet.</p> : null}
      <ul style={{ display: "grid", gap: 12 }}>
        {requests.map((rq) => (
          <li key={rq.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
            <div><strong>{rq.title}</strong></div>
            <div style={{ color: "#555" }}>{rq.details}</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>
              status: <code>{rq.status}</code> · id: <code>{rq.id}</code>
            </div>

            {"targetAtoms" in rq ? (
              <div style={{ marginTop: 8 }}>
                <div>
                  Progress: <strong>{rq.pledgedAtoms || 0}</strong> / <strong>{rq.targetAtoms}</strong> atoms
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    pledge(rq.id, fd.get("userId"), Number(fd.get("amount")));
                    e.currentTarget.reset();
                  }}
                  style={{ display: "flex", gap: 8, marginTop: 8 }}
                >
                  <input name="userId" placeholder="Your userId (e.g. u1)" required />
                  <input name="amount" type="number" min="1" placeholder="Atoms" required />
                  <button disabled={pledgeBusy === rq.id} type="submit">
                    {pledgeBusy === rq.id ? "Pledging…" : "Pledge"}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ marginTop: 8, fontStyle: "italic", color: "#666" }}>Direct request (not crowdfunded)</div>
            )}
          </li>
        ))}
      </ul>
      <p style={{ marginTop: 16 }}><a href={`/creators/${id}`}>← Back to creator</a></p>
    </main>
  );
}
