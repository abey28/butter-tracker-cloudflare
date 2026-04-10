// Cloudflare Pages Function - handles data persistence via KV
// Binding: BUTTER_KV (set up in Cloudflare dashboard)

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  try {
    if (request.method === "GET") {
      // Return clients and deals data
      const clientsJson = await env.BUTTER_KV.get("clients");
      const dealsJson = await env.BUTTER_KV.get("deals");
      const lastUpdated = await env.BUTTER_KV.get("lastUpdated");

      return new Response(JSON.stringify({
        clients: clientsJson ? JSON.parse(clientsJson) : null,
        deals: dealsJson ? JSON.parse(dealsJson) : null,
        lastUpdated: lastUpdated || null,
      }), {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    if (request.method === "POST") {
      const body = await request.json();

      if (action === "saveClients") {
        await env.BUTTER_KV.put("clients", JSON.stringify(body.clients));
        await env.BUTTER_KV.put("lastUpdated", new Date().toISOString());
      } else if (action === "saveDeals") {
        await env.BUTTER_KV.put("deals", JSON.stringify(body.deals));
        await env.BUTTER_KV.put("lastUpdated", new Date().toISOString());
      } else if (action === "saveAll") {
        await env.BUTTER_KV.put("clients", JSON.stringify(body.clients));
        await env.BUTTER_KV.put("deals", JSON.stringify(body.deals));
        await env.BUTTER_KV.put("lastUpdated", new Date().toISOString());
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
}
