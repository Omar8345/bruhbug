import { useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BugForm from "@/components/BugForm";
import DiaryEntryCard from "@/components/DiaryEntryCard";
import Pagination from "@/components/Pagination";
import {
  Book,
  Globe,
  Users,
  Bug,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDiary } from "@/hooks/useDiary";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { myDiary, publicFeed, isLoading, error, refreshData } = useDiary();
  const [activeTab, setActiveTab] = useState("submit-bug");
  const [diaryPage, setDiaryPage] = useState(1);
  const [feedPage, setFeedPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  const getDiaryPageData = () => {
    const startIndex = (diaryPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      entries: myDiary.slice(startIndex, endIndex),
      totalPages: Math.ceil(myDiary.length / ITEMS_PER_PAGE),
    };
  };

  const getFeedPageData = () => {
    const startIndex = (feedPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      entries: publicFeed.slice(startIndex, endIndex),
      totalPages: Math.ceil(publicFeed.length / ITEMS_PER_PAGE),
    };
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-md opacity-50 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Loading bruhbug...
            </h2>
            <p className="text-slate-400">
              Preparing your debugging playground
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-900">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div className="absolute inset-0 bg-grid-slate-100/[0.02] bg-grid-16"></div>
      </div>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-16 max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <div className="relative inline-block mb-8">
            <h1 className="text-7xl md:text-8xl font-black leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                bruhbug
              </span>
            </h1>
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-2xl blur-xl"></div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-200">
            Your Bugs Deserve Better{" "}
            <span className="text-orange-400">Roasts</span>
            <span className="ml-2 text-2xl">🔥</span>
          </h2>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
            Submit your code disasters and get AI-powered savage roasts that
            actually help you debug. Turn your programming failures into
            entertainment and learning opportunities.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <div className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-full backdrop-blur-sm hover:from-purple-500/20 hover:to-purple-600/20 transition-all duration-300">
              <Sparkles className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
              <span className="text-sm font-medium text-purple-300 group-hover:text-purple-200">
                AI-Powered Roasts
              </span>
            </div>
            <div className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-full backdrop-blur-sm hover:from-orange-500/20 hover:to-orange-600/20 transition-all duration-300">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-orange-300 group-hover:text-orange-200">
                Instant Analysis
              </span>
            </div>
            <div className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 rounded-full backdrop-blur-sm hover:from-cyan-500/20 hover:to-cyan-600/20 transition-all duration-300">
              <Users className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
              <span className="text-sm font-medium text-cyan-300 group-hover:text-cyan-200">
                Community Sharing
              </span>
            </div>
          </div>
        </div>

        {/* Custom Tab Navigation */}
        <div className="w-full">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 p-3 bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl shadow-2xl">
            <button
              onClick={() => setActiveTab("submit-bug")}
              className={`flex items-center gap-3 rounded-xl py-3 px-6 font-medium transition-all duration-300 ${
                activeTab === "submit-bug"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20 scale-105"
                  : "text-slate-400 hover:bg-slate-700/30 hover:text-slate-300"
              }`}
            >
              <Bug className="w-4 h-4" />
              <span>Submit Bug</span>
            </button>

            {user && (
              <button
                onClick={() => setActiveTab("my-diary")}
                className={`flex items-center gap-3 rounded-xl py-3 px-6 font-medium transition-all duration-300 ${
                  activeTab === "my-diary"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105"
                    : "text-slate-400 hover:bg-slate-700/30 hover:text-slate-300"
                }`}
              >
                <Book className="w-4 h-4" />
                <span>My Diary</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold min-w-[20px] text-center ${
                    activeTab === "my-diary"
                      ? "bg-white/20 text-white"
                      : "bg-slate-600/50 text-slate-300"
                  }`}
                >
                  {myDiary.length}
                </span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("public-feed")}
              className={`flex items-center gap-3 rounded-xl py-3 px-6 font-medium transition-all duration-300 ${
                activeTab === "public-feed"
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/20 scale-105"
                  : "text-slate-400 hover:bg-slate-700/30 hover:text-slate-300"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Public Feed</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold min-w-[20px] text-center ${
                  activeTab === "public-feed"
                    ? "bg-white/20 text-white"
                    : "bg-slate-600/50 text-slate-300"
                }`}
              >
                {publicFeed.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === "submit-bug" && <BugForm onSuccess={refreshData} />}

            {activeTab === "my-diary" && user && (
              <div>
                <div className="mb-8 p-6 bg-gradient-to-r from-slate-800/50 to-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl">
                        <Book className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-200 mb-1">
                          Your Private Debugging Diary
                        </h3>
                        <p className="text-slate-400">
                          Only you can see these entries - safe space for your
                          worst bugs!
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshData}
                      disabled={isLoading}
                      className="border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm backdrop-blur-sm">
                    {error}
                  </div>
                )}

                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
                      <p className="text-slate-400">
                        Loading your debugging disasters...
                      </p>
                    </div>
                  </div>
                ) : myDiary.length > 0 ? (
                  <div>
                    <div className="space-y-6">
                      {getDiaryPageData().entries.map((entry) => (
                        <DiaryEntryCard
                          key={entry.$id}
                          entry={entry}
                          showAuthor={false}
                        />
                      ))}
                    </div>
                    <Pagination
                      currentPage={diaryPage}
                      totalPages={getDiaryPageData().totalPages}
                      onPageChange={setDiaryPage}
                    />
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/30 max-w-md mx-auto">
                      <Bug className="w-16 h-16 mx-auto mb-6 text-slate-600" />
                      <h3 className="text-xl font-bold text-slate-300 mb-3">
                        No entries yet
                      </h3>
                      <p className="text-slate-400 mb-6">
                        Ready to get roasted? Submit your first bug above!
                      </p>
                      <div className="text-4xl">🔥</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "public-feed" && (
              <div>
                <div className="mb-8 p-6 bg-gradient-to-r from-slate-800/50 to-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 rounded-xl">
                        <Users className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-200 mb-1">
                          Community Bug Roasts
                        </h3>
                        <p className="text-slate-400">
                          Learn from other developers' debugging disasters and
                          epic fails
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshData}
                      disabled={isLoading}
                      className="border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm backdrop-blur-sm">
                    {error}
                  </div>
                )}

                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
                      <p className="text-slate-400">
                        Loading community roasts...
                      </p>
                    </div>
                  </div>
                ) : publicFeed.length > 0 ? (
                  <div>
                    <div className="space-y-6">
                      {getFeedPageData().entries.map((entry) => (
                        <DiaryEntryCard
                          key={entry.$id}
                          entry={entry}
                          showAuthor={true}
                        />
                      ))}
                    </div>
                    <Pagination
                      currentPage={feedPage}
                      totalPages={getFeedPageData().totalPages}
                      onPageChange={setFeedPage}
                    />
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/30 max-w-md mx-auto">
                      <Globe className="w-16 h-16 mx-auto mb-6 text-slate-600" />
                      <h3 className="text-xl font-bold text-slate-300 mb-3">
                        No public roasts yet
                      </h3>
                      <p className="text-slate-400 mb-6">
                        Be the first brave soul to share your debugging
                        disasters!
                      </p>
                      <div className="text-4xl">💀</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
