import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { usePartner } from '@/context/partner-context';

type Range = 'Today' | 'This week' | 'This month' | 'Custom';
type Entry = { id: string; date: string; type: 'Money received' | 'Money sent'; amount: string; commission?: string; balance: string; received: boolean; period: 'today' | 'week' | 'month' };

const entries: Entry[] = [
  { id: 'rec-1', date: 'Today · 10:42 AM', type: 'Money received', amount: '+ $6,500', commission: '$195', balance: '$12,450 owed to you', received: true, period: 'today' },
  { id: 'sent-1', date: 'Today · 8:10 AM', type: 'Money sent', amount: '− $2,100', balance: '$5,950 owed to you', received: false, period: 'today' },
  { id: 'rec-2', date: 'Yesterday · 3:26 PM', type: 'Money received', amount: '+ $4,800', commission: '$144', balance: '$8,050 owed to you', received: true, period: 'week' },
  { id: 'sent-2', date: 'Aug 18 · 11:05 AM', type: 'Money sent', amount: '− $1,350', balance: '$3,250 owed to you', received: false, period: 'week' },
  { id: 'rec-3', date: 'Aug 13 · 4:40 PM', type: 'Money received', amount: '+ $3,600', commission: '$108', balance: '$4,600 owed to you', received: true, period: 'month' },
];

export default function PartnerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPartner, transactionsFor } = usePartner();
  const [range, setRange] = useState<Range>('This month');
  const [loading, setLoading] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const partner = getPartner(id);
  const addedEntries = transactionsFor(id).map<Entry>((entry) => ({ id: entry.id, date: entry.date, type: entry.type, amount: `${entry.type === 'Money received' ? '+' : '−'} $${entry.amount.toLocaleString()}`, balance: formatBalance(entry.balance), received: entry.type === 'Money received', period: 'today' }));
  const isEmptyPartner = id === 'sunrise' && addedEntries.length === 0;

  useEffect(() => { const timer = setTimeout(() => setLoading(false), 450); return () => clearTimeout(timer); }, []);
  const visibleEntries = useMemo(() => {
    const allEntries = [...addedEntries, ...entries];
    return range === 'Custom' ? [] : allEntries.filter((entry) => range === 'Today' ? entry.period === 'today' : range === 'This week' ? entry.period !== 'month' : true);
  }, [addedEntries, range]);
  const exportStatement = async (format: 'PDF' | 'Excel / CSV') => {
    setExportMessage(`Preparing ${format} statement…`);
    await Share.share({ message: `${partner.name} statement · ${range}\nCurrent balance: ${formatBalance(partner.balance)}` });
    setExportMessage(`${format} statement ready to share.`);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Pressable accessibilityLabel="Back to partners" onPress={() => router.back()} style={styles.back}><BackArrow /></Pressable><View style={styles.headerText}><Text style={styles.partnerName}>{partner.name}</Text><Text style={styles.country}>{partner.country}</Text></View><Pressable onPress={() => router.push({ pathname: '/edit-partner', params: { id } })} style={styles.edit}><Text style={styles.editText}>Edit</Text></Pressable></View>
        <View style={styles.statusRow}><View style={styles.statusDot} /><Text style={styles.statusText}>{partner.status}</Text></View>

        <View style={styles.balanceCard}><Text style={styles.balanceLabel}>CURRENT BALANCE</Text><Text style={styles.balanceValue}>${Math.abs(partner.balance).toLocaleString()}</Text><Text style={styles.balanceDirection}>{partner.balance === 0 ? 'Settled' : partner.balance > 0 ? 'Owes you' : 'You owe them'}</Text></View>
        <View style={styles.openingBalance}><View><Text style={styles.openingLabel}>OPENING BALANCE</Text><Text style={styles.openingNote}>Start of current statement period</Text></View><Text style={styles.openingValue}>{formatBalance(partner.openingBalance)}</Text></View>

        <View style={styles.stats}><Stat label="Sent today" value="$2,100" /><Stat label="Received today" value="$6,500" /><Stat label="This period" value={`${entries.length + addedEntries.length} transactions`} /><Stat label="Last verified" value="Aug 18" /></View>

        <View style={styles.actions}><Pressable onPress={() => router.push({ pathname: '/partner/[id]/new-transaction', params: { id } })} style={styles.primaryAction}><Plus /><Text style={styles.primaryText}>New transaction</Text></Pressable><Pressable onPress={() => setShowExport((open) => !open)} style={styles.secondaryAction}><Text style={styles.secondaryText}>Export statement</Text></Pressable></View>
        {showExport && <View style={styles.exportPanel}><Text style={styles.exportTitle}>Export this statement</Text><Text style={styles.exportBody}>Share the current {range.toLowerCase()} view without leaving the app.</Text><View style={styles.exportActions}><Pressable onPress={() => exportStatement('PDF')} style={styles.exportButton}><Text style={styles.exportButtonText}>PDF</Text></Pressable><Pressable onPress={() => exportStatement('Excel / CSV')} style={styles.exportButton}><Text style={styles.exportButtonText}>Excel / CSV</Text></Pressable></View>{!!exportMessage && <Text style={styles.exportMessage}>{exportMessage}</Text>}</View>}

        <Text style={styles.sectionTitle}>Statement</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rangeScroll} contentContainerStyle={styles.rangeContent}>{(['Today', 'This week', 'This month', 'Custom'] as Range[]).map((option) => <Pressable key={option} onPress={() => setRange(option)} style={[styles.range, range === option && styles.rangeActive]}><Text style={[styles.rangeText, range === option && styles.rangeTextActive]}>{option}</Text></Pressable>)}</ScrollView>

        {loading ? <LedgerState title="Loading statement" body="Getting this partner’s latest ledger." loading /> : isEmptyPartner ? <LedgerState title="No transactions yet" body="This partner has no recorded transactions in the current statement period." /> : visibleEntries.length === 0 ? <LedgerState title="No transactions in this period" body="Try another date range to view the partner’s activity." /> : <View style={styles.statement}>{visibleEntries.map((entry, index) => <Pressable key={entry.id} style={[styles.transactionCard, index < visibleEntries.length - 1 && styles.cardGap]}>
          <View style={styles.transactionTop}><Text style={styles.transactionDate}>{entry.date}</Text><Text style={[styles.type, entry.received ? styles.received : styles.sent]}>{entry.type}</Text></View>
          <View style={styles.transactionBody}><View><Text style={[styles.transactionAmount, entry.received ? styles.received : styles.sent]}>{entry.amount}</Text>{entry.commission && <Text style={styles.commission}>Commission {entry.commission}</Text>}</View><View style={styles.runningBalance}><Text style={styles.runningLabel}>Running balance</Text><Text style={styles.runningValue}>{entry.balance}</Text></View></View>
        </Pressable>)}</View>}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) { return <View style={styles.stat}><Text style={styles.statLabel}>{label}</Text><Text style={styles.statValue}>{value}</Text></View>; }
function LedgerState({ title, body, loading = false }: { title: string; body: string; loading?: boolean }) { return <View style={styles.ledgerState}>{loading && <View style={styles.loader} />}<Text style={styles.stateTitle}>{title}</Text><Text style={styles.stateBody}>{body}</Text></View>; }
function Plus() { return <View style={styles.plus}><View style={styles.plusLine} /><View style={[styles.plusLine, styles.plusVertical]} /></View>; }
function BackArrow() { return <View style={styles.arrow}><View style={styles.arrowArm} /><View style={[styles.arrowArm, styles.arrowLower]} /></View>; }
function formatBalance(balance: number) { return `$${Math.abs(balance).toLocaleString()} ${balance === 0 ? 'settled' : balance > 0 ? 'owed to you' : 'you owe'}`; }

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#F6F8F5', flex: 1 }, content: { padding: 20, paddingBottom: 32 }, header: { alignItems: 'center', flexDirection: 'row' }, back: { alignItems: 'center', backgroundColor: '#FFF', borderColor: '#E2E7E2', borderRadius: 15, borderWidth: 1, height: 40, justifyContent: 'center', width: 40 }, headerText: { flex: 1, marginLeft: 12 }, partnerName: { color: '#17231E', fontSize: 20, fontWeight: '700' }, country: { color: '#718078', fontSize: 13, marginTop: 3 }, edit: { paddingHorizontal: 5, paddingVertical: 8 }, editText: { color: '#176B4D', fontSize: 14, fontWeight: '700' }, statusRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 20, marginLeft: 53, marginTop: 4 }, statusDot: { backgroundColor: '#27986A', borderRadius: 4, height: 8, marginRight: 5, width: 8 }, statusText: { color: '#5C6B63', fontSize: 12, fontWeight: '600' },
  balanceCard: { backgroundColor: '#176B4D', borderRadius: 20, padding: 22 }, balanceLabel: { color: '#BCE2CF', fontSize: 11, fontWeight: '800', letterSpacing: 1 }, balanceValue: { color: '#FFF', fontSize: 38, fontWeight: '700', letterSpacing: -1.1, marginTop: 9 }, balanceDirection: { color: '#D6EDDF', fontSize: 15, fontWeight: '600', marginTop: 4 }, openingBalance: { alignItems: 'center', backgroundColor: '#EAF3ED', borderColor: '#D8E7DC', borderRadius: 14, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, padding: 14 }, openingLabel: { color: '#176B4D', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 }, openingNote: { color: '#718078', fontSize: 11, marginTop: 4 }, openingValue: { color: '#17231E', fontSize: 13, fontWeight: '700', maxWidth: 105, textAlign: 'right' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 20 }, stat: { backgroundColor: '#FFF', borderColor: '#E2E7E2', borderRadius: 12, borderWidth: 1, flexBasis: '47%', flexGrow: 1, minHeight: 67, padding: 10 }, statLabel: { color: '#718078', fontSize: 11, fontWeight: '600' }, statValue: { color: '#17231E', fontSize: 14, fontWeight: '700', marginTop: 7 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20 }, primaryAction: { alignItems: 'center', backgroundColor: '#176B4D', borderRadius: 13, flex: 1, flexDirection: 'row', justifyContent: 'center', minHeight: 48 }, primaryText: { color: '#FFF', fontSize: 14, fontWeight: '700', marginLeft: 7 }, secondaryAction: { alignItems: 'center', backgroundColor: '#FFF', borderColor: '#176B4D', borderRadius: 13, borderWidth: 1, flex: 1, justifyContent: 'center', minHeight: 48 }, secondaryText: { color: '#176B4D', fontSize: 14, fontWeight: '700' }, plus: { height: 18, width: 18 }, plusLine: { backgroundColor: '#FFF', borderRadius: 2, height: 2, left: 1, position: 'absolute', top: 8, width: 16 }, plusVertical: { height: 16, left: 8, top: 1, width: 2 },
  exportPanel: { backgroundColor: '#EFF7F2', borderColor: '#D8E7DC', borderRadius: 14, borderWidth: 1, marginTop: 10, padding: 14 }, exportTitle: { color: '#17231E', fontSize: 14, fontWeight: '700' }, exportBody: { color: '#66726C', fontSize: 12, lineHeight: 18, marginTop: 4 }, exportActions: { flexDirection: 'row', gap: 8, marginTop: 13 }, exportButton: { alignItems: 'center', backgroundColor: '#FFF', borderColor: '#176B4D', borderRadius: 10, borderWidth: 1, flex: 1, paddingVertical: 9 }, exportButtonText: { color: '#176B4D', fontSize: 13, fontWeight: '700' }, exportMessage: { color: '#176B4D', fontSize: 12, fontWeight: '600', marginTop: 10 },
  sectionTitle: { color: '#17231E', fontSize: 19, fontWeight: '700', marginTop: 28 }, rangeScroll: { marginTop: 12 }, rangeContent: { gap: 8 }, range: { backgroundColor: '#FFF', borderColor: '#DCE3DD', borderRadius: 18, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 8 }, rangeActive: { backgroundColor: '#E3F2EA', borderColor: '#176B4D' }, rangeText: { color: '#66726C', fontSize: 12, fontWeight: '700' }, rangeTextActive: { color: '#176B4D' }, statement: { marginTop: 15 }, transactionCard: { backgroundColor: '#FFF', borderColor: '#E2E7E2', borderRadius: 15, borderWidth: 1, padding: 15 }, cardGap: { marginBottom: 10 }, transactionTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, transactionDate: { color: '#718078', fontSize: 12, fontWeight: '600' }, type: { fontSize: 12, fontWeight: '700' }, transactionBody: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }, transactionAmount: { fontSize: 20, fontWeight: '700' }, commission: { color: '#718078', fontSize: 11, marginTop: 4 }, runningBalance: { alignItems: 'flex-end', maxWidth: 150 }, runningLabel: { color: '#718078', fontSize: 10, fontWeight: '600' }, runningValue: { color: '#17231E', fontSize: 12, fontWeight: '700', marginTop: 4, textAlign: 'right' }, received: { color: '#176B4D' }, sent: { color: '#B54738' },
  ledgerState: { alignItems: 'center', backgroundColor: '#FFF', borderColor: '#E2E7E2', borderRadius: 16, borderWidth: 1, marginTop: 15, padding: 28 }, loader: { borderColor: '#DCE3DD', borderRadius: 16, borderTopColor: '#176B4D', borderWidth: 3, height: 32, marginBottom: 15, width: 32 }, stateTitle: { color: '#17231E', fontSize: 16, fontWeight: '700' }, stateBody: { color: '#718078', fontSize: 13, lineHeight: 19, marginTop: 6, textAlign: 'center' },
  arrow: { height: 18, width: 18 }, arrowArm: { backgroundColor: '#17231E', borderRadius: 2, height: 2, left: 1, position: 'absolute', top: 5, transform: [{ rotate: '-45deg' }], width: 11 }, arrowLower: { top: 12, transform: [{ rotate: '45deg' }] },
});
