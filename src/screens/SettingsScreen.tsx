import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../components/GradientBackground';
import { Card } from '../components/Card';
import { useTheme } from '../contexts/ThemeContext';
import { useMissions } from '../contexts/MissionsContext';
import { spacing, typography, radius } from '../theme';

export const SettingsScreen: React.FC = () => {
  const { colors, mode, toggle } = useTheme();
  const { missions, clear } = useMissions();

  const confirmClear = () => {
    Alert.alert('Limpar histórico', `Remover ${missions.length} ${missions.length === 1 ? 'missão' : 'missões'}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: clear },
    ]);
  };

  const pillars = [
    {
      icon: 'pulse' as const,
      title: 'Inteligência Orbital',
      desc: 'Digital twin de cada satélite com IA preditiva — antecipa falhas de bateria, combustível e atitude.',
    },
    {
      icon: 'rocket' as const,
      title: 'Frota Modular de Reparo',
      desc: 'Veículos especializados em reabastecer, trocar módulos, corrigir trajetória e capturar detritos.',
    },
    {
      icon: 'hardware-chip' as const,
      title: 'Protocolo Orbit-Ready',
      desc: 'Padrão aberto de acoplamento universal — o "USB-C para satélites".',
    },
  ];

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 }}>
          <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase' }]}>
            Preferências
          </Text>
          <Text style={[typography.display, { color: colors.text, marginBottom: spacing.lg }]}>
            Ajustes
          </Text>

          <Animated.View entering={FadeInDown.duration(420)}>
            <Card>
              <View style={styles.row}>
                <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
                  <Ionicons name={mode === 'dark' ? 'moon' : 'sunny'} size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.subtitle, { color: colors.text }]}>Modo escuro</Text>
                  <Text style={[typography.caption, { color: colors.textMuted }]}>
                    Tema da interface
                  </Text>
                </View>
                <Switch
                  value={mode === 'dark'}
                  onValueChange={toggle}
                  trackColor={{ true: colors.primary, false: colors.surfaceAlt }}
                  thumbColor="#fff"
                />
              </View>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(420)}>
            <Card style={{ marginTop: spacing.md }} onPress={missions.length ? confirmClear : undefined}>
              <View style={styles.row}>
                <View style={[styles.icon, { backgroundColor: 'rgba(255,92,122,0.18)' }]}>
                  <Ionicons name="trash" size={20} color={colors.danger} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.subtitle, { color: colors.text }]}>Limpar histórico de missões</Text>
                  <Text style={[typography.caption, { color: colors.textMuted }]}>
                    {missions.length} {missions.length === 1 ? 'missão registrada' : 'missões registradas'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </View>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(160).duration(420)}>
            <Card style={{ marginTop: spacing.xl }}>
              <Text style={[typography.caption, { color: colors.primary, textTransform: 'uppercase', fontWeight: '800' }]}>
                A REORBITA
              </Text>
              <Text style={[typography.title, { color: colors.text, marginTop: 4 }]}>
                Da órbita morta à oficina ativa
              </Text>
              <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.sm }]}>
                Mais de 60% dos satélites lançados na última década ainda estarão em órbita em 2035,
                mas a maioria deixará de funcionar muito antes. A REORBITA propõe um ecossistema
                integrado de manutenção orbital sustentado por três pilares:
              </Text>
            </Card>
          </Animated.View>

          {pillars.map((p, i) => (
            <Animated.View key={p.title} entering={FadeInDown.delay(220 + i * 60).duration(420)}>
              <Card style={{ marginTop: spacing.md }}>
                <View style={styles.row}>
                  <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
                    <Ionicons name={p.icon} size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[typography.subtitle, { color: colors.text }]}>{p.title}</Text>
                    <Text style={[typography.caption, { color: colors.textMuted, marginTop: 4 }]}>
                      {p.desc}
                    </Text>
                  </View>
                </View>
              </Card>
            </Animated.View>
          ))}

          <Animated.View entering={FadeInDown.delay(460).duration(420)}>
            <Card style={{ marginTop: spacing.md }}>
              <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase' }]}>
                Por que faz sentido
              </Text>
              <BulletItem text="Combate à Síndrome de Kessler — efeito dominó de detritos." />
              <BulletItem text="Economia circular: componentes reaproveitados em órbita." />
              <BulletItem text="Satélite como serviço contínuo, não produto descartável." />
              <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.md }]}>
                Dados orbitais reais fornecidos por CelesTrak · Where the ISS at?
              </Text>
              <Text style={[typography.caption, { color: colors.textMuted, marginTop: 4 }]}>
                ODS 9 · 11 · 13 — Indústria, cidades sustentáveis e ação climática.
              </Text>
            </Card>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const BulletItem: React.FC<{ text: string }> = ({ text }) => {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: spacing.sm }}>
      <Text style={{ color: colors.primary, fontSize: 14 }}>▸</Text>
      <Text style={[typography.body, { color: colors.text, flex: 1 }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
