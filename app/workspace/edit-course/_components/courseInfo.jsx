"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Play,
  Clock,
  BookOpen,
  BarChart2,
  Users,
  ArrowLeft,
  Image as ImageIcon,
  Wand2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";


const CourseInfo = ({ course }) => {
  const router = useRouter();
  const courseData = course?.courseJson?.course || course || {};
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Mock data - replace with actual course data
  const stats = {
    progress: 0, // Start with 0 progress for new courses
    totalLessons: course?.chapters?.length || courseData?.modules?.length || 0,
    completedLessons: 0,
    totalStudents: 0,
    rating: 0,
  };

  const handleGenerateContent = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setGenerationStatus("Generating content...");

    try {
      const response = await axios.post("/api/generate-course-content", {
        course,
        courseId: course.cid,
        courseJson: courseData,
      });

      if (response.data.success) {
        // TODO: Update the course data with the generated content
        console.log("Generated content:", response.data.data);
        router.replace("/workspace")

        // Refresh the page to show new content
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        throw new Error(response.data.error || "Failed to generate content");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setGenerationStatus("Error generating content. Please try again.");
      
      // Clear error status after 3 seconds
      setTimeout(() => {
        setGenerationStatus("");
      }, 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageError = () => {
    console.error("Failed to load banner image:", course?.bannerImage);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const renderGenerateButton = (variant = "default", className = "") => (
    <Button
      onClick={handleGenerateContent}
      disabled={isGenerating}
      className={`${className} ${
        isGenerating ? "opacity-75 cursor-not-allowed" : ""
      }`}
      variant={variant}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="h-4 w-4 mr-2" />
          Generate Content
        </>
      )}
    </Button>
  );

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to courses
      </Button>

      {/* Banner Image with Error Handling */}
      {course?.bannerImage && !imageError ? (
        <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden bg-gray-100">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          )}
          <Image
            src={course.bannerImage}
            alt={courseData.title || "Course Banner"}
            fill
            className="object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex flex-col items-center justify-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-500">
            {imageError ? "Failed to load banner image" : "No banner image"}
          </p>
        </div>
      )}

      {/* Generation Status */}
      {generationStatus && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          generationStatus.includes("Error") 
            ? "bg-red-50 text-red-800" 
            : "bg-blue-50 text-blue-800"
        }`}>
          {generationStatus.includes("Error") ? (
            <AlertCircle className="h-5 w-5 mr-2" />
          ) : (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          )}
          <span>{generationStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {course?.title || courseData.title || "Untitled Course"}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {course?.description ||
                        courseData.description ||
                        "No description available"}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm capitalize">
                    {course?.difficulty || courseData.difficulty || "Beginner"}{" "}
                    Level
                  </Badge>
                </div>

                {/* Generate Content Button */}
                {renderGenerateButton(
                  "default",
                  "w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{courseData.duration || "Not specified"}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>
                      {course?.chapters?.length ||
                        courseData.modules?.length ||
                        0}{" "}
                      {course?.chapters?.length === 1 ? "Chapter" : "Chapters"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>
                      {stats.totalStudents}{" "}
                      {stats.totalStudents === 1 ? "Student" : "Students"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="capitalize">
                      Category: {course?.category || "Uncategorized"}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Course Progress</span>
                    <span>{stats.progress}%</span>
                  </div>
                  <Progress value={stats.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {stats.completedLessons} of {stats.totalLessons}{" "}
                    {stats.totalLessons === 1 ? "lesson" : "lessons"} completed
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    {stats.progress > 0
                      ? "Continue Learning"
                      : "Start Learning"}
                  </Button>
                  <Button variant="outline" className="w-full">
                    View All Lessons
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Course Content</CardTitle>
                {stats.totalLessons === 0 &&
                  renderGenerateButton("outline", "sm")}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseData.modules?.length > 0 ? (
                  courseData.modules.map((module, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">
                          {module.title || `Module ${index + 1}`}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {module.lessons?.length || 0}{" "}
                          {module.lessons?.length === 1 ? "lesson" : "lessons"}
                        </span>
                      </div>
                      {module.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {module.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground">
                      No content available for this course yet.
                    </p>
                    {renderGenerateButton(
                      "default",
                      "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Course Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-blue-100">
                    <BarChart2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Progress</p>
                    <p className="text-2xl font-bold">{stats.progress}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {stats.completedLessons} of {stats.totalLessons}{" "}
                    {stats.totalLessons === 1 ? "lesson" : "lessons"}
                  </p>
                  <Progress value={stats.progress} className="h-2 mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="text-xl font-semibold">{stats.totalStudents}</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-xl font-semibold">
                    {stats.rating > 0 ? `${stats.rating}/5.0` : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <p className="capitalize">
                  {course?.category || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
                <p className="capitalize">{course?.difficulty || "Beginner"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Target Audience
                </p>
                <p>{course?.targetAudience || "Not specified"}</p>
              </div>
              {course?.includeVideo !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Includes Video
                  </p>
                  <p>{course.includeVideo ? "Yes" : "No"}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Course Syllabus
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Download Materials
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Additional Resources
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseInfo;