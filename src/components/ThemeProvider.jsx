import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.settings);

  useEffect(() => {
    // Update the document's data-theme attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update the body's class for Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return children;
};

export default ThemeProvider; 
