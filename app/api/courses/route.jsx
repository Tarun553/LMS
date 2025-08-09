// app/api/courses/route.js
import { db } from "@/config/db";
import { NextResponse } from "next/server";
import { courseTabel } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    console.log('Searching for course with cid:', courseId); // Debug log

    const result = await db
      .select()
      .from(courseTabel)
      .where(eq(courseTabel.cid, courseId)); // Changed from courseId to cid

    console.log('Query result:', result); // Debug log

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch course",
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}