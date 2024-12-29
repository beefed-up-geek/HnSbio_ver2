// src/components/homeContext.js
import React, { createContext, useState } from 'react';

export const HomeContext = createContext({
  rerenderHome: false,
  setRerenderHome: () => {},
});

export const HomeProvider = ({ children }) => {
  const [rerenderHome, setRerenderHome] = useState(false);

  return (
    <HomeContext.Provider value={{ rerenderHome, setRerenderHome }}>
      {children}
    </HomeContext.Provider>
  );
};