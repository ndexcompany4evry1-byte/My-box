import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Languages, User } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Language dictionary
  const translations = {
    en: {
      title: "Welcome back",
      subtitle: "Sign in to your account",
      email: "Email address",
      password: "Password",
      remember: "Remember me",
      forgot: "Forgot password?",
      login: "Sign in",
      language: "Language",
      success: "Login successful! Redirecting..."
    },
    ar: {
      title: "مرحباً بعودتك",
      subtitle: "سجّل الدخول إلى حسابك",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      remember: "تذكرني",
      forgot: "نسيت كلمة المرور؟",
      login: "تسجيل الدخول",
      language: "اللغة",
      success: "تم تسجيل الدخول بنجاح! جاري التوجيه..."
    }
  };

  // Set initial language based on browser preference
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (['en', 'ar'].includes(browserLang)) {
      setLanguage(browserLang);
    }
  }, []);

  const t = translations[language] || translations.en;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    setIsSubmitted(true);
    
    // Simulate redirect after success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ email: '', password: '' });
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4 transition-all duration-300`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Header with language switcher */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">{t.title}</h1>
              <p className="mt-1 text-indigo-100 text-sm">{t.subtitle}</p>
            </div>
            <div className="relative group">
              <button 
                onClick={() => setLanguage(prev => prev === 'en' ? 'ar' : 'en')}
                className="flex items-center text-white hover:text-indigo-100 transition-colors p-2 rounded-full bg-black/20 backdrop-blur-sm"
                aria-label={t.language}
              >
                <Languages size={20} />
                <span className="mr-2 font-medium">{language === 'en' ? 'EN' : 'ع'}</span>
              </button>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="inline-block p-4 bg-green-100 rounded-full mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.success}</h3>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center">
                    {language === 'ar' ? <Mail size={16} className="ml-2 text-indigo-600" /> : <Mail size={16} className="mr-2 text-indigo-600" />}
                    {t.email}
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder={language === 'ar' ? "example@domain.com" : "you@example.com"}
                    />
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 rtl:left-auto rtl:right-3" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center">
                    {language === 'ar' ? <Lock size={16} className="ml-2 text-indigo-600" /> : <Lock size={16} className="mr-2 text-indigo-600" />}
                    {t.password}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder={language === 'ar' ? "••••••••" : "••••••••"}
                    />
                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 rtl:left-auto rtl:right-3" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="mr-2 text-sm text-gray-700 rtl:mr-0 rtl:ml-2">
                      {t.remember}
                    </label>
                  </div>
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    {t.forgot}
                  </a>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {t.login}
                </motion.button>
              </form>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
            <p className="text-sm text-gray-600 flex items-center justify-center">
              <User size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
              {language === 'ar' ? "ليس لديك حساب؟" : "Don't have an account?"} 
              <a href="#" className="font-medium text-indigo-600 mr-1 rtl:mr-0 rtl:ml-1 hover:text-indigo-500">
                {language === 'ar' ? "أنشئ حساباً" : "Sign up"}
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
