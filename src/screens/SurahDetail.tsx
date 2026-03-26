import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Play, Bookmark, Share2 } from 'lucide-react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

const SurahDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setLastReadSurah } = useApp();
  const [surah, setSurah] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        const res = await axios.get(`https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.sahih`);
        const data = res.data.data;
        setSurah(data);
        setLastReadSurah({ number: data[0].number, name: data[0].englishName });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurah();
  }, [id, setLastReadSurah]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  const uthmani = surah[0];
  const english = surah[1];

  return (
    <div className="pb-24 min-h-screen bg-white dark:bg-zinc-950">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-600 dark:text-zinc-400">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="font-bold text-zinc-900 dark:text-white">{uthmani.englishName}</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{uthmani.revelationType} • {uthmani.numberOfAyahs} Ayahs</p>
        </div>
        <button className="p-2 -mr-2 text-emerald-600 dark:text-emerald-400">
          <Bookmark size={20} />
        </button>
      </header>

      {/* Bismillah */}
      {id !== '1' && id !== '9' && (
        <div className="py-12 text-center">
          <p className="text-3xl font-serif text-zinc-900 dark:text-white">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        </div>
      )}

      {/* Ayahs */}
      <div className="px-6 space-y-12 mt-8">
        {uthmani.ayahs.map((ayah: any, index: number) => (
          <motion.div 
            key={ayah.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-500 shrink-0">
                {ayah.numberInSurah}
              </div>
              <p className="text-3xl font-serif text-right leading-[2.5] text-zinc-900 dark:text-white dir-rtl">
                {ayah.text}
              </p>
            </div>
            <div className="pl-12">
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                {english.ayahs[index].text}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <button className="text-zinc-400 hover:text-emerald-500 transition-colors">
                  <Play size={16} />
                </button>
                <button className="text-zinc-400 hover:text-emerald-500 transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-900 w-full" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SurahDetail;
