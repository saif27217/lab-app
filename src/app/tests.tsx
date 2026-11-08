import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native';
import { Text } from 'react-native';
import { TextInput } from 'react-native';
import { View } from 'react-native';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { searchTests, highlightSegments, badgeFor, vendorFor, Test } from '@/utils/lab-search';
import { LAB_TESTS } from '@/utils/labTests';

const MAX_ROWS = 60;

function rowSegments(t: Test, q: string) {
  return highlightSegments(t.name, q).map((seg, i) => (
    <Text key={i} style={seg.hit ? styles.hit : styles.dim}>
      {seg.part}
    </Text>
  ));
}

function fmtMin(v: number | undefined): string {
  if (v === undefined || v === null) return '—';
  const total = Math.round(v);
  return `${Math.floor(total / 60)}h ${String(total % 60).padStart(2, '0')}m`;
}

function detailLines(t: Test) {
  const rows: { label: string; value: string }[] = [
    { label: 'Code', value: t.code || '—' },
    { label: 'Department', value: t.dept || '—' },
    { label: 'Processing', value: `${badgeFor(t)} · ${vendorFor(t)}` },
    { label: 'Schedule mode', value: t.mode || '—' },
    { label: 'SRA/SCA TAT', value: t.sra_sca_tat !== undefined ? fmtMin(t.sra_sca_tat) : '—' },
    { label: 'Dept TAT', value: t.dept_tat !== undefined ? fmtMin(t.dept_tat) : '—' },
    { label: 'Approval TAT', value: t.appr_tat !== undefined ? fmtMin(t.appr_tat) : '—' },
  ];
  const extras: { label: string; value: string | undefined }[] = [
    { label: 'Interpretation / limitations', value: t.interpretation },
    { label: 'Pre-analytical requirements', value: t.pre_analytical },
    { label: 'Reference range notes', value: t.ref_ranges },
    { label: 'References / sources', value: t.refs },
  ];
  for (const e of extras) {
    if (e.value) rows.push({ label: e.label, value: e.value });
  }
  return rows;
}

export default function TestsScreen() {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState('');
  const matches = searchTests(query);

  return (
    <LinearGradient style={styles.fill} colors={['#070D1A', '#10384C', '#070D1A']}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>{"\u2697\uFE0F Lab tests — "}{LAB_TESTS.length} on file</Text>
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
              {matches.length > MAX_ROWS ? ` · showing first ${MAX_ROWS}, scroll for more` : ' · scroll for more'}
            </Text>
            <ScrollView style={styles.resultsScroll}>
              {matches.slice(0, MAX_ROWS).map((t, i) => (
                <View key={i} style={styles.rowWrap}>
                  <Pressable
                    accessibilityLabel={`${badgeFor(t)} ${t.name}. Open details`}
                    accessibilityHint="Shows the full test details"
                    onPress={() => setOpenId(t.name)}
                    style={styles.pressRow}
                  >
                    <Text style={styles.row}>
                      {rowSegments(t, query)}
                      <Text style={styles.badge}>
                        {`  ${badgeFor(t)}${t.proc_type === 'OutSource' ? ` · ${vendorFor(t)}` : ''}`}
                      </Text>
                    </Text>
                  </Pressable>
                  {openId === t.name ? (
                    <View style={styles.detailCard}>
                      {detailLines(t).map((row, j) => (
                        <Text key={j} style={styles.detailLine}>
                          <Text style={styles.detailLabel}>{row.label}: </Text>
                          <Text style={styles.detailValue}>{row.value}</Text>
                        </Text>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </ScrollView>
          </>
        ) : (
          <Text style={styles.hint}>start typing to filter…</Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Catalog: {LAB_TESTS.length} tests · tap a row for details
          </Text>
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
  resultsScroll: { flex: 1, gap: 8 },
  rowWrap: { gap: 6, marginBottom: 10 },
  pressRow: { padding: 8, borderRadius: 10 },
  row: { fontSize: 15, color: '#B9CFE8' },
  badge: { fontSize: 11, fontWeight: '700', color: '#8B5CF6' },
  hit: { fontWeight: '800', color: '#67E8F9' },
  dim: { color: '#B9CFE8' },
  detailCard: {
    padding: 12,
    gap: 4,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(139,92,246,0.45)',
    borderWidth: 1,
  },
  detailLine: { fontSize: 12, color: '#9FB8D4' },
  detailLabel: { fontSize: 11, fontWeight: '800', color: '#67E8F9' },
  detailValue: { fontSize: 12, color: '#B9CFE8' },
  footer: { padding: 10, borderRadius: 12 },
  footerText: { fontSize: 12, color: '#5F7A92' },
});
