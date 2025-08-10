// app/api/courses/route.js
import { db } from "@/config/db";
import { NextResponse } from "next/server";
import { courseTabel } from "@/config/schema";
import { desc, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (courseId) {
      // Get single course by ID
      const [course] = await db
        .select()
        .from(courseTabel)
        .where(eq(courseTabel.cid, courseId));

      if (!course) {
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }

      // Ensure the course belongs to the current user
      if (course.userEmail !== userEmail) {
        return NextResponse.json(
          { error: "Unauthorized access to course" },
          { status: 403 }
        );
      }

      return NextResponse.json(course);
    } else {
      // Get all courses for the current user
      const courses = await db
        .select()
        .from(courseTabel)
        .where(eq(courseTabel.userEmail, userEmail))
        .orderBy(desc(courseTabel.id));

      return NextResponse.json(courses);
    }
  } catch (error) {
    console.error("Error in courses API route:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        ...(process.env.NODE_ENV === "development" && {
          details: error.message,
          stack: error.stack,
        }),
      },
      { status: 500 }
    );
  }
}
