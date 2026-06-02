import { celestrak, openNotify } from './api';
import { Satellite } from '../types';
import { cached, Keys } from '../storage';

const HOUR = 60 * 60 * 1000;

interface CelestrakRow {
  OBJECT_NAME: string;
  OBJECT_ID: string;
  EPOCH: string;
  MEAN_MOTION: number;
  INCLINATION: number;
  BSTAR: number;
  NORAD_CAT_ID: number;
}

const GROUPS: { group: string; operator: string }[] = [
  { group: 'stations', operator: 'Multinacional' },
  { group: 'weather', operator: 'NOAA' },
  { group: 'noaa', operator: 'NOAA' },
  { group: 'goes', operator: 'NOAA' },
  { group: 'gps-ops', operator: 'US Space Force' },
  { group: 'starlink', operator: 'SpaceX' },
  { group: 'oneweb', operator: 'OneWeb' },
  { group: 'science', operator: 'NASA/ESA' },
];

const MU = 398600.4418;
const EARTH = 6371;

const altitudeFromMeanMotion = (meanMotion: number) => {
  const periodSec = 86400 / meanMotion;
  const a = Math.cbrt((MU * periodSec * periodSec) / (4 * Math.PI * Math.PI));
  return Math.round(a - EARTH);
};

const mapRow = (row: CelestrakRow, group: string, operator: string): Satellite => {
  const periodMin = 1440 / row.MEAN_MOTION;
  return {
    noradId: row.NORAD_CAT_ID,
    name: row.OBJECT_NAME ?? `Objeto ${row.NORAD_CAT_ID}`,
    intlDesignator: row.OBJECT_ID ?? '—',
    epoch: row.EPOCH,
    inclination: row.INCLINATION,
    meanMotion: row.MEAN_MOTION,
    periodMin: Math.round(periodMin * 10) / 10,
    altitudeKm: altitudeFromMeanMotion(row.MEAN_MOTION),
    bstar: row.BSTAR,
    group,
    operator,
  };
};

export const fetchFleet = (): Promise<Satellite[]> =>
  cached(Keys.fleetCache, 6 * HOUR, async () => {
    const all: Satellite[] = [];
    const seen = new Set<number>();
    for (const g of GROUPS) {
      try {
        const { data } = await celestrak.get<CelestrakRow[]>(
          '/NORAD/elements/gp.php',
          { params: { GROUP: g.group, FORMAT: 'json' } }
        );
        for (const row of data.slice(0, g.group === 'starlink' ? 14 : 8)) {
          if (seen.has(row.NORAD_CAT_ID)) continue;
          seen.add(row.NORAD_CAT_ID);
          all.push(mapRow(row, g.group, g.operator));
        }
      } catch {}
    }
    return all;
  });

export interface IssPosition {
  latitude: number;
  longitude: number;
  altitudeKm: number;
  velocityKph: number;
  timestamp: number;
}

export const fetchIss = async (): Promise<IssPosition> => {
  const { data } = await openNotify.get('/satellites/25544');
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    altitudeKm: Math.round(data.altitude),
    velocityKph: Math.round(data.velocity),
    timestamp: data.timestamp,
  };
};
