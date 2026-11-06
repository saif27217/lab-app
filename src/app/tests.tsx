import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LAB_TESTS } from '@/utils/labTests';
import { searchTests, highlightSegments } from '@/utils/lab-search';

export default function TestsScreen() {
  let query = '';

  const rows = (q: string) => searchTests(q).map((t) => (
    <Text key={t} style={styles.row}>
      {highlightSegments(t, query).map((seg, i) => (
        <Text key={i} style={seg.hit ? styles.hit : styles.dim}>{seg.part}</Text>
      ))}
    </Text>
  ));

  return (
    <LinearGradient style={styles.fill} colors={['#070D1A', '#10384C', '#070D1A']}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Lab tests — {LAB_TESTS.length} on file</Text>
        <TextInput
          autoFocus
          style={styles.searchBox}
          value={query}
          onChangeText={(t) => { query = t; }}
        >
          <Text style={styles.matchLine}>{searchTests(query).length} match{searchTests(query).length === 1 ? '' : 'es'}</Text>
          {query ? (
            <ScrollView style={styles.list}>{rows(query)}</ScrollView>
          ) : (
            <Text style={styles.hint}>start typing to filter…</Text>
          )}
        </TextInput>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  container: { flex: 1, padding: 16, gap: 12 },
  header: { fontSize: 20, fontWeight: '700', color: '#E8F4FF' },
  searchBox: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(103,232,249,0.07)',
    borderColor: 'rgba(103,232,249,0.55)',
    borderWidth: 1,
    fontSize: 18,
    color: '#E8F4FF',
  },
  matchLine: { fontSize: 15, color: '#67E8F9' },
  hint: { fontSize: 14, color: '#5F7A92' },
  list: { flex: 1, paddingVertical: 6 },
  row: { fontSize: 15, color: '#B9CFE8', paddingVertical: 6 },
  hit: { fontWeight: '800', color: '#67E8F9' },
  dim: { color: '#B9CFE8' },
});
