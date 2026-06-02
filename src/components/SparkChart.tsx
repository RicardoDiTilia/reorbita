import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  data: number[];
  width?: number;
  height?: number;
}

export const SparkChart: React.FC<Props> = ({ data, width = 320, height = 110 }) => {
  const { colors } = useTheme();
  if (!data.length) return <View style={{ width, height }} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1 || 1);

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 16) - 8;
    return { x, y };
  });

  const line = points
    .map((p, i) => {
      if (i === 0) return `M${p.x.toFixed(2)},${p.y.toFixed(2)}`;
      const prev = points[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `C${cx.toFixed(2)},${prev.y.toFixed(2)} ${cx.toFixed(2)},${p.y.toFixed(2)} ${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    })
    .join(' ');

  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.primary} stopOpacity="0.55" />
          <Stop offset="1" stopColor={colors.primary} stopOpacity="0" />
        </LinearGradient>
        <LinearGradient id="stroke" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={colors.primary} />
          <Stop offset="1" stopColor={colors.accent} />
        </LinearGradient>
      </Defs>
      <Path d={area} fill="url(#fill)" />
      <Path d={line} fill="none" stroke="url(#stroke)" strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
};
