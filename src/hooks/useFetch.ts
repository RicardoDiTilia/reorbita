import { useCallback, useEffect, useRef, useState } from 'react';

export function useFetch<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fn();
      if (mounted.current) setData(r);
    } catch (e: any) {
      if (mounted.current) setError(e?.message ?? 'Erro ao buscar dados');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, deps);

  useEffect(() => {
    mounted.current = true;
    run();
    return () => {
      mounted.current = false;
    };
  }, [run]);

  return { data, loading, error, refetch: run };
}
