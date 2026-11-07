import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LAB_TESTS } from '@/utils/labTests';

export default function HomeScreen() {
  return (
    <LinearGradient style={styles.fill} colors={['#070D1A', '#10384C', '#070D1A']}>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Vijaya Lab</Text>
          <Text style={styles.subtitle}>Serum · urine · whole-blood tests</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeNum}>{LAB_TESTS.length}</Text>
            <Text style={styles.badgeLabel}>lab tests</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#070D1A' },
  container: { flex: 1, padding: 20, gap: 14, backgroundColor: '#070D1A' },
  card: {
    padding: 18,
    gap: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
  },
  title: { fontSize: 30, fontWeight: '700', color: '#E8F4FF' },
  subtitle: { fontSize: 14, color: '#8FB8CC' },
  badge: {
    alignSelf: 'stretch',
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(103,232,249,0.08)',
    borderColor: 'rgba(103,232,249,0.45)',
    borderWidth: 1,
  },
  badgeNum: { fontSize: 26, fontWeight: '800', color: '#67E8F9' },
  badgeLabel: { fontSize: 13, color: '#9FB8D4' },
  linkCard: {
    alignSelf: 'stretch',
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
  },
  linkLabel: { fontSize: 17, color: '#BFE7FF' },
});
