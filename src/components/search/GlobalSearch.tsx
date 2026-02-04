import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Product } from "@/types";

const SEARCH_PHRASES = [
    "Search for revolving chairs",
    "Search for office chairs",
    "Search for executive chairs",
    "Search for beds",
    "Search for wardrobes",
    "Search for steel almirahs",
    "Search for study tables",
    "Search for office desks",
    "Search for sofas",
    "Search for conference tables",
];

export function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activePhraseIndex, setActivePhraseIndex] = useState(0);
    const [placeholder, setPlaceholder] = useState("");
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const debouncedQuery = useDebounce(query, 300);

    // Search Query
    const { data: results = [], isLoading } = useQuery({
        queryKey: ["global-search", debouncedQuery],
        queryFn: () => searchProducts(debouncedQuery),
        enabled: debouncedQuery.length > 1,
        staleTime: 60 * 1000,
    });

    // Typewriter Effect
    useEffect(() => {
        if (query || isOpen) {
            setPlaceholder("Search...");
            return;
        }

        const currentPhrase = SEARCH_PHRASES[activePhraseIndex];
        let timeout: NodeJS.Timeout;

        if (isPaused) {
            timeout = setTimeout(() => {
                setIsPaused(false);
                setIsDeleting(true);
            }, 1500);
        } else if (isDeleting) {
            timeout = setTimeout(() => {
                if (charIndex > 0) {
                    setCharIndex(prev => prev - 1);
                    setPlaceholder(currentPhrase.substring(0, charIndex - 1));
                } else {
                    setIsDeleting(false);
                    setActivePhraseIndex(prev => (prev + 1) % SEARCH_PHRASES.length);
                }
            }, 50);
        } else {
            timeout = setTimeout(() => {
                if (charIndex < currentPhrase.length) {
                    setCharIndex(prev => prev + 1);
                    setPlaceholder(currentPhrase.substring(0, charIndex + 1));
                } else {
                    setIsPaused(true);
                }
            }, 100);
        }

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, isPaused, activePhraseIndex, query, isOpen]);

    // Handle Outside Click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const activeResults = debouncedQuery.length > 1 ? results : [];

    return (
        <div className="relative">
            {/* Desktop & Tablet Search Bar */}
            <div className="hidden md:block w-[260px] lg:w-[340px] 2xl:w-[400px] flex-shrink-0">
                <form onSubmit={handleSearch} className="relative group">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary z-10" />
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder={query ? "" : placeholder}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        className="pl-11 h-12 w-full bg-gray-100/50 border-transparent hover:bg-secondary/50 focus:bg-card focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all duration-300 rounded-xl text-base shadow-sm"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                inputRef.current?.focus();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-5 w-5" />}
                        </button>
                    )}
                </form>

                {/* Dropdown Results */}
                {isOpen && debouncedQuery.length > 1 && (
                    <div
                        ref={dropdownRef}
                        className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-xl border border-border/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                        ) : results.length > 0 ? (
                            <div className="py-2">
                                <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                    Suggestions
                                </div>
                                {results.map((product: Product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => {
                                            navigate(`/product/${product.id}`);
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors group"
                                    >
                                        <div className="h-10 w-10 shrink-0 rounded-md bg-gray-100/30 overflow-hidden">
                                            <img src={product.image || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-primary">{product.name}</h4>
                                            <p className="text-xs text-muted-foreground truncate">{product.category}</p>
                                        </div>
                                        {(product.isNewLaunch || product.isBestSeller) && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium shrink-0">
                                                {product.isNewLaunch ? "NEW" : "HOT"}
                                            </span>
                                        )}
                                    </div>
                                ))}
                                <div className="border-t border-gray-50 mt-1 pt-1">
                                    <button
                                        onClick={(e) => handleSearch(e)}
                                        className="w-full text-left px-4 py-2.5 text-sm text-primary font-medium hover:bg-primary/5 flex items-center justify-between"
                                    >
                                        View all results for "{query}"
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-sm text-muted-foreground">No products found for "{query}"</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Search Trigger */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100/50 text-foreground hover:text-accent transition-all"
            >
                <Search className="h-6 w-6" />
            </button>

            {/* Mobile Search Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-background p-4 md:hidden animate-in fade-in slide-in-from-top duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <form onSubmit={handleSearch} className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Search products..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-11 h-12 w-full bg-gray-100/50 border-none focus:ring-2 focus:ring-primary/20 rounded-xl"
                            />
                        </form>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-muted-foreground"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Mobile Results */}
                    {debouncedQuery.length > 1 && (
                        <div className="overflow-y-auto max-h-[calc(100vh-120px)] pb-20">
                            {isLoading ? (
                                <div className="p-8 text-center text-muted-foreground">Searching...</div>
                            ) : results.length > 0 ? (
                                <div className="space-y-4">
                                    {results.map((product: Product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => {
                                                navigate(`/product/${product.id}`);
                                                setIsOpen(false);
                                            }}
                                            className="flex items-center gap-4 py-3 border-b border-border/30"
                                        >
                                            <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-100/30 overflow-hidden">
                                                <img src={product.image || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-slate-900">{product.name}</h4>
                                                <p className="text-sm text-muted-foreground">{product.category}</p>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-slate-300" />
                                        </div>
                                    ))}
                                    <Button
                                        onClick={handleSearch}
                                        className="w-full h-12 bg-primary text-white rounded-xl mt-4"
                                    >
                                        View All Results
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-12 text-center text-muted-foreground">
                                    No products found for "{query}"
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default GlobalSearch;
