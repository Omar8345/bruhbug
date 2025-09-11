import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Send, Zap } from "lucide-react";
import type { CreateEntryRequest } from "@/types";

interface ErrorInputProps {
  onSubmit: (data: CreateEntryRequest) => Promise<void>;
  isLoading: boolean;
}

const ErrorInput = ({ onSubmit, isLoading }: ErrorInputProps) => {
  const [error, setError] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!error.trim()) return;

    const lines = error.split("\n").filter((line) => line.trim());
    const title = lines[0]?.substring(0, 100) || "Bug Report";

    await onSubmit({ title, error, isPublic });

    setError("");
    setIsPublic(false);
  };

  return (
    <Card className="border-border/30 glass-morphism shadow-3d card-3d transition-3d hover:shadow-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="w-6 h-6 text-primary animate-pulse-glow" />
            <div className="absolute inset-0 blur-sm">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
          </div>
          <span className="text-gradient">Submit Your Bug for AI Roasting</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Textarea
              placeholder="Paste your error message, stack trace, or describe the bug...

Examples:
• TypeError: Cannot read properties of undefined (reading 'map')
• SyntaxError: Unexpected token '}' in JSON
• ReferenceError: variable is not defined

The AI will auto-generate a title and roast your code! 🔥"
              value={error}
              onChange={(e) => setError(e.target.value)}
              className="min-h-36 bg-gradient-secondary border-border/50 focus:ring-2 focus:ring-primary/50 font-mono-code text-sm resize-none transition-3d backdrop-blur-sm"
              disabled={isLoading}
            />
            <div className="absolute top-3 right-3">
              <Zap className="w-5 h-5 text-primary/50" />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gradient-card rounded-lg border border-border/30">
            <Checkbox
              id="public"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked === true)}
              className="border-border/50 data-[state=checked]:bg-gradient-primary data-[state=checked]:text-white transition-3d"
              disabled={isLoading}
            />
            <label
              htmlFor="public"
              className="text-sm text-muted-foreground cursor-pointer flex-1"
            >
              🌍 <strong>Share publicly</strong> to help other developers learn
              from your bugs
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !error.trim()}
            className="w-full bg-gradient-primary text-white hover:scale-105 transition-3d shadow-3d hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                <span className="animate-pulse">
                  AI is roasting your code...
                </span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-3" />
                Get Roasted by AI 🔥
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ErrorInput;
