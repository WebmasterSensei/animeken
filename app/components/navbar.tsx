"use client";
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        searchAnime(searchQuery);
      }, 500);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const searchAnime = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=8`);
      const data = await response.json();
      setSearchResults(data.data || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching anime:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAnimeClick = (anime: any) => {
    window.open(anime.url, '_blank');
    setShowDropdown(false);
    setSearchQuery('');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div> */}
            <span className="text-2xl font-black text-white hidden sm:block">
              Anime<span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-400">Ken</span>
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-slate-500/30 border-t-slate-500 rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                placeholder="Search anime..."
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
              />

              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowDropdown(false);
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl shadow-slate-500/10 overflow-hidden max-h-[600px] overflow-y-auto">
                {searchResults.map((anime: any) => (
                  <div
                    key={anime.mal_id}
                    onClick={() => handleAnimeClick(anime)}
                    className="flex items-start gap-4 p-4 hover:bg-slate-800/80 cursor-pointer transition-all group border-b border-slate-800/50 last:border-b-0"
                  >
                    {/* Anime Image */}
                    <div className="flex-shrink-0 w-16 h-24 rounded-lg overflow-hidden bg-slate-800 group-hover:ring-2 group-hover:ring-slate-500 transition-all">
                      <img
                        src={anime.images.jpg.image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Anime Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-base group-hover:text-slate-400 transition-colors line-clamp-1">
                        {anime.title}
                      </h3>
                      
                      {anime.title_english && anime.title_english !== anime.title && (
                        <p className="text-slate-400 text-sm mt-1 line-clamp-1">
                          {anime.title_english}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        {anime.score && (
                          <span className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-md">
                            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {anime.score}
                          </span>
                        )}
                        {anime.type && (
                          <span className="bg-slate-800 px-2 py-1 rounded-md">
                            {anime.type}
                          </span>
                        )}
                        {anime.episodes && (
                          <span className="bg-slate-800 px-2 py-1 rounded-md">
                            {anime.episodes} eps
                          </span>
                        )}
                        {anime.year && (
                          <span className="bg-slate-800 px-2 py-1 rounded-md">
                            {anime.year}
                          </span>
                        )}
                      </div>

                      {anime.genres && anime.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {anime.genres.slice(0, 3).map((genre: any) => (
                            <span
                              key={genre.mal_id}
                              className="text-xs bg-slate-500/20 text-slate-300 px-2 py-0.5 rounded-full border border-slate-500/30"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex-shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {showDropdown && searchQuery.length > 2 && searchResults.length === 0 && !isSearching && (
              <div className="absolute top-full mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl shadow-slate-500/10 p-8 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-400 font-medium">No anime found</p>
                <p className="text-slate-500 text-sm mt-1">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl transition-all border border-slate-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-semibold">Favorites</span>
            </button> */}

            {/* <button className="p-2 sm:p-3 bg-gradient-to-r from-slate-500 to-slate-500 hover:shadow-lg hover:shadow-slate-500/50 text-white rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}