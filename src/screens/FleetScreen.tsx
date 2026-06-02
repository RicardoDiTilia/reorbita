import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../components/GradientBackground';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { StatusPill } from '../components/StatusPill';
import { useTheme } from '../contexts/ThemeContext';
import { useFetch } from '../hooks/useFetch';
import { fetchFleet } from '../services/satellites';
import { buildTelemetry } from '../services/telemetry';
import { FleetFilter, Satellite, SortKey, Telemetry } from '../types';
import { radius, spacing, typography } from '../theme';
import { statusColor } from '../theme/status';

const filters: { key: FleetFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'critical', label: 'Críticos' },
  { key: 'warning', label: 'Atenção' },
  { key: 'nominal', label: 'Nominais' },
  { key: 'orbitReady', label: 'Orbit-Ready' },
];

const sorts: { key: SortKey; label: string }[] = [
  { key: 'health', label: 'Saúde' },
  { key: 'altitude', label: 'Altitude' },
  { key: 'age', label: 'Idade' },
  { key: 'name', label: 'Nome' },
];

export const FleetScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { data, loading, error, refetch } = useFetch(fetchFleet, []);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FleetFilter>('all');
  const [sort, setSort] = useState<SortKey>('health');

  const list = useMemo(() => {
    const items: { s: Satellite; t: Telemetry }[] = (data ?? []).map((s) => ({
      s,
      t: buildTelemetry(s),
    }));
    let arr = items;
    if (filter === 'orbitReady') arr = arr.filter((x) => x.t.orbitReady);
    else if (filter !== 'all') arr = arr.filter((x) => x.t.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (x) =>
          (x.s.name ?? '').toLowerCase().includes(q) ||
          (x.s.operator ?? '').toLowerCase().includes(q) ||
          String(x.s.noradId).includes(q)
      );
    }
    const cp = [...arr];
    cp.sort((a, b) => {
      if (sort === 'health') return a.t.overall - b.t.overall;
      if (sort === 'altitude') return a.s.altitudeKm - b.s.altitudeKm;
      if (sort === 'age') return b.t.ageYears - a.t.ageYears;
      return (a.s.name ?? '').localeCompare(b.s.name ?? '');
    });
    return cp;
  }, [data, query, filter, sort]);

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
          <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase' }]}>
            Catálogo · {data?.length ?? 0} satélites
          </Text>
          <Text style={[typography.display, { color: colors.text }]}>Frota</Text>

          <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar satélite ou NORAD ID..."
              placeholderTextColor={colors.textMuted}
              style={{ flex: 1, color: colors.text, fontSize: 15 }}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </Pressable>
            )}
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filters}
            keyExtractor={(i) => i.key}
            contentContainerStyle={{ gap: spacing.sm, paddingVertical: spacing.md }}
            renderItem={({ item }) => (
              <Chip label={item.label} active={filter === item.key} onPress={() => setFilter(item.key)} />
            )}
          />

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm }}>
            {sorts.map((s) => (
              <Chip key={s.key} label={`↕ ${s.label}`} active={sort === s.key} onPress={() => setSort(s.key)} />
            ))}
          </View>
        </View>

        <FlatList
          data={loading ? Array.from({ length: 6 }) : list}
          keyExtractor={(item: any, i) => item?.s?.noradId?.toString() ?? `skel-${i}`}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 140, gap: spacing.md }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                icon="planet-outline"
                title={error ? 'Falha de conexão' : 'Sem satélites'}
                message={error ?? 'Ajuste os filtros para ver outros objetos.'}
              />
            ) : null
          }
          renderItem={({ item, index }) => {
            if (loading) {
              return (
                <Card>
                  <Skeleton width="60%" height={18} />
                  <Skeleton width="40%" height={14} style={{ marginTop: 10 }} />
                </Card>
              );
            }
            const { s, t } = item as { s: Satellite; t: Telemetry };
            return (
              <Animated.View entering={FadeInDown.delay(index * 28).duration(420)}>
                <Card onPress={() => navigation.navigate('TwinDetail', { satellite: s })}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                    <View style={[styles.thumb, { backgroundColor: statusColor(t.status, colors) + '22' }]}>
                      <Ionicons name="planet" size={22} color={statusColor(t.status, colors)} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[typography.subtitle, { color: colors.text }]} numberOfLines={1}>
                        {s.name}
                      </Text>
                      <Text style={[typography.caption, { color: colors.textMuted }]}>
                        {s.operator} · {s.altitudeKm} km · {t.ageYears.toFixed(1)}a
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <Text style={[typography.subtitle, { color: statusColor(t.status, colors) }]}>
                        {t.overall}
                      </Text>
                      <StatusPill status={t.status} />
                    </View>
                  </View>
                  {t.orbitReady && (
                    <View style={[styles.orbitReady, { backgroundColor: colors.primarySoft }]}>
                      <Ionicons name="hardware-chip-outline" size={12} color={colors.primary} />
                      <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
                        ORBIT-READY
                      </Text>
                    </View>
                  )}
                </Card>
              </Animated.View>
            );
          }}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 48,
    borderRadius: radius.md,
    marginTop: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  thumb: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitReady: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
});
