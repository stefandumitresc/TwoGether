import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { useResponsiveDesign } from '../../hooks/useResponsiveDesign';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { horizontalPadding, spacing, fontSizes } = useResponsiveDesign();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingHorizontal: horizontalPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={[styles.profileCard, { marginBottom: spacing.lg }]}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text
              size={80}
              label={user?.name?.charAt(0) || 'U'}
              style={[styles.avatar, { backgroundColor: user?.color === 'blue' ? colors.primary : colors.secondary }]}
            />
            <Text variant="headlineSmall" style={[styles.name, { fontSize: fontSizes.large }]}>
              {user?.name || 'User'}
            </Text>
            <Text variant="bodyMedium" style={[styles.email, { fontSize: fontSizes.medium }]}>
              {user?.email || 'user@example.com'}
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.infoCard, { marginBottom: spacing.lg }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { fontSize: fontSizes.medium }]}>
              Partner Status
            </Text>
            {user?.partnerId ? (
              <Text variant="bodyMedium" style={[styles.partnerStatus, { fontSize: fontSizes.small }]}>
                ✅ Connected with partner
              </Text>
            ) : (
              <Text variant="bodyMedium" style={[styles.partnerStatus, { fontSize: fontSizes.small }]}>
                ❌ No partner connected
              </Text>
            )}
          </Card.Content>
        </Card>

        <Card style={[styles.actionsCard, { marginBottom: spacing.lg }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { fontSize: fontSizes.medium, marginBottom: spacing.md }]}>
              Actions
            </Text>
            <Button
              mode="contained"
              onPress={handleLogout}
              style={[styles.logoutButton, { marginBottom: spacing.sm }]}
              buttonColor={colors.error}
              textColor="white"
            >
              Logout
            </Button>
            <Text variant="bodySmall" style={[styles.logoutNote, { fontSize: fontSizes.small }]}>
              Logout to test the partner connect screen
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  profileCard: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  profileContent: {
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  email: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  actionsCard: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  partnerStatus: {
    color: colors.textSecondary,
  },
  logoutButton: {
    borderRadius: 8,
  },
  logoutNote: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ProfileScreen; 