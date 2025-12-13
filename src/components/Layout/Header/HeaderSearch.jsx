import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

export default function HeaderSearch({
  query,
  setQuery,
  handleSearch,
  isOnHero,
  searchMode,
  setSearchMode,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchMode) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [searchMode]);

  return (
    <div
      className={`
        relative transition-all duration-300 z-[60]
        ${searchMode
          ? "absolute left-1/2 -translate-x-1/2 w-[1200px]"
          : "w-40"}
      `}
    >
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2"
        size={18}
        strokeWidth={1.5}
      />

      <input
        ref={inputRef}
        type="text"
        placeholder="Search"
        value={query}
        onFocus={() => setSearchMode(true)}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearch}
        className={`
          w-full rounded-full py-1.5 pl-9 pr-9 text-sm transition
          ${isOnHero
            ? "bg-white/20 text-white placeholder-white/50 border-white/40"
            : "bg-white text-black border-gray-300"}
        `}
      />

      {searchMode && (
        <button
          onClick={() => setSearchMode(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
