import { Sidebar } from '@/components/sidebar'
import React from 'react'


const WorkSpaceProvider = ({children}) => {
  return (
    <div>
      <Sidebar/>
      {children}
      </div>
  )
}

export default WorkSpaceProvider