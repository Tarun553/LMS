'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, BookOpen, BarChart2, Users, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import CourseInfo from '../_components/courseInfo';

export default function EditCoursePage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCourseInfo = async () => {
      try {
        const response = await axios.get(`/api/courses?courseId=${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getCourseInfo();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">Course not found</h2>
        <Button 
          onClick={() => router.push('/workspace')} 
          className="mt-4"
          variant="outline"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
   <div>
      <CourseInfo course={course}/>
   </div>
  );
}