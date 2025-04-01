
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Header() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userNavItems = [
    { label: "Dashboard", href: "/user/dashboard" },
    { label: "Record Feedback", href: "/user/record-feedback" },
    { label: "About Us", href: "/about" },
  ];

  const adminNavItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Feedback Requests", href: "/admin/feedback-requests" },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gradient">Swiggy</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated && (
            <>
              {navItems.map((item) => (
                <Button key={item.href} variant="ghost" asChild>
                  <Link to={item.href}>{item.label}</Link>
                </Button>
              ))}
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login/user">User Login</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/login/admin">Admin Login</Link>
              </Button>
              <Button variant="default" className="bg-orange-500 hover:bg-orange-600" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {isAuthenticated ? (
                  <>
                    <div className="mb-4 px-2">
                      <p className="text-sm text-muted-foreground">
                        Logged in as {user?.name} ({user?.role})
                      </p>
                    </div>
                    {navItems.map((item) => (
                      <Button
                        key={item.href}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => {
                          navigate(item.href);
                          setIsMenuOpen(false);
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        navigate("/login/user");
                        setIsMenuOpen(false);
                      }}
                    >
                      User Login
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        navigate("/login/admin");
                        setIsMenuOpen(false);
                      }}
                    >
                      Admin Login
                    </Button>
                    <Button
                      variant="default"
                      className="justify-start bg-orange-500 hover:bg-orange-600"
                      onClick={() => {
                        navigate("/register");
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
