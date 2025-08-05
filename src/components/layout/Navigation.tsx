import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Users, Phone, UserCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import logo from '../../assets/logo.png';

export function Navigation() {
  const location = useLocation();
  const isB2B = location.pathname.startsWith('/b2b');

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Interface Toggle */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {/* B2C Tab - Disabled */}
            <div
              className={cn(
                "flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-not-allowed opacity-50",
                !isB2B 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground"
              )}
              title="B2C functionality coming soon"
            >
              <Users className="h-4 w-4" />
              <span>B2C</span>
            </div>
            <Link
              to="/b2b/calls"
              className={cn(
                "flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors",
                isB2B 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Building2 className="h-4 w-4" />
              <span>B2B</span>
            </Link>
          </div>

          {/* Center - Logo Only */}
          <div className="flex items-center justify-center flex-1">
            <img 
              src={logo} 
              alt="ClubExec CRM Logo" 
              className="h-10 w-auto"
            />
          </div>

          {/* Right side - Navigation Links */}
          <div className="flex items-center space-x-4">
            {isB2B ? (
              <>
                <Link
                  to="/b2b/calls"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === '/b2b/calls'
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Phone className="h-4 w-4" />
                  <span>Calls</span>
                </Link>
                <Link
                  to="/b2b/contacts"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === '/b2b/contacts'
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Contacts</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/b2c/calls"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === '/b2c/calls'
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Phone className="h-4 w-4" />
                  <span>Calls</span>
                </Link>
                <Link
                  to="/b2c/contacts"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === '/b2c/contacts'
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Contacts</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 