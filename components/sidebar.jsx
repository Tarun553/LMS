"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  User,
  Settings,
  Bell,
  Grid,
  LogOut,
  Plus,
  Tablet,
  Compass,
  Scissors,
  Mail,
} from "lucide-react";
import { SignIn, SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog } from "./ui/dialog";
import { CourseFormDialog } from "./CourseFormDialog";
import { CourseList } from "./courseList";
import EnrollCourseList from "./EnrollCourseList";


const AnimatedMenuToggle = ({ toggle, isOpen }) => (
  <button
    onClick={toggle}
    aria-label="Toggle menu"
    className="focus:outline-none z-999"
  >
    <motion.div animate={{ y: isOpen ? 13 : 0 }} transition={{ duration: 0.3 }}>
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
        className="text-black"
      >
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 2.5 L 22 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 12 L 22 12", opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 21.5 L 22 21.5" },
            open: { d: "M 3 2.5 L 17 16.5" },
          }}
        />
      </motion.svg>
    </motion.div>
  </button>
);

const CollapsibleSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        className="w-full flex items-center justify-between py-2 px-4 rounded-xl hover:bg-gray-100"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold">{title}</span>
        {open ? <XIcon /> : <MenuIcon />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuIcon = () => (
  <motion.svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <motion.line x1="3" y1="12" x2="21" y2="12" />
  </motion.svg>
);

const XIcon = () => (
  <motion.svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <motion.line x1="18" y1="6" x2="6" y2="18" />
    <motion.line x1="6" y1="6" x2="18" y2="18" />
  </motion.svg>
);

const Sidebar = ({ showMainContent = true }) => {
  const [courseList, setCourseList] = useState([]);
  const { user, isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateCourse = (newCourse) => {
    setCourseList(prevCourses => [...prevCourses, {
      ...newCourse,
      generatedContent: typeof newCourse.generatedContent === 'string' 
        ? newCourse.generatedContent 
        : JSON.stringify(newCourse.generatedContent)
    }]);
  };

  const mobileSidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen">
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileSidebarVariants}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-50 bg-white text-black"
          >
            <div className="flex flex-col h-full">
              {/* Profile Section */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {isSignedIn ? <UserButton /> : <User className="h-6 w-6" />}
                  </div>
                  <div>
                    <p className="font-semibold">LMS</p>
                    <p className="text-sm text-gray-500">
                      {isSignedIn
                        ? user?.firstName ||
                          user?.emailAddresses[0]?.emailAddress
                        : "Guest"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Course List Section */}
              <div className="flex-1 overflow-y-auto">
                <CourseList
                  courses={courseList}
                  onNewCourse={() => setIsDialogOpen(true)}
                />
              </div>

              {/* Create Course Dialog */}
              <CourseFormDialog
                onCourseCreate={handleCreateCourse}
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
              />

              {/* Navigation Section */}
              <nav className="p-4 border-t border-gray-200">
                <ul className="space-y-2">
                  <li>
                    <Link href="/workspace">
                      <button className="flex gap-3 font-medium text-sm items-center w-full py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors">
                        <Grid className="h-5 w-5" />
                        Dashboard
                      </button>
                    </Link>
                  </li>
                  <li>
                    <button className="flex gap-3 font-medium text-sm items-center w-full py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors">
                      <Tablet className="h-5 w-5" />
                      My Learning
                    </button>
                  </li>
                  <li>
                    <button className="flex gap-3 font-medium text-sm items-center w-full py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors">
                      <Compass className="h-5 w-5" />
                      Explore Courses
                    </button>
                    </li>
                  <li>
                    <button className="flex gap-3 font-medium text-sm items-center w-full py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors">
                      <Scissors className="h-5 w-5" />
                      AI Tools
                    </button>
                  </li>
                  <li>
                    <button className="flex gap-3 font-medium text-sm items-center w-full py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors">
                      <Mail className="h-5 w-5" />
                      Billing
                    </button>
                  </li>
                  <li>
                    <button className="flex gap-3 font-medium text-sm items-center w-full py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors">
                      <User className="h-5 w-5" />
                      Profile
                    </button>
                  </li>
                </ul>
              </nav>
              
              {/* Footer / Action Button */}
              <div className="p-4 border-t border-gray-200">
                {isSignedIn ? (
                  <SignOutButton>
                    <button className="w-full font-medium text-sm p-2 text-center bg-red-100 rounded-xl hover:bg-red-200 flex items-center justify-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </SignOutButton>
                ) : (
                  <SignIn mode="modal">
                    <button className="w-full font-medium text-sm p-2 text-center bg-blue-100 rounded-xl hover:bg-blue-200">
                      Sign In
                    </button>
                  </SignIn>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed top-0 left-0 h-full w-64 bg-white text-black shadow">
        {/* Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              {isSignedIn ? <UserButton /> : <User className="h-6 w-6" />}
            </div>
            <div>
              <p className="font-semibold">LMS</p>
              <p className="text-sm text-gray-500">
                {isSignedIn
                  ? user?.firstName || user?.emailAddresses[0]?.emailAddress
                  : "Guest"}
              </p>
            </div>
          </div>
        </div>
        
        {/* Create New Course Button */}
        <div className="p-4">
          <CourseFormDialog onCourseCreate={handleCreateCourse} />
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <Link href="/workspace">
                <button className="flex gap-3 font-medium text-sm items-center w-full py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors">
                  <Grid className="h-5 w-5" />
                  Dashboard
                </button>
              </Link>
            </li>
            <li>
              <button className="flex gap-3 font-medium text-sm items-center w-full py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors">
                <Tablet className="h-5 w-5" />
                My Learning
              </button>
            </li>
            <li>
              <button className="flex gap-3 font-medium text-sm items-center w-full py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors">
                <Compass className="h-5 w-5" />
                Explore Courses
              </button>
            </li>
            <li>
              <button className="flex gap-3 font-medium text-sm items-center w-full py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors">
                <Scissors className="h-5 w-5" />
                AI Tools
              </button>
            </li>
            <li>
              <button className="flex gap-3 font-medium text-sm items-center w-full py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors">
                <Mail className="h-5 w-5" />
                Billing
              </button>
            </li>
            <li>
              <button className="flex gap-3 font-medium text-sm items-center w-full py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors">
                <User className="h-5 w-5" />
                Profile
              </button>
            </li>
          </ul>
        </nav>
        
        {/* Footer / Action Button */}
        <div className="p-4 border-t border-gray-200">
          {isSignedIn ? (
            <SignOutButton>
              <button className="w-full font-medium text-sm p-2 text-center bg-red-100 rounded-xl hover:bg-red-200 flex items-center justify-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </SignOutButton>
          ) : (
            <SignIn mode="modal">
              <button className="w-full font-medium text-sm p-2 text-center bg-blue-100 rounded-xl hover:bg-blue-200">
                Sign In
              </button>
            </SignIn>
          )}
        </div>
      </div>
      
      {/* Main Content Area - Only show if showMainContent is true */}
      {showMainContent && (
        <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
          {/* Top bar for mobile toggle */}
          <div className="p-4 bg-gray-100 border-b border-gray-200 md:hidden flex justify-between items-center">
            <h1 className="text-xl font-bold">Workspace</h1>
            <AnimatedMenuToggle toggle={toggleSidebar} isOpen={isOpen} />
          </div>
          
          <div className="p-6 m-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500">
            <h1 className="text-2xl text-white font-bold">
              Welcome to online learning platform
            </h1>
            <p className="text-sm text-white font-medium">
              Learn Create And Explore Your Favourite Courses
            </p>
          </div>
          
          {/* course list */}
          <EnrollCourseList />
          <CourseList courses={courseList} />
         
        </div>
      )}
      
      {/* Mobile toggle button - Only show if main content is not shown */}
      {!showMainContent && (
        <div className="md:hidden fixed top-4 left-4 z-40">
          <AnimatedMenuToggle toggle={toggleSidebar} isOpen={isOpen} />
        </div>
      )}
    </div>
  );
};

export { Sidebar };                                                                                                                                 