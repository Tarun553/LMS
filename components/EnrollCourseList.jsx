"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const EnrollCourseList = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const getEnrolledCourses = async () => {
    try {
      setLoading(true);
      const result = await axios.get("/api/enroll-course");
      setEnrolledCourses(result.data);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  // Function to calculate progress
  const calculateProgress = (course, completedChapters) => {
    if (!course?.courseJson?.course?.chapters) return 0;

    // Total topics count
    const totalTopics = course.courseJson.course.chapters.reduce(
      (total, chapter) => total + (chapter.topics?.length || 0),
      0
    );

    // Completed topics count
    let completedTopics = 0;
    if (completedChapters) {
      for (const chapterName in completedChapters) {
        completedTopics += completedChapters[chapterName]?.length || 0;
      }
    }

    return totalTopics > 0
      ? Math.round((completedTopics / totalTopics) * 100)
      : 0;
  };

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <h2 className="text-2xl font-bold">My Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full rounded-xl shadow-sm">
              <Skeleton className="h-48 w-full rounded-t-xl" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-2">My Learning</h2>
        <p className="text-muted-foreground mb-6">
          You haven't enrolled in any courses yet.
        </p>
        <Button asChild>
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">My Learning</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((item) => {
          const course = item.courses;
          const progress = calculateProgress(
            course,
            item.enrollCourse?.completedChapters
          );

          return (
            <Card
              key={course.cid}
              className="w-full rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow"
            >
              {/* Banner with Gradient */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={course.bannerImage} 
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-course.svg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Play Button */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="bg-white p-2 rounded-full shadow">
                    <Play className="h-5 w-5 text-black" />
                  </div>
                  <span className="text-white font-semibold text-sm">
                    {progress === 0 ? "Start" : "Resume"}
                  </span>
                </div>

                {/* Tags */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-purple-500/90 text-white text-xs px-2 py-0.5 rounded-full">
                    {course.difficulty}
                  </span>
                  <span className="bg-pink-500/90 text-white text-xs px-2 py-0.5 rounded-full">
                    {course.category}
                  </span>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg line-clamp-2 min-h-[3.5rem]">
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  {/* Circular Progress */}
                  <div className="relative flex items-center justify-center">
                    <svg
                      className="w-12 h-12 transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-gray-200"
                        strokeWidth="3.8"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-500"
                        strokeWidth="3.8"
                        strokeDasharray={`${progress}, 100`}
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-sm font-semibold">
                      {progress}%
                    </span>
                  </div>

                  {/* Continue Button */}
                  <Button asChild size="sm" className="rounded-full">
                    <Link href={`/workspace/view-course/${course.cid}`}>
                      {progress === 0 ? "Start Learning" : "Continue"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EnrollCourseList;
