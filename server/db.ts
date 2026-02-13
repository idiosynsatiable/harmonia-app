import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Subscription management functions

import { and, desc } from "drizzle-orm";
import { subscriptions, type InsertSubscription, type Subscription } from "../drizzle/schema";

/**
 * Get user's active subscription
 */
export async function getUserSubscription(userId: number): Promise<Subscription | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    const results = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, "active")
        )
      )
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    return results[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get user subscription:", error);
    return null;
  }
}

/**
 * Get all user subscriptions (including inactive)
 */
export async function getUserSubscriptions(userId: number): Promise<Subscription[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt));
}

/**
 * Create a new subscription
 */
export async function createSubscription(data: InsertSubscription): Promise<number> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.insert(subscriptions).values(data);
    return Number((result as any).insertId || 0);
  } catch (error) {
    console.error("[Database] Failed to create subscription:", error);
    throw new Error("Failed to create subscription record");
  }
}

/**
 * Update subscription by Stripe subscription ID
 */
export async function updateSubscriptionByStripeId(
  stripeSubscriptionId: string,
  data: Partial<InsertSubscription>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(subscriptions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
}

/**
 * Update subscription by ID
 */
export async function updateSubscription(
  id: number,
  data: Partial<InsertSubscription>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(subscriptions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(subscriptions.id, id));
}

/**
 * Cancel subscription
 */
export async function cancelUserSubscription(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(subscriptions)
    .set({
      status: "canceled",
      canceledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, id));
}

/**
 * Get subscription by Stripe customer ID
 */
export async function getSubscriptionByCustomerId(
  stripeCustomerId: string
): Promise<Subscription | null> {
  const db = await getDb();
  if (!db) return null;

  const results = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeCustomerId, stripeCustomerId))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);

  return results[0] || null;
}

/**
 * Get system-wide statistics for admin dashboard
 */
export async function getSystemStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // Count total users
    const userCountResult = await db.select({ count: sql<number>`count(*)` }).from(users);
    const totalUsers = Number(userCountResult[0]?.count || 0);

    // Count active subscriptions
    const activeSubCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subscriptions)
      .where(eq(subscriptions.status, "active"));
    const activeSubscriptions = Number(activeSubCountResult[0]?.count || 0);

    // Calculate conversion rate
    const conversionRate = totalUsers > 0 
      ? Number(((activeSubscriptions / totalUsers) * 100).toFixed(1)) 
      : 0;

    // In a real app, you'd sum up successful payments for revenue
    // For now, we'll return a placeholder or 0
    return {
      totalUsers,
      activeSubscriptions,
      totalRevenue: 0, // Placeholder
      conversionRate,
    };
  } catch (error) {
    console.error("[Database] Failed to fetch system stats:", error);
    throw error;
  }
}
