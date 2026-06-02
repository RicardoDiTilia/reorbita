import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { palette, Palette, ThemeMode } from '../theme';
import { Keys, loadJSON, saveJSON } from '../storage';

interface ThemeCtx {
  mode: ThemeMode;
  colors: Palette;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    loadJSON<ThemeMode>(Keys.theme, 'dark').then(setModeState);
  }, []);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    saveJSON(Keys.theme, m);
  };
  const toggle = () => setMode(mode === 'dark' ? 'light' : 'dark');

  const value = useMemo<ThemeCtx>(
    () => ({ mode, colors: palette[mode], toggle, setMode }),
    [mode]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useTheme = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme fora do provider');
  return v;
};
