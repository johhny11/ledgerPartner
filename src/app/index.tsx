import { useState } from 'react';
import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  ink: '#17231E',
  muted: '#66726C',
  border: '#D8DFDA',
  surface: '#FFFFFF',
  canvas: '#F7F8F5',
  accent: '#176B4D',
  accentPressed: '#10553C',
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    // UI-only placeholder for a future login request.
    setTimeout(() => {
      setIsSubmitting(false);
      router.replace('/home');
    }, 900);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', default: undefined })}
        style={styles.keyboardView}>
        <View style={styles.content}>
          <View style={styles.intro}>
            <View style={styles.mark}>
              <View style={styles.markLine} />
              <View style={[styles.markLine, styles.markLineShort]} />
            </View>
            <Text style={styles.eyebrow}>LEDGER PARTNER</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Log in to manage your business with confidence.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#98A39D"
                style={styles.input}
                textContentType="emailAddress"
                value={email}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  autoComplete="current-password"
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#98A39D"
                  secureTextEntry={!passwordVisible}
                  style={styles.passwordInput}
                  textContentType="password"
                  value={password}
                />
                <Pressable
                  accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                  hitSlop={12}
                  onPress={() => setPasswordVisible((visible) => !visible)}
                  style={styles.visibilityButton}>
                  <Text style={styles.visibilityText}>{passwordVisible ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>
            </View>

            <Pressable accessibilityRole="link" hitSlop={8} style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting || !email.trim() || !password}
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.loginButton,
              (pressed || isSubmitting) && styles.loginButtonPressed,
              (isSubmitting || !email.trim() || !password) && styles.loginButtonDisabled,
            ]}>
            <Text style={styles.loginButtonText}>{isSubmitting ? 'Logging in…' : 'Log in'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.canvas },
  keyboardView: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 56 },
  intro: { marginBottom: 44 },
  mark: { gap: 5, marginBottom: 24 },
  markLine: { width: 34, height: 5, borderRadius: 4, backgroundColor: COLORS.accent },
  markLineShort: { width: 21 },
  eyebrow: { color: COLORS.accent, fontSize: 11, fontWeight: '700', letterSpacing: 1.3, marginBottom: 12 },
  title: { color: COLORS.ink, fontSize: 32, fontWeight: '700', letterSpacing: -0.7, marginBottom: 10 },
  subtitle: { color: COLORS.muted, fontSize: 16, lineHeight: 23, maxWidth: 285 },
  form: { gap: 20 },
  fieldGroup: { gap: 8 },
  label: { color: COLORS.ink, fontSize: 14, fontWeight: '600' },
  input: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 12, borderWidth: 1, color: COLORS.ink, fontSize: 16, height: 54, paddingHorizontal: 16 },
  passwordContainer: { alignItems: 'center', backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 12, borderWidth: 1, flexDirection: 'row', height: 54 },
  passwordInput: { color: COLORS.ink, flex: 1, fontSize: 16, height: '100%', paddingHorizontal: 16 },
  visibilityButton: { alignItems: 'center', height: '100%', justifyContent: 'center', paddingHorizontal: 16 },
  visibilityText: { color: COLORS.accent, fontSize: 14, fontWeight: '700' },
  forgotButton: { alignSelf: 'flex-start', marginTop: -4 },
  forgotText: { color: COLORS.accent, fontSize: 14, fontWeight: '600' },
  footer: { paddingHorizontal: 24, paddingTop: 16 },
  loginButton: { alignItems: 'center', backgroundColor: COLORS.accent, borderRadius: 14, justifyContent: 'center', minHeight: 56 },
  loginButtonPressed: { backgroundColor: COLORS.accentPressed },
  loginButtonDisabled: { opacity: 0.72 },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
