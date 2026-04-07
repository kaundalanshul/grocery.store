import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const translations = {
  en: {
    home: 'Home',
    allProducts: 'All Products',
    mens: "Men's",
    womens: "Women's",
    jewelry: 'Jewelry',
    footwear: 'Footwear',
    accessories: 'Accessories',
    cart: 'Cart',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    myProducts: 'My Products',
    myOrders: 'My Orders',
  },
  hi: {
    home: 'होम',
    allProducts: 'सभी प्रोडक्ट्स',
    mens: 'पुरुष',
    womens: 'महिला',
    jewelry: 'ज्वेलरी',
    footwear: 'फुटवियर',
    accessories: 'एसेसरीज़',
    cart: 'कार्ट',
    signIn: 'लॉगिन',
    signOut: 'साइन आउट',
    myProducts: 'मेरे प्रोडक्ट्स',
    myOrders: 'मेरे ऑर्डर्स',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'hi' : 'en';
      localStorage.setItem('language', next);
      return next;
    });
  };

  const t = useCallback(
    (key) => translations[language]?.[key] || translations.en[key] || key,
    [language]
  );

  const value = useMemo(() => ({ language, toggleLanguage, t }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};

export default LanguageContext;
