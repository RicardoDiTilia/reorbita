import { HealthStatus, Robot, Satellite, Telemetry } from '../types';

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const causes = [
  'Degradação acelerada de bateria de íons de lítio',
  'Combustível abaixo do mínimo operacional',
  'Perda de eficiência em painéis solares',
  'Anomalia térmica recorrente',
  'Desvio de atitude além da tolerância',
  'Falha intermitente no transponder',
];

export const buildTelemetry = (sat: Satellite): Telemetry => {
  const rng = mulberry32(sat.noradId);
  const epochMs = new Date(sat.epoch).getTime();
  const epochAge = Number.isFinite(epochMs)
    ? (Date.now() - epochMs) / (365.25 * 24 * 3600 * 1000)
    : 0;
  const ageYears = Math.max(0.2, Math.min(20, Math.abs(epochAge) + rng() * 12));

  const ageFactor = Math.min(1, ageYears / 14);
  const noise = () => rng() * 18;

  const battery = clamp(100 - ageFactor * 55 - noise(), 8, 100);
  const fuel = clamp(100 - ageFactor * 60 - noise() * 1.2, 0, 100);
  const solar = clamp(100 - ageFactor * 40 - noise() * 0.8, 25, 100);
  const thermal = clamp(100 - noise() * 1.4, 30, 100);
  const signal = clamp(100 - noise() * 0.6, 55, 100);
  const attitude = clamp(100 - noise() * 0.9, 50, 100);

  const overall = Math.round(
    battery * 0.28 + fuel * 0.24 + solar * 0.18 + thermal * 0.12 + signal * 0.1 + attitude * 0.08
  );

  let status: HealthStatus = 'nominal';
  if (overall < 35) status = 'critical';
  else if (overall < 60) status = 'warning';
  if (rng() < 0.04) status = 'offline';

  const lowest = Math.min(battery, fuel, solar);
  let predictedFailureDays: number | null = null;
  let predictedFailureCause: string | null = null;
  if (status !== 'nominal' && status !== 'offline') {
    predictedFailureDays = Math.round(20 + lowest * 4 + rng() * 60);
    predictedFailureCause =
      lowest === battery
        ? causes[0]
        : lowest === fuel
        ? causes[1]
        : lowest === solar
        ? causes[2]
        : causes[Math.floor(rng() * causes.length)];
  }

  const orbitReady = rng() > 0.55;
  const lastContact = new Date(Date.now() - rng() * 6 * 3600 * 1000).toISOString();

  return {
    battery: Math.round(battery),
    fuel: Math.round(fuel),
    solar: Math.round(solar),
    thermal: Math.round(thermal),
    signal: Math.round(signal),
    attitude: Math.round(attitude),
    overall,
    status,
    orbitReady,
    predictedFailureDays,
    predictedFailureCause,
    ageYears: Math.round(ageYears * 10) / 10,
    lastContact,
  };
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const fleetRobots: Robot[] = [
  { id: 'r-01', callsign: 'REFUEL-01', kind: 'refuel', motherStation: 'OASIS-A · 540 km', busy: false, fuel: 84 },
  { id: 'r-02', callsign: 'MODUL-02', kind: 'module', motherStation: 'OASIS-A · 540 km', busy: true, fuel: 67 },
  { id: 'r-03', callsign: 'DEORBIT-03', kind: 'deorbit', motherStation: 'OASIS-B · 720 km', busy: false, fuel: 91 },
  { id: 'r-04', callsign: 'CAPTURE-04', kind: 'capture', motherStation: 'OASIS-B · 720 km', busy: true, fuel: 48 },
  { id: 'r-05', callsign: 'REFUEL-05', kind: 'refuel', motherStation: 'OASIS-C · 1200 km', busy: false, fuel: 76 },
];

export const robotKindLabel: Record<Robot['kind'], string> = {
  refuel: 'Reabastecimento',
  module: 'Troca de módulo',
  deorbit: 'Descarte controlado',
  capture: 'Captura de detrito',
};

export const robotKindIcon: Record<Robot['kind'], string> = {
  refuel: 'water',
  module: 'cube',
  deorbit: 'arrow-down-circle',
  capture: 'magnet',
};
