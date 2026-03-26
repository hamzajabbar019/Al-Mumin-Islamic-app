import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppContextType {
  location: { lat: number; lng: number } | null;
  method: number;
  setMethod: (m: number) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  tasbeehCount: number;
  setTasbeehCount: (c: number) => void;
  notifications: boolean;
  requestNotificationPermission: () => Promise<void>;
  lastReadSurah: { number: number; name: string } | null;
  setLastReadSurah: (surah: { number: number; name: string }) => void;
  completedPrayers: string[];
  togglePrayerCompleted: (prayer: string) => void;
  prayerData: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [method, setMethod] = useState(() => Number(localStorage.getItem('prayer_method')) || 3);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');
  const [bookmarks, setBookmarks] = useState<string[]>(() => JSON.parse(localStorage.getItem('bookmarks') || '[]'));
  const [tasbeehCount, setTasbeehCount] = useState(() => Number(localStorage.getItem('tasbeeh_count')) || 0);
  const [notifications, setNotifications] = useState<boolean>(() => localStorage.getItem('notifications_enabled') === 'true');
  const [lastReadSurah, setLastReadSurahState] = useState<{ number: number; name: string } | null>(() => {
    const saved = localStorage.getItem('last_read_surah');
    return saved ? JSON.parse(saved) : null;
  });
  const [completedPrayers, setCompletedPrayers] = useState<string[]>(() => {
    const saved = localStorage.getItem('completed_prayers');
    const today = new Date().toDateString();
    const data = saved ? JSON.parse(saved) : null;
    return data && data.date === today ? data.prayers : [];
  });
  const [prayerData, setPrayerData] = useState<any>(null);
  const [lastNotified, setLastNotified] = useState<string | null>(() => localStorage.getItem('last_notified_prayer'));

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Location error:", err)
      );
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered:', reg))
        .catch(err => console.error('SW registration failed:', err));
    }
  }, []);

  // Fetch prayer times
  useEffect(() => {
    if (location) {
      const fetchTimings = async () => {
        try {
          const res = await fetch(`https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${location.lat}&longitude=${location.lng}&method=${method}`);
          const data = await res.json();
          setPrayerData(data.data);
        } catch (err) {
          console.error("Error fetching timings:", err);
        }
      };
      fetchTimings();
    }
  }, [location, method]);

  // Notification scheduler
  useEffect(() => {
    if (!notifications || !prayerData?.timings) return;

    const checkNotifications = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      Object.entries(prayerData.timings).forEach(([name, time]: [string, any]) => {
        if (['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(name)) {
          const [hours, minutes] = time.split(':').map(Number);
          const prayerMinutes = hours * 60 + minutes;
          const diff = prayerMinutes - currentMinutes;

          // Notify 10 minutes before
          if (diff === 10 && lastNotified !== `${name}_10`) {
            sendNotification(`Upcoming Prayer: ${name}`, `It's 10 minutes before ${name}. Prepare for your worship.`);
            setLastNotified(`${name}_10`);
          }
          
          // Notify at prayer time
          if (diff === 0 && lastNotified !== `${name}_0`) {
            sendNotification(`Time for ${name}`, `It's now time for ${name} prayer.`);
            setLastNotified(`${name}_0`);
          }
        }
      });
    };

    const sendNotification = (title: string, body: string) => {
      if ('serviceWorker' in navigator && 'Notification' in window) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification(title, {
            body,
            icon: '/icon-192.png',
            badge: '/badge-72.png',
            vibrate: [200, 100, 200]
          } as any);
        });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
      }
    };

    const interval = setInterval(checkNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [notifications, prayerData, lastNotified]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotifications(true);
        localStorage.setItem('notifications_enabled', 'true');
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('prayer_method', String(method));
    localStorage.setItem('theme', theme);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    localStorage.setItem('tasbeeh_count', String(tasbeehCount));
    localStorage.setItem('last_read_surah', JSON.stringify(lastReadSurah));
    localStorage.setItem('completed_prayers', JSON.stringify({
      date: new Date().toDateString(),
      prayers: completedPrayers
    }));
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (lastNotified) {
      localStorage.setItem('last_notified_prayer', lastNotified);
    }
  }, [method, theme, bookmarks, tasbeehCount, lastReadSurah, completedPrayers, lastNotified]);

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const setLastReadSurah = (surah: { number: number; name: string }) => {
    setLastReadSurahState(surah);
  };

  const togglePrayerCompleted = (prayer: string) => {
    setCompletedPrayers(prev => 
      prev.includes(prayer) ? prev.filter(p => p !== prayer) : [...prev, prayer]
    );
  };

  return (
    <AppContext.Provider value={{ 
      location, method, setMethod, theme, setTheme, 
      bookmarks, toggleBookmark, tasbeehCount, setTasbeehCount,
      notifications, requestNotificationPermission,
      lastReadSurah, setLastReadSurah,
      completedPrayers, togglePrayerCompleted,
      prayerData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
