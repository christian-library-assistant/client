import { useState } from "react";
import { cn } from "@/lib/utils";

interface Source {
  record_id: string;
  link: string;
  citation_text: string;
}

interface SourcesAccordionProps {
  sources: Source[];
}

export default function SourcesAccordion({ sources }: SourcesAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCitations, setExpandedCitations] = useState<Record<string, boolean>>({});

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const toggleCitation = (recordId: string) => {
    setExpandedCitations(prev => ({
      ...prev,
      [recordId]: !prev[recordId],
    }));
  };

  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 mb-4 overflow-y-auto border rounded-md bg-gray-50 dark:bg-gray-800/50">
      <button
        type="button"
        className="flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
        onClick={toggleAccordion}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span>Sources</span>
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {sources.length}
          </span>
        </div>
        <svg
          className={cn(
            "w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      <div
        className={cn(
          "transition-all duration-200 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <ul className="space-y-3">
            {sources.map(source => {
              const isExpanded = expandedCitations[source.record_id];
              const needsExpansion = source.citation_text.split("\n").length > 2;

              return (
                <li key={source.record_id} className="text-sm">
                  <div className="flex flex-col">
                    <a
                      href={source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start group"
                    >
                      <svg
                        className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-blue-500 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      <span className="text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 group-hover:underline">
                        Source {sources.indexOf(source) + 1}
                      </span>
                    </a>

                    <div className="ml-6 mt-1 text-gray-700 dark:text-gray-300">
                      <p
                        className={cn(
                          "whitespace-pre-line",
                          needsExpansion && !isExpanded ? "line-clamp-2" : ""
                        )}
                      >
                        {source.citation_text}
                      </p>
                      {needsExpansion && (
                        <button
                          onClick={() => toggleCitation(source.record_id)}
                          className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-1"
                        >
                          {isExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
