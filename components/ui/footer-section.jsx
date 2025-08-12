"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Facebook,
  Instagram,
  Linkedin,
  Moon,
  Send,
  Sun,
  Twitter,
} from "lucide-react";

function Footerdemo() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <footer className="relative mt-10 border-t text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <h2 className="mb-3 text-2xl font-bold tracking-tight">
              Get In Touch
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Have questions or feedback? Send us a message.
            </p>
            <form  action="https://getform.io/f/ayvevveb" method="POST" className="space-y-2 ">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="h-10 w-full rounded-md border border-gray-300 bg-white/50 px-3 py-2 text-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="h-10 w-full rounded-md border border-gray-300 bg-white/50 px-3 py-2 text-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="subject" className="text-xs font-medium">
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="How can we help you?"
                  className="h-10 w-full rounded-md border border-gray-300 bg-white/50 px-3 py-2 text-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="message" className="text-xs font-medium">
                  Message
                </Label>
                <textarea
                  id="message"
                  rows="3"
                  placeholder="Type your message here..."
                  className="w-full rounded-md border border-gray-300 bg-white/50 p-3 text-sm backdrop-blur-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800/50"
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-md transition-colors"
              >
                Send Message
                <Send className="ml-2 h-3.5 w-3.5" />
              </Button>
            </form>
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/10 blur-xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <a
                href="#"
                className="block transition-colors hover:text-primary"
              >
                Home
              </a>
              <a
                href="#"
                className="block transition-colors hover:text-primary"
              >
                About Us
              </a>
              <a
                href="#"
                className="block transition-colors hover:text-primary"
              >
                Services
              </a>
              <a
                href="#"
                className="block transition-colors hover:text-primary"
              >
                Products
              </a>
              <a
                href="#"
                className="block transition-colors hover:text-primary"
              >
                Contact
              </a>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic">
              <p>123 Innovation Street</p>
              <p>Tech City, TC 12345</p>
              <p>Phone: (123) 456-7890</p>
              <p>Email: hello@example.com</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {/* <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              <Moon className="h-4 w-4" />
              <Label htmlFor="dark-mode" className="sr-only">
                Toggle dark mode
              </Label>
            </div> */}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            2024 Your Company. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Cookie Settings
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export { Footerdemo };
