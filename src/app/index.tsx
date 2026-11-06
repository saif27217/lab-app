import { StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import { formatReading } from '@/utils/format';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>lab-app</Text>
      <Text style={styles.sample}>
        {formatReading({ value: 42.1987, unit: 'mg/dL', decimals: 2 })}
      </Text>
      <Link href="/stats" style={styles.link}>
        Open stats screen
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 28, marginBottom: 8 },
  sample: { fontSize: 16 },
  link: { alignSelf: 'stretch', padding: 12 },
});
