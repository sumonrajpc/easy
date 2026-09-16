import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false });

  await db
    .update(users)
    .set({ lastActiveAt: new Date() })
    .where(eq(users.id, session.userId));

  return NextResponse.json({ ok: true });
}
