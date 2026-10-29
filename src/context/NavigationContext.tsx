import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface NavigationContextType {
  currentPath: string;
  navigate: (to: string, options?: { scroll?: boolean }) => void;
}

const getFullLocation = (): string => {
  if (typeof window === 'undefined') return '/';
  return (window.location.pathname || '/') + (window.location.search || '');
};

const NavigationContext = createContext<NavigationContextType>({
  currentPath: typeof window !== 'undefined' ? getFullLocation() : '/',
  navigate: () => {},
});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(getFullLocation);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getFullLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = useCallback((to: string, options?: { scroll?: boolean }) => {
    const current = getFullLocation();
    if (to === current) {
      if (options?.scroll !== false) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    window.history.pushState({}, '', to);
    setCurrentPath(to);

    if (options?.scroll !== false) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <NavigationContext.Provider value={{ currentPath, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
