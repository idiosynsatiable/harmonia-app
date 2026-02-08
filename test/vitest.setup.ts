process.env.TZ = "UTC";

// Safe dummy envs (do NOT use real keys in repos)
process.env.NODE_ENV ||= "test";
process.env.STRIPE_SECRET_KEY ||= "sk_test_dummy";
process.env.STRIPE_WEBHOOK_SECRET ||= "whsec_dummy";
process.env.NEXT_PUBLIC_SITE_URL ||= "http://localhost:3000";

// Polyfill fetch for Node if missing
try {
  if (typeof fetch === "undefined") {
    // Node 18+ usually has fetch, but some runtimes/envs may not expose it
    // @ts-ignore
    globalThis.fetch = (await import("undici")).fetch;
    // @ts-ignore
    globalThis.Headers = (await import("undici")).Headers;
    // @ts-ignore
    globalThis.Request = (await import("undici")).Request;
    // @ts-ignore
    globalThis.Response = (await import("undici")).Response;
  }
} catch {
  // If undici isn't present, tests will reveal it; we add it below if needed.
}
