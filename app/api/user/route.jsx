import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  // if user already exist
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, body.email));
  // if user is not exist
  if (user?.length == 0) {
    const result = await db
      .insert(usersTable)
      .values({
        name: body.name,
        email: body.email,
        subscriptionId: body.subscriptionId,
      })
      .returning(usersTable);

    // Create a plain object with only the data we need
    const userData = result[0]
      ? {
          id: result[0].id,
          name: result[0].name,
          email: result[0].email,
          subscriptionId: result[0].subscriptionId,
        }
      : null;

    return NextResponse.json(userData);
  }
  return NextResponse.json(user[0]);
}
