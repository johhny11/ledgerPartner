import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PartnerProvider } from '@/context/partner-context';

export default function RootLayout() {
  return (
    <PartnerProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
      </Stack>
    </PartnerProvider>
  );
}
