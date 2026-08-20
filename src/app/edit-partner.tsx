import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { usePartner } from '@/context/partner-context';

export default function EditPartnerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPartner, updatePartner, transactionsFor } = usePartner();
  const partner = getPartner(id);
  const [name, setName] = useState(partner.name);
  const [country, setCountry] = useState(partner.country);
  const [contact, setContact] = useState(partner.contact);
  const [notes, setNotes] = useState(partner.notes);
  const [status, setStatus] = useState(partner.status);
  const [showOpeningHint, setShowOpeningHint] = useState(false);
  const openingLocked = id !== 'sunrise' || transactionsFor(id).length > 0;

  const save = () => { updatePartner(id, { name: name.trim() || partner.name, country: country.trim() || partner.country, contact, notes, status }); router.back(); };

  return <SafeAreaView edges={['top']} style={styles.safeArea}><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.header}><Pressable onPress={() => router.back()}><Text style={styles.cancel}>Cancel</Text></Pressable><Text style={styles.title}>Edit partner</Text><Pressable onPress={save}><Text style={styles.save}>Save</Text></Pressable></View>
    <Field label="Partner name" value={name} onChangeText={setName} /><Field label="Country" value={country} onChangeText={setCountry} /><Field label="Contact" value={contact} onChangeText={setContact} keyboardType="phone-pad" /><Field label="Notes" value={notes} onChangeText={setNotes} multiline />
    <Text style={styles.label}>Status</Text><View style={styles.statuses}>{(['Active', 'Archived'] as const).map((option) => <Pressable key={option} onPress={() => setStatus(option)} style={[styles.status, status === option && styles.statusActive]}><Text style={[styles.statusText, status === option && styles.statusTextActive]}>{option}</Text></Pressable>)}</View>
    <Text style={styles.label}>Opening balance</Text><Pressable disabled={!openingLocked} onPress={() => setShowOpeningHint(true)} style={styles.lockedField}><Text style={styles.lockedValue}>${partner.openingBalance.toLocaleString()} owed to you</Text><Text style={styles.lockedText}>{openingLocked ? 'Locked' : 'Editable'}</Text></Pressable>
    {showOpeningHint && <Text style={styles.hint}>Opening balance is locked once transactions exist.</Text>}
  </ScrollView></SafeAreaView>;
}

function Field({ label, multiline = false, ...props }: { label: string; multiline?: boolean } & React.ComponentProps<typeof TextInput>) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput multiline={multiline} placeholderTextColor="#8B9690" style={[styles.input, multiline && styles.notes]} {...props} /></View>; }
const styles = StyleSheet.create({ safeArea: { backgroundColor: '#F6F8F5', flex: 1 }, content: { padding: 20 }, header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }, title: { color: '#17231E', fontSize: 19, fontWeight: '700' }, cancel: { color: '#66726C', fontSize: 14, fontWeight: '700' }, save: { color: '#176B4D', fontSize: 14, fontWeight: '800' }, field: { marginBottom: 18 }, label: { color: '#17231E', fontSize: 13, fontWeight: '700', marginBottom: 8 }, input: { backgroundColor: '#FFF', borderColor: '#DCE3DD', borderRadius: 12, borderWidth: 1, color: '#17231E', fontSize: 16, minHeight: 52, paddingHorizontal: 14 }, notes: { minHeight: 100, paddingTop: 13, textAlignVertical: 'top' }, statuses: { flexDirection: 'row', gap: 9, marginBottom: 20 }, status: { backgroundColor: '#FFF', borderColor: '#DCE3DD', borderRadius: 12, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 10 }, statusActive: { backgroundColor: '#E3F2EA', borderColor: '#176B4D' }, statusText: { color: '#66726C', fontSize: 13, fontWeight: '700' }, statusTextActive: { color: '#176B4D' }, lockedField: { alignItems: 'center', backgroundColor: '#EDF0ED', borderColor: '#DFE5DF', borderRadius: 12, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 52, paddingHorizontal: 14 }, lockedValue: { color: '#849089', fontSize: 15, fontWeight: '600' }, lockedText: { color: '#849089', fontSize: 12, fontWeight: '700' }, hint: { color: '#66726C', fontSize: 12, lineHeight: 18, marginTop: 8 } });
