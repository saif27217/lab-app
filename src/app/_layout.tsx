import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function Layout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NativeTabs backgroundColor="#070D1A" indicatorColor="rgba(103,232,249,0.14)">
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="tests">
          <NativeTabs.Trigger.Label>Lab tests</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="stats">
          <NativeTabs.Trigger.Label>Session stats</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
