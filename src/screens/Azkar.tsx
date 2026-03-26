import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Moon, Sun, RefreshCw, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Azkar = () => {
  const { tasbeehCount, setTasbeehCount } = useApp();
  const [activeTab, setActiveTab] = useState<'morning' | 'evening' | 'tasbeeh'>('morning');

  const morningAzkar = [
    { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ", translation: "We have reached the morning and at this very time unto Allah belongs all sovereignty", count: 1 },
    { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", translation: "Glory be to Allah and His is the praise", count: 100 },
    { text: "أَسْتَغْفِرُ اللَّهَ", translation: "I seek forgiveness from Allah", count: 100 },
  ];

  const eveningAzkar = [
    { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ", translation: "We have reached the evening and at this very time unto Allah belongs all sovereignty", count: 1 },
    { text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ", translation: "O Ever Living One, O Self-Sustaining One, in Your mercy I seek relief", count: 3 },
    { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا", translation: "O Allah, by You we enter the evening and by You we enter the morning", count: 1 },
  ];

  const currentAzkar = activeTab === 'morning' ? morningAzkar : eveningAzkar;
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggleDone = (id: string) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="pb-24 px-6 pt-8 max-w-md mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-serif italic text-zinc-900 dark:text-white">Azkar & Duas</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Remember Allah in every moment</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl">
        {(['morning', 'evening', 'tasbeeh'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                : 'text-zinc-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'tasbeeh' ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-12">
          <div className="relative">
            <div className="w-64 h-64 rounded-full border-8 border-emerald-50 dark:border-emerald-900/20 flex items-center justify-center">
              <div className="text-center">
                <span className="text-7xl font-bold tracking-tighter text-zinc-900 dark:text-white">{tasbeehCount}</span>
                <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mt-2">Total Count</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setTasbeehCount(tasbeehCount + 1)}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-200 dark:shadow-none"
            >
              <Plus size={32} />
            </motion.button>
          </div>
          
          <button 
            onClick={() => setTasbeehCount(0)}
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-600 transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <RefreshCw size={14} />
            Reset Counter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {currentAzkar.map((zikr, i) => (
            <motion.div 
              key={`${activeTab}-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4"
            >
              <p className="text-2xl font-serif text-right text-emerald-600 dark:text-emerald-400 leading-relaxed dir-rtl">
                {zikr.text}
              </p>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{zikr.translation}</p>
                <div className="flex justify-end items-center mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <button 
                    onClick={() => toggleDone(`${activeTab}-${i}`)}
                    className={`font-bold text-sm px-4 py-1.5 rounded-full transition-all ${
                      completed[`${activeTab}-${i}`] 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' 
                        : 'text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                    }`}
                  >
                    {completed[`${activeTab}-${i}`] ? 'Completed' : 'Done'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Azkar;
