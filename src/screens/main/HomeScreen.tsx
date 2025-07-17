import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, Card, Avatar, Chip, Portal, Modal, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { useResponsiveDesign } from '../../hooks/useResponsiveDesign';

const { width: screenWidth } = Dimensions.get('window');

// Types
interface QuickActionButtonProps {
  icon: any; // MaterialCommunityIcons icon name
  title: string;
  onPress: () => void;
  color?: string;
}

// Mock data for demonstration
const mockUpcomingDates = [
  {
    id: '1',
    title: 'Dinner at Luigi\'s',
    date: 'Tonight, 7:00 PM',
    type: 'dinner',
    location: 'Downtown',
    plannedBy: 'you',
  },
  {
    id: '2',
    title: 'Movie Night',
    date: 'Tomorrow, 8:30 PM',
    type: 'entertainment',
    location: 'Home',
    plannedBy: 'partner',
  },
];

const mockDateIdeas = [
  'Try a new coffee shop together',
  'Go for a sunset walk in the park',
  'Cook a meal from a different cuisine',
  'Visit a local museum or art gallery',
  'Have a picnic in your favorite spot',
  'Take a dance class together',
];

const HomeScreen = () => {
  const { user, partner } = useAuth();
  const { horizontalPadding, spacing, fontSizes, isSmallScreen } = useResponsiveDesign();
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [showPlanDateModal, setShowPlanDateModal] = useState(false);
  const [planDateTitle, setPlanDateTitle] = useState('');
  const [planDateDate, setPlanDateDate] = useState('');
  const [planDateTime, setPlanDateTime] = useState('');
  const [planDateLocation, setPlanDateLocation] = useState('');

  // Rotate date ideas every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdeaIndex((prev) => (prev + 1) % mockDateIdeas.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getPartnerStatus = () => {
    if (partner) {
      return `You and ${partner.name} are connected`;
    }
    if (user?.partnerId === 'skipped') {
      return 'Flying solo for now';
    }
    return 'Ready to connect with your partner';
  };

  const parseInputDate = (dateInput: string): string => {
    // Handle various date formats and convert to YYYY-MM-DD
    const today = new Date();

    // If empty, use today
    if (!dateInput.trim()) {
      return today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');
    }

    // Try to parse the input
    const input = dateInput.trim().toLowerCase();

    // Handle relative dates
    if (input === 'today') {
      return today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');
    }

    if (input === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.getFullYear() + '-' +
        String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' +
        String(tomorrow.getDate()).padStart(2, '0');
    }

    // Try to parse as date
    const parsedDate = new Date(dateInput);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.getFullYear() + '-' +
        String(parsedDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(parsedDate.getDate()).padStart(2, '0');
    }

    // If parsing fails, use today as fallback
    return today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');
  };

  const handlePlanDate = () => {
    if (planDateTitle.trim() && planDateDate.trim() && planDateTime.trim() && planDateLocation.trim()) {
      const eventDate = parseInputDate(planDateDate);

      const newEvent = {
        id: Date.now().toString(),
        title: planDateTitle.trim(),
        date: eventDate,
        time: planDateTime.trim(),
        location: planDateLocation.trim(),
        type: 'planned' as const,
        plannedBy: 'you' as const,
      };

      // Navigate to calendar with the new event data
      (navigation as any).navigate('Calendar', { newEvent });

      setPlanDateTitle('');
      setPlanDateDate('');
      setPlanDateTime('');
      setPlanDateLocation('');
      setShowPlanDateModal(false);
    }
  };

  const QuickActionButton = ({ icon, title, onPress, color = colors.primary }: QuickActionButtonProps) => (
    <Card style={[styles.quickActionCard, { width: (screenWidth - horizontalPadding * 2 - spacing.md) / 2 }]}>
      <Card.Content style={styles.quickActionContent}>
        <MaterialCommunityIcons name={icon} size={32} color={color} />
        <Text variant="labelMedium" style={[styles.quickActionText, { fontSize: fontSizes.small }]}>
          {title}
        </Text>
        <Button mode="contained" onPress={onPress} compact style={styles.quickActionButton}>
          Go
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingHorizontal: horizontalPadding }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <Card style={[styles.welcomeCard, { marginBottom: spacing.lg }]}>
          <Card.Content>
            <View style={styles.welcomeHeader}>
              <View style={styles.welcomeText}>
                <Text variant="headlineSmall" style={[styles.greeting, { fontSize: fontSizes.large }]}>
                  {getGreeting()}, {user?.name}! 👋
                </Text>
                <Text variant="bodyMedium" style={[styles.partnerStatus, { fontSize: fontSizes.small }]}>
                  {getPartnerStatus()}
                </Text>
              </View>
              <Avatar.Text
                size={isSmallScreen ? 50 : 60}
                label={user?.name?.charAt(0) || 'U'}
                style={{ backgroundColor: user?.color === 'blue' ? colors.primary : colors.secondary }}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <View style={[styles.section, { marginBottom: spacing.lg }]}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { fontSize: fontSizes.medium }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionButton
              icon="heart-plus"
              title="Plan Date"
              onPress={() => setShowPlanDateModal(true)}
              color={colors.heart}
            />
            <QuickActionButton
              icon="lightbulb-outline"
              title="Browse Ideas"
              onPress={() => navigation.navigate('Ideas' as never)}
              color={colors.secondary}
            />
            <QuickActionButton
              icon="calendar-heart"
              title="View Calendar"
              onPress={() => navigation.navigate('Calendar' as never)}
              color={colors.primary}
            />
            <QuickActionButton
              icon="message-text"
              title="Send Message"
              onPress={() => navigation.navigate('Chat' as never)}
              color={colors.heart}
            />
          </View>
        </View>

        {/* Upcoming Dates */}
        <View style={[styles.section, { marginBottom: spacing.lg }]}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { fontSize: fontSizes.medium }]}>
            Upcoming Dates
          </Text>
          {mockUpcomingDates.length > 0 ? (
            mockUpcomingDates.map((date) => (
              <Card key={date.id} style={[styles.dateCard, { marginBottom: spacing.sm }]}>
                <Card.Content>
                  <View style={styles.dateHeader}>
                    <View style={styles.dateInfo}>
                      <Text variant="titleSmall" style={[styles.dateTitle, { fontSize: fontSizes.medium }]}>
                        {date.title}
                      </Text>
                      <Text variant="bodySmall" style={[styles.dateTime, { fontSize: fontSizes.small }]}>
                        {date.date}
                      </Text>
                      <Text variant="bodySmall" style={[styles.dateLocation, { fontSize: fontSizes.small }]}>
                        📍 {date.location}
                      </Text>
                    </View>
                    <View style={styles.dateActions}>
                      <Chip
                        mode="outlined"
                        compact
                        style={styles.plannedByChip}
                        textStyle={{ fontSize: fontSizes.small }}
                      >
                        {date.plannedBy === 'you' ? 'Your idea' : `${partner?.name || 'Partner'}'s idea`}
                      </Chip>
                      <MaterialCommunityIcons
                        name={date.type === 'dinner' ? 'food' : 'movie'}
                        size={24}
                        color={colors.primary}
                      />
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <MaterialCommunityIcons name="calendar-plus" size={48} color={colors.textSecondary} />
                <Text variant="bodyMedium" style={[styles.emptyText, { fontSize: fontSizes.small }]}>
                  No upcoming dates planned yet
                </Text>
                <Button mode="contained" onPress={() => navigation.navigate('Calendar' as never)} style={styles.emptyButton}>
                  Plan Your First Date
                </Button>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Date Inspiration */}
        <View style={[styles.section, { marginBottom: spacing.xl }]}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { fontSize: fontSizes.medium }]}>
            Date Inspiration
          </Text>
          <Card style={styles.inspirationCard}>
            <Card.Content>
              <View style={styles.inspirationHeader}>
                <MaterialCommunityIcons name="lightbulb" size={32} color={colors.secondary} />
                <Text variant="titleSmall" style={[styles.inspirationTitle, { fontSize: fontSizes.medium }]}>
                  Today's Suggestion
                </Text>
              </View>
              <Text variant="bodyLarge" style={[styles.inspirationText, { fontSize: fontSizes.medium }]}>
                {mockDateIdeas[currentIdeaIndex]}
              </Text>
              <View style={styles.inspirationActions}>
                <Button
                  mode="outlined"
                  onPress={() => setCurrentIdeaIndex((prev) => (prev + 1) % mockDateIdeas.length)}
                  style={styles.inspirationButton}
                >
                  Next Idea
                </Button>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('Ideas' as never)}
                  style={styles.inspirationButton}
                >
                  Save This
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Plan Date Modal */}
      <Portal>
        <Modal
          visible={showPlanDateModal}
          onDismiss={() => setShowPlanDateModal(false)}
          contentContainerStyle={[styles.modalContainer, { margin: horizontalPadding }]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalKeyboardView}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalScrollContent}
            >
              <View style={styles.modalHeader}>
                <Text variant="titleLarge" style={[styles.modalTitle, { fontSize: fontSizes.large }]}>
                  Plan a Date
                </Text>
                <Text variant="bodyMedium" style={[styles.modalSubtitle, { fontSize: fontSizes.small }]}>
                  Let's plan something special together!
                </Text>
              </View>

              <View style={styles.modalForm}>
                <TextInput
                  label="What are you planning? *"
                  value={planDateTitle}
                  onChangeText={setPlanDateTitle}
                  mode="outlined"
                  style={styles.modalInput}
                  placeholder="e.g., Dinner at Italian restaurant"
                />

                <TextInput
                  label="When? (Date) *"
                  value={planDateDate}
                  onChangeText={setPlanDateDate}
                  mode="outlined"
                  placeholder="e.g., today, tomorrow, Dec 25, 2024-12-25"
                  style={styles.modalInput}
                  right={<TextInput.Icon icon="calendar" />}
                />

                <TextInput
                  label="What time? *"
                  value={planDateTime}
                  onChangeText={setPlanDateTime}
                  mode="outlined"
                  placeholder="e.g., 7:00 PM, 19:00"
                  style={styles.modalInput}
                  right={<TextInput.Icon icon="clock" />}
                />

                <TextInput
                  label="Where? *"
                  value={planDateLocation}
                  onChangeText={setPlanDateLocation}
                  mode="outlined"
                  placeholder="e.g., Luigi's Restaurant, Downtown"
                  style={styles.modalInput}
                  right={<TextInput.Icon icon="map-marker" />}
                />
              </View>

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => setShowPlanDateModal(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handlePlanDate}
                  style={styles.modalButton}
                  disabled={!planDateTitle.trim() || !planDateDate.trim() || !planDateTime.trim() || !planDateLocation.trim()}
                >
                  Plan Date
                </Button>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>
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
    paddingTop: 16,
  },
  welcomeCard: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    flex: 1,
    marginRight: 16,
  },
  greeting: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  partnerStatus: {
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: colors.surface,
    elevation: 2,
    marginBottom: 12,
  },
  quickActionContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  quickActionText: {
    color: colors.text,
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  quickActionButton: {
    minWidth: 60,
  },
  dateCard: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateInfo: {
    flex: 1,
  },
  dateTitle: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateTime: {
    color: colors.primary,
    marginBottom: 2,
  },
  dateLocation: {
    color: colors.textSecondary,
  },
  dateActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  plannedByChip: {
    backgroundColor: colors.surfaceVariant,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  emptyButton: {
    marginTop: 8,
  },
  inspirationCard: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  inspirationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inspirationTitle: {
    color: colors.text,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  inspirationText: {
    color: colors.text,
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 22,
  },
  inspirationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  inspirationButton: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 0,
    maxHeight: '85%',
    minHeight: 400,
  },
  modalKeyboardView: {
    flex: 1,
  },
  modalScrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalForm: {
    marginBottom: 20,
  },
  modalTitle: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    color: colors.textSecondary,
    marginBottom: 20,
  },
  modalInput: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
  },
});

export default HomeScreen; 