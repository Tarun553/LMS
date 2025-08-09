import React from 'react'

export const CourseList = ({ courses = [], onNewCourse }) => {
  return (
    <div className="p-4">
      {courses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No courses found</p>
          <button 
            onClick={onNewCourse}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
          >
            Create New Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div 
              key={course.courseId} 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {course.description || 'No description available'}
              </p>
              <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                <span className="capitalize">{course.difficulty}</span>
                <span>{course.chapters} chapters</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

