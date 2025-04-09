'use client';
import { createContext, useState, useContext, ReactNode } from 'react';
import FullScreenLoading from '@/components/FullScreenLoading';

const FullScreenLoaderContext = createContext({
  showLoader: () => {},
  hideLoader: () => {},
});

export const useFullScreenLoader = () => useContext(FullScreenLoaderContext);

export const FullScreenLoaderProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);

  const showLoader = () => setVisible(true);
  const hideLoader = () => setVisible(false);

  return (
    <FullScreenLoaderContext.Provider value={{ showLoader, hideLoader }}>
      {visible && <FullScreenLoading />}
      {children}
    </FullScreenLoaderContext.Provider>
  );
};