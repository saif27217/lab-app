import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatReading } from '@/utils/format';
import { useStopwatch } from '@/hooks/use-stopwatch';

export default function StatsScreen() {
  const seconds = useStopwatch();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Session stats</Text>
      <Text style={styles.body}>Booted {seconds}s ago</Text>
      <Text style={styles.body}>
        {formatReading({ value: 3.0001, unit: 'mmol/L', decimals: 3 })}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 24, marginBottom: 8 },
  body: { fontSize: 16 },
});
