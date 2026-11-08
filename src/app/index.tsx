import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LAB_TEST_RECORDS } from '@/utils/lab-search';

export default function HomeScreen() {
  const total = LAB_TEST_RECORDS.length;
  const local = LAB_TEST_RECORDS.filter((t) => t.proc_type === 'Local').length;
  const outsourced = LAB_TEST_RECORDS.filter((t) => t.proc_type === 'OutSource').length;
  const branch = total - local - outsourced;
  const vendors = [
    ...new Set(
      LAB_TEST_RECORDS
        .filter((t) => t.proc_type === 'OutSource')
        .map((t) => t.b2b)
        .filter((v) => v),
    ),
  ];
  const routine = LAB_TEST_RECORDS.filter((t) => t.mode === 'Routine').length;

  return (
    <LinearGradient style={styles.fill} colors={['#070D1A', '#10384C', '#070D1A']}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {'\u{1F9EB} Vijaya Diagnostic Lab'}
          </Text>
          <Text style={styles.subtitle}>
            {`${total} lab tests on menu · ${routine} routine`}
          </Text>
        </View>

        <View style={styles.splitRow}>
          <View style={styles.statCard}>
            <Text style={styles.big}>{local}</Text>
            <Text style={styles.label}>in-house</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.big}>{outsourced}</Text>
            <Text style={styles.label}>outsourced</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.big}>{vendors.length}</Text>
            <Text style={styles.label}>partner labs</Text>
          </View>
        </View>

        <View style={styles.legend}>
          <Text style={styles.legendLine}>
            {'\u2697\uFE0F Lab tests tab: every result carries a badge'}
          </Text>
          <Text style={styles.legendLine}>
            {`In-house = run at Vijaya DC · Outsourced = ${vendors.length} partner labs (${vendors.join(', ')})`}
          </Text>
          <Text style={styles.legendLine}>{branch} branch-transfer tests</Text>
        </View>

        <View style={styles.hint}>
          <Text style={styles.hintText}>
            Search by test name or lab-test code (e.g. T8834) · tap a row for full details
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#070D1A' },
  container: { flex: 1, padding: 20, gap: 14, backgroundColor: '#070D1A' },
  header: { gap: 6 },
  title: { fontSize: 28, fontWeight: '700', color: '#E8F4FF' },
  subtitle: { fontSize: 14, color: '#8FB8CC' },
  splitRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    padding: 14,
    gap: 4,
    borderRadius: 18,
    backgroundColor: 'rgba(103,232,249,0.07)',
    borderColor: 'rgba(103,232,249,0.35)',
    borderWidth: 1,
  },
  big: { fontSize: 26, fontWeight: '800', color: '#67E8F9' },
  label: { fontSize: 12, color: '#9FB8D4' },
  legend: {
    padding: 14,
    gap: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
  },
  legendLine: { fontSize: 13, color: '#AFC8E8' },
  hint: { padding: 12, borderRadius: 14, backgroundColor: 'rgba(139,92,246,0.10)' },
  hintText: { fontSize: 13, color: '#C9B8FF' },
});
