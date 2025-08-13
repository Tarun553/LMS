"use client";

import { useState } from "react";
import {
  ArrowRight,
  Menu,
  X,
  User,
  FileTextIcon,
  InputIcon,
  GlobeIcon,
  CalendarIcon,
  BellIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import Earth from "./ui/globe";
import { Button } from "./ui/button";
import Link from "next/link";
import ContactUs from "@/components/ContactUs";
import { BentoGrid, BentoCard } from "./ui/bento-grid";
import { Component } from "./ui/testimonial-slider";
import { Footerdemo } from "./ui/footer-section";

const Hero2 = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoaded, isSignedIn } = useUser();



  const testimonials = [
    {
      img: "https://i.pinimg.com/736x/be/18/09/be180986381f87edae21ce8ed731c416.jpg",
      quote:
        "This AI-powered LMS transformed the way I learn — lessons are interactive, personalized, and incredibly engaging!",
      name: "Bhura",
      role: "Software Engineer, Acme LTD",
    },
    {
      img: "https://i.pinimg.com/1200x/e4/99/40/e49940ea4066c2b4163591f7b8549e05.jpg",
      quote:
        "Our training completion rate doubled after switching to this AI LMS. The adaptive learning paths are a game changer.",
      name: "Suresh",
      role: "Learning Manager, Malika Inc.",
    },
    {
      img: "https://i.pinimg.com/1200x/48/6b/0a/486b0abdfc45c8a972bcea741f0b06bd.jpg",
      quote:
        "The AI tutor feels like a real instructor — answering questions instantly and tracking my progress effortlessly.",
      name: "Ramesh",
      role: "Data Analyst, Panda AI",
    },
  ];


  const features = [
    {
      Icon: FileTextIcon,
      name: "Interactive Courses",
      description:
        "Engage with interactive course materials and track your progress.",
      href: "/courses",
      cta: "Browse courses",
      background: (
        <img
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="Interactive learning"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
      ),
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: InputIcon,
      name: "Expert Instructors",
      description:
        "Learn from industry professionals and subject matter experts.",
      href: "/instructors",
      cta: "Meet instructors",
      background: (
        <img
          src="https://images.unsplash.com/photo-1541178735493-479c1a27ed24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="Expert instructors"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
      ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: GlobeIcon,
      name: "Learn Anywhere",
      description: "Access your courses on any device, anytime, anywhere.",
      href: "/mobile",
      cta: "Get the app",
      background: (
        <img
          src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="Learn anywhere"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
      ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: CalendarIcon,
      name: "Track Progress",
      description: "Monitor your learning journey and set personal goals.",
      href: "/dashboard",
      cta: "View dashboard",
      background: (
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="Track progress"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
      ),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: BellIcon,
      name: "Stay Updated",
      description:
        "Get notified about new courses, deadlines, and important updates.",
      href: "/notifications",
      cta: "Manage notifications",
      background: (
        <img
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="Stay updated"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
      ),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ];

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
              Smarter Learning,
              <br /> Smarter Pricing
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
        {/* feature section */}
        <div>
        <motion.h1 className="text-5xl font-bold leading-tight text-center mb-8 text-white md:text-6xl lg:text-7xl" 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
        >
             Features
            </motion.h1>
          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>
        {/* testimonial section */}
        <div className="mt-20">
        <motion.h1 className="text-5xl font-bold leading-tight text-center mb-8 text-white md:text-6xl lg:text-7xl" 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
        >
            What Our Users Say's 
            </motion.h1>
          <Component testimonials={testimonials} />
        </div>
        {/* pricing */}
        {/* footer */}
      
        <div className="mt-15">
          <Footerdemo />
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
