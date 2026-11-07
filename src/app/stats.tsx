import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LAB_TESTS } from '@/utils/labTests';

function countMatching(pattern: RegExp) {
  return LAB_TESTS.reduce((n, t) => pattern.test(t) ? n + 1 : n, 0);
}

export default function StatsScreen() {
  const urinal = countMatching(/URINARY/);
  const hgb = countMatching(/\bHGB\b/);
  const hcg = countMatching(/\bHCG\b/);
  const other = LAB_TESTS.length - urinal - hgb - hcg;

  return (
    <LinearGradient style={styles.fill} colors={['#070D1A', '#10384C', '#070D1A']}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Catalog stats</Text>
        <View style={styles.card}>
          <Text style={styles.big}>{LAB_TESTS.length}</Text>
          <Text style={styles.label}>tests on file</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.big}>{urinal}</Text>
          <Text style={styles.label}>urine-based tests</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.big}>{hgb}</Text>
          <Text style={styles.label}>hemoglobin (HGB)</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.big}>{hcg}</Text>
          <Text style={styles.label}>human chorionic (HCG)</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {other} more across serum, whole-blood, and immunoassay analytes
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
