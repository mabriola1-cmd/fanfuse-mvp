import { kv } from "@vercel/kv";

// Redis keys
const K_CREATORS = "creators";
const K_REQUESTS = "concierge_requests";
const K_USERS    = "users";

// ---------------------- seed once ----------------------
export async function ensureSeed() {
  const creators = (await kv.get(K_CREATORS)) || null;
  if (!creators) {
    await kv.set(K_CREATORS, [
      { id: "c1", name: "Ava Orion",  bio: "Sci‑fi sketches",    avatarUrl: "https://i.pravatar.cc/160?u=c1", earnedAtoms: 0 },
      { id: "c2", name: "Leo Nyx",    bio: "Lo‑fi beats",        avatarUrl: "https://i.pravatar.cc/160?u=c2", earnedAtoms: 0 },
      { id: "c3", name: "Nova Vale",  bio: "Photo sets & reels", avatarUrl: "https://i.pravatar.cc/160?u=c3", earnedAtoms: 0 }
    ]);
  }
  const users = (await kv.get(K_USERS)) || null;
  if (!users) {
    await kv.set(K_USERS, [
      { id: "u1", handle: "alpha",   membership: "gold",     atoms: 500 },
      { id: "u2", handle: "bravo",   membership: "free",     atoms:  50 },
      { id: "u3", handle: "charlie", membership: "platinum", atoms: 800 }
    ]);
  }
  const reqs = (await kv.get(K_REQUESTS)) || null;
  if (!reqs) await kv.set(K_REQUESTS, []);
}

// ---------------------- creators ----------------------
export async function getCreators() {
  await ensureSeed();
  const list = await kv.get(K_CREATORS);
  return Array.isArray(list) ? list : [];
}
export async function getCreator(id) {
  const list = await getCreators();
  return list.find(c => c.id === id) || null;
}
async function setCreators(list) { await kv.set(K_CREATORS, list); }

// ADD: create / update / delete creators
export async function addCreator({ name, bio = "", avatarUrl = "" }) {
  const trimmed = String(name || "").trim();
  if (!trimmed) return { error: "name_required" };
  const list = await getCreators();
  // generate id c_<timestamp>
  const id = `c_${Date.now()}`;
  const row = { id, name: trimmed, bio: String(bio || ""), avatarUrl: String(avatarUrl || ""), earnedAtoms: 0 };
  list.push(row);
  await setCreators(list);
  return { ok: true, creator: row };
}
export async function updateCreator(id, patch = {}) {
  const list = await getCreators();
  const i = list.findIndex(c => c.id === id);
  if (i === -1) return { error: "not_found" };
  const cur = list[i];
  const next = {
    ...cur,
    ...(patch.name !== undefined ? { name: String(patch.name) } : {}),
    ...(patch.bio !== undefined ? { bio: String(patch.bio) } : {}),
    ...(patch.avatarUrl !== undefined ? { avatarUrl: String(patch.avatarUrl) } : {}),
  };
  list[i] = next;
  await setCreators(list);
  return { ok: true, creator: next };
}
export async function deleteCreator(id) {
  const list = await getCreators();
  const i = list.findIndex(c => c.id === id);
  if (i === -1) return { error: "not_found" };
  const [removed] = list.splice(i, 1);
  await setCreators(list);
  return { ok: true, removed };
}

// earnings helpers
export async function creditCreator(creatorId, amount) {
  amount = Math.round(Number(amount || 0));
  if (!(amount > 0)) return { error: "invalid_amount" };
  const list = await getCreators();
  const i = list.findIndex(c => c.id === creatorId);
  if (i === -1) return { error: "no_creator" };
  list[i].earnedAtoms = (list[i].earnedAtoms || 0) + amount;
  await setCreators(list);
  return { ok: true, creator: list[i] };
}
export async function getCreatorEarnings(creatorId) {
  const c = await getCreator(creatorId);
  if (!c) return { error: "no_creator" };
  return { id: c.id, earnedAtoms: c.earnedAtoms || 0 };
}

// ---------------------- users / wallet ----------------------
export async function getUsers() {
  await ensureSeed();
  const list = await kv.get(K_USERS);
  return Array.isArray(list) ? list : [];
}
async function setUsers(list) { await kv.set(K_USERS, list); }
export async function getUser(userId) {
  const list = await getUsers();
  return list.find(u => u.id === userId) || null;
}
export async function getBalance(userId) {
  const u = await getUser(userId);
  if (!u) return { error: "no_user" };
  return { id: u.id, membership: u.membership, atoms: u.atoms };
}
export async function topUp(userId, rawAmount) {
  let amount = Math.round(Number(rawAmount || 0));
  if (!(amount > 0)) return { error: "invalid_amount" };
  const users = await getUsers();
  const i = users.findIndex(u => u.id === userId);
  if (i === -1) return { error: "no_user" };
  users[i].atoms += amount;
  await setUsers(users);
  return { ok: true, user: users[i] };
}
export async function transferAtoms(fromUserId, toUserId, rawAmount) {
  let amount = Math.round(Number(rawAmount || 0));
  if (!(amount > 0)) return { error: "invalid_amount" };
  const users = await getUsers();
  const fi = users.findIndex(u => u.id === fromUserId);
  const ti = users.findIndex(u => u.id === toUserId);
  if (fi === -1 || ti === -1) return { error: "no_user" };
  if (users[fi].atoms < amount) return { error: "insufficient_atoms", atoms: users[fi].atoms };
  users[fi].atoms -= amount;
  users[ti].atoms += amount;
  await setUsers(users);
  return { ok: true, from: users[fi], to: users[ti] };
}

// ---------------------- concierge ----------------------
async function getRequestsRaw() {
  await ensureSeed();
  const list = await kv.get(K_REQUESTS);
  return Array.isArray(list) ? list : [];
}
async function setRequestsRaw(list) { await kv.set(K_REQUESTS, list); }

export async function listRequests() { return await getRequestsRaw(); }
export async function listRequestsByCreator(creatorId) {
  const list = await getRequestsRaw();
  return list.filter(r => r.creatorId === creatorId);
}
export async function getRequest(id) {
  const list = await getRequestsRaw();
  return list.find(r => r.id === id) || null;
}
export async function addRequest({ userId, creatorId, title, details, targetAtoms }) {
  const id = `rq_${Date.now()}`;
  const row = {
    id, userId, creatorId, title, details,
    createdAt: new Date().toISOString(),
    status: "open"
  };
  if (typeof targetAtoms === "number" && targetAtoms > 0) {
    row.targetAtoms = Math.round(targetAtoms);
    row.pledgedAtoms = 0;
    row.pledges = [];
  }
  const list = await getRequestsRaw();
  list.push(row);
  await setRequestsRaw(list);
  return row;
}
export async function updateStatus(id, status) {
  const allowed = new Set(["open","accepted","rejected","completed","canceled"]);
  if (!allowed.has(status)) return null;
  const list = await getRequestsRaw();
  const i = list.findIndex(r => r.id === id);
  if (i === -1) return null;
  list[i] = { ...list[i], status };
  await setRequestsRaw(list);
  return list[i];
}
export async function addPledge(id, userId, rawAmount) {
  let amount = Math.round(Number(rawAmount || 0));
  if (!(amount > 0)) return { error: "invalid_amount" };

  const users = await getUsers();
  const u = users.find(x => x.id === userId);
  if (!u) return { error: "no_user" };
  if (u.atoms < amount) return { error: "insufficient_atoms", atoms: u.atoms };

  const list = await getRequestsRaw();
  const i = list.findIndex(r => r.id === id);
  if (i === -1) return { error: "not_found" };
  const r = list[i];
  if (!("targetAtoms" in r)) return { error: "not_crowdfunded" };
  if (r.status !== "open") return { error: "not_open" };

  // debit user → escrow
  u.atoms -= amount;
  await setUsers(users);

  r.pledges.push({ userId, amount, createdAt: new Date().toISOString() });
  r.pledgedAtoms += amount;

  if (r.pledgedAtoms >= r.targetAtoms && r.status === "open") r.status = "accepted";

  list[i] = r;
  await setRequestsRaw(list);
  return { ok: true, request: r, user: u };
}
export async function finalize(id) {
  // credit creator with escrowed atoms
  const list = await getRequestsRaw();
  const i = list.findIndex(r => r.id === id);
  if (i === -1) return { error: "not_found" };
  const r = list[i];

  if (r.status !== "accepted" && r.status !== "open") return { error: "bad_status" };

  const amount = r.pledgedAtoms || 0;
  if (amount > 0) {
    const credit = await creditCreator(r.creatorId, amount);
    if (credit?.error) return credit;
  }

  r.status = "completed";
  list[i] = r;
  await setRequestsRaw(list);
  return { ok: true, request: r };
}
export async function cancel(id) {
  // refund all pledges to users
  const list = await getRequestsRaw();
  const i = list.findIndex(r => r.id === id);
  if (i === -1) return { error: "not_found" };
  const r = list[i];

  if (!("targetAtoms" in r)) return { error: "not_crowdfunded" };
  if (r.status === "completed" || r.status === "canceled") return { error: "finalized" };

  const users = await getUsers();
  for (const p of r.pledges) {
    const ui = users.findIndex(x => x.id === p.userId);
    if (ui !== -1) users[ui].atoms += p.amount;
  }
  await setUsers(users);

  r.status = "canceled";
  list[i] = r;
  await setRequestsRaw(list);
  return { ok: true, request: r };
}
