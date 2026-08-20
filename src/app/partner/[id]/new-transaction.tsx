import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { usePartner } from '@/context/partner-context';

export default function NewPartnerTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPartner, addTransaction } = usePartner();
  const partner = getPartner(id);
  const [type, setType] = useState<'Money received' | 'Money sent'>('Money received');
  const [amount, setAmount] = useState('');
  const save = () => { const number = Number(amount.replace(/[^0-9.]/g, '')); if (!number) return; addTransaction(id, type, number); router.back(); };
  return <SafeAreaView edges={['top']} style={styles.safeArea}><View style={styles.content}>
    <View style={styles.header}><Pressable onPress={() => router.back()}><Text style={styles.cancel}>Cancel</Text></Pressable><Text style={styles.title}>New transaction</Text><Pressable disabled={!amount} onPress={save}><Text style={[styles.save, !amount && styles.disabled]}>Save</Text></Pressable></View>
    <Text style={styles.label}>Partner</Text><View style={styles.lockedPartner}><Text style={styles.partnerName}>{partner.name}</Text><Text style={styles.locked}>Locked</Text></View><Text style={styles.helper}>To use another partner, go back and start from the main action button.</Text>
    <Text style={styles.label}>Transaction type</Text><View style={styles.types}>{(['Money received', 'Money sent'] as const).map((option) => <Pressable key={option} onPress={() => setType(option)} style={[styles.type, type === option && styles.typeActive]}><Text style={[styles.typeText, type === option && styles.typeTextActive]}>{option}</Text></Pressable>)}</View>
    <Text style={styles.label}>Amount</Text><TextInput autoFocus keyboardType="decimal-pad" onChangeText={setAmount} placeholder="$0.00" placeholderTextColor="#8B9690" style={styles.amountInput} value={amount} />
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({ safeArea: { backgroundColor: '#F6F8F5', flex: 1 }, content: { padding: 20 }, header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }, title: { color: '#17231E', fontSize: 19, fontWeight: '700' }, cancel: { color: '#66726C', fontSize: 14, fontWeight: '700' }, save: { color: '#176B4D', fontSize: 14, fontWeight: '800' }, disabled: { color: '#AAB4AE' }, label: { color: '#17231E', fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 20 }, lockedPartner: { alignItems: 'center', backgroundColor: '#EDF0ED', borderColor: '#DFE5DF', borderRadius: 12, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 52, paddingHorizontal: 14 }, partnerName: { color: '#59655E', fontSize: 16, fontWeight: '600' }, locked: { color: '#849089', fontSize: 12, fontWeight: '700' }, helper: { color: '#718078', fontSize: 12, lineHeight: 18, marginTop: 8 }, types: { flexDirection: 'row', gap: 9 }, type: { backgroundColor: '#FFF', borderColor: '#DCE3DD', borderRadius: 12, borderWidth: 1, flex: 1, paddingVertical: 13 }, typeActive: { backgroundColor: '#E3F2EA', borderColor: '#176B4D' }, typeText: { color: '#66726C', fontSize: 13, fontWeight: '700', textAlign: 'center' }, typeTextActive: { color: '#176B4D' }, amountInput: { backgroundColor: '#FFF', borderColor: '#DCE3DD', borderRadius: 12, borderWidth: 1, color: '#17231E', fontSize: 26, fontWeight: '700', height: 62, paddingHorizontal: 14 } });
