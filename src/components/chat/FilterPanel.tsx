"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ChevronDown, ChevronUp, Filter, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchAuthors, searchWorks, type Author, type Work } from "@/lib/apiService";

interface FilterPanelProps {
  selectedAuthors: string[];
  selectedWorks: string[];
  onAuthorsChange: (authors: string[]) => void;
  onWorksChange: (works: string[]) => void;
}

export default function FilterPanel({
  selectedAuthors,
  selectedWorks,
  onAuthorsChange,
  onWorksChange,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [authorQuery, setAuthorQuery] = useState("");
  const [workQuery, setWorkQuery] = useState("");
  const [authorResults, setAuthorResults] = useState<Author[]>([]);
  const [workResults, setWorkResults] = useState<Work[]>([]);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  const [showWorkDropdown, setShowWorkDropdown] = useState(false);
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(false);
  const [isLoadingWorks, setIsLoadingWorks] = useState(false);

  const authorInputRef = useRef<HTMLInputElement>(null);
  const workInputRef = useRef<HTMLInputElement>(null);
  const authorDropdownRef = useRef<HTMLDivElement>(null);
  const workDropdownRef = useRef<HTMLDivElement>(null);

  // Search authors with debounce
  useEffect(() => {
    if (authorQuery.length < 2) {
      setAuthorResults([]);
      return;
    }

    setIsLoadingAuthors(true);
    const timer = setTimeout(() => {
      searchAuthors(authorQuery)
        .then((response) => {
          setAuthorResults(response.matches || []);
          setShowAuthorDropdown(true);
        })
        .catch((error) => {
          console.error("Error searching authors:", error);
          setAuthorResults([]);
        })
        .finally(() => setIsLoadingAuthors(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [authorQuery]);

  // Search works with debounce
  useEffect(() => {
    if (workQuery.length < 2) {
      setWorkResults([]);
      return;
    }

    setIsLoadingWorks(true);
    const timer = setTimeout(() => {
      searchWorks(workQuery)
        .then((response) => {
          setWorkResults(response.matches || []);
          setShowWorkDropdown(true);
        })
        .catch((error) => {
          console.error("Error searching works:", error);
          setWorkResults([]);
        })
        .finally(() => setIsLoadingWorks(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [workQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        authorDropdownRef.current &&
        !authorDropdownRef.current.contains(event.target as Node) &&
        authorInputRef.current &&
        !authorInputRef.current.contains(event.target as Node)
      ) {
        setShowAuthorDropdown(false);
      }
      if (
        workDropdownRef.current &&
        !workDropdownRef.current.contains(event.target as Node) &&
        workInputRef.current &&
        !workInputRef.current.contains(event.target as Node)
      ) {
        setShowWorkDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddAuthor = (authorId: string) => {
    if (!selectedAuthors.includes(authorId)) {
      onAuthorsChange([...selectedAuthors, authorId]);
    }
    setAuthorQuery("");
    setShowAuthorDropdown(false);
  };

  const handleRemoveAuthor = (authorId: string) => {
    onAuthorsChange(selectedAuthors.filter((id) => id !== authorId));
  };

  const handleAddWork = (workId: string) => {
    if (!selectedWorks.includes(workId)) {
      onWorksChange([...selectedWorks, workId]);
    }
    setWorkQuery("");
    setShowWorkDropdown(false);
  };

  const handleRemoveWork = (workId: string) => {
    onWorksChange(selectedWorks.filter((id) => id !== workId));
  };

  const handleClearAll = () => {
    onAuthorsChange([]);
    onWorksChange([]);
    setAuthorQuery("");
    setWorkQuery("");
  };

  const hasFilters = selectedAuthors.length > 0 || selectedWorks.length > 0;

  return (
    <div className="border rounded-lg bg-background">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between hover:bg-accent/50 transition-colors rounded-t-lg"
      >
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Search Filters</span>
          {hasFilters && (
            <div className="flex items-center space-x-1">
              {selectedAuthors.length > 0 && (
                <span className="text-xs bg-blue-500 text-white rounded-full px-2 py-0.5 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {selectedAuthors.length}
                </span>
              )}
              {selectedWorks.length > 0 && (
                <span className="text-xs bg-purple-500 text-white rounded-full px-2 py-0.5 flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {selectedWorks.length}
                </span>
              )}
            </div>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-4 border-t">
          {/* Selected Filters */}
          {hasFilters && (
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Active Filters</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-6 text-xs hover:bg-muted"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedAuthors.map((authorId) => (
                  <div
                    key={authorId}
                    className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100 rounded-md px-2.5 py-1.5 text-xs font-medium border border-blue-200 dark:border-blue-800"
                  >
                    <User className="h-3 w-3" />
                    <span>{authorId}</span>
                    <button
                      onClick={() => handleRemoveAuthor(authorId)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-sm p-0.5 ml-1"
                      aria-label={`Remove ${authorId} author filter`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {selectedWorks.map((workId) => (
                  <div
                    key={workId}
                    className="flex items-center space-x-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-100 rounded-md px-2.5 py-1.5 text-xs font-medium border border-purple-200 dark:border-purple-800"
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>{workId}</span>
                    <button
                      onClick={() => handleRemoveWork(workId)}
                      className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-sm p-0.5 ml-1"
                      aria-label={`Remove ${workId} work filter`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Author Search */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <label className="text-sm font-medium">Filter by Author</label>
            </div>
            <p className="text-xs text-muted-foreground">
              Search results will only include content from selected authors
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={authorInputRef}
                type="text"
                placeholder="e.g., Augustine, Aquinas, Calvin..."
                value={authorQuery}
                onChange={(e) => setAuthorQuery(e.target.value)}
                onFocus={() => {
                  if (authorResults.length > 0) setShowAuthorDropdown(true);
                }}
                className="pl-10"
              />
              {isLoadingAuthors && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {showAuthorDropdown && authorResults.length > 0 && (
                <div
                  ref={authorDropdownRef}
                  className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {authorResults.map((author) => (
                    <button
                      key={author.author_id}
                      onClick={() => handleAddAuthor(author.author_id)}
                      className="w-full px-4 py-3 text-left hover:bg-accent"
                      disabled={selectedAuthors.includes(author.author_id)}
                    >
                      <div className="flex flex-col space-y-1">
                        <div className="text-sm font-medium">{author.author_name}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{author.author_id}</span>
                          {Object.keys(author.associated_works).length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {Object.keys(author.associated_works).length} work(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Work Search */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <label className="text-sm font-medium">Filter by Work</label>
            </div>
            <p className="text-xs text-muted-foreground">
              Search results will only include content from selected works/books
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={workInputRef}
                type="text"
                placeholder="e.g., Confessions, City of God, Summa..."
                value={workQuery}
                onChange={(e) => setWorkQuery(e.target.value)}
                onFocus={() => {
                  if (workResults.length > 0) setShowWorkDropdown(true);
                }}
                className="pl-10"
              />
              {isLoadingWorks && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {showWorkDropdown && workResults.length > 0 && (
                <div
                  ref={workDropdownRef}
                  className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {workResults.map((work) => (
                    <button
                      key={work.work_id}
                      onClick={() => handleAddWork(work.work_id)}
                      className="w-full px-4 py-3 text-left hover:bg-accent"
                      disabled={selectedWorks.includes(work.work_id)}
                    >
                      <div className="flex flex-col space-y-1">
                        <div className="text-sm font-medium">{work.work_name}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{work.work_id}</span>
                          {work.authors.length > 0 && (
                            <span className="text-xs text-muted-foreground truncate max-w-xs">
                              By: {work.authors.map(a => a.author_name).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-3 space-y-1">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
              💡 How filters work
            </p>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li><strong className="text-blue-600 dark:text-blue-400">Authors</strong> (blue) - Limit results to writings by specific theologians</li>
              <li><strong className="text-purple-600 dark:text-purple-400">Works</strong> (purple) - Limit results to specific books or documents</li>
              <li>Type at least 2 characters to search for authors or works</li>
              <li>Multiple filters narrow your search further</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
