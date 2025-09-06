import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Theme {
  name: string;
  palette: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    fontSize: number;
  };
}

interface ThemeContextType {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (themeName: string) => void;
  createCustomTheme: (theme: Theme) => void;
}

const defaultTheme: Theme = {
  name: 'light',
  palette: {
    primary: '#1976d2',
    secondary: '#dc004e',
    background: '#ffffff',
    text: '#000000',
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 16,
  },
};

const darkTheme: Theme = {
  name: 'dark',
  palette: {
    primary: '#90caf9',
    secondary: '#f48fb1',
    background: '#303030',
    text: '#ffffff',
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 16,
  },
};

const highContrastTheme: Theme = {
  name: 'high-contrast',
  palette: {
    primary: '#0000ff',
    secondary: '#ff0000',
    background: '#ffff00',
    text: '#000000',
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontSize: 18,
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themes, setThemes] = useState<Theme[]>([defaultTheme, darkTheme, highContrastTheme]);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    // Load theme from localStorage if available
    const savedThemeName = localStorage.getItem('theme');
    if (savedThemeName) {
      const savedTheme = themes.find(theme => theme.name === savedThemeName);
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      }
    }
    
    // Apply theme to document
    applyTheme(currentTheme);
  }, []);

  useEffect(() => {
    // Apply theme whenever it changes
    applyTheme(currentTheme);
    // Save theme preference to localStorage
    localStorage.setItem('theme', currentTheme.name);
  }, [currentTheme]);

  const applyTheme = (theme: Theme) => {
    // Apply CSS variables to document
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.palette.primary);
    root.style.setProperty('--secondary-color', theme.palette.secondary);
    root.style.setProperty('--background-color', theme.palette.background);
    root.style.setProperty('--text-color', theme.palette.text);
    root.style.setProperty('--font-family', theme.typography.fontFamily);
    root.style.setProperty('--font-size', `${theme.typography.fontSize}px`);
    
    // Toggle dark class for Tailwind
    if (theme.name === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setTheme = (themeName: string) => {
    const theme = themes.find(t => t.name === themeName);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  const createCustomTheme = (theme: Theme) => {
    setThemes(prev => {
      const existingIndex = prev.findIndex(t => t.name === theme.name);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = theme;
        return updated;
      }
      return [...prev, theme];
    });
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themes, setTheme, createCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};