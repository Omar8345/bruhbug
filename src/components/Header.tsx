import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { CustomUser } from "@/types/auth";

const Header = () => {
  const { user, login, logout } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await login();
      toast({
        title: "Redirecting to GitHub...",
        description: "You'll be redirected to GitHub for authentication.",
      });
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login Failed",
        description: "Failed to initiate GitHub login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout Failed",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const prefs = (user as CustomUser | null)?.prefs || {};
  const { avatar, name, username } = prefs;

  return (
    <header className="border-b border-border/50 glass-morphism sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-glow animate-pulse-glow">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-md opacity-50 animate-pulse-glow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">bruhbug</h1>
            <p className="text-sm text-muted-foreground">
              AI-powered bug roasts & solutions
            </p>
          </div>
        </div>

        {/* Auth controls */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 ring-2 ring-primary/30">
                <AvatarImage src={avatar} alt={name || user.name || "User"} />
                <AvatarFallback className="bg-gradient-primary text-white">
                  {name?.charAt(0).toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{name}</span>
                {username && (
                  <span className="text-xs text-muted-foreground">
                    @{username}
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="transition-3d hover:scale-105 border-border/50 hover:bg-destructive hover:text-destructive-foreground hover:shadow-glow"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Logout"
                )}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="bg-gradient-primary text-white hover:scale-105 transition-3d shadow-3d hover:shadow-glow"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Github className="w-4 h-4 mr-2" />
                  Login with GitHub
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
