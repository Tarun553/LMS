import { NextResponse } from "next/server";
import { ai } from "../generateCourseLayout/route";
import axios from "axios";
import { db } from "@/config/db";
import { courseTabel } from "@/config/schema";
import { eq } from "drizzle-orm";

const PROMPT = `You are an expert course content creator. 
Generate detailed educational content for each topic in the following chapter. 
The content should be in HTML format and cover the topic comprehensively.

Chapter: {chapterName}
Topic: {topicName}

Please provide the content in the following JSON format:
{
  "chapterName": "Name of the chapter",
  "topic": "Name of the topic",
  "content": "<h2>Detailed Content</h2><p>Comprehensive educational content in HTML format...</p>"
}`;

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const getYoutubeVideos = async (topic) => {
  console.log(`[YouTube] Searching for videos on topic: "${topic}"`);
  try {
    const params = {
      part: "snippet",
      q: topic,
      maxResults: 4,
      type: "video",
      key: process.env.YOUTUBE_API_KEY,
    };

    console.log(
      "[YouTube] Making API request with params:",
      JSON.stringify(params, null, 2)
    );
    const response = await axios.get(`${YOUTUBE_BASE_URL}`, { params });

    console.log(
      `[YouTube] Received ${response.data.items?.length || 0} results`
    );

    // Extract only the useful parts from the response
    const videos = (response.data.items || []).map((item) => {
      const video = {
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail:
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      };
      console.log(`[YouTube] Found video: ${video.title} (${video.videoId})`);
      return video;
    });

    console.log(`[YouTube] Returning ${videos.length} processed videos`);
    return videos;
  } catch (error) {
    console.error("[YouTube] Error fetching videos:", {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return [];
  }
};

export async function POST(req) {
  try {
    const { course, courseId, courseJson } = await req.json();

    // Extract chapters from the course data
    const chapters = courseJson?.chapters || course?.chapters || [];

    if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
      return NextResponse.json(
        { error: "No chapters found in course data" },
        { status: 400 }
      );
    }

    // Process each chapter and its topics
    const chapterPromises = chapters.map(async (chapter) => {
      const topics = chapter.topics || [];
      if (!topics.length) return { chapter, topics: [] };

      // Get the correct chapter name from your database structure
      const chapterName =
        chapter.chapterName ||
        chapter.title ||
        chapter.name ||
        "Untitled Chapter";
      console.log(`[Processing] Chapter: "${chapterName}"`);

      // Get YouTube videos for this chapter
      const youtubeVideos = await getYoutubeVideos(chapterName);

      // Process each topic in the chapter
      const topicPromises = topics.map(async (topic, topicIndex) => {
        try {
          // Handle both string topics and object topics
          const topicName =
            typeof topic === "string"
              ? topic
              : topic.title || topic.name || `Topic ${topicIndex + 1}`;
          console.log(
            `[Processing] Topic: "${topicName}" in chapter "${chapterName}"`
          );

          const prompt = PROMPT.replace("{chapterName}", chapterName).replace(
            "{topicName}",
            topicName
          );

          const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          });

          const responseText =
            response.candidates?.[0]?.content?.parts?.[0]?.text || "";

          try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const content = jsonMatch
              ? JSON.parse(jsonMatch[0])
              : JSON.parse(responseText);
            return {
              ...content,
              chapterName, // Ensure we use the correct chapter name
              topic: topicName, // Ensure we use the correct topic name
              youtubeVideos, // Add YouTube videos to each topic
            };
          } catch (parseError) {
            console.error("Error parsing response:", parseError);
            return {
              chapterName,
              topic: topicName,
              content: `<p>Error generating content: ${parseError.message}</p>`,
              error: true,
              youtubeVideos,
            };
          }
        } catch (error) {
          const topicName =
            typeof topic === "string"
              ? topic
              : topic.title || topic.name || "Untitled Topic";
          console.error(
            "Error generating content for topic:",
            topicName,
            error
          );
          return {
            chapterName,
            topic: topicName,
            content: `<p>Error: Failed to generate content for this topic.</p>`,
            error: true,
            youtubeVideos,
          };
        }
      });

      const topicsData = await Promise.all(topicPromises);
      return {
        chapter: {
          ...chapter,
          chapterName, // Ensure the chapter object has the correct name
        },
        topics: topicsData,
        youtubeVideos,
      };
    });

    const chapterResults = await Promise.all(chapterPromises);

    // Save to database
    try {
      const dbResponse = await db
        .update(courseTabel)
        .set({
          courseContent: JSON.stringify(chapterResults),
          updatedAt: new Date(),
        })
        .where(eq(courseTabel.cid, courseId));

      console.log("Database update response:", dbResponse);
      console.log("Successfully updated course content in database");
    } catch (dbError) {
      console.error("Database save error:", {
        message: dbError.message,
        code: dbError.code,
        detail: dbError.detail,
      });
    }

    // Flatten the results for backward compatibility
    const flattenedResults = chapterResults.flatMap((chapterData) =>
      chapterData.topics.map((topic) => ({
        ...topic,
        chapterName: topic.chapterName || chapterData.chapter.chapterName,
      }))
    );

    return NextResponse.json({
      success: true,
      data: {
        topics: flattenedResults,
        chapters: chapterResults.map((ch) => ({
          ...ch.chapter,
          youtubeVideos: ch.youtubeVideos,
        })),
      },
      courseId,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in generate-course-content:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate course content",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
