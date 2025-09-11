import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bug, Clock, Flame } from "lucide-react";
import type { DiaryEntry } from "@/hooks/useDiary";

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  showAuthor?: boolean;
}

const DiaryEntryCard = ({ entry, showAuthor = false }: DiaryEntryCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getDisplayName = () => {
    if (entry.name && entry.name !== "Anonymous") {
      return entry.name;
    }
    if (entry.username && entry.username !== "@unknown") {
      return entry.username;
    }
    return "Anonymous Developer";
  };

  const getAvatarFallback = () => {
    if (entry.name && entry.name !== "Anonymous") {
      return entry.name[0]?.toUpperCase() || "A";
    }
    if (entry.username && entry.username !== "@unknown") {
      return entry.username[1]?.toUpperCase() || "A";
    }
    return "A";
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/5 group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>

      <CardHeader className="pb-3 relative">
        {showAuthor && (
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-10 h-10 ring-2 ring-gradient-to-r from-cyan-500/30 to-blue-500/30">
              <AvatarImage src={entry.avatar} alt={getDisplayName()} />
              <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm">
                {getAvatarFallback()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold text-slate-200 text-sm">
                {getDisplayName()}
              </div>
              {entry.username && entry.username !== "@unknown" && (
                <div className="text-xs text-slate-500">
                  @{entry.username.replace("@", "")}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              {formatDate(entry.$createdAt)}
            </div>
          </div>
        )}

        {!showAuthor && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg">
                <Bug className="w-3.5 h-3.5 text-red-400" />
              </div>
              <span className="text-slate-300 font-medium text-sm">
                Bug Report
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              {formatDate(entry.$createdAt)}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4 relative">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Description
            </h4>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/40">
            <p className="text-sm leading-relaxed text-slate-300 font-mono whitespace-pre-wrap">
              {entry.description}
            </p>
          </div>
        </div>

        {entry.roast ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <h4 className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
                AI Roast
              </h4>
              <Badge className="bg-gradient-to-r from-orange-500/15 to-red-500/15 text-orange-300 border-orange-500/30 text-xs h-5">
                🔥 Savage
              </Badge>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-r from-orange-500/10 to-red-500/10 p-4 rounded-lg border border-orange-500/20">
                <p className="text-sm leading-relaxed text-orange-50 font-medium">
                  {entry.roast}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/5 to-amber-500/5 rounded-lg border border-yellow-500/20">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-yellow-300 font-medium">
              Processing roast...
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiaryEntryCard;
