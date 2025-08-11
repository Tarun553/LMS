import { db } from "@/config/db";
import { courseTabel, enrollCourseTabel } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    
    // Get the current user for authorization if needed
    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the course by ID
    const course = await db
      .select()
      .from(courseTabel)
      .where(eq(courseTabel.cid, id))
      .limit(1);

    if (!course || course.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if the user is enrolled in this course
    const enrollment = await db
      .select()
      .from(enrollCourseTabel)
      .where(
        and(
          eq(enrollCourseTabel.userEmail, user.primaryEmailAddress.emailAddress),
          eq(enrollCourseTabel.cid, id)
        )
      );

    // Add enrollment status to the course data
    const courseWithEnrollment = {
      ...course[0],
      isEnrolled: enrollment.length > 0,
      progress: enrollment[0]?.progress || 0
    };

    return NextResponse.json(courseWithEnrollment);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
