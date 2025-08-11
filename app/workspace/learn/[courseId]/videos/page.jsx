"use client";
import { useSearchParams } from "next/navigation";

export default function RelatedVideosPage() {
  const searchParams = useSearchParams();
  const videos = JSON.parse(searchParams.get("data") || "[]");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Related Videos</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {videos.map((video, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-900 rounded-lg shadow p-4"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="rounded-lg mb-3 w-full object-cover"
            />
            <h2 className="font-semibold">{video.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {video.description}
            </p>
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium mt-2 inline-block"
            >
              Watch on YouTube
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
