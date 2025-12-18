"use client";
import { useState, useEffect } from 'react';

export default function AnimeList() {
  const [topAnime, setTopAnime] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnime, setSelectedAnime] = useState<any>(null);

  useEffect(() => {
    fetchTopAnime();
  }, []);

  const fetchTopAnime = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=20');
      const data = await response.json();
      setTopAnime(data.data);
    } catch (error) {
      console.error('Error fetching top anime:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-slate-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-slate-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400 text-lg">Loading Top 20 Anime...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full px-6 py-2 mb-6">
            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-yellow-400 font-bold">Highest Rated</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
            Top 20 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">Anime</span>
          </h1>
          <p className="text-slate-400 text-lg">The highest rated anime of all time</p>
        </div>

        {/* Podium Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {topAnime.slice(0, 3).map((anime: any, index: number) => {
            const podiumColors = [
              { bg: 'from-yellow-500 to-orange-500', ring: 'ring-yellow-500/50', text: 'text-yellow-400', medal: '🥇' },
              { bg: 'from-slate-400 to-slate-500', ring: 'ring-slate-400/50', text: 'text-slate-400', medal: '🥈' },
              { bg: 'from-orange-600 to-orange-700', ring: 'ring-orange-600/50', text: 'text-orange-400', medal: '🥉' }
            ];
            const color = podiumColors[index];

            return (
              <div
                key={anime.mal_id}
                className={`group relative ${index === 0 ? 'md:order-2 md:scale-110 md:-translate-y-4' : index === 1 ? 'md:order-1' : 'md:order-3'}`}
                onClick={() => setSelectedAnime(anime)}
              >
                <div className={`relative bg-slate-900/80 backdrop-blur-sm rounded-3xl overflow-hidden border-2 ${index === 0 ? 'border-yellow-500/50' : 'border-slate-700'} hover:border-slate-500/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-slate-500/20`}>
                  {/* Rank Badge */}
                  <div className={`absolute top-4 left-4 z-20 w-12 h-12 bg-gradient-to-br ${color.bg} rounded-full flex items-center justify-center text-2xl shadow-lg ring-4 ring-slate-900 ${color.ring}`}>
                    {color.medal}
                  </div>

                  {/* Image */}
                  <div className="relative h-96 overflow-hidden">
                    <img
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${color.bg} text-white px-4 py-2 rounded-full font-bold text-lg mb-3 shadow-lg`}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {anime.score}
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2 line-clamp-2 group-hover:text-slate-400 transition-colors">
                      {anime.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span>{anime.type}</span>
                      <span>•</span>
                      <span>{anime.year}</span>
                      <span>•</span>
                      <span>{anime.episodes || '?'} eps</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rest of Top 20 */}
        <div className="space-y-3">
          {topAnime.slice(3).map((anime: any, index: number) => {
            const rank = index + 4;
            return (
              <div
                key={anime.mal_id}
                onClick={() => setSelectedAnime(anime)}
                className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-500/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-500/10"
              >
                <div className="flex items-center gap-6 p-4">
                  {/* Rank Number */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-slate-700 group-hover:border-slate-500/50 transition-colors">
                    <span className="text-2xl font-black text-slate-400 group-hover:text-slate-400 transition-colors">
                      {rank}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden bg-slate-800 ring-2 ring-slate-700 group-hover:ring-slate-500/50 transition-all">
                    <img
                      src={anime.images.jpg.image_url}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-xl mb-2 line-clamp-1 group-hover:text-slate-400 transition-colors">
                      {anime.title}
                    </h3>
                    {anime.title_english && anime.title_english !== anime.title && (
                      <p className="text-slate-400 text-sm mb-2 line-clamp-1">
                        {anime.title_english}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-lg text-slate-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                        </svg>
                        {anime.episodes || '?'} eps
                      </span>
                      <span className="bg-slate-800 px-3 py-1 rounded-lg text-slate-300">
                        {anime.type}
                      </span>
                      <span className="bg-slate-800 px-3 py-1 rounded-lg text-slate-300">
                        {anime.year || 'TBA'}
                      </span>
                      {anime.genres.slice(0, 2).map((genre: any) => (
                        <span
                          key={genre.mal_id}
                          className="bg-slate-500/20 text-slate-300 px-3 py-1 rounded-lg border border-slate-500/30"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 bg-gradient-to-br from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {anime.score}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {anime.scored_by?.toLocaleString()} votes
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedAnime && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAnime(null)}
        >
          <div
            className="bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-80 overflow-hidden">
              <img
                src={selectedAnime.images.jpg.large_image_url}
                alt={selectedAnime.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
              <button
                onClick={() => setSelectedAnime(null)}
                className="absolute top-4 right-4 p-2 bg-slate-900/80 backdrop-blur-sm rounded-full text-white hover:bg-slate-800 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-xl font-bold text-xl shadow-lg">
                    ⭐ {selectedAnime.score}
                  </div>
                  <div className="bg-gradient-to-br from-slate-500 to-blue-500 text-white px-4 py-2 rounded-xl font-bold text-xl shadow-lg">
                    #{selectedAnime.rank}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-4xl font-black text-white mb-2">
                  {selectedAnime.title}
                </h2>
                {selectedAnime.title_english && selectedAnime.title_english !== selectedAnime.title && (
                  <p className="text-xl text-slate-400 font-semibold">
                    {selectedAnime.title_english}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg font-semibold">
                  {selectedAnime.type}
                </span>
                <span className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg font-semibold">
                  {selectedAnime.episodes || '?'} Episodes
                </span>
                <span className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg font-semibold">
                  {selectedAnime.year || 'TBA'}
                </span>
                <span className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg font-semibold">
                  {selectedAnime.status}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-3">Synopsis</h3>
                <p className="text-slate-300 leading-relaxed">
                  {selectedAnime.synopsis || 'No description available.'}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAnime.genres.map((genre: any) => (
                    <span
                      key={genre.mal_id}
                      className="bg-slate-500/20 text-slate-300 px-4 py-2 rounded-xl border border-slate-500/30 font-semibold"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-yellow-400">{selectedAnime.score}</div>
                  <div className="text-slate-400 text-sm mt-1">Score</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-slate-400">#{selectedAnime.rank}</div>
                  <div className="text-slate-400 text-sm mt-1">Rank</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-blue-400">#{selectedAnime.popularity}</div>
                  <div className="text-slate-400 text-sm mt-1">Popularity</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-cyan-400">{selectedAnime.members?.toLocaleString()}</div>
                  <div className="text-slate-400 text-sm mt-1">Members</div>
                </div>
              </div>

              <a
                href={selectedAnime.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-gradient-to-r from-slate-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-slate-500/50 transition-all"
              >
                View on MyAnimeList
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}