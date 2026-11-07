import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatReading } from '@/utils/format';
import { useStopwatch } from '@/hooks/use-stopwatch';

export default function StatsScreen() {
  const seconds = useStopwatch();
  return (
    <LinearGradient style={styles.fill} colors={['#070D1A', '#10384C', '#070D1A']}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Session stats</Text>
        <View style={styles.card}>
          <Text style={styles.big}>{seconds.toFixed(1)}</Text>
          <Text style={styles.label}>seconds since boot</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.big}>{formatReading({ value: 42.1987, unit: 'mg/dL', decimals: 2 })}</Text>
          <Text style={styles.label}>sample serum reading</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.big}>{formatReading({ value: 3.0001, unit: 'mmol/L', decimals: 3 })}</Text>
          <Text style={styles.label}>sample specimen reading</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#070D1A' },
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#070D1A' },
  title: { fontSize: 24, fontWeight: '700', color: '#E8F4FF' },
  card: {
    flex: 1,
    padding: 16,
    gap: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
  },
  big: { fontSize: 30, fontWeight: '800', color: '#67E8F9' },
  label: { fontSize: 13, color: '#9FB8D4' },
});
