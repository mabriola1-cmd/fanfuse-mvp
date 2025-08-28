"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Login failed");

      // after login, go to ?next=... or default admin landing
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/admin/concierge";
      window.location.href = next;
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setBusy(false);
      setPassword("");
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 420 }}>
      <h2>Admin Login</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button disabled={busy} type="submit">
          {busy ? "Checking…" : "Login"}
        </button>
        {error && <p style={{ color: "tomato" }}>{error}</p>}
      </form>
    </main>
  );
}
