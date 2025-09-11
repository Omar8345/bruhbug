import { Github, Heart, OctagonAlert } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <OctagonAlert className="w-4 h-4 text-red-400" />
              <span>Community posts are actively moderated.</span>
            </div>
            <div className="text-sm text-slate-300 flex items-center gap-1.5 font-medium">
              Made for developers with
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              and a sense of humor
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Omar8345/bruhbug"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors font-medium"
            >
              <Github className="w-5 h-5" />
              GitHub Repository
            </a>

            <div className="flex gap-2 items-center text-gray-300">
              <span>Powered by</span>
              <a
                className="flex items-center gap-2 hover:text-cyan-400 transition-all duration-300 ease-in-out font-medium hover:scale-105"
                href="https://appwrite.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/appwrite.svg"
                  className="w-5 h-5 transition-all duration-300 ease-in-out"
                  alt="Appwrite"
                />
                Appwrite
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
