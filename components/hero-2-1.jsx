"use client";

import { useState } from "react";
import { ArrowRight, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import Earth from "./ui/globe";
import { Button } from "./ui/button";
import Link from "next/link";

const Hero2 = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoaded, isSignedIn } = useUser();

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Gradient background with grain effect */}
      <div className="flex flex-col items-end absolute -right-60 -top-10 blur-xl z-0 ">
        <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-purple-600 to-sky-600"></div>
        <div className="h-[10rem] rounded-full w-[90rem] z-1 bg-gradient-to-b blur-[6rem] from-pink-900 to-yellow-400"></div>
        <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-yellow-600 to-sky-500"></div>
      </div>
      <div className="absolute inset-0 z-0 bg-noise opacity-30"></div>
      {/* Content container */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto flex items-center justify-between px-4 py-4 mt-6">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
              <span className="font-bold">⚡</span>
            </div>
            <span className="ml-2 text-xl font-bold text-white">LMS</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              <NavItem label="Use Cases" hasDropdown />
              <NavItem label="Products" hasDropdown />
              <NavItem label="Resources" hasDropdown />
              <NavItem label="Pricing" />
            </div>
            <div className="flex items-center space-x-3">
              {isLoaded &&
                (isSignedIn ? (
                  <UserButton afterSignOutUrl="/" />
                ) : (
                  <SignInButton mode="modal">
                    <Button className="h-12 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90">
                      Sign In
                    </Button>
                  </SignInButton>
                ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <Button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </Button>
        </nav>

        {/* Mobile Navigation Menu with animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex flex-col p-4 bg-black/95 md:hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                    <span className="font-bold">⚡</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-white">LMS</span>
                </div>
                <Button onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-6 w-6 text-white" />
                </Button>
              </div>
              <div className="mt-8 flex flex-col space-y-6">
                <MobileNavItem label="Use Cases" />
                <MobileNavItem label="Products" />
                <MobileNavItem label="Resources" />
                <MobileNavItem label="Pricing" />
                <div className="pt-4">
                  {isLoaded &&
                    (isSignedIn ? (
                      <div className="flex items-center justify-between">
                        <UserButton afterSignOutUrl="/" />
                        <span className="text-white ml-2">My Account</span>
                      </div>
                    ) : (
                      <SignInButton mode="modal">
                        <Button className="w-full justify-start border border-gray-700 text-white p-2 rounded">
                          Sign In
                        </Button>
                      </SignInButton>
                    ))}
                </div>
                <Button className="h-12 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90">
                  Get Started For Free
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge */}
        <div className="mx-auto mt-6 flex max-w-fit items-center justify-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
          <span className="text-sm font-medium text-white">Powered By AI</span>
          <ArrowRight className="h-4 w-4 text-white" />
        </div>

        {/* Hero section with Earth component */}
        <div className="container mx-auto flex flex-col items-center px-4 pt-12 md:flex-row md:items-start md:justify-between">
          {/* Left side - Hero content */}
          <div className="w-full md:w-1/2 lg:pr-8">
            <h1 className="text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            Smarter Learning,<br /> Smarter Pricing
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gray-300">
              Generate comprehensive, structured courses on any topic instantly
              with AI. Start learning the smart way with personalized,
              step-by-step guidance.
            </p>
            <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link href="/workspace">
              <Button className="h-12 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90">
              Get Started For Free
              </Button>
              </Link>
              <Button className="h-12 rounded-full border border-gray-600 px-8 text-base font-medium text-white hover:bg-white/10">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right side - Globe */}
          <div className="mt-12 w-full md:mt-0 md:w-1/2">
            <Earth
              className="h-full w-full"
              baseColor={[1, 0, 0.3]}
              markerColor={[1, 0, 0.33]}
              glowColor={[1, 0, 0.3]}
            />
          </div>
        </div>

        <div className="relative mx-auto my-20 w-full max-w-6xl">
          <div className="absolute inset-0 rounded shadow-lg bg-white blur-[10rem] bg-grainy opacity-20" />

          {/* Hero Image */}
          <img
            src="./dashboard.png"
            alt="Hero Image"
            className="relative w-full h-auto shadow-md grayscale-100 rounded"
          />
        </div>
      </div>
    </div>
  );
};

function NavItem({ label, hasDropdown }) {
  return (
    <div className="flex items-center text-sm text-gray-300 hover:text-white">
      <span>{label}</span>
      {hasDropdown && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-1"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      )}
    </div>
  );
}

function MobileNavItem({ label }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-800 pb-2 text-lg text-white">
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 text-gray-400" />
    </div>
  );
}

export { Hero2 };
