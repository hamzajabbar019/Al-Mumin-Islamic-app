import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, Settings, Bell, BellOff, CheckCircle2, Circle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import axios from 'axios';
import { format } from 'date-fns';
import { PRAYER_METHODS, PRAYER_NAMES, cn } from '../lib/utils';

const PrayerTimes = () => {
  const { location, method, setMethod, notifications, requestNotificationPermission, completedPrayers, togglePrayerCompleted, prayerData } = useApp();
  const [showSettings, setShowSettings] = useState(false);

  const timings = prayerData?.timings;
  const prayers = Object.keys(PRAYER_NAMES);

  return (
    <div className="pb-24 px-6 pt-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif italic text-zinc-900 dark:text-white">Prayer Times</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Stay connected to your worship</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => requestNotificationPermission()}
            className={cn(
              "p-2 rounded-full transition-colors",
              notifications ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-400"
            )}
          >
            {notifications ? <Bell size={20} /> : <BellOff size={20} />}
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-600 dark:text-zinc-400"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {showSettings && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 overflow-hidden max-w-2xl"
        >
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Calculation Method</label>
          <select 
            value={method}
            onChange={(e) => setMethod(Number(e.target.value))}
            className="w-full bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-sm dark:text-white"
          >
            {PRAYER_METHODS.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prayers.map((p, i) => (
          <motion.div 
            key={p}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 flex items-center justify-between group hover:border-emerald-500 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white">{p}</h3>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Daily Prayer</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold tracking-tighter text-emerald-600 dark:text-emerald-400">
                {timings ? timings[p] : '--:--'}
              </span>
              <button 
                onClick={() => togglePrayerCompleted(p)}
                className={cn(
                  "p-2.5 rounded-xl transition-all",
                  completedPrayers.includes(p) ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-400"
                )}
              >
                {completedPrayers.includes(p) ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PrayerTimes;
