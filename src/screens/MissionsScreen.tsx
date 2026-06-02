import React, { useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../components/GradientBackground';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../contexts/ThemeContext';
import { useMissions } from '../contexts/MissionsContext';
import { robotKindLabel } from '../services/telemetry';
import { Mission } from '../types';
import { radius, spacing, typography } from '../theme';

const statusLabel: Record<Mission['status'], string> = {
  scheduled: 'Agendada',
  enroute: 'A caminho',
  docking: 'Acoplando',
  working: 'Operando',
  done: 'Concluída',
};

export const MissionsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { missions, cancel } = useMissions();

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
          <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase' }]}>
            {missions.filter((m) => m.status !== 'done').length} ativas · {missions.length} no total
          </Text>
          <Text style={[typography.display, { color: colors.text }]}>Missões</Text>
        </View>

        <FlatList
          data={missions}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140, gap: spacing.md }}
          ListEmptyComponent={
            <EmptyState
              icon="rocket-outline"
              title="Sem missões"
              message="Abra um satélite na Frota e despache um robô para acompanhar a operação aqui."
            />
          }
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 40).duration(420)}
              layout={LinearTransition.springify()}
            >
              <MissionCard m={item} onCancel={() => cancel(item.id)} />
            </Animated.View>
          )}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

const MissionCard: React.FC<{ m: Mission; onCancel: () => void }> = ({ m, onCancel }) => {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(m.progress, { duration: 800 });
  }, [m.progress]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value}%` }));

  const tint =
    m.status === 'done' ? colors.success : m.status === 'working' || m.status === 'docking' ? colors.accent : colors.primary;

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View style={[styles.icon, { backgroundColor: tint + '22' }]}>
          <Ionicons name={icon(m)} size={20} color={tint} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase' }]}>
            {robotKindLabel[m.kind]} · {m.robotCallsign}
          </Text>
          <Text style={[typography.subtitle, { color: colors.text }]} numberOfLines={1}>
            {m.satelliteName}
          </Text>
        </View>
        {m.status !== 'done' && (
          <Pressable onPress={onCancel} hitSlop={12}>
            <Ionicons name="close-circle" size={22} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.sm }]}>
        {m.reason}
      </Text>

      <View style={[styles.track, { backgroundColor: colors.surfaceAlt, marginTop: spacing.md }]}>
        <Animated.View style={[styles.fillWrap, fillStyle]}>
          <LinearGradient
            colors={[tint, tint + 'AA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      <View style={[styles.row, { marginTop: spacing.sm }]}>
        <Text style={[typography.caption, { color: tint, fontWeight: '700', textTransform: 'uppercase' }]}>
          {statusLabel[m.status]} · {Math.round(m.progress)}%
        </Text>
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          {m.status === 'done' ? 'Concluída agora' : `ETA ${m.etaMin} min`}
        </Text>
      </View>
    </Card>
  );
};

const icon = (m: Mission): keyof typeof Ionicons.glyphMap => {
  if (m.status === 'done') return 'checkmark-done-circle';
  if (m.kind === 'refuel') return 'water';
  if (m.kind === 'module') return 'cube';
  if (m.kind === 'deorbit') return 'arrow-down-circle';
  return 'magnet';
};

const styles = StyleSheet.create({
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: { height: 10, borderRadius: 999, overflow: 'hidden' },
  fillWrap: { height: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
