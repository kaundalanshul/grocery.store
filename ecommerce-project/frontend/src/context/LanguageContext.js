import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const translations = {
  en: {
    home: 'Home',
    allProducts: 'All Products',
    grocery: 'Grocery',
    apparel: 'Apparel',
    shoes: 'Shoes',
    furniture: 'Furniture',
    books: 'Books',
    sports: 'Sports',
    cart: 'Cart',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    myProducts: 'My Products',
    myOrders: 'My Orders',
  },
  hi: {
    home: 'होम',
    allProducts: 'सभी प्रोडक्ट्स',
    grocery: 'किराना',
    apparel: 'परिधान',
    shoes: 'जूते',
    furniture: 'फर्नीचर',
    books: 'पुस्तकें',
    sports: 'खेल',
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
