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
import { TextInput, Button, Card, Chip } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/styles/colors';
import { spacing } from '../../src/styles/spacing';
import { typography } from '../../src/styles/typography';

const studyFields = [
  'Computer Science',
  'Engineering',
  'Medicine',
  'Business',
  'Arts',
  'Science',
  'Law',
  'Education',
  'Other',
];

const interests = [
  'Technology',
  'Sports',
  'Music',
  'Travel',
  'Cooking',
  'Reading',
  'Gaming',
  'Photography',
  'Fitness',
  'Art',
  'Dance',
  'Writing',
];

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    destinationCountry: '',
    destinationState: '',
    destinationCity: '',
    university: '',
    studyField: '',
    bio: '',
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, loading, error, clearError } = useAuth();

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      const userData = {
        name: formData.name,
        destinationCountry: formData.destinationCountry,
        destinationState: formData.destinationState,
        destinationCity: formData.destinationCity,
        university: formData.university,
        studyField: formData.studyField,
        interests: selectedInterests,
        goals: [], // Will be set during onboarding
        bio: formData.bio,
      };

      await signUp(formData.email, formData.password, userData);
      router.replace('/(tabs)');
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Join Yeti-Consult</Text>
          <Text style={styles.subtitle}>
            Connect with fellow Nepali students around the world
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Card.Content style={styles.formContent}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <TextInput
              label="Full Name *"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              mode="outlined"
              style={styles.input}
              theme={{
                colors: {
                  primary: colors.primary[600],
                  outline: colors.border.primary,
                },
              }}
            />

            <TextInput
              label="Email *"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              theme={{
                colors: {
                  primary: colors.primary[600],
                  outline: colors.border.primary,
                },
              }}
            />

            <TextInput
              label="Password *"
              value={formData.password}
              onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
              theme={{
                colors: {
                  primary: colors.primary[600],
                  outline: colors.border.primary,
                },
              }}
            />

            <TextInput
              label="Confirm Password *"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
              style={styles.input}
              theme={{
                colors: {
                  primary: colors.primary[600],
                  outline: colors.border.primary,
                },
              }}
            />

            <Text style={styles.sectionTitle}>Study Destination</Text>

            <TextInput
              label="Destination Country *"
              value={formData.destinationCountry}
              onChangeText={(text) => setFormData(prev => ({ ...prev, destinationCountry: text }))}
              mode="outlined"
              style={styles.input}
              theme={{
                colors: {
                  primary: colors.primary[600],
                  outline: colors.border.primary,
                },
              }}
            />

            <TextInput
              label="State/Province"
              value={formData.destinationState}
              onChangeText={(text) => setFormData(prev => ({ ...prev, destinationState: text }))}
              mode="outlined"
              style={styles.input}
              theme={{
                colors: {
                  primary: colors.primary[600],
                  outline: colors.border.primary,
                },
              }}
            />

            <TextInput
              label="City"
              value={formData.destinationCity}
              onChangeText={(text) => setFormData(prev => ({ ...prev, destinationCity: text }))}
              mode="outlined"
              style={styles.input}
              theme={{
                colors: {
                  primary: colors.primary[600],
                  outline: colors.border.primary,
                },
              }}
            />

            <Text style={styles.sectionTitle}>Academic Information</Text>

            <TextInput
              label="University/Institution"
              value={formData.university}
              onChangeText={(text) => setFormData(prev => ({ ...prev, university: text }))}
              mode="outlined"
              style={styles.input}
              theme={{
                colors: {
                  primary: colors.primary[600],
                  outline: colors.border.primary,
                },
              }}
            />

            <TextInput
              label="Study Field"
              value={formData.studyField}
              onChangeText={(text) => setFormData(prev => ({ ...prev, studyField: text }))}
              mode="outlined"
              style={styles.input}
              theme={{
                colors: {
                  primary: colors.primary[600],
                  outline: colors.border.primary,
                },
              }}
            />

            <Text style={styles.sectionTitle}>Interests</Text>
            <Text style={styles.sectionSubtitle}>
              Select your interests to help us match you with like-minded students
            </Text>

            <View style={styles.chipContainer}>
              {interests.map((interest) => (
                <Chip
                  key={interest}
                  selected={selectedInterests.includes(interest)}
                  onPress={() => handleInterestToggle(interest)}
                  style={styles.chip}
                  textStyle={styles.chipText}
                  theme={{
                    colors: {
                      primary: colors.primary[600],
                    },
                  }}
                >
                  {interest}
                </Chip>
              ))}
            </View>

            <TextInput
              label="Bio (Optional)"
              value={formData.bio}
              onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
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
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
              theme={{
                colors: {
                  primary: colors.primary[600],
                },
              }}
            >
              Create Account
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/login" asChild>
            <Text style={styles.linkText}>Sign In</Text>
          </Link>
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
    padding: spacing.layout.screen.padding,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
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
  sectionTitle: {
    ...typography.text.h5,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionSubtitle: {
    ...typography.text.body2,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.background.primary,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  chip: {
    margin: spacing.xs,
  },
  chipText: {
    ...typography.text.body2,
  },
  errorText: {
    ...typography.text.body2,
    color: colors.error[500],
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  registerButton: {
    marginTop: spacing.lg,
    borderRadius: spacing.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
}); 