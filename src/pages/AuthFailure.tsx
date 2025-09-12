import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthFailure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900">
      <div className="text-center space-y-6 p-8 bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl max-w-md">
        <div className="flex justify-center">
          <div className="p-4 bg-red-500/20 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">
            Authentication Failed
          </h2>
          <p className="text-slate-400 mb-6">
            There was an issue signing you in with GitHub. This might be due to:
          </p>
          <ul className="text-sm text-slate-500 text-left space-y-2 mb-6">
            <li>• You cancelled the authorization</li>
            <li>• Network connectivity issues</li>
            <li>• GitHub service temporarily unavailable</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate("/", { replace: true })}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
          >
            Try Again
          </Button>
          <p className="text-xs text-slate-500">
            Redirecting automatically in 10 seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthFailure;
