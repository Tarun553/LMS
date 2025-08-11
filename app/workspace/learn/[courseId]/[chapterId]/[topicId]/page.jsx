"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  Play,
  BookOpen,
} from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";

export default function VideoLessonPage() {
  const { courseId, chapterId, topicId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [availableVideos, setAvailableVideos] = useState([]);
  const [error, setError] = useState(null);

  // Extract video ID from topic
  const extractVideoId = (topic) => {
    if (!topic) return null;
    if (topic.youtubeVideos?.length > 0) {
      const validVideo = topic.youtubeVideos.find(
        (video) => video?.videoId && /^[a-zA-Z0-9_-]{11}$/.test(video.videoId)
      );
      if (validVideo) return validVideo.videoId;
    }
    if (topic.videoId) return topic.videoId;
    if (topic.videoUrl) {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = topic.videoUrl.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    }
    return null;
  };

  // Get available videos for the current topic
  const getAvailableVideos = (topic) => {
    if (!topic) return [];
    const videos = [];
    if (Array.isArray(topic.youtubeVideos)) {
      topic.youtubeVideos.forEach((video) => {
        if (video?.videoId && /^[a-zA-Z0-9_-]{11}$/.test(video.videoId)) {
          videos.push({
            videoId: video.videoId,
            title: video.title || topic.topic || "Untitled Video",
            description: video.description || topic.description || "",
            channelTitle: video.channelTitle || "Unknown Channel",
            thumbnail:
              video.thumbnail ||
              `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`,
          });
        }
      });
    }
    if (videos.length === 0 && topic.videoId) {
      const videoId = extractVideoId(topic);
      if (videoId) {
        videos.push({
          videoId,
          title: topic.topic || "Untitled Video",
          description: topic.description || "",
          channelTitle: "Unknown Channel",
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        });
      }
    }
    return videos;
  };

  // Get related videos from the same course
  const getRelatedVideos = (
    currentVideoId,
    currentChapterIdx,
    currentTopicIdx
  ) => {
    if (!course) return [];
    const allVideos = [];
    const chapters =
      course.courseContent || course.courseJson?.course?.chapters || [];
    chapters.forEach((chapter, chapterIdx) => {
      const topics = chapter.topics || [];
      topics.forEach((topic, topicIdx) => {
        if (chapterIdx === currentChapterIdx && topicIdx === currentTopicIdx)
          return;
        if (topic.youtubeVideos && topic.youtubeVideos.length > 0) {
          topic.youtubeVideos.forEach((video, videoIdx) => {
            if (video.videoId) {
              allVideos.push({
                videoId: video.videoId,
                title: video.title || topic.topic || `Topic ${topicIdx + 1}`,
                description: video.description || topic.description || "",
                thumbnail:
                  video.thumbnail ||
                  `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`,
                channelTitle: video.channelTitle || "",
                chapterIndex: chapterIdx,
                topicIndex: topicIdx,
                chapterName:
                  chapter.chapter?.chapterName || `Chapter ${chapterIdx + 1}`,
                uniqueId: `${chapterIdx}-${topicIdx}-${video.videoId}-${videoIdx}`,
              });
            }
          });
        }
      });
    });
    const shuffled = [...allVideos].sort(() => 0.5 - Math.random());
    const uniqueVideos = [];
    const videoIds = new Set();
    for (const video of shuffled) {
      if (!videoIds.has(video.videoId)) {
        videoIds.add(video.videoId);
        uniqueVideos.push(video);
        if (uniqueVideos.length >= 2) break;
      }
    }
    return uniqueVideos;
  };

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) throw new Error("Failed to fetch course");
        const data = await response.json();
        setCourse(data);
        const chapters =
          data.courseContent || data.courseJson?.course?.chapters || [];
        const chapterIndex = parseInt(chapterId) - 1;
        const topicIndex = parseInt(topicId) - 1;
        if (chapterIndex < 0 || chapterIndex >= chapters.length) {
          throw new Error("Chapter not found");
        }
        const chapter = chapters[chapterIndex];
        const topics = chapter.topics || [];
        if (topicIndex < 0 || topicIndex >= topics.length) {
          throw new Error("Topic not found");
        }
        const topic = topics[topicIndex];
        const videos = getAvailableVideos(topic);
        setAvailableVideos(videos);
        if (videos.length > 0) {
          const firstVideo = videos[0];
          setSelectedVideo({
            ...firstVideo,
            chapterIndex,
            topicIndex,
            totalChapters: chapters.length,
            topicsInChapter: topics.length,
          });
          setCurrentVideo({
            id: firstVideo.videoId,
            title: firstVideo.title,
            description: firstVideo.description,
            chapterIndex,
            topicIndex,
            totalChapters: chapters.length,
            topicsInChapter: topics.length,
          });
          const relatedVideosList = getRelatedVideos(
            firstVideo.videoId,
            chapterIndex,
            topicIndex
          );
          setRelatedVideos(relatedVideosList);
        } else {
          throw new Error("No valid videos found for this topic");
        }
      } catch (error) {
        console.error("Error loading course:", error);
        setError(error.message || "Failed to load course content");
        setCurrentVideo(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, chapterId, topicId]);

  // Handle video selection
  const handleVideoSelect = (video) => {
    setSelectedVideo({
      ...video,
      chapterIndex: currentVideo?.chapterIndex || 0,
      topicIndex: currentVideo?.topicIndex || 0,
      totalChapters: currentVideo?.totalChapters || 1,
      topicsInChapter: currentVideo?.topicsInChapter || 1,
      title: currentVideo?.title || video.title,
    });
    setCurrentVideo((prev) => ({
      ...prev,
      id: video.videoId,
      title: video.title || prev?.title,
      description: video.description || prev?.description,
    }));
  };

  const handleBack = () => {
    router.push(`/workspace/view-course/${courseId}`);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const navigateToTopic = (chapterIdx, topicIdx) => {
    router.push(
      `/workspace/learn/${courseId}/${chapterIdx + 1}/${topicIdx + 1}`
    );
  };

  const handleNextVideo = () => {
    if (!currentVideo) return;
    const nextTopicIndex = currentVideo.topicIndex + 1;
    const nextChapterIndex = currentVideo.chapterIndex;
    if (nextTopicIndex < currentVideo.topicsInChapter) {
      navigateToTopic(nextChapterIndex, nextTopicIndex);
    } else if (nextChapterIndex + 1 < currentVideo.totalChapters) {
      navigateToTopic(nextChapterIndex + 1, 0);
    }
  };

  const handlePreviousVideo = () => {
    if (!currentVideo) return;
    const prevTopicIndex = currentVideo.topicIndex - 1;
    const prevChapterIndex = currentVideo.chapterIndex;
    if (prevTopicIndex >= 0) {
      navigateToTopic(prevChapterIndex, prevTopicIndex);
    } else if (prevChapterIndex - 1 >= 0) {
      const prevChapter = course.courseContent?.[prevChapterIndex - 1];
      if (prevChapter?.topics?.length > 0) {
        navigateToTopic(prevChapterIndex - 1, prevChapter.topics.length - 1);
      }
    }
  };

  const hasNextVideo =
    currentVideo &&
    (currentVideo.topicIndex + 1 < currentVideo.topicsInChapter ||
      currentVideo.chapterIndex + 1 < currentVideo.totalChapters);

  const hasPreviousVideo =
    currentVideo &&
    (currentVideo.topicIndex > 0 || currentVideo.chapterIndex > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-lg text-gray-600 dark:text-gray-300">
          Loading lesson...
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Video Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The requested video could not be found.
        </p>
        <Button onClick={handleBack} variant="outline" className="w-full sm:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Course
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-gray-700 dark:text-gray-300"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Video Options */}
            {availableVideos.length > 1 && (
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  Choose a video:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableVideos.map((video, index) => (
                    <div
                      key={`video-option-${index}`}
                      onClick={() => handleVideoSelect(video)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedVideo?.videoId === video.videoId
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-24 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <img
                            src={
                              video.thumbnail ||
                              `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
                            }
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                          {selectedVideo?.videoId === video.videoId && (
                            <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              ✓
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 text-gray-800 dark:text-gray-200">
                            {video.title || `Video Option ${index + 1}`}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                            {video.channelTitle || "No channel"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Player */}
            <div className="bg-black rounded-xl overflow-hidden w-full aspect-video">
              {currentVideo ? (
                <VideoPlayer
                  key={`${currentVideo.id}-${chapterId}-${topicId}`}
                  videoId={currentVideo.id}
                  title={currentVideo.title}
                  onClose={handleBack}
                  onNext={handleNextVideo}
                  onPrevious={handlePreviousVideo}
                  hasNext={hasNextVideo}
                  hasPrevious={hasPreviousVideo}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                  {loading ? "Loading video..." : "Video not available"}
                </div>
              )}
            </div>

            {/* Video Info */}
            {currentVideo && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
                <h1 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                  {currentVideo.title}
                </h1>
                {currentVideo.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    {currentVideo.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 xl:w-96 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5" />
                  Course Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                  {course?.courseContent?.map((chapter, idx) => (
                    <div key={idx} className="space-y-1">
                      <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 px-2">
                        Chapter {idx + 1}:{" "}
                        {chapter.chapter?.chapterName || `Chapter ${idx + 1}`}
                      </h3>
                      <div className="space-y-1 ml-2 pl-3 border-l border-gray-200 dark:border-gray-700">
                        {chapter.topics?.map((topic, topicIdx) => {
                          const isActive =
                            parseInt(chapterId) === idx + 1 &&
                            parseInt(topicId) === topicIdx + 1;
                          const topicTitle =
                            typeof topic === "string"
                              ? topic.split(" [")[0]
                              : topic.topic;

                          return (
                            <Button
                              key={topicIdx}
                              variant={isActive ? "secondary" : "ghost"}
                              className={`w-full justify-start font-normal text-sm ${
                                isActive ? "bg-accent" : ""
                              }`}
                              onClick={() => {
                                router.push(
                                  `/workspace/learn/${courseId}/${idx + 1}/${
                                    topicIdx + 1
                                  }`
                                );
                              }}
                            >
                              <div className="flex items-center">
                                <Play className="h-3.5 w-3.5 mr-2 text-gray-500 dark:text-gray-400" />
                                <span className="truncate">{topicTitle}</span>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Videos */}
            {relatedVideos.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Related Videos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {relatedVideos.map((video, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setCurrentVideo({
                          id: video.videoId,
                          title: video.title,
                          description: video.description,
                        });
                      }}
                    >
                      <div className="relative w-24 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium leading-tight line-clamp-2 text-gray-800 dark:text-gray-200">
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {video.channelTitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}