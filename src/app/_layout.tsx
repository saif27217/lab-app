import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import HomeScreen from './index';
import StatsScreen from './stats';
import TestsScreen from './tests';

export default function Layout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <HomeScreen />
        <TestsScreen />
        <StatsScreen />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
