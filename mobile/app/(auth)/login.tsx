import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/styles/colors';
import { spacing } from '../../src/styles/spacing';
import { typography } from '../../src/styles/typography';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading, error, clearError } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email first');
      return;
    }
    // TODO: Implement forgot password screen
    Alert.alert('Coming Soon', 'Forgot password feature will be available soon');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to connect with fellow Nepali students
          </Text>
          <Button
            mode="text"
            onPress={() => router.push('/(auth)/register')}
            style={styles.headerSignUpButton}
            theme={{
              colors: {
                primary: colors.primary[600],
              },
            }}
          >
            New user? Create Account
          </Button>
        </View>

        <Card style={styles.formCard}>
          <Card.Content style={styles.formContent}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              contentStyle={styles.inputContent}
              theme={{
                colors: {
                  primary: colors.primary[600],
                  outline: colors.border.primary,
                },
              }}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
              contentStyle={styles.inputContent}
              theme={{
                colors: {
                  primary: colors.primary[600],
                  outline: colors.border.primary,
                },
              }}
            />

            {error && (
              <Text style={styles.errorText} onPress={clearError}>
                {error}
              </Text>
            )}

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
              theme={{
                colors: {
                  primary: colors.primary[600],
                },
              }}
            >
              Sign In
            </Button>

            <Button
              mode="text"
              onPress={handleForgotPassword}
              style={styles.forgotButton}
              theme={{
                colors: {
                  primary: colors.primary[600],
                },
              }}
            >
              Forgot Password?
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Button
            mode="outlined"
            onPress={() => router.push('/(auth)/register')}
            style={styles.signUpButton}
            theme={{
              colors: {
                primary: colors.primary[600],
                outline: colors.primary[600],
              },
            }}
          >
            Create Account
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.layout.screen.padding,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.text.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.text.body1,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  formCard: {
    backgroundColor: colors.surface.primary,
    borderRadius: spacing.borderRadius.lg,
    marginBottom: spacing.xl,
    ...spacing.shadow.md,
  },
  formContent: {
    padding: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.background.primary,
  },
  inputContent: {
    paddingVertical: spacing.sm,
  },
  errorText: {
    ...typography.text.body2,
    color: colors.error[500],
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  loginButton: {
    marginTop: spacing.md,
    borderRadius: spacing.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  forgotButton: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.text.body2,
    color: colors.text.secondary,
  },
  linkText: {
    ...typography.text.body2,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
  },
  signUpButton: {
    marginTop: spacing.md,
    borderRadius: spacing.borderRadius.md,
  },
  headerSignUpButton: {
    marginTop: spacing.sm,
  },
}); 