import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Clock, Moon, Heart, Calculator } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const Navbar = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Clock, label: 'Prayer', path: '/prayer' },
    { icon: BookOpen, label: 'Quran', path: '/quran' },
    { icon: Heart, label: 'Azkar', path: '/azkar' },
    { icon: Moon, label: 'Ramadan', path: '/ramadan' },
    { icon: Calculator, label: 'Zakat', path: '/zakat' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-4 pb-safe pt-2 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 p-2 transition-colors",
              isActive ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400 dark:text-zinc-500"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
