import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  className?: string;
}

const CodeBlock = ({ code, className }: CodeBlockProps) => {
  return (
    <div
      className={cn(
        "bg-gray-900 text-gray-100 p-4 rounded-lg border border-gray-700 overflow-x-auto",
        "font-mono text-sm leading-relaxed relative",
        "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800",
        className,
      )}
    >
      <pre className="whitespace-pre-wrap break-words m-0">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
