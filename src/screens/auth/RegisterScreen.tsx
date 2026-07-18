import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';

import { Screen } from '@/components/Screen';
import { Colors, Fonts, Radius, Spacing, Typography, brandColors } from '@/constants/theme';
import { useRegister } from '@/hooks/useRegister';
import type { RegisterPatientRequest } from '@/services/authService';

type RegistrationField = keyof RegisterPatientRequest;

type FieldConfig = {
  autoCapitalize?: 'none' | 'words';
  keyboardType?: KeyboardTypeOptions;
  label: string;
  name: RegistrationField;
  placeholder: string;
  secureTextEntry?: boolean;
  textContentType?: 'emailAddress' | 'name' | 'newPassword' | 'telephoneNumber' | 'username';
};

const INITIAL_FORM: RegisterPatientRequest = {
  username: '',
  email: '',
  phone: '',
  password: '',
  full_name: '',
};

const FIELDS: readonly FieldConfig[] = [
  {
    autoCapitalize: 'words',
    label: 'Full name',
    name: 'full_name',
    placeholder: 'Enter your full name',
    textContentType: 'name',
  },
  {
    autoCapitalize: 'none',
    label: 'Username',
    name: 'username',
    placeholder: 'Choose a username',
    textContentType: 'username',
  },
  {
    autoCapitalize: 'none',
    keyboardType: 'email-address',
    label: 'Email',
    name: 'email',
    placeholder: 'Enter your email address',
    textContentType: 'emailAddress',
  },
  {
    keyboardType: 'phone-pad',
    label: 'Phone number',
    name: 'phone',
    placeholder: 'Enter your phone number',
    textContentType: 'telephoneNumber',
  },
  {
    autoCapitalize: 'none',
    label: 'Password',
    name: 'password',
    placeholder: 'At least 6 characters',
    secureTextEntry: true,
    textContentType: 'newPassword',
  },
];

export function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);
  const { error, loading, register } = useRegister();
  const updateField = useCallback((name: RegistrationField, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  }, []);
  const handleRegister = useCallback(async () => {
    try {
      await register(form);
      router.replace({ pathname: '/login', params: { registered: 'true' } });
    } catch {
      // useRegister owns the user-facing validation and API message.
    }
  }, [form, register, router]);
  const handleLogin = useCallback(() => {
    router.replace('/login');
  }, [router]);

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.eyebrow}>SajiloHealth</Text>
            <Text accessibilityRole="header" style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>
              Register to manage appointments, prescriptions, and clinic care.
            </Text>
          </View>

          <View style={styles.form}>
            {FIELDS.map((field) => (
              <View key={field.name} style={styles.field}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  accessibilityLabel={field.label}
                  autoCapitalize={field.autoCapitalize}
                  autoCorrect={false}
                  editable={!loading}
                  keyboardType={field.keyboardType}
                  onChangeText={(value) => updateField(field.name, value)}
                  placeholder={field.placeholder}
                  placeholderTextColor={brandColors.softBlue}
                  secureTextEntry={field.secureTextEntry}
                  style={styles.input}
                  textContentType={field.textContentType}
                  value={form[field.name]}
                />
              </View>
            ))}

            {error ? <Text accessibilityRole="alert" style={styles.errorText}>{error}</Text> : null}

            <Pressable
              accessibilityLabel="Create patient account"
              accessibilityRole="button"
              accessibilityState={{ disabled: loading }}
              disabled={loading}
              onPress={handleRegister}
              style={({ pressed }) => [
                styles.button,
                pressed && !loading && styles.buttonPressed,
                loading && styles.buttonDisabled,
              ]}
            >
              {loading
                ? <ActivityIndicator color={Colors.background} />
                : <Text style={styles.buttonText}>Create account</Text>}
            </Pressable>

            <View style={styles.loginRow}>
              <Text style={styles.loginCopy}>Already have an account?</Text>
              <Pressable
                accessibilityRole="link"
                hitSlop={Spacing.two}
                onPress={handleLogin}
              >
                <Text style={styles.loginLink}>Log in</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: Spacing.five,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  header: {
    gap: Spacing.two,
  },
  eyebrow: {
    color: Colors.primary,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.semibold,
  },
  title: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.rounded,
    ...Typography.heading,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontFamily: Fonts.sans,
    ...Typography.bodyLarge,
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
    ...Typography.body,
    fontWeight: Typography.weights.semibold,
  },
  input: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    borderWidth: 1,
    color: Colors.textPrimary,
    fontFamily: Fonts.sans,
    ...Typography.bodyLarge,
    minHeight: Spacing.four * 2,
    paddingHorizontal: Spacing.three,
  },
  errorText: {
    color: Colors.danger,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.medium,
  },
  button: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    minHeight: Spacing.four * 2,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    backgroundColor: brandColors.softBlue,
  },
  buttonText: {
    color: Colors.background,
    fontFamily: Fonts.sans,
    ...Typography.bodyLarge,
    fontWeight: Typography.weights.semibold,
  },
  loginRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: Spacing.four * 2,
  },
  loginCopy: {
    color: Colors.textSecondary,
    fontFamily: Fonts.sans,
    ...Typography.body,
  },
  loginLink: {
    color: Colors.primary,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.semibold,
  },
});
