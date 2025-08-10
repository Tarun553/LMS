"use client";

import { Sidebar } from '@/components/sidebar'
import React from 'react'
import { usePathname } from 'next/navigation'

const WorkSpaceProvider = ({children}) => {
  const pathname = usePathname()
  
  // Check if we're on the main workspace page
  const isMainWorkspacePage = pathname === '/workspace'
  
  // If we're on the main workspace page, show sidebar with content
  // If we're on other pages (like edit-course), show sidebar without main content
  if (isMainWorkspacePage) {
    return <Sidebar showMainContent={true} />
  }
  
  // For other pages, show sidebar without main content + the page content
  return (
    <div className="flex h-screen">
      <Sidebar showMainContent={false} />
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  )
}

export default WorkSpaceProvider