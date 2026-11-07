import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LAB_TEST_RECORDS } from '@/utils/lab-search';

export default function StatsScreen() {
  const total = LAB_TEST_RECORDS.length;
  const local = LAB_TEST_RECORDS.filter((t) => t.proc_type === 'Local').length;
  const outsourced = LAB_TEST_RECORDS.filter((t) => t.proc_type === 'OutSource').length;
  const branch = total - local - outsourced;
  const routine = LAB_TEST_RECORDS.filter((t) => t.mode === 'Routine').length;
  const scheduled = LAB_TEST_RECORDS.filter((t) => t.mode === 'Scheduled').length;
  const withInterp = LAB_TEST_RECORDS.filter((t) => t.interpretation).length;

  return (
    <LinearGradient style={styles.fill} colors={['#070D1A', '#10384C', '#070D1A']}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Catalog stats</Text>
        <View style={styles.card}>
          <Text style={styles.big}>{total}</Text>
          <Text style={styles.label}>tests on file</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.big}>{local}</Text>
          <Text style={styles.label}>in-house tests</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.big}>{outsourced}</Text>
          <Text style={styles.label}>outsourced tests</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {branch} branch-transfer · {routine} routine · {scheduled} scheduled
          </Text>
          <Text style={styles.footerText}>
            {withInterp} with interpretation notes
          </Text>
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
  footer: { padding: 10, borderRadius: 12 },
  footerText: { fontSize: 12, color: '#5F7A92' },
});
