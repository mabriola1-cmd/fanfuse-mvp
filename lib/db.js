export const conciergeRequestsBasic = []; 
// shape: { id, fanId, creatorId, message, atomsOffered, groupFunding, contributors: [{ fanId, atoms }], status }

export function createConciergeRequestBasic({ fanId, creatorId, message, atomsOffered = 0, groupFunding = false }) {
  const id = `rq_basic_${Date.now()}`;
  const req = {
    id,
    fanId,
    creatorId,
    message: String(message || "").slice(0, 2000),
    atomsOffered: Math.max(0, Math.round(Number(atomsOffered || 0))),
    groupFunding: !!groupFunding,
    contributors: groupFunding ? [{ fanId, atoms: Math.max(0, Math.round(Number(atomsOffered || 0))) }] : [],
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  conciergeRequestsBasic.push(req);
  return req;
}

export function getRequestsForCreatorBasic(creatorId) {
  return conciergeRequestsBasic.filter(r => r.creatorId === creatorId);
}

export function contributeToRequestBasic(requestId, fanId, atoms) {
  const amount = Math.max(0, Math.round(Number(atoms || 0)));
  if (!(amount > 0)) return { error: "invalid_amount" };
  const req = conciergeRequestsBasic.find(r => r.id === requestId && r.groupFunding);
  if (!req) return { error: "not_found_or_not_group" };
  req.contributors.push({ fanId, atoms: amount });
  req.atomsOffered += amount;
  return { ok: true, request: req };
}
