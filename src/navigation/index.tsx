import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { DashboardScreen } from '../screens/DashboardScreen';
import { FleetScreen } from '../screens/FleetScreen';
import { MissionsScreen } from '../screens/MissionsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TwinDetailScreen } from '../screens/TwinDetailScreen';
import { TabBar } from './TabBar';
import { useTheme } from '../contexts/ThemeContext';

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabsNav = () => (
  <Tabs.Navigator screenOptions={{ headerShown: false }} tabBar={(p) => <TabBar {...p} />}>
    <Tabs.Screen name="Dashboard" component={DashboardScreen} />
    <Tabs.Screen name="Fleet" component={FleetScreen} />
    <Tabs.Screen name="Missions" component={MissionsScreen} />
    <Tabs.Screen name="Settings" component={SettingsScreen} />
  </Tabs.Navigator>
);

export const RootNavigator: React.FC = () => {
  const { mode, colors } = useTheme();
  const navTheme = {
    ...(mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.bg,
      card: colors.bgElevated,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Tabs" component={TabsNav} />
        <Stack.Screen name="TwinDetail" component={TwinDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
