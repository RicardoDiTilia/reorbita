import React, { useMemo } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../components/GradientBackground';
import { Card } from '../components/Card';
import { Skeleton } from '../components/Skeleton';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { SparkChart } from '../components/SparkChart';
import { StatusPill } from '../components/StatusPill';
import { useTheme } from '../contexts/ThemeContext';
import { useFetch } from '../hooks/useFetch';
import { fetchFleet, fetchIss } from '../services/satellites';
import { buildTelemetry, fleetRobots } from '../services/telemetry';
import { useMissions } from '../contexts/MissionsContext';
import { radius, spacing, typography } from '../theme';
import { statusColor } from '../theme/status';
import { Satellite } from '../types';

export const DashboardScreen: React.FC = () => {
  const { colors, mode, toggle } = useTheme();
  const navigation = useNavigation<any>();
  const fleet = useFetch(fetchFleet, []);
  const iss = useFetch(fetchIss, []);
  const { missions } = useMissions();

  const stats = useMemo(() => {
    const items = (fleet.data ?? []).map((s) => ({ s, t: buildTelemetry(s) }));
    const total = items.length;
    const critical = items.filter((x) => x.t.status === 'critical').length;
    const warning = items.filter((x) => x.t.status === 'warning').length;
    const nominal = items.filter((x) => x.t.status === 'nominal').length;
    const orbitReady = items.filter((x) => x.t.orbitReady).length;
    const avgHealth = total ? Math.round(items.reduce((a, x) => a + x.t.overall, 0) / total) : 0;
    const altitudes = items
      .filter((x) => x.s.altitudeKm > 0 && x.s.altitudeKm < 2500)
      .map((x) => x.s.altitudeKm)
      .sort((a, b) => a - b)
      .slice(0, 32);
    const criticalList = items
      .filter((x) => x.t.status === 'critical' || x.t.status === 'warning')
      .sort((a, b) => a.t.overall - b.t.overall)
      .slice(0, 5);
    return { total, critical, warning, nominal, orbitReady, avgHealth, altitudes, criticalList };
  }, [fleet.data]);

  const activeRobots = fleetRobots.filter((r) => r.busy).length;
  const activeMissions = missions.filter((m) => m.status !== 'done').length;

  const refresh = () => {
    fleet.refetch();
    iss.refetch();
  };

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 }}
          refreshControl={
            <RefreshControl
              refreshing={fleet.loading}
              onRefresh={refresh}
              tintColor={colors.primary}
            />
          }
        >
          <Animated.View entering={FadeInDown.duration(500)} style={styles.headerRow}>
            <View>
              <Text style={[typography.caption, { color: colors.primary, textTransform: 'uppercase', fontWeight: '800' }]}>
                REORBITA
              </Text>
              <Text style={[typography.display, { color: colors.text }]}>Centro de Controle</Text>
              <Text style={[typography.caption, { color: colors.textMuted, marginTop: 4 }]}>
                Manutenção preditiva da frota orbital
              </Text>
            </View>
            <Pressable
              onPress={toggle}
              style={[styles.themeBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Ionicons name={mode === 'dark' ? 'sunny' : 'moon'} size={20} color={colors.text} />
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(500)}>
            <Card glow style={{ marginTop: spacing.lg }}>
              {fleet.loading || !fleet.data ? (
                <View style={{ gap: spacing.sm }}>
                  <Skeleton width="40%" />
                  <Skeleton width="60%" height={56} />
                </View>
              ) : (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View>
                      <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase' }]}>
                        Saúde média da frota
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 4 }}>
                        <AnimatedNumber
                          value={stats.avgHealth}
                          style={[styles.bigNum, { color: colors.text }]}
                        />
                        <Text style={[styles.unit, { color: colors.textMuted }]}>/100</Text>
                      </View>
                    </View>
                    <StatusPill
                      size="md"
                      status={
                        stats.avgHealth > 70 ? 'nominal' : stats.avgHealth > 45 ? 'warning' : 'critical'
                      }
                    />
                  </View>
                  <Text style={[typography.body, { color: colors.textMuted, marginBottom: spacing.md }]}>
                    {stats.total} satélites em digital twin · {activeMissions} missões em curso
                  </Text>
                  <SparkChart data={stats.altitudes} />
                  <Text style={[typography.caption, { color: colors.textMuted, marginTop: 6 }]}>
                    Distribuição de altitude orbital · {stats.altitudes.length} objetos amostrados
                  </Text>
                </>
              )}
            </Card>
          </Animated.View>

          <View style={[styles.grid, { marginTop: spacing.lg }]}>
            <MetricCard
              delay={140}
              label="Críticos"
              value={stats.critical}
              icon="alert-circle"
              tint={colors.danger}
              loading={fleet.loading}
            />
            <MetricCard
              delay={180}
              label="Em atenção"
              value={stats.warning}
              icon="warning"
              tint={colors.warning}
              loading={fleet.loading}
            />
            <MetricCard
              delay={220}
              label="Nominais"
              value={stats.nominal}
              icon="checkmark-circle"
              tint={colors.success}
              loading={fleet.loading}
            />
            <MetricCard
              delay={260}
              label="Orbit-Ready"
              value={stats.orbitReady}
              icon="hardware-chip"
              tint={colors.accent}
              loading={fleet.loading}
            />
          </View>

          <Animated.View entering={FadeInDown.delay(320).duration(500)} style={{ marginTop: spacing.lg }}>
            <View style={styles.sectionHeader}>
              <Text style={[typography.subtitle, { color: colors.text }]}>Frota de robôs</Text>
              <Text style={[typography.caption, { color: colors.textMuted }]}>
                {activeRobots}/{fleetRobots.length} em campo
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md, paddingVertical: 4 }}>
              {fleetRobots.map((r) => (
                <Card key={r.id} style={{ width: 200 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <View style={[styles.robotDot, { backgroundColor: r.busy ? colors.warning : colors.success }]} />
                    <Text style={[typography.subtitle, { color: colors.text }]}>{r.callsign}</Text>
                  </View>
                  <Text style={[typography.caption, { color: colors.textMuted, marginTop: 4 }]}>
                    {r.motherStation}
                  </Text>
                  <Text style={[typography.body, { color: colors.text, marginTop: spacing.sm }]}>
                    Combustível {r.fuel}%
                  </Text>
                  <Text style={[typography.caption, { color: r.busy ? colors.warning : colors.success, marginTop: 2 }]}>
                    {r.busy ? 'Em missão' : 'Disponível'}
                  </Text>
                </Card>
              ))}
            </ScrollView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(380).duration(500)} style={{ marginTop: spacing.lg }}>
            <View style={styles.sectionHeader}>
              <Text style={[typography.subtitle, { color: colors.text }]}>Alertas preditivos</Text>
              <Pressable onPress={() => navigation.navigate('Fleet')}>
                <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
                  VER FROTA →
                </Text>
              </Pressable>
            </View>
            {fleet.loading ? (
              <Card><Skeleton height={60} /></Card>
            ) : stats.criticalList.length === 0 ? (
              <Card>
                <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
                  Nenhum alerta. Frota nominal.
                </Text>
              </Card>
            ) : (
              stats.criticalList.map((x, i) => (
                <Animated.View key={x.s.noradId} entering={FadeInDown.delay(420 + i * 50).duration(450)}>
                  <Card
                    onPress={() => navigation.navigate('TwinDetail', { satellite: x.s })}
                    style={{ marginBottom: spacing.sm }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                      <View style={[styles.alertIcon, { backgroundColor: statusColor(x.t.status, colors) + '22' }]}>
                        <Ionicons name="warning" size={20} color={statusColor(x.t.status, colors)} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[typography.subtitle, { color: colors.text }]} numberOfLines={1}>
                          {x.s.name}
                        </Text>
                        <Text style={[typography.caption, { color: colors.textMuted }]} numberOfLines={1}>
                          {x.t.predictedFailureCause ?? 'Anomalia identificada'}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase' }]}>
                          Falha em
                        </Text>
                        <Text style={[typography.subtitle, { color: statusColor(x.t.status, colors) }]}>
                          {x.t.predictedFailureDays ?? '—'}d
                        </Text>
                      </View>
                    </View>
                  </Card>
                </Animated.View>
              ))
            )}
          </Animated.View>

          {iss.data && (
            <Animated.View entering={FadeInDown.delay(560).duration(500)} style={{ marginTop: spacing.lg }}>
              <Card>
                <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase' }]}>
                  Posição ISS (ao vivo)
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
                  <Stat label="Latitude" value={iss.data.latitude.toFixed(2) + '°'} />
                  <Stat label="Longitude" value={iss.data.longitude.toFixed(2) + '°'} />
                  <Stat label="Altitude" value={iss.data.altitudeKm + ' km'} />
                  <Stat label="Velocidade" value={iss.data.velocityKph.toLocaleString('pt-BR') + ' km/h'} />
                </View>
              </Card>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const MetricCard: React.FC<{
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  delay: number;
  loading?: boolean;
}> = ({ label, value, icon, tint, delay, loading }) => {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(450)} style={{ width: '47%', flexGrow: 1 }}>
      <Card>
        <View style={[styles.metricIcon, { backgroundColor: tint + '22' }]}>
          <Ionicons name={icon} size={18} color={tint} />
        </View>
        {loading ? (
          <Skeleton width="50%" height={28} style={{ marginTop: 10 }} />
        ) : (
          <AnimatedNumber value={value} style={[styles.metric, { color: colors.text }]} />
        )}
        <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase' }]}>{label}</Text>
      </Card>
    </Animated.View>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { colors } = useTheme();
  return (
    <View>
      <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase' }]}>{label}</Text>
      <Text style={[typography.subtitle, { color: colors.text }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  themeBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  bigNum: { fontSize: 64, fontWeight: '800', letterSpacing: -2, lineHeight: 68 },
  unit: { fontSize: 18, marginBottom: 10, marginLeft: 4, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metric: { fontSize: 30, fontWeight: '800', marginTop: 10 },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  robotDot: { width: 10, height: 10, borderRadius: 10 },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
