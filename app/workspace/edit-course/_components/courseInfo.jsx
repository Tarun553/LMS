import React from 'react'

const CourseInfo = ({course}) => {
const courseLayout = course?.courseJson?.course;
  
  return (
    <div>
      <div>
        <h1>{courseLayout?.title}</h1>
      </div>
    </div>
  )
}

export default CourseInfo