import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './screens/Home';
import PrayerTimes from './screens/PrayerTimes';
import Quran from './screens/Quran';
import Azkar from './screens/Azkar';
import Ramadan from './screens/Ramadan';
import Zakat from './screens/Zakat';
import SurahDetail from './screens/SurahDetail';
import Chatbot from './screens/Chatbot';
import { useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/chatbot';

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <main className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto min-h-screen relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prayer" element={<PrayerTimes />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/quran/:id" element={<SurahDetail />} />
          <Route path="/azkar" element={<Azkar />} />
          <Route path="/ramadan" element={<Ramadan />} />
          <Route path="/zakat" element={<Zakat />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </main>
      {!hideNavbar && <Navbar />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}
