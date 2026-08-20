import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type PartnerProfile = {
  id: string;
  name: string;
  country: string;
  contact: string;
  notes: string;
  status: 'Active' | 'Archived';
  openingBalance: number;
  balance: number;
};

export type NewPartnerTransaction = { id: string; type: 'Money received' | 'Money sent'; amount: number; date: string; balance: number };

type PartnerContextValue = {
  getPartner: (id: string) => PartnerProfile;
  updatePartner: (id: string, updates: Pick<PartnerProfile, 'name' | 'country' | 'contact' | 'notes' | 'status'>) => void;
  transactionsFor: (id: string) => NewPartnerTransaction[];
  addTransaction: (id: string, type: NewPartnerTransaction['type'], amount: number) => void;
};

const PartnerContext = createContext<PartnerContextValue | null>(null);

const defaultPartner = (id: string): PartnerProfile => ({
  id,
  name: id.split('-').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ') || 'Partner',
  country: id === 'bright-star' ? 'Uganda' : id === 'kijiji' ? 'Tanzania' : id === 'safina' ? 'Rwanda' : 'Kenya',
  contact: '+254 712 345 678',
  notes: 'Regular partner. Follow up on weekly reconciliation.',
  status: id === 'sunrise' ? 'Archived' : 'Active',
  openingBalance: 1200,
  balance: id === 'sunrise' ? 0 : 12450,
});

export function PartnerProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Record<string, PartnerProfile>>({});
  const [transactions, setTransactions] = useState<Record<string, NewPartnerTransaction[]>>({});

  const value = useMemo<PartnerContextValue>(() => ({
    getPartner: (id) => profiles[id] ?? defaultPartner(id),
    updatePartner: (id, updates) => setProfiles((current) => ({ ...current, [id]: { ...(current[id] ?? defaultPartner(id)), ...updates } })),
    transactionsFor: (id) => transactions[id] ?? [],
    addTransaction: (id, type, amount) => {
      const profile = profiles[id] ?? defaultPartner(id);
      const balance = type === 'Money received' ? profile.balance + amount : profile.balance - amount;
      setProfiles((current) => ({ ...current, [id]: { ...(current[id] ?? defaultPartner(id)), balance } }));
      setTransactions((current) => ({ ...current, [id]: [{ id: `${Date.now()}`, type, amount, date: 'Today · just now', balance }, ...(current[id] ?? [])] }));
    },
  }), [profiles, transactions]);

  return <PartnerContext.Provider value={value}>{children}</PartnerContext.Provider>;
}

export function usePartner() {
  const context = useContext(PartnerContext);
  if (!context) throw new Error('usePartner must be used within PartnerProvider');
  return context;
}
