import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Scale, Shield, MessageCircle, User, Home, Briefcase, FileText, Settings, Menu, X, FileSearch } from 'lucide-react'

const Navigation = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/auth', icon: Shield, label: 'Credentials' },
    { path: '/dashboard', icon: Briefcase, label: 'Dashboard' },
    { path: '/matching', icon: Scale, label: 'Case Matching' },
    { path: '/document-analysis', icon: FileSearch, label: 'AI Analysis' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/chat', icon: MessageCircle, label: 'Communications' },
    { path: '/privacy', icon: FileText, label: 'Compliance' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0 mr-4">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-amber-600 rounded-lg flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">LegalMatch</span>
              <span className="text-xs text-gray-500 -mt-1 hidden sm:block">Confidential legal case matching</span>
            </div>
          </Link>

          {/* Desktop Navigation Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Tablet Navigation Items */}
          <div className="hidden md:flex lg:hidden items-center space-x-1">
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden xl:block">{item.label}</span>
                </Link>
              )
            })}
            
            {/* More menu for remaining items */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-2 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <Menu className="w-3.5 h-3.5" />
                <span>More</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {navItems.slice(6).map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 ${
                        isActive ? 'text-blue-700 bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <div className="grid grid-cols-2 gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
