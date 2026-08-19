import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>LEDGER PARTNER</Text>
        <Text style={styles.title}>Welcome home</Text>
        <Text style={styles.subtitle}>Your business overview will appear here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8F5' },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  eyebrow: { color: '#176B4D', fontSize: 11, fontWeight: '700', letterSpacing: 1.3, marginBottom: 12 },
  title: { color: '#17231E', fontSize: 32, fontWeight: '700', letterSpacing: -0.7, marginBottom: 10 },
  subtitle: { color: '#66726C', fontSize: 16, lineHeight: 23 },
});
