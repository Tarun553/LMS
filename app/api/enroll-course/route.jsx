import { db } from "@/config/db";
import { enrollCourseTabel, courseTabel } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId } = await req.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Check if already enrolled
    const isEnrolled = await db
      .select()
      .from(enrollCourseTabel)
      .where(
        and(
          eq(enrollCourseTabel.userEmail, user.primaryEmailAddress.emailAddress),
          eq(enrollCourseTabel.cid, courseId)
        )
      );

    if (isEnrolled.length > 0) {
      return NextResponse.json({ error: "Course already enrolled" }, { status: 400 });
    }

    // Insert enrollment
    const result = await db
      .insert(enrollCourseTabel)
      .values({
        cid: courseId,
        userEmail: user.primaryEmailAddress.emailAddress,
      })
      .returning({
        id: enrollCourseTabel.id,
        cid: enrollCourseTabel.cid,
        userEmail: enrollCourseTabel.userEmail,
      });

    return NextResponse.json({ res: "Course enrolled successfully", result }, { status: 200 });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}



export async function GET(req){
  const user = await currentUser()
    const result = await db.select().from(courseTabel).innerJoin(enrollCourseTabel, eq(courseTabel.cid, enrollCourseTabel.cid)).where(eq(enrollCourseTabel.userEmail, user.primaryEmailAddress.emailAddress)).orderBy(desc(enrollCourseTabel.id))
    return NextResponse.json(result)
}