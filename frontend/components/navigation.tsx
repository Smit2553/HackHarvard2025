"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  HashSquareIcon,
  HashSquareSolidIcon,
} from "@/components/icons/hash-square";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoginDialog } from "@/components/login";

interface User {
  email: string;
  name: string;
  avatar: string;
}

const DUMMY_USER: User = {
  email: "john.doe@example.com",
  name: "John Doe",
  avatar: "https://github.com/soradotwav.png",
};

const AUTH_STORAGE_KEY = "offscript_auth";

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      try {
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          if (authData.isLoggedIn && authData.user) {
            setIsLoggedIn(true);
            setUser(authData.user);
          }
        }
      } catch (error) {
        console.error("Failed to load auth state:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authData = {
        isLoggedIn,
        user,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    }
  }, [isLoggedIn, user]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleLogin = () => {
    setShowLoginDialog(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setUser(DUMMY_USER);
    setShowLoginDialog(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setMobileMenuOpen(false);
    router.push("/");
  };

  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  // Different nav items for logged in vs logged out
  const navigationItems = [
    { name: "Problems", path: "/practice/problems" },
    { name: "Companies", path: "/practice/companies" },
    { name: "Pricing", path: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 px-4 md:px-6 h-14 flex items-center justify-between flex-shrink-0 bg-background">
      <div className="flex items-center gap-4 md:gap-6">
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => handleNavigation(isLoggedIn ? "/dashboard" : "/")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleNavigation(isLoggedIn ? "/dashboard" : "/");
            }
          }}
        >
          <div className="relative w-6 h-6">
            <HashSquareIcon className="absolute inset-0 group-hover:opacity-0 transition-opacity" />
            <HashSquareSolidIcon className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-semibold text-base">Offscript</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => router.push(item.path)}
              className={`cursor-pointer text-sm transition-colors ${
                pathname === item.path
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="hidden md:flex items-center gap-3">
        {mounted && (
          <button
            type="button"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-md hover:bg-muted transition-colors flex items-center justify-center"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </button>
        )}

        {isLoggedIn && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/progress")}>
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>Progress</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <button
              type="button"
              onClick={handleLogin}
              className="cursor-pointer h-9 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted flex items-center"
            >
              Sign in
            </button>
            <Button
              size="sm"
              className="h-9"
              onClick={() => router.push("/signup")}
            >
              Get Started
            </Button>
          </>
        )}

        {isLoggedIn && (
          <Button
            size="sm"
            className="h-9"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </Button>
        )}
      </div>

      <div className="flex md:hidden items-center gap-2">
        {mounted && (
          <button
            type="button"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-md hover:bg-muted transition-colors flex items-center justify-center"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </button>
        )}

        <button
          type="button"
          className="h-9 w-9 rounded-md hover:bg-muted transition-colors flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute top-14 left-0 right-0 bg-background border-b border-border/50 md:hidden overflow-hidden z-50"
          >
            <nav className="flex flex-col p-4 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left px-3 py-2 rounded-md hover:bg-muted/50"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.name}
                </button>
              ))}

              <div className="pt-3 border-t border-border/50 space-y-2">
                {isLoggedIn && user ? (
                  <>
                    <button
                      type="button"
                      className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors text-left w-full px-3 py-2 rounded-md hover:bg-muted/50"
                      onClick={() => handleNavigation("/progress")}
                    >
                      Progress
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors text-left w-full px-3 py-2 rounded-md hover:bg-muted/50"
                      onClick={() => handleNavigation("/settings")}
                    >
                      Settings
                    </button>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleNavigation("/dashboard")}
                    >
                      Dashboard
                    </Button>
                    <button
                      type="button"
                      className="cursor-pointer text-sm text-red-600 dark:text-red-400 hover:text-red-500 transition-colors text-left w-full px-3 py-2 rounded-md hover:bg-muted/50"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left w-full px-3 py-2 rounded-md hover:bg-muted/50"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogin();
                      }}
                    >
                      Sign in
                    </button>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleNavigation("/signup")}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLoginSuccess={handleLoginSuccess}
      />
    </header>
  );
}
