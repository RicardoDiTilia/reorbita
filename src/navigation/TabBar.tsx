import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { radius, spacing } from '../theme';

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Dashboard: 'pulse',
  Fleet: 'planet',
  Missions: 'rocket',
  Settings: 'settings',
};

const labels: Record<string, string> = {
  Dashboard: 'Controle',
  Fleet: 'Frota',
  Missions: 'Missões',
  Settings: 'Ajustes',
};

export const TabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.bgElevated,
            borderColor: colors.border,
            shadowColor: colors.glow,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          return (
            <TabItem
              key={route.key}
              focused={focused}
              icon={icons[route.name]}
              label={labels[route.name] ?? route.name}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

const TabItem: React.FC<{
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}> = ({ focused, icon, label, onPress }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(focused ? 1 : 0.9);
  const width = useSharedValue(focused ? 116 : 48);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0.92, { damping: 14 });
    width.value = withTiming(focused ? 124 : 48, { duration: 260 });
  }, [focused]);

  const aWrap = useAnimatedStyle(() => ({
    width: width.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={onPress} style={styles.itemPress}>
      <Animated.View
        style={[
          styles.item,
          { backgroundColor: focused ? colors.primary : 'transparent' },
          aWrap,
        ]}
      >
        <Ionicons name={icon} size={20} color={focused ? '#fff' : colors.textMuted} />
        {focused && (
          <Animated.Text style={styles.label} numberOfLines={1}>
            {label}
          </Animated.Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
    gap: 4,
  },
  itemPress: { padding: 2 },
  item: {
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    overflow: 'hidden',
  },
  label: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
