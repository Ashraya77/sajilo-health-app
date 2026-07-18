import { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Fonts, Radius, Spacing, brandColors } from '@/constants/theme';
import { useLogin } from '@/hooks/useLogin';

export function LoginScreen() {
  const router = useRouter();
  const { registered } = useLocalSearchParams<{ registered?: string }>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error, login } = useLogin();

  const handleLogin = useCallback(async () => {
    try {
      await login(username.trim(), password);
    } catch {
      // useLogin owns the user-facing error message shown below the button.
    }
  }, [login, password, username]);
  const handleRegister = useCallback(() => {
    router.push('/register');
  }, [router]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SajiloHealth</Text>
          <Text style={styles.title}>Sign in to your account</Text>
          <Text style={styles.subtitle}>Access appointments, records, and care updates.</Text>
        </View>

        <View style={styles.form}>
          {registered === 'true' ? (
            <Text accessibilityRole="alert" style={styles.successText}>
              Account created. You can now log in.
            </Text>
          ) : null}
          <View style={styles.field}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor={brandColors.softBlue}
              style={styles.input}
              textContentType="username"
              value={username}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              editable={!loading}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor={brandColors.softBlue}
              secureTextEntry
              style={styles.input}
              textContentType="password"
              value={password}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: loading }}
            disabled={loading}
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.button,
              pressed && !loading ? styles.buttonPressed : null,
              loading ? styles.buttonDisabled : null,
            ]}>
            {loading ? (
              <ActivityIndicator color={brandColors.white} />
            ) : (
              <Text style={styles.buttonText}>Log in</Text>
            )}
          </Pressable>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.registerRow}>
            <Text style={styles.registerCopy}>New to SajiloHealth?</Text>
            <Pressable
              accessibilityRole="link"
              hitSlop={Spacing.two}
              onPress={handleRegister}
            >
              <Text style={styles.registerLink}>Create account</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: brandColors.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  header: {
    gap: Spacing.two,
    marginBottom: Spacing.five,
  },
  eyebrow: {
    color: brandColors.primary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  },
  title: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.sans,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 36,
  },
  subtitle: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 22,
  },
  form: {
    gap: Spacing.three,
  },
  field: {
    gap: Spacing.one,
  },
  label: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: brandColors.surfaceBlue,
    borderRadius: Radius.small,
    paddingHorizontal: Spacing.three,
    color: brandColors.primaryDark,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0,
    backgroundColor: brandColors.white,
  },
  button: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.small,
    backgroundColor: brandColors.primary,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    backgroundColor: brandColors.softBlue,
  },
  buttonText: {
    color: brandColors.white,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
  errorText: {
    color: brandColors.primaryMuted,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 20,
  },
  successText: {
    color: brandColors.primaryMuted,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  registerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: Spacing.five + Spacing.twoHalf,
  },
  registerCopy: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '500',
  },
  registerLink: {
    color: brandColors.primary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
  },
});
