import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Keys, loadJSON, saveJSON } from '../storage';

interface WatchCtx {
  ids: number[];
  toggle: (id: number) => void;
  has: (id: number) => boolean;
}

const Ctx = createContext<WatchCtx | null>(null);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ids, setIds] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadJSON<number[]>(Keys.watchlist, []).then((v) => {
      setIds(v);
      setHydrated(true);
    });
  }, []);
  useEffect(() => {
    if (hydrated) saveJSON(Keys.watchlist, ids);
  }, [ids, hydrated]);

  const toggle = (id: number) =>
    setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [id, ...p]));
  const has = (id: number) => ids.includes(id);

  const value = useMemo(() => ({ ids, toggle, has }), [ids]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useWatchlist = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useWatchlist fora do provider');
  return v;
};
