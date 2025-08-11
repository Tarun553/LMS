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
  Play,
  Pause,
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
  const [isPlaying, setIsPlaying] = useState(true);
  const playerRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const [showControls, setShowControls] = useState(true);

  const validateVideoId = (id) => /^[a-zA-Z0-9_-]{11}$/.test(id);

  useEffect(() => {
    if (!videoId) {
      setError("No video ID provided");
      return;
    }
    setIsLoaded(false);
    setError(null);
    setIsPlaying(true);

    if (!validateVideoId(videoId)) {
      setError("Invalid video ID format.");
      setIsLoaded(true);
      return;
    }

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setShowControls(true);
      resetControlsTimeout();
    };

    const handleKeyDown = (e) => {
      // Toggle fullscreen with 'F' key
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleFullscreen();
      }
      // Close with Escape key
      else if (e.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(console.error);
        } else {
          handleClose();
        }
      }
      // Toggle play/pause with space/enter
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        togglePlayPause();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      playerRef.current?.destroy?.();
      clearTimeout(hideTimeoutRef.current);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [videoId]);

  const initPlayer = () => {
    if (!window.YT) return;

    playerRef.current = new window.YT.Player("youtube-player", {
      videoId,
      playerVars: {
        autoplay: 1,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          setIsLoaded(true);
          setTimeout(() => playerRef.current?.playVideo?.(), 500);
        },
        onError: () => setError("Failed to load video."),
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
          } else if (event.data === window.YT.PlayerState.ENDED && hasNext) {
            onNext?.();
          }
        },
      },
    });
  };

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
    setShowControls(true);
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const toggleFullscreen = () => {
    const playerElement =
      document.getElementById("youtube-player")?.parentElement;
    if (!playerElement) return;

    try {
      if (!document.fullscreenElement) {
        if (playerElement.requestFullscreen) {
          playerElement.requestFullscreen();
        } else if (playerElement.webkitRequestFullscreen) {
          /* Safari */
          playerElement.webkitRequestFullscreen();
        } else if (playerElement.msRequestFullscreen) {
          /* IE11 */
          playerElement.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          /* Safari */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          /* IE11 */
          document.msExitFullscreen();
        }
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
      setError("Failed to toggle fullscreen mode.");
    }

    setShowControls(true);
    resetControlsTimeout();
  };

  const handleClose = () => {
    // Exit fullscreen first if in fullscreen mode
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    }

    // Pause video if playing
    if (playerRef.current?.getPlayerState) {
      const state = playerRef.current.getPlayerState();
      if (state === window.YT.PlayerState.PLAYING) {
        playerRef.current.pauseVideo();
      }
    }

    // Call the onClose callback
    onClose?.();
  };

  const resetControlsTimeout = () => {
    setShowControls(true);
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <div
      className="relative w-full bg-black rounded-xl overflow-hidden aspect-video"
      onMouseMove={resetControlsTimeout}
      onTouchStart={resetControlsTimeout}
    >
      <div id="youtube-player" className="w-full h-full" />

      {!isLoaded && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
          <Loader2 className="w-10 h-10 animate-spin text-white" />
          <p className="mt-3 text-white text-sm sm:text-base">
            Loading video...
          </p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-4">
          <p className="text-red-400 mb-4 text-sm sm:text-base text-center">
            {error}
          </p>
          <Button
            variant="outline"
            onClick={() => location.reload()}
            className="text-white border-white/30 hover:bg-white/10"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Overlay Controls */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        } flex flex-col justify-between`}
        style={{ pointerEvents: showControls ? "auto" : "none" }}
      >
        {/* Top bar */}
        <div className="w-full flex justify-between items-center p-3 sm:p-4 bg-gradient-to-b from-black/70 to-transparent">
          <h2 className="text-white font-semibold text-sm sm:text-base md:text-lg truncate max-w-[60%]">
            {title}
          </h2>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20 w-12 h-12"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20 w-12 h-12"
              onClick={handleClose}
              aria-label="Close video"
            >
              <X size={24} />
            </Button>
          </div>
        </div>

        {/* Center Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20 w-14 h-14"
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center px-3 sm:px-4 pb-4">
          {hasPrevious && (
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20 w-12 h-12"
              onClick={onPrevious}
              aria-label="Previous video"
            >
              <ChevronLeft size={28} />
            </Button>
          )}
          <div className="flex-1" /> {/* Spacer */}
          {hasNext && (
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20 w-12 h-12"
              onClick={onNext}
              aria-label="Next video"
            >
              <ChevronRight size={28} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
