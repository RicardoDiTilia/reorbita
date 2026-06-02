export type HealthStatus = 'nominal' | 'warning' | 'critical' | 'offline';

export interface Satellite {
  noradId: number;
  name: string;
  intlDesignator: string;
  epoch: string;
  inclination: number;
  meanMotion: number;
  periodMin: number;
  altitudeKm: number;
  bstar: number;
  group: string;
  operator: string;
}

export interface Telemetry {
  battery: number;
  fuel: number;
  solar: number;
  thermal: number;
  signal: number;
  attitude: number;
  overall: number;
  status: HealthStatus;
  orbitReady: boolean;
  predictedFailureDays: number | null;
  predictedFailureCause: string | null;
  ageYears: number;
  lastContact: string;
}

export type RobotKind = 'refuel' | 'module' | 'deorbit' | 'capture';

export interface Robot {
  id: string;
  callsign: string;
  kind: RobotKind;
  motherStation: string;
  busy: boolean;
  fuel: number;
}

export type MissionStatus = 'scheduled' | 'enroute' | 'docking' | 'working' | 'done';

export interface Mission {
  id: string;
  satelliteNorad: number;
  satelliteName: string;
  robotId: string;
  robotCallsign: string;
  kind: RobotKind;
  status: MissionStatus;
  progress: number;
  etaMin: number;
  scheduledAt: number;
  reason: string;
}

export type FleetFilter = 'all' | 'critical' | 'warning' | 'nominal' | 'orbitReady';
export type SortKey = 'health' | 'altitude' | 'age' | 'name';
