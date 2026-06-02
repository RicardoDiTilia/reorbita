import { HealthStatus } from '../types';
import { Palette } from './index';

export const statusColor = (s: HealthStatus, c: Palette) => {
  switch (s) {
    case 'nominal':
      return c.success;
    case 'warning':
      return c.warning;
    case 'critical':
      return c.danger;
    case 'offline':
    default:
      return c.textMuted;
  }
};

export const statusLabel: Record<HealthStatus, string> = {
  nominal: 'Nominal',
  warning: 'Atenção',
  critical: 'Crítico',
  offline: 'Offline',
};

export const statusBg = (s: HealthStatus) => {
  switch (s) {
    case 'nominal':
      return 'rgba(34,197,94,0.16)';
    case 'warning':
      return 'rgba(245,158,11,0.18)';
    case 'critical':
      return 'rgba(255,92,122,0.18)';
    default:
      return 'rgba(140,144,184,0.18)';
  }
};
