
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, Zap, User, Crown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';
import { Badge } from '@/components/ui/badge';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavigationProps {
  className?: string;
}

export const Navigation = ({ className }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { isPremium } = usePremium();

  return (
    <nav className={cn(
      'relative z-50 border-b border-border',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center border-2 border-blue-button shadow-sm">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <span className="text-xl font-bold text-foreground tracking-wide">
              ToolsHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            <Link to="/tools" onClick={() => window.scrollTo(0, 0)} className="text-foreground hover:text-primary transition-colors">
              Tools
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-orange-500 transition-colors">
              Pricing
            </Link>
            <Link to="/contact-us" className="text-foreground hover:text-primary transition-colors">
              Contact Us
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <Link to="/profile" className="flex items-center space-x-2 group">
                <User className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  {profile?.username || 'Profile'}
                </span>
              </Link>
            ) : (
              <Link to="/auth" className="text-foreground hover:text-primary">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground hover:text-primary"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Mobile Menu */}
          <div
            className={`md:hidden ${
              isOpen
                ? 'fixed inset-0 bg-black bg-opacity-50 z-40'
                : 'hidden'
            }`}
          >
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background border-l border-border overflow-y-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <Link to="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-foreground">ToolHub</span>
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-foreground hover:text-primary"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="space-y-2">
                  <Link
                    to="/tools"
                    className="block text-foreground hover:text-primary transition-colors"
                    onClick={() => {setIsOpen(false); window.scrollTo(0, 0);}}
                  >
                    Tools
                  </Link>
                  <Link
                    to="/pricing"
                    className="block text-foreground hover:text-orange-500 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/contact-us"
                    className="block text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact Us
                  </Link>
                </nav>

                <div className="mt-4">
                  <ThemeToggle className="mb-4" />
                  {user ? (
                    <Link
                      to="/profile"
                      className="block text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm">{profile?.username || 'Profile'}</span>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      to="/auth"
                      className="text-foreground hover:text-primary"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
