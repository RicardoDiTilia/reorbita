export const formatNumber = (n: number, digits = 0) =>
  n.toLocaleString('pt-BR', { maximumFractionDigits: digits, minimumFractionDigits: digits });

export const formatKm = (km: number) => {
  if (km > 1_000_000) return `${formatNumber(km / 1_000_000, 2)} mi km`;
  if (km > 1_000) return `${formatNumber(km / 1_000, 1)} mil km`;
  return `${formatNumber(km, 0)} km`;
};

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export const weatherCodeToText = (code: number): { label: string; icon: string } => {
  const map: Record<number, { label: string; icon: string }> = {
    0: { label: 'Céu limpo', icon: 'sunny' },
    1: { label: 'Predominantemente limpo', icon: 'partly-sunny' },
    2: { label: 'Parcialmente nublado', icon: 'partly-sunny' },
    3: { label: 'Nublado', icon: 'cloudy' },
    45: { label: 'Neblina', icon: 'cloud' },
    48: { label: 'Neblina gelada', icon: 'cloud' },
    51: { label: 'Garoa leve', icon: 'rainy' },
    53: { label: 'Garoa', icon: 'rainy' },
    55: { label: 'Garoa intensa', icon: 'rainy' },
    61: { label: 'Chuva leve', icon: 'rainy' },
    63: { label: 'Chuva', icon: 'rainy' },
    65: { label: 'Chuva forte', icon: 'rainy' },
    71: { label: 'Neve leve', icon: 'snow' },
    73: { label: 'Neve', icon: 'snow' },
    75: { label: 'Neve forte', icon: 'snow' },
    80: { label: 'Pancadas de chuva', icon: 'thunderstorm' },
    81: { label: 'Chuva pesada', icon: 'thunderstorm' },
    82: { label: 'Tempestade', icon: 'thunderstorm' },
    95: { label: 'Tempestade elétrica', icon: 'thunderstorm' },
    96: { label: 'Tempestade c/ granizo', icon: 'thunderstorm' },
    99: { label: 'Tempestade severa', icon: 'thunderstorm' },
  };
  return map[code] ?? { label: 'Indefinido', icon: 'help-circle' };
};

export const cToF = (c: number) => (c * 9) / 5 + 32;
