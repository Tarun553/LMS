import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const CourseList = () => {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCourseId, setLoadingCourseId] = useState(null); // track loading per course
  const { user } = useUser();

  const onEnrollCourse = async (course) => {
    try {
      setLoadingCourseId(course.cid);
      const result = await axios.post("/api/enroll-course", { courseId: course.cid });

      if (result.data.error) {
        alert(result.data.error);
      } else if (result.data.res) {
        alert(result.data.res);
      }
    } catch (error) {
      console.error("Error enrolling course:", error);
    } finally {
      setLoadingCourseId(null);
    }
  };

  useEffect(() => {
    if (user) {
      getCourseList();
    }
  }, [user]);

  const getCourseList = async () => {
    try {
      setLoading(true);
      const result = await axios.get("/api/courses");
      setCourseList(result.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Courses</h1>
      {courseList.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">No courses found</h2>
          <p className="text-slate-600 mb-6">Get started by creating a new course</p>
          <Button className="bg-primary hover:bg-primary/90">
            Create New Course
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseList.map((course) => (
            <Card
              key={course.cid}
              className="hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
                {course.bannerImage ? (
                  <img
                    src={course.bannerImage}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-slate-400">No banner image</span>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 line-clamp-1">
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {course.description || "No description available"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.difficulty === "beginner"
                        ? "bg-green-100 text-green-800"
                        : course.difficulty === "intermediate"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {course.difficulty?.toUpperCase() || "ALL LEVELS"}
                  </span>
                  <span>•</span>
                  <span>{course.chapters || 0} chapters</span>
                  <span>•</span>
                  <span className="capitalize">{course.category}</span>
                </div>
                {course.targetAudience && (
                  <div className="text-xs text-slate-500 mt-1">
                    For: {course.targetAudience}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button
                  disabled={loadingCourseId === course.cid}
                  onClick={() => onEnrollCourse(course)}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  {loadingCourseId === course.cid
                    ? "Enrolling..."
                    : course.includeVideo
                    ? "Watch Now"
                    : "Enroll Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
