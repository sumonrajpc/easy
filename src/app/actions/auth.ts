"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/auth";
import { redirect } from "next/navigation";

export type AuthState = { error?: string } | null;

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "STUDENT") as
    | "STUDENT"
    | "INSTRUCTOR";

  if (!name || !email || !password) {
    return { error: "সব ঘর পূরণ করুন / Please fill all fields." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing.length > 0) {
    return { error: "This email is already registered." };
  }

  const hashed = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashed,
      role: role === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT",
      lastActiveAt: new Date(),
    })
    .returning();

  await setSessionCookie({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });

  redirect(user.role === "INSTRUCTOR" ? "/instructor" : "/dashboard");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Please enter email and password." };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  if (!user.isActive) {
    return { error: "Your account has been deactivated. Contact support." };
  }

  await db
    .update(users)
    .set({ lastActiveAt: new Date() })
    .where(eq(users.id, user.id));

  await setSessionCookie({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });

  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "INSTRUCTOR") redirect("/instructor");
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/");
}
