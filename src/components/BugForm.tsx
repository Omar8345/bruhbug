import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bug, Zap, AlertCircle, Flame } from "lucide-react";
import { useBugAI } from "@/hooks/useBugAI";
import { useAuth } from "@/contexts/AuthContext";
import type { BugSubmission } from "@/types/bug";

const BugForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user } = useAuth();
  const { submitBug, isProcessing, error, result, reset } = useBugAI(onSuccess);
  const [formData, setFormData] = useState<BugSubmission>({
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      return;
    }

    try {
      const unsubscribe = await submitBug(formData);
      useEffect(() => {
        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
        };
      });
    } catch (error) {
      console.error("Failed to submit bug:", error);
    }
  };

  const handleReset = () => {
    setFormData({ description: "" });
    reset();
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full w-fit mx-auto mb-6">
              <Bug className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-3">
              Login Required
            </h3>
            <p className="text-slate-400 mb-6">
              Please login with GitHub to submit bugs for AI roasting.
            </p>
            <div className="text-4xl">🔥</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Form */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl overflow-hidden relative group">
        {/* Animated border glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>

        <CardHeader className="pb-6 relative">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl">
              <Bug className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Submit Your Bug
              </CardTitle>
              <CardDescription className="text-slate-400 mt-2 text-lg">
                Get AI-powered roasts that actually help you debug! 🔥
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label
                htmlFor="description"
                className="text-base font-bold text-slate-200 block"
              >
                Bug Description *
              </label>
              <div className="relative">
                <Textarea
                  id="description"
                  placeholder="Describe your bug... What were you trying to do? What went wrong? Stack traces, error messages, code snippets - the more dramatic, the better the roast!"
                  value={formData.description}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 500) {
                      setFormData((prev) => ({
                        ...prev,
                        description: value,
                      }));
                    }
                  }}
                  className="min-h-[200px] resize-none bg-slate-900/60 border-slate-600/50 focus:border-purple-400 transition-all duration-300 font-mono text-base text-slate-200 placeholder:text-slate-500 rounded-xl p-4"
                  disabled={isProcessing}
                  required
                />
                <div
                  className={`absolute bottom-3 right-3 text-xs ${
                    formData.description.length > 450
                      ? "text-orange-400"
                      : formData.description.length > 400
                      ? "text-yellow-400"
                      : "text-slate-500"
                  }`}
                >
                  {formData.description.length}/500 characters
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={!formData.description.trim() || isProcessing}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 flex-1 text-lg relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Getting Roasted...
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6 mr-3" />
                      Submit for Roasting
                    </>
                  )}
                </div>
              </Button>

              {(result || error) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 py-4 px-8 rounded-xl font-medium"
                >
                  Submit Another
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {isProcessing && (
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                <div className="absolute inset-0 bg-purple-400 rounded-full blur-md opacity-50 animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold text-purple-300 text-lg">
                  AI is analyzing your bug...
                </h3>
                <p className="text-slate-400">
                  Preparing a savage roast that might actually help you debug 🔥
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert className="bg-red-500/10 border-red-500/20 backdrop-blur-xl">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <AlertDescription className="text-red-300 font-medium">
            <strong>Oops!</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Result Display */}
      {result && (
        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/20 shadow-2xl shadow-orange-500/10">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-orange-400" />
              <CardTitle className="text-xl font-bold text-orange-400">
                AI Roast
              </CardTitle>
              <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30">
                🔥 Savage
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 rounded-xl border border-orange-500/20">
              <p className="text-lg leading-relaxed text-orange-100 font-medium">
                {(result as any).roast}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BugForm;
