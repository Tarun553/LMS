import React from 'react'
import { Brain } from 'lucide-react'
import { Button } from './ui/button'

const Navbar = () => {
  return (
    <div>
          <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">LearnAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
              <Button variant="outline" className="mr-2 bg-transparent">
                Sign In
              </Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar