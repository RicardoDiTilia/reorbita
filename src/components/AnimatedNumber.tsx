import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';

interface Props {
  value: number;
  duration?: number;
  digits?: number;
  suffix?: string;
  style?: TextStyle | TextStyle[];
}

export const AnimatedNumber: React.FC<Props> = ({
  value,
  duration = 900,
  digits = 0,
  suffix = '',
  style,
}) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!Number.isFinite(value)) {
      setDisplay(0);
      return;
    }
    let raf: number;
    const start = performance.now();
    const from = Number.isFinite(display) ? display : 0;
    const delta = value - from;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + delta * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <Text style={style}>
      {display.toLocaleString('pt-BR', { maximumFractionDigits: digits, minimumFractionDigits: digits })}
      {suffix}
    </Text>
  );
};
