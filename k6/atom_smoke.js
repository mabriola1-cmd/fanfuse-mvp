import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 1,
  duration: "10s",
};

export default function () {
  const login = http.post("https://your-api.com/api/auth/login", JSON.stringify({
    email: __ENV.USER_EMAIL,
    password: __ENV.USER_PASS
  }), {
    headers: { "Content-Type": "application/json" }
  });

  const token = JSON.parse(login.body).token;

  const purchase = http.post("https://your-api.com/api/atoms/purchase", JSON.stringify({
    userId: "user1",
    bundleId: "bundle123",
    amountUSD: 10
  }), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const unlock = http.post("https://your-api.com/api/vaults/vault123/unlock", JSON.stringify({
    creatorId: "c1" // ✅ lowercase 'i'
  }), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const gift = http.post("https://your-api.com/api/gifts", JSON.stringify({
    creatorId: "c1", // ✅ lowercase
    amountAtoms: 100
  }), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const raffle = http.post("https://your-api.com/api/raffles/r1/enter", JSON.stringify({
    creatorId: "c1", // ✅ lowercase
    entries: 5
  }), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  check(raffle, {
    "raffle entry worked": (res) => res.status === 200,
  });
}
