"use client";
import { useState, useEffect } from 'react';

export default function Hero() {
  const [animeList, setAnimeList] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchAnime();
  }, [page]);

  const fetchAnime = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=12`);
      const data = await response.json();
      setAnimeList(data.data);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching anime:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentAnime = animeList[currentIndex];

  const handleSwipe = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentIndex < animeList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const offset = e.clientY - dragStart;
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (dragOffset > 100) {
      handleSwipe('prev');
    } else if (dragOffset < -100) {
      handleSwipe('next');
    }
    
    setDragOffset(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const offset = e.touches[0].clientY - dragStart;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (dragOffset > 100) {
      handleSwipe('prev');
    } else if (dragOffset < -100) {
      handleSwipe('next');
    }
    
    setDragOffset(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-slate-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-slate-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Image with transition */}
      {currentAnime && (
        <div 
          className="absolute inset-0 transition-all duration-700 ease-out"
          style={{
            backgroundImage: `url(${currentAnime.images.jpg.large_image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/80"></div>
          <div className="absolute inset-0 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Left Column (40%) - Gallery Stack */}
      <div className="w-full md:w-2/5 p-8 relative z-10 flex mt-5 justify-center">
        <div className="w-full max-w-md">
          {/* Gallery Stack */}
          <div 
            className="relative h-[600px] cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {animeList.map((anime: any, index: number) => {
              const offset = index - currentIndex;
              const isVisible = Math.abs(offset) <= 2;
              
              if (!isVisible) return null;

              return (
                <div
                  key={anime.mal_id}
                  className="absolute inset-0 transition-all duration-500 ease-out"
                  style={{
                    transform: `
                      translateY(${offset * 20 + (index === currentIndex ? dragOffset * 0.5 : 0)}px) 
                      scale(${1 - Math.abs(offset) * 0.1}) 
                      rotateX(${offset * -5}deg)
                    `,
                    zIndex: 10 - Math.abs(offset),
                    opacity: 1 - Math.abs(offset) * 0.3,
                    pointerEvents: index === currentIndex ? 'auto' : 'none',
                  }}
                >
                  <div className="w-full h-full bg-slate-900/90 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      className="w-full h-full object-cover"
                      draggable="false"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          ⭐ {anime.score}
                        </span>
                        <span className="bg-gradient-to-r from-slate-500 to-slate-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          #{anime.rank}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-xl line-clamp-2">
                        {anime.title}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Swipe Indicator */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => handleSwipe('prev')}
              disabled={currentIndex === 0}
              className="p-3 bg-slate-800/80 backdrop-blur-sm rounded-full text-white disabled:opacity-30 hover:bg-slate-700 transition-all border border-slate-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            
            <div className="flex gap-2">
              {animeList.map((_: any, index: number) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-8 bg-gradient-to-r from-slate-500 to-slate-500' 
                      : 'w-2 bg-slate-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => handleSwipe('next')}
              disabled={currentIndex === animeList.length - 1}
              className="p-3 bg-slate-800/80 backdrop-blur-sm rounded-full text-white disabled:opacity-30 hover:bg-slate-700 transition-all border border-slate-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <p className="text-center text-slate-400 text-sm mt-4">
            Swipe or use arrows to navigate
          </p>
        </div>
      </div>

      {/* Right Column (60%) - Details */}
      <div className="w-full md:w-3/5 p-8 relative z-10 flex items-center">
        {currentAnime && (
          <div className="w-full max-w-3xl mx-auto space-y-8 animate-fadeIn">
            {/* Title Section */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
                {currentAnime.title}
              </h1>
              {currentAnime.title_english && currentAnime.title_english !== currentAnime.title && (
                <h2 className="text-2xl md:text-3xl text-slate-400 font-semibold">
                  {currentAnime.title_english}
                </h2>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-slate-300">
              <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                </svg>
                <span className="font-semibold">{currentAnime.episodes || '?'} Episodes</span>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700 font-semibold">
                {currentAnime.type}
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700 font-semibold">
                {currentAnime.year || 'TBA'}
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700 font-semibold">
                {currentAnime.status}
              </div>
            </div>

            {/* Synopsis */}
            <div className="backdrop-blur-md p-2 rounded-2xl border-slate-800">
              <h3 className="text-xl font-bold text-white mb-3">Synopsis</h3>
              <p className="text-slate-300 leading-relaxed">
                {currentAnime.synopsis || 'No description available.'}
              </p>
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Genres</h3>
              <div className="flex flex-wrap gap-3">
                {currentAnime.genres.map((genre: any) => (
                  <span
                    key={genre.mal_id}
                    className="px-4 py-2 bg-gradient-to-r from-slate-500/20 to-slate-500/20 text-slate-300 rounded-xl border border-slate-500/30 font-semibold backdrop-blur-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-3xl font-bold text-yellow-400">{currentAnime.score}</div>
                <div className="text-slate-400 text-sm mt-1">Score</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-3xl font-bold text-slate-400">#{currentAnime.rank}</div>
                <div className="text-slate-400 text-sm mt-1">Rank</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-3xl font-bold text-slate-400">#{currentAnime.popularity}</div>
                <div className="text-slate-400 text-sm mt-1">Popularity</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-3xl font-bold text-cyan-400">{currentAnime.members?.toLocaleString()}</div>
                <div className="text-slate-400 text-sm mt-1">Members</div>
              </div>
            </div>

            {/* Action Button */}
            <div>
              <a
                href={currentAnime.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-500 to-slate-500 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-slate-500/50 transition-all hover:scale-105"
              >
                View on MyAnimeList
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}