import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Text, TextInput, Card, Divider, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../context/AuthContext';
import { useResponsiveDesign } from '../../hooks/useResponsiveDesign';
import { colors } from '../../theme';

type PartnerConnectNavigationProp = StackNavigationProp<AuthStackParamList, 'PartnerConnect'>;

interface ConnectFormData {
  partnerCode: string;
}

const PartnerConnectScreen = () => {
  const navigation = useNavigation<PartnerConnectNavigationProp>();
  const { user, connectPartner, generatePartnerCode, skipPartnerConnection } = useAuth();
  const { horizontalPadding, spacing, isSmallScreen } = useResponsiveDesign();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'connect'>('generate');

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ConnectFormData>();

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const code = await generatePartnerCode();
      setGeneratedCode(code);
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConnectPartner = async (data: ConnectFormData) => {
    setIsConnecting(true);
    try {
      await connectPartner(data.partnerCode.toUpperCase());
      // Success - will be handled by auth context
    } catch (error) {
      console.error('Error connecting partner:', error);
      setError('partnerCode', {
        type: 'manual',
        message: 'Invalid partner code. Please check and try again.',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    // TODO: Implement clipboard copy
    console.log('Copy to clipboard:', text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}>
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="heart-multiple"
              size={isSmallScreen ? 70 : 80}
              color={colors.heart}
            />
            <Text variant="headlineMedium" style={styles.title}>
              Connect with Your Partner
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Share a special code with your partner to start planning dates together
            </Text>
          </View>

          <View style={styles.content}>
            {/* Tab Selection */}
            <View style={styles.tabContainer}>
              <Button
                mode={activeTab === 'generate' ? 'contained' : 'outlined'}
                onPress={() => setActiveTab('generate')}
                style={[styles.tabButton, activeTab === 'generate' && styles.activeTab]}
                compact
              >
                Generate Code
              </Button>
              <Button
                mode={activeTab === 'connect' ? 'contained' : 'outlined'}
                onPress={() => setActiveTab('connect')}
                style={[styles.tabButton, activeTab === 'connect' && styles.activeTab]}
                compact
              >
                Enter Code
              </Button>
            </View>

            {activeTab === 'generate' ? (
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <MaterialCommunityIcons
                      name="qrcode"
                      size={40}
                      color={colors.primary}
                    />
                    <Text variant="titleMedium" style={styles.cardTitle}>
                      Share Your Code
                    </Text>
                  </View>

                  <Text variant="bodyMedium" style={styles.cardDescription}>
                    Generate a unique code and share it with your partner. They can use this code to connect with you.
                  </Text>

                  {generatedCode ? (
                    <View style={styles.codeContainer}>
                      <Text variant="headlineSmall" style={styles.generatedCode}>
                        {generatedCode}
                      </Text>
                      <Button
                        mode="outlined"
                        onPress={() => copyToClipboard(generatedCode)}
                        style={styles.copyButton}
                        icon="content-copy"
                        compact
                      >
                        Copy Code
                      </Button>
                    </View>
                  ) : (
                    <Button
                      mode="contained"
                      onPress={handleGenerateCode}
                      loading={isGenerating}
                      disabled={isGenerating}
                      style={styles.generateButton}
                      icon="plus"
                    >
                      Generate Partner Code
                    </Button>
                  )}
                </Card.Content>
              </Card>
            ) : (
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <MaterialCommunityIcons
                      name="account-plus"
                      size={40}
                      color={colors.secondary}
                    />
                    <Text variant="titleMedium" style={styles.cardTitle}>
                      Connect with Partner
                    </Text>
                  </View>

                  <Text variant="bodyMedium" style={styles.cardDescription}>
                    Enter the code your partner shared with you to connect your accounts.
                  </Text>

                  <Controller
                    control={control}
                    name="partnerCode"
                    rules={{
                      required: 'Partner code is required',
                      minLength: {
                        value: 6,
                        message: 'Partner code must be 6 characters',
                      },
                      maxLength: {
                        value: 6,
                        message: 'Partner code must be 6 characters',
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputContainer}>
                        <TextInput
                          label="Partner Code"
                          value={value}
                          onChangeText={(text) => onChange(text.toUpperCase())}
                          onBlur={onBlur}
                          mode="outlined"
                          style={styles.input}
                          placeholder="ABC123"
                          maxLength={6}
                          autoCapitalize="characters"
                          left={<TextInput.Icon icon="key" />}
                          error={!!errors.partnerCode}
                        />
                        {errors.partnerCode && (
                          <HelperText type="error">
                            {errors.partnerCode.message}
                          </HelperText>
                        )}
                      </View>
                    )}
                  />

                  <Button
                    mode="contained"
                    onPress={handleSubmit(handleConnectPartner)}
                    loading={isConnecting}
                    disabled={isConnecting}
                    style={styles.connectButton}
                    icon="heart-plus"
                  >
                    Connect with Partner
                  </Button>
                </Card.Content>
              </Card>
            )}

            <Divider style={styles.divider} />

            <View style={styles.footer}>
              <Text variant="bodySmall" style={styles.footerText}>
                Once connected, you'll both be able to plan dates, share ideas, and chat together.
              </Text>

              <Button
                mode="text"
                onPress={async () => {
                  try {
                    await skipPartnerConnection();
                  } catch (error) {
                    console.error('Error skipping partner connection:', error);
                  }
                }}
                style={styles.skipButton}
                textColor={colors.textSecondary}
              >
                Skip for Now
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  title: {
    color: colors.text,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 2,
  },
  activeTab: {
    elevation: 2,
  },
  card: {
    marginBottom: 20,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    marginLeft: 12,
    color: colors.text,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  codeContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 12,
    marginBottom: 16,
  },
  generatedCode: {
    color: colors.primary,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 12,
  },
  copyButton: {
    borderColor: colors.primary,
  },
  generateButton: {
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 1,
  },
  connectButton: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 20,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  skipButton: {
    marginTop: 8,
  },
});

export default PartnerConnectScreen; 