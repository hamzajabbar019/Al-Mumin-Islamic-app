import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Info, Save } from 'lucide-react';

const Zakat = () => {
  const [wealth, setWealth] = useState({
    cash: '',
    gold: '',
    silver: '',
    investments: '',
    debts: '',
  });

  const calculateTotal = () => {
    const total = (parseFloat(wealth.cash) || 0) + 
                  (parseFloat(wealth.gold) || 0) + 
                  (parseFloat(wealth.silver) || 0) + 
                  (parseFloat(wealth.investments) || 0) - 
                  (parseFloat(wealth.debts) || 0);
    return Math.max(0, total);
  };

  const totalWealth = calculateTotal();
  const zakatAmount = totalWealth * 0.025;

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('last_zakat_calculation', JSON.stringify({
      wealth,
      totalWealth,
      zakatAmount,
      date: new Date().toISOString()
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleInputChange = (id: string, value: string) => {
    setWealth(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="pb-24 px-6 pt-8 max-w-md mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-serif italic text-zinc-900 dark:text-white">Zakat Calculator</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Calculate your 2.5% annual contribution</p>
      </header>

      {/* Result Card */}
      <motion.div 
        key={zakatAmount}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-amber-500 dark:bg-amber-600 rounded-3xl p-8 text-white shadow-xl shadow-amber-200 dark:shadow-none"
      >
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Payable Zakat</p>
        <h2 className="text-5xl font-bold tracking-tighter mt-2">${zakatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
        <div className="mt-6 pt-6 border-t border-white/20 flex justify-between items-center">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-70">Total Wealth</p>
            <p className="font-bold">${totalWealth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <button 
            onClick={handleSave}
            className={`p-2 rounded-xl transition-all flex items-center gap-2 ${
              saved ? 'bg-white text-amber-600' : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <Save size={20} />
            {saved && <span className="text-xs font-bold">Saved</span>}
          </button>
        </div>
      </motion.div>

      {/* Inputs */}
      <div className="space-y-4">
        {[
          { id: 'cash', label: 'Cash & Savings', icon: '💰' },
          { id: 'gold', label: 'Gold Value', icon: '✨' },
          { id: 'silver', label: 'Silver Value', icon: '🥈' },
          { id: 'investments', label: 'Investments', icon: '📈' },
          { id: 'debts', label: 'Debts to Pay', icon: '📉' },
        ].map((field) => (
          <div key={field.id} className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">{field.label}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">{field.icon}</span>
              <input 
                type="number" 
                inputMode="decimal"
                placeholder="0.00"
                value={(wealth as any)[field.id]}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex gap-3">
        <Info className="text-zinc-400 shrink-0" size={18} />
        <p className="text-xs text-zinc-500 leading-relaxed">
          Zakat is calculated as 2.5% of your total wealth that exceeds the Nisab threshold for one lunar year.
        </p>
      </div>
    </div>
  );
};

export default Zakat;
