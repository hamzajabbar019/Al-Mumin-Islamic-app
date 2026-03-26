import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Book, Play, Bookmark, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Quran = () => {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { bookmarks, toggleBookmark } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await axios.get('https://api.alquran.cloud/v1/surah');
        setSurahs(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) || 
    s.name.includes(search)
  );

  return (
    <div className="pb-24 px-6 pt-8 space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-serif italic text-zinc-900 dark:text-white">The Holy Quran</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Read, listen and explore</p>
      </header>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input 
          type="text" 
          placeholder="Search Surah..." 
          className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Surah List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array(12).fill(0).map((_, i) => (
            <div key={i} className="h-20 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl" />
          ))
        ) : (
          filteredSurahs.map((surah, index) => (
            <motion.div 
              key={surah.number}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => navigate(`/quran/${surah.number}`)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between group hover:border-emerald-500 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  {surah.number}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">{surah.englishName}</h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">{surah.englishNameTranslation}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="font-serif text-lg text-emerald-600 dark:text-emerald-400">{surah.name}</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-tighter">{surah.numberOfAyahs} Ayahs</p>
                </div>
                <ChevronRight size={16} className="text-zinc-300 group-hover:text-emerald-500 transition-colors" />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Quran;
