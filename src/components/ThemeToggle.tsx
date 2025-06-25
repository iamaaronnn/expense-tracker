
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { THEMES } from '@/types/expense';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const nextTheme = () => {
    const currentIndex = THEMES.findIndex(t => t.value === theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex].value);
  };

  const currentTheme = THEMES.find(t => t.value === theme);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={nextTheme}
      className="flex items-center gap-2"
    >
      <span className="text-lg">{currentTheme?.icon}</span>
      <span>{currentTheme?.name}</span>
    </Button>
  );
};
