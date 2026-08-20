import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type Partner = { id: string; name: string; country: string; balance: number; activity: string; archived?: boolean };
type Sort = 'Recent' | 'Balance' | 'A–Z';

const partners: Partner[] = [
  { id: 'amani', name: 'Amani Grocers', country: 'Kenya', balance: 12450, activity: 'Today, 10:42 AM' },
  { id: 'bright-star', name: 'Bright Star Stores', country: 'Uganda', balance: 8600, activity: 'Yesterday, 11:20 AM' },
  { id: 'kijiji', name: 'Kijiji Supplies', country: 'Tanzania', balance: -7200, activity: 'Today, 9:18 AM' },
  { id: 'mwangaza', name: 'Mwangaza Traders', country: 'Kenya', balance: 3400, activity: 'Yesterday, 4:36 PM' },
  { id: 'safina', name: 'Safina Mart', country: 'Rwanda', balance: -1850, activity: 'Yesterday, 1:05 PM' },
  { id: 'sunrise', name: 'Sunrise Distributors', country: 'Zambia', balance: 0, activity: 'Aug 14, 2:15 PM', archived: true },
];

export default function PartnersScreen() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('Recent');
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const timer = setTimeout(() => setLoading(false), 500); return () => clearTimeout(timer); }, []);

  const visiblePartners = useMemo(() => partners
    .filter((partner) => showArchived || !partner.archived)
    .filter((partner) => partner.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => sort === 'A–Z' ? a.name.localeCompare(b.name) : sort === 'Balance' ? Math.abs(b.balance) - Math.abs(a.balance) : 0), [query, showArchived, sort]);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}><Text style={styles.title}>Partners</Text><Pressable accessibilityLabel="Add partner" style={styles.addHeader}><Plus /></Pressable></View>
      <View style={styles.searchBox}><SearchMark /><TextInput autoCapitalize="words" clearButtonMode="while-editing" onChangeText={setQuery} placeholder="Search partners" placeholderTextColor="#8B9690" style={styles.searchInput} value={query} /></View>

      <View style={styles.controls}>
        {(['Recent', 'Balance', 'A–Z'] as Sort[]).map((option) => <Pressable key={option} onPress={() => setSort(option)} style={[styles.chip, sort === option && styles.chipActive]}><Text style={[styles.chipText, sort === option && styles.chipTextActive]}>{option}</Text></Pressable>)}
        <Pressable onPress={() => setShowArchived((current) => !current)} style={[styles.chip, showArchived && styles.chipActive]}><Text style={[styles.chipText, showArchived && styles.chipTextActive]}>{showArchived ? 'All status' : 'Active'}</Text></Pressable>
      </View>

      {loading ? <LoadingState /> : partners.length === 0 ? <EmptyState title="No partners yet" body="Add your first partner to start tracking balances and activity." action="Add partner" /> : visiblePartners.length === 0 ? <EmptyState title="No matching partners" body="Try a different name or change your active filters." action="Clear search" onPress={() => setQuery('')} /> : <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultCount}>{visiblePartners.length} {visiblePartners.length === 1 ? 'partner' : 'partners'}</Text>
        <View style={styles.list}>{visiblePartners.map((partner, index) => <Pressable key={partner.id} onPress={() => router.push({ pathname: '/partner/[id]', params: { id: partner.id } })} style={[styles.partnerRow, index < visiblePartners.length - 1 && styles.divider]}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{partner.name[0]}</Text></View>
          <View style={styles.partnerCopy}><Text style={styles.partnerName}>{partner.name}</Text><Text style={styles.country}>{partner.country} · {partner.activity}</Text></View>
          <Balance balance={partner.balance} />
        </Pressable>)}</View>
      </ScrollView>}
      <Pressable accessibilityLabel="Add partner" style={styles.fab}><Plus /></Pressable>
      <View style={styles.tabBar}><Tab label="Home" type="home" onPress={() => router.replace('/home')} /><Tab active label="Partners" type="partners" /><Tab label="Ledger" type="ledger" /><Tab label="Verify" type="verify" /></View>
    </SafeAreaView>
  );
}

function Balance({ balance }: { balance: number }) { const owedToYou = balance > 0; const settled = balance === 0; return <View style={styles.balance}><Text style={[styles.balanceValue, owedToYou ? styles.owedToYou : styles.youOwe]}>{settled ? '$0' : `$${Math.abs(balance).toLocaleString()}`}</Text><Text style={styles.balanceDirection}>{settled ? 'Settled' : owedToYou ? 'Owes you' : 'You owe'}</Text></View>; }
function LoadingState() { return <View style={styles.state}><View style={styles.loader} /><Text style={styles.stateTitle}>Loading partners</Text><Text style={styles.stateBody}>Getting the latest partner balances.</Text></View>; }
function EmptyState({ title, body, action, onPress }: { title: string; body: string; action: string; onPress?: () => void }) { return <View style={styles.state}><Text style={styles.stateTitle}>{title}</Text><Text style={styles.stateBody}>{body}</Text><Pressable onPress={onPress} style={styles.stateButton}><Text style={styles.stateButtonText}>{action}</Text></Pressable></View>; }
function Plus() { return <View style={styles.plus}><View style={styles.plusLine} /><View style={[styles.plusLine, styles.plusVertical]} /></View>; }
function SearchMark() { return <View style={styles.searchMark}><View style={styles.searchRing} /><View style={styles.searchHandle} /></View>; }
function Tab({ label, type, active = false, onPress }: { label: string; type: 'home' | 'partners' | 'ledger' | 'verify'; active?: boolean; onPress?: () => void }) { return <Pressable onPress={onPress} style={styles.tab}><NativeIcon active={active} type={type} /><Text style={[styles.tabLabel, active && styles.activeLabel]}>{label}</Text></Pressable>; }
function NativeIcon({ type, active }: { type: 'home' | 'partners' | 'ledger' | 'verify'; active: boolean }) { const color = active ? '#176B4D' : '#849089'; if (type === 'home') return <View style={[styles.homeIcon, { borderColor: color }]}><View style={[styles.homeRoof, { borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color }]} /></View>; if (type === 'partners') return <View style={styles.peopleIcon}><View style={[styles.personHead, { backgroundColor: color }]} /><View style={[styles.personBody, { backgroundColor: color }]} /><View style={[styles.personHead, styles.secondHead, { backgroundColor: color }]} /></View>; if (type === 'ledger') return <View style={[styles.ledgerIcon, { borderColor: color }]}><View style={[styles.ledgerLine, { backgroundColor: color }]} /><View style={[styles.ledgerLine, { backgroundColor: color }]} /><View style={[styles.ledgerLine, { backgroundColor: color }]} /></View>; return <View style={[styles.verifyIcon, { borderColor: color }]}><View style={[styles.checkFirst, { backgroundColor: color }]} /><View style={[styles.checkSecond, { backgroundColor: color }]} /></View>; }

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#F6F8F5', flex: 1 }, header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12 }, title: { color: '#17231E', fontSize: 28, fontWeight: '700', letterSpacing: -0.6 }, addHeader: { alignItems: 'center', backgroundColor: '#176B4D', borderRadius: 15, height: 38, justifyContent: 'center', width: 38 },
  searchBox: { alignItems: 'center', backgroundColor: '#FFF', borderColor: '#DCE3DD', borderRadius: 13, borderWidth: 1, flexDirection: 'row', height: 50, marginHorizontal: 20, marginTop: 19, paddingHorizontal: 14 }, searchInput: { color: '#17231E', flex: 1, fontSize: 16, height: '100%', marginLeft: 10 }, searchMark: { height: 20, width: 20 }, searchRing: { borderColor: '#718078', borderRadius: 7, borderWidth: 2, height: 13, left: 1, position: 'absolute', top: 1, width: 13 }, searchHandle: { backgroundColor: '#718078', height: 2, left: 12, position: 'absolute', top: 14, transform: [{ rotate: '45deg' }], width: 8 },
  controls: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingVertical: 15 }, chip: { backgroundColor: '#FFF', borderColor: '#DCE3DD', borderRadius: 18, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 }, chipActive: { backgroundColor: '#E3F2EA', borderColor: '#176B4D' }, chipText: { color: '#66726C', fontSize: 12, fontWeight: '700' }, chipTextActive: { color: '#176B4D' },
  listContent: { paddingBottom: 76, paddingHorizontal: 20 }, resultCount: { color: '#7B8780', fontSize: 12, fontWeight: '600', marginBottom: 9 }, list: { backgroundColor: '#FFF', borderColor: '#E2E7E2', borderRadius: 16, borderWidth: 1, overflow: 'hidden' }, partnerRow: { alignItems: 'center', flexDirection: 'row', minHeight: 76, paddingHorizontal: 14 }, divider: { borderBottomColor: '#EDF0ED', borderBottomWidth: 1 }, avatar: { alignItems: 'center', backgroundColor: '#DFEEE5', borderRadius: 18, height: 36, justifyContent: 'center', marginRight: 11, width: 36 }, avatarText: { color: '#176B4D', fontSize: 15, fontWeight: '700' }, partnerCopy: { flex: 1, paddingRight: 7 }, partnerName: { color: '#17231E', fontSize: 15, fontWeight: '700' }, country: { color: '#75827B', fontSize: 12, marginTop: 4 }, balance: { alignItems: 'flex-end' }, balanceValue: { fontSize: 14, fontWeight: '800' }, balanceDirection: { color: '#75827B', fontSize: 11, fontWeight: '600', marginTop: 4 }, owedToYou: { color: '#176B4D' }, youOwe: { color: '#B54738' },
  state: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 40 }, loader: { borderColor: '#DCE3DD', borderRadius: 18, borderTopColor: '#176B4D', borderWidth: 3, height: 36, marginBottom: 18, width: 36 }, stateTitle: { color: '#17231E', fontSize: 18, fontWeight: '700', textAlign: 'center' }, stateBody: { color: '#718078', fontSize: 14, lineHeight: 20, marginTop: 8, textAlign: 'center' }, stateButton: { backgroundColor: '#176B4D', borderRadius: 12, marginTop: 22, paddingHorizontal: 16, paddingVertical: 11 }, stateButtonText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  fab: { alignItems: 'center', backgroundColor: '#176B4D', borderRadius: 28, bottom: 70, elevation: 6, height: 56, justifyContent: 'center', position: 'absolute', right: 20, shadowColor: '#0D3C2B', shadowOffset: { height: 5, width: 0 }, shadowOpacity: 0.22, shadowRadius: 8, width: 56 }, plus: { height: 20, width: 20 }, plusLine: { backgroundColor: '#FFF', borderRadius: 2, height: 3, left: 1, position: 'absolute', top: 9, width: 18 }, plusVertical: { height: 18, left: 9, top: 1, width: 3 },
  tabBar: { backgroundColor: '#FFF', borderTopColor: '#E2E7E2', borderTopWidth: 1, bottom: 0, flexDirection: 'row', height: 66, left: 0, position: 'absolute', right: 0 }, tab: { alignItems: 'center', flex: 1, justifyContent: 'center' }, tabLabel: { color: '#849089', fontSize: 10, fontWeight: '600', marginTop: 3 }, activeLabel: { color: '#176B4D', fontWeight: '800' }, homeIcon: { borderRadius: 2, borderWidth: 2, height: 14, marginTop: 5, width: 17 }, homeRoof: { borderBottomWidth: 8, borderLeftWidth: 10, borderRightWidth: 10, height: 0, left: -3, position: 'absolute', top: -10, width: 0 }, peopleIcon: { height: 20, width: 22 }, personHead: { borderRadius: 4, height: 7, left: 3, position: 'absolute', top: 1, width: 7 }, personBody: { borderRadius: 6, bottom: 1, height: 9, left: 0, position: 'absolute', width: 13 }, secondHead: { left: 13, top: 4 }, ledgerIcon: { borderRadius: 2, borderWidth: 2, height: 18, paddingTop: 3, width: 16 }, ledgerLine: { height: 2, marginHorizontal: 3, marginVertical: 1 }, verifyIcon: { borderRadius: 3, borderWidth: 2, height: 18, position: 'relative', width: 18 }, checkFirst: { bottom: 5, height: 3, left: 3, position: 'absolute', transform: [{ rotate: '45deg' }], width: 6 }, checkSecond: { bottom: 7, height: 3, left: 6, position: 'absolute', transform: [{ rotate: '-45deg' }], width: 10 },
});
