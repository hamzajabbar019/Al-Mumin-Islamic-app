import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, ChevronRight, Sparkles, BookOpen, Compass, Moon, Sun, Settings, Heart, Bot, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import axios from 'axios';
import { format } from 'date-fns';
import { getIslamicReminder, getWorshipSuggestions } from '../services/gemini';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { location, method, lastReadSurah, completedPrayers, prayerData } = useApp();
  const navigate = useNavigate();
  const [reminder, setReminder] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aiReminder, aiSuggestions] = await Promise.all([
          getIslamicReminder(),
          getWorshipSuggestions('peaceful')
        ]);
        setReminder(aiReminder);
        setSuggestions(aiSuggestions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextPrayer = () => {
    const timings = prayerData?.timings;
    if (!timings) return null;
    const now = format(new Date(), 'HH:mm');
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    for (const p of prayers) {
      if (timings[p] > now) return { name: p, time: timings[p] };
    }
    return { name: 'Fajr', time: timings.Fajr }; // Next day
  };

  const missedPrayer = () => {
    const timings = prayerData?.timings;
    if (!timings) return null;
    const now = format(new Date(), 'HH:mm');
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    let lastPassed = null;
    for (let i = prayers.length - 1; i >= 0; i--) {
      if (timings[prayers[i]] < now) {
        lastPassed = prayers[i];
        break;
      }
    }

    if (lastPassed && !completedPrayers.includes(lastPassed)) {
      return lastPassed;
    }
    return null;
  };

  const next = nextPrayer();
  const missed = missedPrayer();

  return (
    <div className="pb-24 px-6 pt-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif italic text-zinc-900 dark:text-white">Assalamu Alaikum</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            {format(new Date(), 'EEEE, do MMMM')}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/prayer')}
            className="bg-zinc-100 dark:bg-zinc-900 p-2.5 rounded-full text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Daily Reminders & Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-zinc-400 uppercase tracking-widest text-[10px] font-bold">
            <Bell size={12} />
            <span>Daily Reminders</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {missed && (
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-800/30 flex items-center justify-center text-rose-600">
                    <Bell size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">Missed {missed}?</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Perform it before the next prayer</p>
                  </div>
                </div>
                <button onClick={() => navigate('/prayer')} className="text-rose-600 text-xs font-bold">Mark Done</button>
              </motion.div>
            )}

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-800/30 flex items-center justify-center text-emerald-600">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">Next Prayer: {next?.name}</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Scheduled for {next?.time}</p>
                </div>
              </div>
              <button onClick={() => navigate('/prayer')} className="text-emerald-600 text-xs font-bold">View All</button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center text-amber-600">
                  <Heart size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">Remember Today's Azkar</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Keep your tongue moist with remembrance</p>
                </div>
              </div>
              <button onClick={() => navigate('/azkar')} className="text-amber-600 text-xs font-bold">Start Now</button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-800/30 flex items-center justify-center text-indigo-600">
                  <Moon size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">Ramadan Preparation</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Maximize rewards in the holy month</p>
                </div>
              </div>
              <button onClick={() => navigate('/ramadan')} className="text-indigo-600 text-xs font-bold">Guide</button>
            </motion.div>
          </div>
        </section>

        <div className="space-y-8">
          {/* Next Prayer Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-600 dark:bg-emerald-700 rounded-3xl p-6 text-white shadow-xl shadow-emerald-200 dark:shadow-none relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 opacity-80 text-sm font-medium uppercase tracking-widest">
                <Clock size={16} />
                Next Prayer
              </div>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <h2 className="text-5xl font-bold tracking-tighter">{next?.time || '--:--'}</h2>
                  <p className="text-xl font-medium mt-1 opacity-90">{next?.name || 'Loading...'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-semibold">{prayerData?.meta?.timezone?.split('/')[1] || 'Detecting...'}</p>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl" />
          </motion.div>

          {/* AI Insights */}
          <div className="space-y-3">
            {(loading || reminder) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-amber-50/50 dark:bg-amber-900/10 p-3 rounded-2xl border border-amber-100/50 dark:border-amber-900/20"
              >
                <Sparkles size={16} className="text-amber-600 shrink-0" />
                {loading ? (
                  <div className="h-3 bg-amber-200/50 animate-pulse rounded w-full" />
                ) : (
                  <p className="text-[11px] text-zinc-700 dark:text-zinc-300 italic font-serif line-clamp-1">
                    {reminder}
                  </p>
                )}
              </motion.div>
            )}

            {(loading || suggestions) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-emerald-50/50 dark:bg-emerald-900/10 p-3 rounded-2xl border border-emerald-100/50 dark:border-amber-900/20"
              >
                <Heart size={16} className="text-emerald-600 shrink-0" />
                {loading ? (
                  <div className="h-3 bg-emerald-200/50 animate-pulse rounded w-full" />
                ) : (
                  <p className="text-[11px] text-zinc-700 dark:text-zinc-300 line-clamp-1">
                    {suggestions}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* AI Chatbot CTA */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/chatbot')}
        className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-3xl p-6 flex items-center justify-between shadow-xl shadow-zinc-200 dark:shadow-none transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
            <Bot size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg">Ask Al-Mumin AI</h3>
            <p className="text-xs opacity-70">Get answers to your Islamic queries</p>
          </div>
        </div>
        <ChevronRight size={20} className="opacity-50" />
      </motion.button>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between h-32 cursor-pointer"
          onClick={() => lastReadSurah && navigate(`/quran/${lastReadSurah.number}`)}
        >
          <div className="bg-emerald-50 dark:bg-emerald-900/20 w-10 h-10 rounded-xl flex items-center justify-center">
            <BookOpen size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Last Read</p>
            <p className="text-sm font-semibold mt-1 truncate">
              {lastReadSurah ? lastReadSurah.name : 'Start Reading'}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between h-32 cursor-pointer" onClick={() => navigate('/ramadan')}>
          <div className="bg-amber-50 dark:bg-amber-900/20 w-10 h-10 rounded-xl flex items-center justify-center">
            <Moon size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Ramadan</p>
            <p className="text-sm font-semibold mt-1">Holy Month Guide</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between h-32 cursor-pointer" onClick={() => navigate('/qibla')}>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 w-10 h-10 rounded-xl flex items-center justify-center">
            <Compass size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Qibla</p>
            <p className="text-sm font-semibold mt-1">Find Direction</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between h-32 cursor-pointer" onClick={() => navigate('/zakat')}>
          <div className="bg-rose-50 dark:bg-rose-900/20 w-10 h-10 rounded-xl flex items-center justify-center">
            <Sun size={20} className="text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Zakat</p>
            <p className="text-sm font-semibold mt-1">Calculator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
