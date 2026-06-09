import React, { useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../components/GradientBackground';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { HealthBar } from '../components/HealthBar';
import { StatusPill } from '../components/StatusPill';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { useTheme } from '../contexts/ThemeContext';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useMissions } from '../contexts/MissionsContext';
import { buildTelemetry, robotKindLabel } from '../services/telemetry';
import { RobotKind, Satellite } from '../types';
import { radius, spacing, typography } from '../theme';
import { statusColor } from '../theme/status';

export const TwinDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { params } = useRoute<any>();
  const sat = params.satellite as Satellite;
  const { has, toggle } = useWatchlist();
  const { schedule } = useMissions();
  const t = useMemo(() => buildTelemetry(sat), [sat]);
  const watched = has(sat.noradId);

  const repairOptions: RobotKind[] = ['refuel', 'module', 'deorbit', 'capture'];

  const onSchedule = (kind: RobotKind) => {
    const m = schedule(sat, t, kind);
    if (m) {
      navigation.navigate('Tabs', { screen: 'Missions' });
    } else {
      Alert.alert('Indisponível', 'Nenhum robô compatível disponível no momento.');
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <Header
          title="Digital Twin"
          subtitle={`NORAD ${sat.noradId}`}
          onBack={() => navigation.goBack()}
          right={
            <Pressable
              onPress={() => toggle(sat.noradId)}
              style={[styles.iconBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
            >
              <Ionicons name={watched ? 'bookmark' : 'bookmark-outline'} size={20} color={watched ? colors.primary : colors.text} />
            </Pressable>
          }
        />
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 }}>
          <Animated.View entering={FadeInDown.duration(500)}>
            <Card glow>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, paddingRight: spacing.md }}>
                  <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase' }]}>
                    {sat.operator}
                  </Text>
                  <Text style={[typography.title, { color: colors.text }]} numberOfLines={2}>
                    {sat.name}
                  </Text>
                </View>
                <StatusPill status={t.status} size="md" />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: spacing.lg }}>
                <AnimatedNumber value={t.overall} style={[styles.score, { color: statusColor(t.status, colors) }]} />
                <Text style={[styles.scoreUnit, { color: colors.textMuted }]}>/100 saúde global</Text>
              </View>

              {t.orbitReady && (
                <View style={[styles.orbitReadyBadge, { backgroundColor: colors.primarySoft }]}>
                  <Ionicons name="hardware-chip" size={14} color={colors.primary} />
                  <Text style={[typography.caption, { color: colors.primary, fontWeight: '800' }]}>
                    COMPATÍVEL COM PROTOCOLO ORBIT-READY
                  </Text>
                </View>
              )}
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(500)} style={{ marginTop: spacing.lg }}>
            <Card>
              <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.md }]}>
                Telemetria em tempo real
              </Text>
              <HealthBar label="Bateria" value={t.battery} icon={<Ionicons name="battery-half" size={14} color={colors.textMuted} />} />
              <HealthBar label="Combustível" value={t.fuel} icon={<Ionicons name="water" size={14} color={colors.textMuted} />} />
              <HealthBar label="Painéis solares" value={t.solar} icon={<Ionicons name="sunny" size={14} color={colors.textMuted} />} />
              <HealthBar label="Térmico" value={t.thermal} icon={<Ionicons name="thermometer" size={14} color={colors.textMuted} />} />
              <HealthBar label="Sinal" value={t.signal} icon={<Ionicons name="cellular" size={14} color={colors.textMuted} />} />
              <HealthBar label="Atitude" value={t.attitude} icon={<Ionicons name="compass" size={14} color={colors.textMuted} />} />
            </Card>
          </Animated.View>

          {t.predictedFailureDays !== null && (
            <Animated.View entering={FadeInDown.delay(140).duration(500)} style={{ marginTop: spacing.lg }}>
              <Card style={{ borderColor: statusColor(t.status, colors), borderWidth: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Ionicons name="sparkles" size={20} color={colors.primary} />
                  <Text style={[typography.caption, { color: colors.primary, fontWeight: '800', textTransform: 'uppercase' }]}>
                    IA preditiva
                  </Text>
                </View>
                <Text style={[typography.title, { color: colors.text, marginTop: spacing.sm }]}>
                  Falha estimada em {t.predictedFailureDays} dias
                </Text>
                <Text style={[typography.body, { color: colors.textMuted, marginTop: 4 }]}>
                  {t.predictedFailureCause}
                </Text>
              </Card>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ marginTop: spacing.lg }}>
            <Card>
              <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.md }]}>
                Parâmetros orbitais
              </Text>
              <View style={styles.paramGrid}>
                <Param label="Altitude" value={`${sat.altitudeKm} km`} />
                <Param label="Período" value={`${sat.periodMin.toFixed(1)} min`} />
                <Param label="Inclinação" value={`${sat.inclination.toFixed(2)}°`} />
                <Param label="Idade" value={`${t.ageYears.toFixed(1)} anos`} />
                <Param label="ID Internacional" value={sat.intlDesignator} />
                <Param label="Último contato" value={new Date(t.lastContact).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} />
              </View>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(260).duration(500)} style={{ marginTop: spacing.lg }}>
            <Text style={[typography.subtitle, { color: colors.text, marginBottom: spacing.sm }]}>
              Despachar missão de reparo
            </Text>
            <View style={{ gap: spacing.sm }}>
              {repairOptions.map((kind) => (
                <Card key={kind} onPress={() => onSchedule(kind)} style={{ paddingVertical: spacing.md }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                    <View style={[styles.repairIcon, { backgroundColor: colors.primarySoft }]}>
                      <Ionicons name={iconFor(kind)} size={18} color={colors.primary} />
                    </View>
                    <Text style={[typography.subtitle, { color: colors.text, flex: 1 }]}>
                      {robotKindLabel[kind]}
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                  </View>
                </Card>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const iconFor = (k: RobotKind): keyof typeof Ionicons.glyphMap => {
  if (k === 'refuel') return 'water';
  if (k === 'module') return 'cube';
  if (k === 'deorbit') return 'arrow-down-circle';
  return 'magnet';
};

const Param: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { colors } = useTheme();
  return (
    <View style={{ width: '47%' }}>
      <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase' }]}>{label}</Text>
      <Text style={[typography.subtitle, { color: colors.text }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  score: { fontSize: 72, fontWeight: '800', letterSpacing: -2, lineHeight: 76 },
  scoreUnit: { fontSize: 14, marginBottom: 14, marginLeft: 8 },
  orbitReadyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  paramGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, rowGap: spacing.md },
  repairIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
