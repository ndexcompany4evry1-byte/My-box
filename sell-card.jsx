import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Building, Store, Coffee } from 'lucide-react';

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleDark = () => {
    setIsDark(!isDark);
  };

  const gridItems = [
    {
      href: "3naiba.html",
      imgSrc: "https://i.ibb.co/xq848vy6/images-8.jpg",
      videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-computer-451-large.mp4",
      caption: "أعمال حرة",
      icon: <User size={48} />
    },
    {
      href: "law.html",
      imgSrc: "https://i.ibb.co/pvYmnGND/images-9.jpg",
      videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-team-of-people-having-a-meeting-in-an-office-447-large.mp4",
      caption: "مؤسسة او شركة",
      icon: <Building size={48} />
    },
    {
      href: "lesen.html",
      imgSrc: "https://i.ibb.co/pYHzBv7/download-2.jpg",
      videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-woman-shopping-in-a-supermarket-450-large.mp4",
      caption: "محل او تاجر",
      icon: <Store size={48} />
    },
    {
      href: "fool.html",
      imgSrc: "https://i.ibb.co/b5hnnpxt/images-5.jpg",
      videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-barista-making-coffee-in-a-cafe-449-large.mp4",
      caption: "مقهى او مطعم",
      icon: <Coffee size={48} />
    }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans`}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-3 px-6 flex justify-between items-center shadow-md">
        <div className="flex space-x-8 rtl:space-x-reverse">
          <a href="home.html" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">Home</a>
          <a href="المعرض.html" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">المعرض</a>
        </div>
        <button 
          onClick={toggleDark}
          className="w-8 h-8 hover:scale-110 transition-transform"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <img 
              src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" 
              alt="Sun" 
              className="w-full h-full object-contain"
            />
          ) : (
            <img 
              src="https://cdn-icons-png.flaticon.com/512/3068/3068828.png" 
              alt="Moon" 
              className="w-full h-full object-contain"
            />
          )}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <motion.div
          initial={{ scale: 1, y: 0 }}
          animate={isAnimated ? { scale: 0.3, y: -280 } : {}}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="mb-8"
        >
          <img 
            src="https://i.ibb.co/mCn4j10s/Messenger-creation-5806-B85-D-8-A3-B-43-B7-8678-18-F10-EE953-DE-Copy.png" 
            alt="N'dex Logo" 
            className="w-64 sm:w-80 mx-auto drop-shadow-xl"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isAnimated ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Welcome to the Business Card Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose your profession to create a stunning digital business card
          </p>
        </motion.div>
      </section>

      {/* Grid Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gridItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              className="relative block rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {/* Video on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <video 
                  src={item.videoSrc} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              
              {/* Static image */}
              <img 
                src={item.imgSrc} 
                alt={item.caption} 
                className="w-full h-64 object-cover transition-opacity duration-300 group-hover:opacity-0"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-3 text-center font-medium text-gray-800 dark:text-white transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white z-20">
                {item.caption}
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700 mt-16">
        <p>© 2024 N'dex – All rights reserved. Contact: ndexdesainer351@gmail.com</p>
        <a 
          href="privacy.html" 
          className="text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block"
        >
          سياسة الخصوصية
        </a>
      </footer>
    </div>
  );
};

export default App;
