import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const discrepancyCount = 3;
const verifications = [
  { partner: 'Amani Grocers', managers: 'James & Mercy', status: 'In progress' },
  { partner: 'Kijiji Supplies', managers: 'Anne W.', status: 'Submitted' },
  { partner: 'Mwangaza Traders', managers: 'David & Rose', status: 'Mismatch' },
];
const transactions = [
  { partner: 'Amani Grocers', type: 'Money received', date: 'Today, 10:42 AM', amount: '+ $24,500', received: true },
  { partner: 'Kijiji Supplies', type: 'Money sent', date: 'Today, 9:18 AM', amount: '− $18,000', received: false },
  { partner: 'Mwangaza Traders', type: 'Money received', date: 'Yesterday, 4:36 PM', amount: '+ $8,750', received: true },
  { partner: 'Safina Mart', type: 'Money sent', date: 'Yesterday, 1:05 PM', amount: '− $12,300', received: false },
  { partner: 'Bright Star Stores', type: 'Money received', date: 'Yesterday, 11:20 AM', amount: '+ $16,400', received: true },
];

export default function HomeScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View><Text style={styles.greeting}>Good morning, Rak</Text><Text style={styles.greetingNote}>Here’s how your day is shaping up.</Text></View>
          <Pressable accessibilityLabel="Notifications" style={styles.bellButton}><BellIcon /><View style={styles.unreadDot} /></Pressable>
        </View>

        {discrepancyCount > 0 && <Pressable style={styles.alertBanner}>
          <View style={styles.alertMark}><Text style={styles.alertMarkText}>!</Text></View>
          <View style={styles.alertCopy}><Text style={styles.alertEyebrow}>NEEDS YOUR ATTENTION</Text><Text style={styles.alertTitle}>{discrepancyCount} unresolved discrepancies</Text><Text style={styles.alertDescription}>Review them before they affect today’s ledger.</Text></View>
          <Chevron />
        </Pressable>}

        <Section title="Today’s snapshot" action="19 AUG" subdued />
        <View style={styles.kpiGrid}>
          <Kpi label="Active partners" value="24" />
          <Kpi label="Sent today" value="$58,300" valueStyle={styles.sent} />
          <Kpi label="Received today" value="$74,650" valueStyle={styles.received} />
          <Kpi label="Net commission" value="$4,678" valueStyle={styles.commission} />
          <Pressable style={[styles.kpi, styles.pendingCard]}><Text style={styles.kpiLabel}>Pending verification</Text><View style={styles.kpiFooter}><Text style={styles.kpiValue}>6</Text><Chevron dark /></View></Pressable>
        </View>

        <Section title="Pending verification" action="See all" />
        <View style={styles.list}>{verifications.map((item, index) => <Pressable key={item.partner} style={[styles.verificationRow, index < verifications.length - 1 && styles.divider]}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{item.partner[0]}</Text></View>
          <View style={styles.rowCopy}><Text style={styles.rowTitle}>{item.partner}</Text><Text style={styles.rowSubtitle}>Assigned: {item.managers}</Text></View>
          <StatusBadge status={item.status} />
        </Pressable>)}</View>

        <Section title="Recent transactions" action="See all" />
        <View style={styles.list}>{transactions.map((item, index) => <Pressable key={`${item.partner}-${item.date}`} style={[styles.transactionRow, index < transactions.length - 1 && styles.divider]}>
          <View style={styles.rowCopy}><Text style={styles.rowTitle}>{item.partner}</Text><Text style={styles.rowSubtitle}>{item.type} · {item.date}</Text></View>
          <Text style={[styles.amount, item.received ? styles.received : styles.sent]}>{item.amount}</Text>
        </Pressable>)}</View>
      </ScrollView>

      <Pressable accessibilityLabel="New transaction" style={styles.fab}><PlusIcon /></Pressable>
      <View style={styles.tabBar}><Tab type="home" label="Home" active /><Tab type="partners" label="Partners" /><Tab type="ledger" label="Ledger" /><Tab type="verify" label="Verify" /></View>
    </SafeAreaView>
  );
}

function Kpi({ label, value, valueStyle }: { label: string; value: string; valueStyle?: object }) { return <View style={styles.kpi}><Text style={styles.kpiLabel}>{label}</Text><Text style={[styles.kpiValue, valueStyle]}>{value}</Text></View>; }
function Section({ title, action, subdued = false }: { title: string; action: string; subdued?: boolean }) { return <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{title}</Text><Text style={subdued ? styles.date : styles.seeAll}>{action}</Text></View>; }
function StatusBadge({ status }: { status: string }) { const background = status === 'Mismatch' ? styles.mismatch : status === 'Submitted' ? styles.submitted : styles.inProgress; return <View style={[styles.status, background]}><Text style={styles.statusText}>{status}</Text></View>; }
function Chevron({ dark = false }: { dark?: boolean }) { return <View style={styles.chevron}><View style={[styles.chevronArm, dark && styles.chevronDark]} /><View style={[styles.chevronArm, styles.chevronLower, dark && styles.chevronDark]} /></View>; }

function BellIcon() { return <View style={styles.bell}><View style={styles.bellTop} /><View style={styles.bellBody} /><View style={styles.bellClapper} /></View>; }
function PlusIcon() { return <View style={styles.plus}><View style={styles.plusLine} /><View style={[styles.plusLine, styles.plusVertical]} /></View>; }
function Tab({ type, label, active = false }: { type: 'home' | 'partners' | 'ledger' | 'verify'; label: string; active?: boolean }) { return <Pressable style={styles.tab}><NativeIcon type={type} active={active} /><Text style={[styles.tabLabel, active && styles.activeLabel]}>{label}</Text></Pressable>; }
function NativeIcon({ type, active }: { type: 'home' | 'partners' | 'ledger' | 'verify'; active: boolean }) {
  const color = active ? '#176B4D' : '#849089';
  if (type === 'home') return <View style={[styles.homeIcon, { borderColor: color }]}><View style={[styles.homeRoof, { borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color }]} /><View style={[styles.homeDoor, { backgroundColor: color }]} /></View>;
  if (type === 'partners') return <View style={styles.peopleIcon}><View style={[styles.personHead, { backgroundColor: color }]} /><View style={[styles.personBody, { backgroundColor: color }]} /><View style={[styles.personHead, styles.secondHead, { backgroundColor: color }]} /></View>;
  if (type === 'ledger') return <View style={[styles.ledgerIcon, { borderColor: color }]}><View style={[styles.ledgerLine, { backgroundColor: color }]} /><View style={[styles.ledgerLine, { backgroundColor: color }]} /><View style={[styles.ledgerLine, { backgroundColor: color }]} /></View>;
  return <View style={[styles.verifyIcon, { borderColor: color }]}><View style={[styles.checkFirst, { backgroundColor: color }]} /><View style={[styles.checkSecond, { backgroundColor: color }]} /></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F8F5' }, content: { padding: 20, paddingBottom: 72 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 }, greeting: { color: '#17231E', fontSize: 24, fontWeight: '700', letterSpacing: -0.5 }, greetingNote: { color: '#718078', fontSize: 14, marginTop: 5 }, bellButton: { alignItems: 'center', backgroundColor: '#FFF', borderColor: '#E2E7E2', borderRadius: 18, borderWidth: 1, height: 46, justifyContent: 'center', position: 'relative', width: 46 }, unreadDot: { backgroundColor: '#D95042', borderColor: '#FFF', borderRadius: 6, borderWidth: 2, height: 12, position: 'absolute', right: 8, top: 7, width: 12 }, bell: { height: 25, width: 20 }, bellTop: { backgroundColor: '#17231E', borderRadius: 3, height: 3, left: 8, position: 'absolute', top: 1, width: 4 }, bellBody: { borderColor: '#17231E', borderRadius: 10, borderWidth: 2, height: 18, left: 3, position: 'absolute', top: 4, width: 14 }, bellClapper: { backgroundColor: '#17231E', borderRadius: 3, bottom: 0, height: 4, left: 8, position: 'absolute', width: 4 },
  alertBanner: { alignItems: 'center', backgroundColor: '#1A6149', borderRadius: 18, flexDirection: 'row', marginBottom: 30, padding: 18 }, alertMark: { alignItems: 'center', backgroundColor: '#E5B655', borderRadius: 17, height: 34, justifyContent: 'center', width: 34 }, alertMarkText: { color: '#173C30', fontSize: 19, fontWeight: '800' }, alertCopy: { flex: 1, marginHorizontal: 13 }, alertEyebrow: { color: '#BCE2CF', fontSize: 10, fontWeight: '800', letterSpacing: 0.9, marginBottom: 4 }, alertTitle: { color: '#FFF', fontSize: 17, fontWeight: '700' }, alertDescription: { color: '#D4EADF', fontSize: 12, marginTop: 4 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }, sectionTitle: { color: '#17231E', fontSize: 18, fontWeight: '700' }, date: { color: '#89968F', fontSize: 11, fontWeight: '700', letterSpacing: 1 }, seeAll: { color: '#176B4D', fontSize: 14, fontWeight: '700' },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 }, kpi: { backgroundColor: '#FFF', borderColor: '#E2E7E2', borderRadius: 14, borderWidth: 1, flexBasis: '47%', flexGrow: 1, minHeight: 101, padding: 14 }, kpiLabel: { color: '#718078', fontSize: 12, fontWeight: '600' }, kpiValue: { color: '#17231E', fontSize: 20, fontWeight: '700', marginTop: 11 }, kpiFooter: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, pendingCard: { backgroundColor: '#EFF7F2' }, sent: { color: '#B54738' }, received: { color: '#176B4D' }, commission: { color: '#3E5071' },
  list: { backgroundColor: '#FFF', borderColor: '#E2E7E2', borderRadius: 16, borderWidth: 1, marginBottom: 30, overflow: 'hidden' }, verificationRow: { alignItems: 'center', flexDirection: 'row', minHeight: 72, paddingHorizontal: 14 }, transactionRow: { alignItems: 'center', flexDirection: 'row', minHeight: 65, paddingHorizontal: 14 }, divider: { borderBottomColor: '#EDF0ED', borderBottomWidth: 1 }, avatar: { alignItems: 'center', backgroundColor: '#DFEEE5', borderRadius: 16, height: 32, justifyContent: 'center', marginRight: 11, width: 32 }, avatarText: { color: '#176B4D', fontSize: 14, fontWeight: '700' }, rowCopy: { flex: 1 }, rowTitle: { color: '#17231E', fontSize: 14, fontWeight: '700' }, rowSubtitle: { color: '#75827B', fontSize: 12, marginTop: 3 }, status: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 }, inProgress: { backgroundColor: '#EEF1F7' }, submitted: { backgroundColor: '#E3F2EA' }, mismatch: { backgroundColor: '#FCE9E7' }, statusText: { color: '#40536E', fontSize: 10, fontWeight: '700' }, amount: { fontSize: 14, fontWeight: '700', marginLeft: 8 },
  fab: { alignItems: 'center', backgroundColor: '#176B4D', borderRadius: 28, bottom: 70, elevation: 6, height: 56, justifyContent: 'center', position: 'absolute', right: 20, shadowColor: '#0D3C2B', shadowOffset: { height: 5, width: 0 }, shadowOpacity: 0.22, shadowRadius: 8, width: 56 }, plus: { height: 24, width: 24 }, plusLine: { backgroundColor: '#FFF', borderRadius: 2, height: 3, left: 2, position: 'absolute', top: 10, width: 20 }, plusVertical: { height: 20, left: 10, top: 2, width: 3 },
  tabBar: { backgroundColor: '#FFF', borderTopColor: '#E2E7E2', borderTopWidth: 1, bottom: 0, flexDirection: 'row', height: 66, left: 0, position: 'absolute', right: 0 }, tab: { alignItems: 'center', flex: 1, justifyContent: 'center' }, tabLabel: { color: '#849089', fontSize: 10, fontWeight: '600', marginTop: 3 }, activeLabel: { color: '#176B4D', fontWeight: '800' },
  chevron: { height: 20, width: 12 }, chevronArm: { backgroundColor: '#FFF', borderRadius: 2, height: 3, position: 'absolute', right: 0, top: 5, transform: [{ rotate: '45deg' }], width: 10 }, chevronLower: { top: 12, transform: [{ rotate: '-45deg' }] }, chevronDark: { backgroundColor: '#176B4D' },
  homeIcon: { borderRadius: 2, borderWidth: 2, height: 14, marginTop: 5, width: 17 }, homeRoof: { borderBottomWidth: 8, borderLeftWidth: 10, borderRightWidth: 10, height: 0, left: -3, position: 'absolute', top: -10, width: 0 }, homeDoor: { bottom: 0, height: 6, left: 6, position: 'absolute', width: 3 }, peopleIcon: { height: 20, width: 22 }, personHead: { borderRadius: 4, height: 7, left: 3, position: 'absolute', top: 1, width: 7 }, personBody: { borderRadius: 6, bottom: 1, height: 9, left: 0, position: 'absolute', width: 13 }, secondHead: { left: 13, top: 4 }, ledgerIcon: { borderRadius: 2, borderWidth: 2, height: 18, paddingTop: 3, width: 16 }, ledgerLine: { height: 2, marginHorizontal: 3, marginVertical: 1 }, verifyIcon: { borderRadius: 3, borderWidth: 2, height: 18, position: 'relative', width: 18 }, checkFirst: { bottom: 5, height: 3, left: 3, position: 'absolute', transform: [{ rotate: '45deg' }], width: 6 }, checkSecond: { bottom: 7, height: 3, left: 6, position: 'absolute', transform: [{ rotate: '-45deg' }], width: 10 },
});
