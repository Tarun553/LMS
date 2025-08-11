"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  X,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

export default function VideoPlayer({
  videoId,
  title,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const validateVideoId = (id) => {
    if (!id) return false;
    // Basic validation for YouTube video IDs (11 alphanumeric characters)
    return /^[a-zA-Z0-9_-]{11}$/.test(id);
  };

  // Initialize YouTube Player API
  useEffect(() => {
    if (!videoId) {
      setError("No video ID provided");
      return;
    }

    // Reset states when videoId changes
    setIsLoaded(false);
    setError(null);

    // Validate video ID format
    if (!validateVideoId(videoId)) {
      console.error("Invalid YouTube video ID format:", videoId);
      setError("Invalid video ID format. Please check the video reference.");
      setIsLoaded(true);
      return;
    }

    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    // Cleanup function
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error("Error destroying YouTube player:", e);
        }
        playerRef.current = null;
      }
      clearTimeout(hideTimeoutRef.current);
    };
  }, [videoId]);

  const initializePlayer = () => {
    if (!videoId || !window.YT) return;

    try {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
          playsinline: 1,
          origin: window.location.origin,
          enablejsapi: 1,
          fs: 1, // Enable fullscreen button
          controls: 1, // Show controls
          disablekb: 0, // Enable keyboard controls
          iv_load_policy: 3, // Hide annotations
          cc_load_policy: 0, // Hide captions by default
        },
        events: {
          onReady: (event) => {
            console.log("YouTube player ready");
            setIsLoaded(true);
            // Set a small delay to ensure the player is fully ready
            setTimeout(() => {
              try {
                event.target.playVideo();
              } catch (e) {
                console.error("Error playing video:", e);
                setError("Error starting video playback. Please try again.");
              }
            }, 500);
          },
          onError: (event) => {
            console.error("YouTube Player Error:", event.data);
            let errorMessage = "Failed to load video. ";

            // More specific error messages based on error code
            switch (event.data) {
              case 2:
                errorMessage += "Invalid video ID.";
                break;
              case 5:
                errorMessage +=
                  "HTML5 player error. Please try refreshing the page.";
                break;
              case 100:
                errorMessage += "Video not found or private.";
                break;
              case 101:
              case 150:
                errorMessage +=
                  "Playback on other websites has been disabled by the video owner.";
                break;
              default:
                errorMessage += "Please try again later.";
            }

            setError(errorMessage);
            setIsLoaded(true);
          },
          onStateChange: (event) => {
            // Handle player state changes
            if (event.data === window.YT.PlayerState.ENDED && hasNext) {
              onNext?.();
            }
          },
        },
      });
    } catch (err) {
      console.error("Error initializing YouTube player:", err);
      setError(
        "Failed to initialize video player. Please try refreshing the page."
      );
      setIsLoaded(true);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Auto-hide controls after 3 seconds of inactivity
  const resetHideTimeout = () => {
    setShowControls(true);
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const [showControls, setShowControls] = useState(true);

  // Set up event listeners for controls
  useEffect(() => {
    const container = document.querySelector(".video-player-container");
    if (!container) return;

    container.addEventListener("mousemove", resetHideTimeout);
    container.addEventListener("touchstart", resetHideTimeout);

    return () => {
      container.removeEventListener("mousemove", resetHideTimeout);
      container.removeEventListener("touchstart", resetHideTimeout);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-gray-900 flex items-center justify-center text-white">
        <p>No video available</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full bg-black rounded-xl overflow-hidden aspect-video video-player-container"
      onMouseMove={resetHideTimeout}
      onTouchStart={resetHideTimeout}
    >
      {/* YouTube Player Container */}
      <div id="youtube-player" className="w-full h-full"></div>

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <p className="text-white">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 p-4 text-center">
          <div>
            <p className="text-red-400 mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="text-white border-white hover:bg-white/10"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none",
        }}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center pointer-events-auto">
          <h2 className="text-white font-medium text-lg line-clamp-1 pr-4">
            {title}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            className={`text-white hover:bg-white/20 pointer-events-auto ${
              !hasPrevious ? "invisible" : ""
            }`}
            onClick={onPrevious}
            disabled={!hasPrevious}
          >
            <ChevronLeft size={32} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`text-white hover:bg-white/20 pointer-events-auto ${
              !hasNext ? "invisible" : ""
            }`}
            onClick={onNext}
            disabled={!hasNext}
          >
            <ChevronRight size={32} />
          </Button>
        </div>

        {/* Bottom Bar - Progress and Time */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
          <div className="h-1 bg-white/30 rounded-full mb-2">
            <div
              className="h-full bg-red-600 rounded-full"
              style={{ width: "0%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
