import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { TextInput } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { searchTests, highlightSegments } from '@/utils/lab-search';
import { LAB_TESTS } from '@/utils/labTests';

const MAX_ROWS = 15;

function rowSegments(test: string, q: string) {
  return highlightSegments(test, q).map((seg, i) => (
    <Text key={i} style={seg.hit ? styles.hit : styles.dim}>
      {seg.part}
    </Text>
  ));
}

export default function TestsScreen() {
  const [query, setQuery] = useState('');
  const matches = searchTests(query);

  return (
    <LinearGradient style={styles.fill} colors={['#070D1A', '#10384C', '#070D1A']}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Lab tests — {LAB_TESTS.length} on file</Text>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            multiline={false}
            autoCorrect={false}
            onChangeText={setQuery}
          />
        </View>
        {query ? (
          <>
            <Text style={styles.matchLine}>
              {matches.length} match{matches.length === 1 ? '' : 'es'}
            </Text>
            {matches.slice(0, MAX_ROWS).map((t, i) => (
              <Text key={i} style={styles.row}>
                {rowSegments(t, query)}
              </Text>
            ))}
          </>
        ) : (
          <Text style={styles.hint}>start typing to filter…</Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Catalog: 518 tests · case-insensitive</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#070D1A' },
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#070D1A' },
  header: { fontSize: 20, fontWeight: '700', color: '#E8F4FF' },
  searchBox: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(103,232,249,0.07)',
    borderColor: 'rgba(103,232,249,0.55)',
    borderWidth: 1,
  },
  input: { fontSize: 18, color: '#E8F4FF', padding: 4 },
  matchLine: { fontSize: 15, color: '#67E8F9' },
  hint: { fontSize: 14, color: '#5F7A92' },
  row: { fontSize: 15, color: '#B9CFE8' },
  hit: { fontWeight: '800', color: '#67E8F9' },
  dim: { color: '#B9CFE8' },
  footer: { padding: 10, borderRadius: 12 },
  footerText: { fontSize: 12, color: '#5F7A92' },
});
