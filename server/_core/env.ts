import "dotenv/config";

/**
 * Environment variable validation and access.
 * This ensures the server crashes early with a clear error if required variables are missing.
 */

function getEnv(key: string, required = true): string {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`[ENV ERROR] Missing required environment variable: ${key}`);
  }
  return value ?? "";
}

export const ENV = {
  // App Config
  nodeEnv: getEnv("NODE_ENV", false) || "development",
  port: parseInt(getEnv("PORT", false) || "3000"),
  appOrigin: getEnv("APP_ORIGIN", false) || "http://localhost:8081",
  
  // Auth
  appId: getEnv("VITE_APP_ID", false),
  cookieSecret: getEnv("JWT_SECRET", false),
  oAuthServerUrl: getEnv("OAUTH_SERVER_URL", false),
  ownerOpenId: getEnv("OWNER_OPEN_ID", false),
  
  // Database
  databaseUrl: getEnv("DATABASE_URL"),
  
  // Stripe
  stripeSecretKey: getEnv("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: getEnv("STRIPE_WEBHOOK_SECRET"),
  
  // Stripe Price IDs
  stripePricePremium: getEnv("STRIPE_PRICE_PREMIUM"),
  stripePriceUltimate: getEnv("STRIPE_PRICE_ULTIMATE"),
  stripePriceLifetime: getEnv("STRIPE_PRICE_LIFETIME"),
  
  // External APIs
  forgeApiUrl: getEnv("BUILT_IN_FORGE_API_URL", false),
  forgeApiKey: getEnv("BUILT_IN_FORGE_API_KEY", false),
  
  // Computed
  isProduction: process.env.NODE_ENV === "production",
};

// Log successful env load in development
if (!ENV.isProduction) {
  console.log("[ENV] Environment variables validated successfully.");
}
