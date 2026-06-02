import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Mission, MissionStatus, RobotKind, Satellite, Telemetry } from '../types';
import { Keys, loadJSON, saveJSON } from '../storage';
import { fleetRobots } from '../services/telemetry';

interface MissionsCtx {
  missions: Mission[];
  schedule: (sat: Satellite, tel: Telemetry, kind: RobotKind) => Mission | null;
  cancel: (id: string) => void;
  clear: () => void;
}

const Ctx = createContext<MissionsCtx | null>(null);

const STATUS_ORDER: MissionStatus[] = ['scheduled', 'enroute', 'docking', 'working', 'done'];

export const MissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadJSON<Mission[]>(Keys.missions, []).then((v) => {
      setMissions(v);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) saveJSON(Keys.missions, missions);
  }, [missions, hydrated]);

  useEffect(() => {
    tick.current = setInterval(() => {
      setMissions((prev) =>
        prev.map((m) => {
          if (m.status === 'done') return m;
          const next = Math.min(100, m.progress + 4 + Math.random() * 4);
          let status: MissionStatus = m.status;
          if (next >= 100) status = 'done';
          else if (next > 75) status = 'working';
          else if (next > 45) status = 'docking';
          else if (next > 5) status = 'enroute';
          const etaMin = Math.max(0, Math.round((100 - next) * 0.35));
          return { ...m, progress: next, etaMin, status };
        })
      );
    }, 3500);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, []);

  const schedule: MissionsCtx['schedule'] = (sat, tel, kind) => {
    const robot = fleetRobots.find((r) => r.kind === kind && !r.busy) ?? fleetRobots.find((r) => r.kind === kind);
    if (!robot) return null;
    const reason =
      tel.predictedFailureCause ??
      (kind === 'refuel'
        ? 'Reabastecimento preventivo'
        : kind === 'module'
        ? 'Substituição de módulo'
        : kind === 'deorbit'
        ? 'Descarte controlado'
        : 'Captura de detrito orbital');
    const mission: Mission = {
      id: `${sat.noradId}-${kind}-${Date.now()}`,
      satelliteNorad: sat.noradId,
      satelliteName: sat.name,
      robotId: robot.id,
      robotCallsign: robot.callsign,
      kind,
      status: 'scheduled',
      progress: 0,
      etaMin: 35 + Math.round(Math.random() * 90),
      scheduledAt: Date.now(),
      reason,
    };
    setMissions((p) => [mission, ...p]);
    return mission;
  };

  const cancel = (id: string) => setMissions((p) => p.filter((m) => m.id !== id));
  const clear = () => setMissions([]);

  const sorted = useMemo(
    () =>
      [...missions].sort(
        (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || b.scheduledAt - a.scheduledAt
      ),
    [missions]
  );

  const value = useMemo<MissionsCtx>(
    () => ({ missions: sorted, schedule, cancel, clear }),
    [sorted]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useMissions = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useMissions fora do provider');
  return v;
};
