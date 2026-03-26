import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Star, Heart, Book, Sparkles, Clock, Info, CheckCircle2 } from 'lucide-react';

const Ramadan = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'last10' | 'deeds'>('overview');

  const ramadanDeeds = [
    { title: 'Last 10 Nights', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', desc: 'Seek Laylat al-Qadr, a night better than a thousand months.' },
    { title: "I'tikaf", icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', desc: 'Seclusion in the mosque for worship during the last ten days.' },
    { title: 'Charity (Sadaqah)', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', desc: 'The Prophet (PBUH) was most generous during Ramadan.' },
    { title: 'Quran Recitation', icon: Book, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', desc: 'Ramadan is the month in which the Quran was revealed.' },
  ];

  const laylatAlQadrTips = [
    "Recite the Dua: 'Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni'",
    "Pray Tahajjud and perform extra Nafl prayers",
    "Make sincere Tawbah (repentance) for past sins",
    "Give charity, even if it's a small amount each night",
    "Stay away from distractions and focus on Dhikr"
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'last10', label: 'Last 10 Nights', icon: Moon },
    { id: 'deeds', label: 'Daily Deeds', icon: Heart },
  ];

  return (
    <div className="pb-24 px-6 pt-8 max-w-md mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-serif italic text-zinc-900 dark:text-white">Ramadan Guide</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Maximize your rewards this holy month</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-zinc-800 text-emerald-600 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Hero Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={20} className="text-indigo-200" />
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">The Last 10 Days</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Laylat al-Qadr</h2>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  "The Night of Decree is better than a thousand months." (Quran 97:3)
                </p>
              </div>
              <Moon className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 rotate-12" />
            </motion.div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-4 flex gap-3">
              <Info className="text-emerald-600 shrink-0" size={18} />
              <p className="text-[10px] text-emerald-800 dark:text-emerald-400 leading-relaxed font-medium">
                Note: Ramadan dates vary by moon sighting. Please check with your local mosque for the exact start of the last ten nights.
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'last10' && (
          <motion.div
            key="last10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Tips Section */}
            <section className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-amber-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Laylat al-Qadr Checklist</h3>
              </div>
              <ul className="space-y-3">
                {laylatAlQadrTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          </motion.div>
        )}

        {activeTab === 'deeds' && (
          <motion.div
            key="deeds"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Key Worships</h3>
            <div className="grid grid-cols-1 gap-3">
              {ramadanDeeds.map((deed, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 4 }}
                  className={`${deed.bg} rounded-2xl p-4 flex items-start gap-4 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all`}
                >
                  <div className={`p-3 rounded-xl bg-white dark:bg-zinc-900 ${deed.color} shadow-sm`}>
                    <deed.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{deed.title}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{deed.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ramadan;
