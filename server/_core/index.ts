import "dotenv/config";
import express from "express";
import { createServer } from "http";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerWebhookRoutes } from "../webhooks";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { ENV } from "./env";

/**
 * Harmonia API Server
 * Hardened Express server with tRPC, OAuth, and Stripe Webhooks.
 */

async function startServer() {
  const app = express();
  const server = createServer(app);

  // 1. Security Headers (Helmet)
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: ENV.isProduction ? undefined : false, // Disable CSP in dev for easier debugging
  }));

  // 2. Trust Proxy (Required for rate limiting on Railway/Cloudflare)
  app.set("trust proxy", 1);

  // 3. CORS Configuration
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        ENV.appOrigin,
        "http://localhost:8081",
        "https://harmonia-sounds.vercel.app"
      ].filter(Boolean);

      if (allowedOrigins.includes(origin) || !ENV.isProduction) {
        callback(null, true);
      } else {
        console.warn(`[CORS Blocked] Origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  }));

  // 4. Rate Limiting (Global + Specific)
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests, please try again later.",
  });
  app.use(globalLimiter);

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Limit sensitive API routes
    message: "Sensitive operation limit reached. Please wait 15 minutes.",
  });
  app.use("/api/billing/", apiLimiter);
  app.use("/api/auth/", apiLimiter);

  // 5. Stripe Webhook (MUST use raw body)
  app.post(
    "/api/billing/webhook",
    express.raw({ type: "application/json" }),
    (req, res, next) => next() // Pass to registered handler
  );

  // 6. Body Parsers
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ limit: "1mb", extended: true }));

  // 7. Request Logging
  app.use((req, res, next) => {
    if (!ENV.isProduction || req.path !== "/api/health") {
      console.log(`[${new RegExp(/post|put|delete/i).test(req.method) ? "WRITE" : "READ"}] ${req.method} ${req.path}`);
    }
    next();
  });

  // 8. Route Registration
  app.get("/", (_req, res) => {
    res.status(200).send("Harmonia API online");
  });

  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      env: ENV.nodeEnv 
    });
  });

  registerOAuthRoutes(app);
  registerWebhookRoutes(app);

  // 9. tRPC Middleware
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // 10. Start Listening
  const port = ENV.port;
  server.listen(port, "0.0.0.0", () => {
    console.log(`
🚀 Harmonia API Server Started
--------------------------------
Port:       ${port}
Mode:       ${ENV.nodeEnv}
Origin:     ${ENV.appOrigin}
Stripe:     ${ENV.stripeSecretKey ? "✅ Configured" : "❌ Missing"}
Database:   ${ENV.databaseUrl ? "✅ Configured" : "❌ Missing"}
--------------------------------
    `);
  });
}

startServer().catch((err) => {
  console.error("FATAL: Server failed to start:", err);
  process.exit(1);
});
