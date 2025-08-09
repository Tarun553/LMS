"use client";

import { useState } from "react";
import { Plus, X, Upload, XCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import axios from "axios";
import {v4 as uuidv4} from "uuid"
import { useRouter } from "next/navigation";

export function CourseFormDialog({ onCourseCreate, isOpen, onOpenChange, children }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "beginner",
    chapters: 1,
    includeVideo: false,
    targetAudience: "",
    thumbnail: null,
    thumbnailPreview: "",
  });

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      const courseId = uuidv4();
      const courseData = {
        courseId: courseId,
        title: course.title,
        description: course.description,
        category: course.category,
        difficulty: course.difficulty,
        includeVideo: course.includeVideo,
        chapters: course.chapters,
        targetAudience: course.targetAudience,
        thumbnail: course.thumbnail,
      };
  
      // Call the API endpoint using Axios
      const response = await axios.post(
        "/api/generateCourseLayout",
        courseData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      // Log the response for debugging
      console.log('API Response:', response.data);
      
      // Ensure we have a courseId before navigating
      if (!response.data?.courseId) {
        throw new Error('No courseId received from the server');
      }
  
      // Call the parent component's callback with the generated content
      onCourseCreate({
        ...courseData,
        generatedContent: response.data,
      });
  
      // Show success message
      alert("Course generated successfully!");
  
      // Navigate to the edit course page
      const newCourseId = response.data.courseId;
      console.log('Navigating to course:', newCourseId);
      window.location.href = `/workspace/edit-course/${newCourseId}`;
  
      // Reset form
      setCourse({
        title: "",
        description: "",
        category: "",
        difficulty: "beginner",
        chapters: 1,
        includeVideo: false,
        targetAudience: "",
        thumbnail: null,
        thumbnailPreview: "",
      });
  
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert(error.message || "Failed to create course. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourse({
        ...course,
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file),
      });
    }
  };

  const removeThumbnail = () => {
    setCourse({
      ...course,
      thumbnail: null,
      thumbnailPreview: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Course
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Course
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to create your new course. All fields are
            required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Course Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Course Title
            </Label>
            <Input
              id="title"
              placeholder="e.g. Introduction to Web Development"
              value={course.title}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
              required
            />
          </div>

          {/* Course Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Course Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what students will learn in this course"
              rows={3}
              value={course.description}
              onChange={(e) =>
                setCourse({ ...course, description: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={course.category}
                onChange={(e) =>
                  setCourse({ ...course, category: e.target.value })
                }
                required
              >
                <option value="">Select a category</option>
                <option value="web">Web Development</option>
                <option value="mobile">Mobile Development</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
                <option value="data-science">Data Science</option>
                <option value="programming">Programming</option>
                <option value="photography">Photography</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-sm font-medium">
                Difficulty Level
              </Label>
              <select
                id="difficulty"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={course.difficulty}
                onChange={(e) =>
                  setCourse({ ...course, difficulty: e.target.value })
                }
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Number of Chapters */}
            <div className="space-y-2">
              <Label htmlFor="chapters" className="text-sm font-medium">
                Number of Chapters
              </Label>
              <Input
                id="chapters"
                type="number"
                min="1"
                max="50"
                value={course.chapters}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    chapters: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full"
                required
              />
            </div>

            {/* Include Video */}
            <div className="space-y-2 flex items-center justify-start pt-6">
              <Checkbox
                id="includeVideo"
                checked={course.includeVideo}
                onCheckedChange={(checked) =>
                  setCourse({ ...course, includeVideo: checked })
                }
                className="h-5 w-5 rounded"
              />
              <Label
                htmlFor="includeVideo"
                className="text-sm font-medium ml-2 cursor-pointer"
              >
                Include Video Content
              </Label>
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <Label htmlFor="targetAudience" className="text-sm font-medium">
              Target Audience
            </Label>
            <Input
              id="targetAudience"
              placeholder="e.g. Beginners with no prior experience"
              value={course.targetAudience}
              onChange={(e) =>
                setCourse({ ...course, targetAudience: e.target.value })
              }
              required
            />
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="text-sm font-medium">
              Course Thumbnail (Optional)
            </Label>
            {course.thumbnailPreview ? (
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={course.thumbnailPreview}
                  alt="Course thumbnail"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <XCircle className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="thumbnail-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-6 h-6 mb-2 text-gray-500" />
                  <p className="mb-1 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG (MAX. 2MB)</p>
                </div>
                <input
                  id="thumbnail-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
              </label>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6"
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 px-6"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Course"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
