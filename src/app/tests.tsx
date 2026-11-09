import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native';
import { Text } from 'react-native';
import { TextInput } from 'react-native';
import { View } from 'react-native';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import {
  searchTests,
  browseTests,
  browseLetter,
  letterGroups,
  highlightSegments,
  badgeFor,
  vendorFor,
  badgeColor,
  badgeBg,
  badgeBorderColor,
  Test,
} from '@/utils/lab-search';
import { LAB_TESTS } from '@/utils/labTests';

const MAX_ROWS = 60;
const NOTE_CAP = 240;

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

function tatCells(t: Test) {
  return [
    { label: 'SRA/SCA', value: t.sra_sca_tat },
    { label: 'Dept', value: t.dept_tat },
    { label: 'Approval', value: t.appr_tat },
  ];
}

function noteLines(t: Test) {
  const notes: { icon: string; label: string; value: string }[] = [];
  if (t.interpretation) notes.push({ icon: '🧫', label: 'Interpretation / limitations', value: t.interpretation });
  if (t.pre_analytical) notes.push({ icon: '🧇', label: 'Pre-analytical requirements', value: t.pre_analytical });
  if (t.ref_ranges) notes.push({ icon: '📐', label: 'Reference ranges', value: t.ref_ranges });
  if (t.refs) notes.push({ icon: '🔗', label: 'References / sources', value: t.refs });
  return notes;
}

export default function TestsScreen() {
  const [query, setQuery] = useState('');
  const [letter, setLetter] = useState('');
  const [openKey, setOpenKey] = useState('');
  const [detailMode, setDetailMode] = useState(0);

  const browsing = !query;
  const matches = query
    ? searchTests(query)
    : letter
      ? browseLetter(letter)
      : browseTests();
  const shown = query ? matches.slice(0, MAX_ROWS) : matches;
  const openTest = openKey ? shown.find((t) => t.name === openKey) : null;

  function onText(v: string) {
    setQuery(v);
    setOpenKey('');
    setDetailMode(0);
  }

  const groups = browsing && !letter ? letterGroups() : [{ letter: '', tests: shown }];

  return (
    <LinearGradient style={styles.fill} colors={['#070D1A', '#10384C', '#070D1A']}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>{"\u2697\uFE0F Lab tests — "}{LAB_TESTS.length} on file</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
          <Pressable
            accessibilityLabel={`Show all ${LAB_TESTS.length} tests`}
            onPress={() => setLetter('')}
            style={styles.chip}
          >
            <Text style={styles.chipText}>All · {LAB_TESTS.length}</Text>
          </Pressable>
          {letterGroups().map((g, i) => (
            <Pressable
              key={i}
              accessibilityLabel={`Filter to tests starting with ${g.letter}, ${g.tests.length} tests`}
              onPress={() => setLetter(g.letter)}
              style={styles.chip}
            >
              <Text style={styles.chipText}>{g.letter} · {g.tests.length}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            multiline={false}
            autoCorrect={false}
            onChangeText={onText}
          />
        </View>

        <Text style={styles.matchLine}>
          {query
            ? `${matches.length} match${matches.length === 1 ? '' : 'es'}${matches.length > MAX_ROWS ? ` · showing first ${MAX_ROWS}, scroll for more` : ' · scroll for more'}`
            : letter
              ? `${letter} · ${matches.length} tests`
              : `Full menu · ${matches.length} tests · ${matches.filter((t) => t.proc_type === 'Local').length} in-house · ${matches.filter((t) => t.proc_type === 'OutSource').length} outsourced`}
        </Text>

        <ScrollView style={styles.resultsScroll}>
          {groups.map((g, gi) => (
            <View key={gi} style={styles.groupWrap}>
              {g.letter ? <Text style={styles.groupHeader}>{`\u{1F537} ${g.letter} · ${g.tests.length}`}</Text> : null}
              {g.tests.map((t, i) => (
                <Pressable
                  key={i}
                  accessibilityLabel={`${badgeFor(t)} ${t.name}. Open details`}
                  accessibilityHint="Shows the full test details card"
                  onPress={() => {
                    if (!openKey) {
                      setOpenKey(t.name);
                      setDetailMode(0);
                    }
                  }}
                  style={styles.pressRow}
                >
                  <Text style={styles.row}>
                    {rowSegments(t, query)}
                    <Text style={[styles.badge, { color: badgeColor(t) }]}>
                      {`  ${badgeFor(t)}${t.proc_type === 'OutSource' ? ` · ${vendorFor(t)}` : ''}`}
                    </Text>
                  </Text>
                </Pressable>
              ))}
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Catalog: {LAB_TESTS.length} tests · tap a row for details
          </Text>
        </View>

        {openTest ? (
          <Pressable
            accessibilityLabel={`Details card for ${openTest.name}. Tap to ${detailMode === 0 ? 'expand notes' : 'close'}`}
            onPress={() => {
              if (detailMode === 0) {
                setDetailMode(1);
              } else {
                setOpenKey('');
                setDetailMode(0);
              }
            }}
            style={styles.cardSheet}
          >
            <ScrollView style={styles.cardScroll}>
              <Text style={styles.cardTitle}>{openTest.name}</Text>
              <View style={styles.pillRow}>
                <View style={[styles.pill, { backgroundColor: badgeBg(openTest), borderColor: badgeBorderColor(openTest) }]}>
                  <Text style={[styles.pillText, { color: badgeColor(openTest) }]}>{badgeFor(openTest)}</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: 'rgba(103,232,249,0.10)', borderColor: 'rgba(103,232,249,0.5)' }]}>
                  <Text style={styles.pillText}>{vendorFor(openTest) || openTest.dept || '—'}</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: 'rgba(139,92,246,0.12)', borderColor: 'rgba(139,92,246,0.5)' }]}>
                  <Text style={styles.pillText}>{openTest.mode || openTest.code || '—'}</Text>
                </View>
              </View>
              <View style={styles.tatRow}>
                {tatCells(openTest).map((c, k) => (
                  <View key={k} style={styles.tatCell}>
                    <Text style={styles.tatValue}>{fmtMin(c.value)}</Text>
                    <Text style={styles.tatLabel}>{c.label}</Text>
                  </View>
                ))}
              </View>
              {noteLines(openTest).map((n, k) => (
                <Text key={k} style={styles.noteLine}>
                  <Text style={styles.noteLabel}>{`${n.icon} ${n.label}: `}</Text>
                  <Text style={styles.noteValue}>
                    {detailMode === 1 ? n.value : `${n.value.slice(0, NOTE_CAP)}${n.value.length > NOTE_CAP ? ' …tap card to expand' : ''}`}
                  </Text>
                </Text>
              ))}
              <Text style={styles.cardHint}>
                {detailMode === 0 ? 'tap card → full notes · tap again to close' : 'tap card → close'}
              </Text>
            </ScrollView>
          </Pressable>
        ) : null}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#070D1A' },
  container: { flex: 1, padding: 16, gap: 10, backgroundColor: '#070D1A' },
  header: { fontSize: 20, fontWeight: '700', color: '#E8F4FF' },
  chipsScroll: { height: 34, flexDirection: 'row' },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 6,
    backgroundColor: 'rgba(103,232,249,0.08)',
    borderColor: 'rgba(103,232,249,0.35)',
    borderWidth: 1,
  },
  chipText: { fontSize: 12, fontWeight: '700', color: '#8FB8CC' },
  searchBox: {
    padding: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(103,232,249,0.07)',
    borderColor: 'rgba(103,232,249,0.55)',
    borderWidth: 1,
  },
  input: { fontSize: 17, color: '#E8F4FF', padding: 4 },
  matchLine: { fontSize: 14, color: '#67E8F9' },
  resultsScroll: { flex: 1, gap: 6 },
  groupWrap: { gap: 6 },
  groupHeader: { fontSize: 14, fontWeight: '800', color: '#67E8F9' },
  pressRow: { padding: 8, borderRadius: 10 },
  row: { fontSize: 15, color: '#B9CFE8' },
  badge: { fontSize: 11, fontWeight: '700' },
  hit: { fontWeight: '800', color: '#67E8F9' },
  dim: { color: '#B9CFE8' },
  footer: { padding: 10, borderRadius: 12 },
  footerText: { fontSize: 12, color: '#5F7A92' },
  cardSheet: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 10,
    zIndex: 5,
    borderRadius: 18,
    backgroundColor: 'rgba(13,30,48,0.97)',
    borderColor: 'rgba(103,232,249,0.45)',
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  cardScroll: { gap: 6 },
  cardTitle: { fontSize: 19, fontWeight: '800', color: '#E8F4FF' },
  pillRow: { flexDirection: 'row', gap: 6 },
  pill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 9,
    borderWidth: 1,
  },
  pillText: { fontSize: 11, fontWeight: '700', color: '#C9DCF0' },
  tatRow: { flexDirection: 'row', gap: 8 },
  tatCell: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(103,232,249,0.08)',
  },
  tatValue: { fontSize: 15, fontWeight: '800', color: '#67E8F9' },
  tatLabel: { fontSize: 10, color: '#8FB8CC' },
  noteLine: { fontSize: 12, color: '#B9CFE8' },
  noteLabel: { fontSize: 11, fontWeight: '800', color: '#8FB8CC' },
  noteValue: { fontSize: 12, color: '#B9CFE8' },
  cardHint: { fontSize: 11, color: '#5F7A92' },
});
