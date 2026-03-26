import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Compass, Navigation } from 'lucide-react';

const Qibla = () => {
  const [heading, setHeading] = useState(0);
  const [qiblaDir, setQiblaDir] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateQibla = (lat: number, lng: number) => {
      const makkahLat = 21.4225;
      const makkahLng = 39.8262;
      
      const y = Math.sin(Math.PI * (makkahLng - lng) / 180);
      const x = Math.cos(Math.PI * lat / 180) * Math.tan(Math.PI * makkahLat / 180) - 
                Math.sin(Math.PI * lat / 180) * Math.cos(Math.PI * (makkahLng - lng) / 180);
      
      let qibla = Math.atan2(y, x) * 180 / Math.PI;
      return (qibla + 360) % 360;
    };

    const requestPermission = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          } else {
            setError("Permission denied. Compass won't work.");
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setQiblaDir(calculateQibla(pos.coords.latitude, pos.coords.longitude));
      }, (err) => {
        setError("Location access required for Qibla.");
      });
    }

    const handleOrientation = (e: any) => {
      if (e.webkitCompassHeading) {
        setHeading(e.webkitCompassHeading);
      } else if (e.alpha) {
        setHeading(360 - e.alpha);
      }
    };

    requestPermission();
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return (
    <div className="pb-24 px-6 pt-8 max-w-md mx-auto space-y-12 flex flex-col items-center h-full">
      <header className="w-full">
        <h1 className="text-3xl font-serif italic text-zinc-900 dark:text-white">Qibla Finder</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Find the direction of Kaaba</p>
      </header>

      <div className="relative flex-1 flex items-center justify-center w-full">
        {error ? (
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-100 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="w-72 h-72 rounded-full border-[12px] border-zinc-100 dark:border-zinc-900 relative shadow-inner">
              {/* Compass Marks */}
              {[0, 90, 180, 270].map(deg => (
                <div 
                  key={deg}
                  className="absolute font-bold text-[10px] text-zinc-400"
                  style={{ 
                    top: deg === 0 ? '10px' : deg === 180 ? 'auto' : '50%',
                    bottom: deg === 180 ? '10px' : 'auto',
                    left: deg === 270 ? '10px' : deg === 90 ? 'auto' : '50%',
                    right: deg === 90 ? '10px' : 'auto',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : 'W'}
                </div>
              ))}

              {/* Needle */}
              <motion.div 
                animate={{ rotate: qiblaDir - heading }}
                transition={{ type: 'spring', stiffness: 50 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative">
                  <div className="w-1 h-32 bg-emerald-600 rounded-full" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Navigation className="text-emerald-600 fill-emerald-600" size={32} />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 text-center space-y-2">
              <div className="inline-block bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  {Math.round(qiblaDir)}° from North
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">Rotate your phone to align the needle</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Qibla;
