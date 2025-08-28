"use client";
import { useEffect, useState } from "react";

export default function WalletPage() {
  const [userId, setUserId] = useState("u1");   // try u1/u2/u3
  const [balance, setBalance] = useState(null);
  const [topAmount, setTopAmount] = useState("");
  const [toUser, setToUser] = useState("u2");
  const [sendAmount, setSendAmount] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    setMsg("");
    const r = await fetch(`/api/wallet/balance?userId=${encodeURIComponent(userId)}`, { cache: "no-store" });
    const data = await r.json();
    setBalance(data);
  }
  useEffect(() => { load(); }, [userId]);

  async function topup(e) {
    e.preventDefault();
    setMsg("");
    const r = await fetch("/api/wallet/topup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId, amount: Number(topAmount || 0) }),
    });
    const data = await r.json();
    if (!r.ok) { setMsg(data?.error || "Top-up failed"); return; }
    setMsg(`Top-up ok. New balance: ${data?.user?.atoms ?? "?"}`);
    setTopAmount("");
    load();
  }

  async function transfer(e) {
    e.preventDefault();
    setMsg("");
    const r = await fetch("/api/wallet/transfer", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fromUserId: userId, toUserId: toUser, amount: Number(sendAmount || 0) }),
    });
    const data = await r.json();
    if (!r.ok) { setMsg(data?.error || "Transfer failed"); return; }
    setMsg(`Transfer ok. New balance: ${data?.from?.atoms ?? "?"}`);
    setSendAmount("");
    load();
  }

  return (
    <main style={{ padding: 24, display: "grid", gap: 16, maxWidth: 640 }}>
      <h2>Wallet</h2>

      <section style={{ display: "grid", gap: 8 }}>
        <label>
          User ID
          <input value={userId} onChange={e => setUserId(e.target.value)} />
        </label>
        <div style={{ fontSize: 14, color: "#555" }}>
          Membership: <strong>{balance?.membership ?? "?"}</strong> · Atoms: <strong>{balance?.atoms ?? "?"}</strong>
        </div>
        <button onClick={load}>Refresh</button>
      </section>

      <hr />

      <section style={{ display: "grid", gap: 8 }}>
        <h3>Top-up (mock)</h3>
        <form onSubmit={topup} style={{ display: "flex", gap: 8 }}>
          <input type="number" min="1" placeholder="Amount" value={topAmount} onChange={e => setTopAmount(e.target.value)} required />
          <button type="submit">Top-up</button>
        </form>
      </section>

      <section style={{ display: "grid", gap: 8 }}>
        <h3>Transfer (gift)</h3>
        <form onSubmit={transfer} style={{ display: "flex", gap: 8 }}>
          <input placeholder="To userId (e.g. u2)" value={toUser} onChange={e => setToUser(e.target.value)} required />
          <input type="number" min="1" placeholder="Amount" value={sendAmount} onChange={e => setSendAmount(e.target.value)} required />
          <button type="submit">Send</button>
        </form>
      </section>

      {msg && <p style={{ color: "#0a0" }}>{msg}</p>}
    </main>
  );
}
