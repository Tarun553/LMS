"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen, Video, Play } from "lucide-react";
import Image from "next/image";

const ViewCourse = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch course");
        }
        const data = await response.json();
        setCourse(data);
        setProgress(data.progress || 0);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      const response = await fetch("/api/enroll-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to enroll in course");
      }

      setCourse((prev) => ({
        ...prev,
        isEnrolled: true,
        progress: 0,
      }));
    } catch (error) {
      console.error("Enrollment error:", error);
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartTopic = (chapterIndex, topicIndex) => {
    if (course.isEnrolled) {
      // Navigate to topic page with chapter and topic indices
      router.push(`/workspace/learn/${courseId}/${chapterIndex + 1}/${topicIndex + 1}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto p-6 space-y-8">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-60 w-full rounded-lg" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-semibold">Course not found</h2>
            <p className="text-muted-foreground">The course you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.back()} className="w-full">
              Go back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle the response structure properly
  const courseData = course.courseJson?.course || course;
  const chapters = course.courseContent || courseData.chapters || [];
  const bannerImage = course.bannerImage || "/placeholder-banner.jpg";
  const description = course.description || courseData.description || "No description available.";
  const difficulty = course.difficulty || courseData.difficulty || "Not specified";
  const targetAudience = course.targetAudience || courseData.targetAudience || "All levels";
  const title = course.title || courseData.title || "Untitled Course";

  // Calculate total duration
  const totalDuration = chapters.reduce((total, chapter) => {
    const duration = parseFloat(chapter.chapter?.duration) || 0;
    return total + duration;
  }, 0);

  // Calculate total topics
  const totalTopics = chapters.reduce((total, chapter) => {
    return total + (chapter.topics?.length || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 lg:p-8 space-y-8">
        {/* Hero Section */}
        <div className="relative">
          {/* Banner Image */}
          <div className="relative w-full h-72 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={bannerImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Course Title Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-white/90 text-black">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {difficulty}
                </Badge>
                <Badge variant="secondary" className="bg-white/90 text-black">
                  <Users className="w-4 h-4 mr-1" />
                  {targetAudience}
                </Badge>
                <Badge variant="secondary" className="bg-white/90 text-black">
                  <Clock className="w-4 h-4 mr-1" />
                  {totalDuration}h
                </Badge>
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2 capitalize">
                {title}
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl">
                {description}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="absolute -bottom-6 right-6">
            {course.isEnrolled ? (
              <Button 
                size="lg" 
                className="shadow-xl bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
                onClick={() => {
                  if (chapters.length > 0 && chapters[0].topics?.length > 0) {
                    handleStartTopic(0, 0);
                  } else {
                    router.push(`/workspace/learn/${courseId}`);
                  }
                }}
              >
                <Play className="w-5 h-5 mr-2" />
                Continue Learning
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={handleEnroll} 
                disabled={enrolling}
                className="shadow-xl bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
              >
                {enrolling ? "Enrolling..." : "Enroll Now"}
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3 mt-12">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Progress (if enrolled) */}
            {course.isEnrolled && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Overall Progress</span>
                      <span className="text-2xl font-bold text-blue-600">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.floor((progress / 100) * chapters.length)}
                        </div>
                        <div className="text-muted-foreground">Chapters Completed</div>
                      </div>
                      <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.floor((progress / 100) * totalTopics)}
                        </div>
                        <div className="text-muted-foreground">Topics Completed</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Content */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Course Content</CardTitle>
                <CardDescription className="text-lg">
                  {chapters.length} {chapters.length === 1 ? "Chapter" : "Chapters"} • {totalTopics} Topics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {chapters.map((chapterData, chapterIndex) => {
                  const chapter = chapterData.chapter || chapterData;
                  const topics = chapterData.topics || [];
                  
                  return (
                    <div key={chapterIndex} className="border rounded-xl p-6 space-y-4 bg-gray-50/50 dark:bg-gray-800/50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                            {chapterIndex + 1}
                          </div>
                          {chapter.chapterName}
                        </h3>
                        <Badge variant="outline" className="text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {chapter.duration}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3 ml-13">
                        {topics.map((topic, topicIndex) => {
                          const topicName = typeof topic === 'string' ? topic : topic.topic;
                          const hasVideo = topic.youtubeVideos && topic.youtubeVideos.length > 0;
                          
                          return (
                            <div
                              key={topicIndex}
                              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border rounded-lg hover:shadow-md transition-all duration-200 group"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-sm font-medium">
                                  {topicIndex + 1}
                                </div>
                                <div>
                                  <span className="font-medium group-hover:text-blue-600 transition-colors">
                                    {topicName?.split(" [")[0] || `Topic ${topicIndex + 1}`}
                                  </span>
                                  {hasVideo && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                      <Video className="w-4 h-4" />
                                      <span>Video content available</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant={course.isEnrolled ? "default" : "secondary"}
                                size="sm"
                                disabled={!course.isEnrolled}
                                onClick={() => handleStartTopic(chapterIndex, topicIndex)}
                                className={course.isEnrolled ? "bg-blue-600 hover:bg-blue-700" : ""}
                              >
                                <Play className="w-4 h-4 mr-1" />
                                {course.isEnrolled ? "Start" : "Enroll to Access"}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* About & Requirements Tabs */}
            <Card className="border-0 shadow-lg">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="about" className="text-lg py-3">About</TabsTrigger>
                  <TabsTrigger value="requirements" className="text-lg py-3">Requirements</TabsTrigger>
                </TabsList>
                <div className="p-6">
                  <TabsContent value="about" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Course Description</h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {description}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
                      <ul className="grid gap-3 text-gray-700 dark:text-gray-300">
                        {courseData.learningOutcomes?.length > 0 ? (
                          courseData.learningOutcomes.map((outcome, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                ✓
                              </div>
                              <span>{outcome}</span>
                            </li>
                          ))
                        ) : (
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              ℹ
                            </div>
                            <span>Comprehensive learning outcomes will be detailed in the course content</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="requirements" className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Prerequisites</h3>
                    <ul className="space-y-3">
                      {[
                        "A computer with internet access",
                        "Basic computer literacy",
                        "No prior programming experience needed",
                        "Willingness to learn and practice"
                      ].map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            •
                          </div>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Course Stats */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <CardHeader>
                <CardTitle className="text-xl">Course Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Duration</span>
                    </div>
                    <span className="font-bold">{totalDuration}h</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Chapters</span>
                    </div>
                    <span className="font-bold">{chapters.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">Level</span>
                    </div>
                    <span className="font-bold capitalize">{difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-red-600" />
                      <span className="font-medium">Videos</span>
                    </div>
                    <span className="font-bold">Included</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button
                    className="w-full h-12 text-lg"
                    size="lg"
                    disabled={!course.isEnrolled}
                    onClick={() => {
                      if (chapters.length > 0 && chapters[0].topics?.length > 0) {
                        handleStartTopic(0, 0);
                      } else {
                        router.push(`/workspace/learn/${courseId}`);
                      }
                    }}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {progress === 100 ? "Review Course" : "Start Learning"}
                  </Button>
                  
                  {progress === 100 && (
                    <Button variant="outline" className="w-full h-12 text-lg">
                      <div className="w-5 h-5 mr-2">🏆</div>
                      Download Certificate
                    </Button>
                  )}
                  
                  {!course.isEnrolled && (
                    <div className="text-center text-sm text-muted-foreground p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      Enroll now to access all course content and track your progress
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourse;