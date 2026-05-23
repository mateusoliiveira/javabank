import { useThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
  const { theme, colors, resolvedTheme, toggleTheme, setTheme } = useThemeContext();

  return {
    theme,
    colors,
    toggleTheme,
    setTheme,
    isDark: resolvedTheme === 'dark',
  };
};
