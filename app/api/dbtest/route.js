import { kv } from "@vercel/kv";

export async function GET() {
  try {
    const key = "kv_debug_key";
    const val = `ok_${Date.now()}`;
    await kv.set(key, val);
    const got = await kv.get(key);
    return new Response(JSON.stringify({ wrote: val, read: got }), {
      headers: { "content-type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}
