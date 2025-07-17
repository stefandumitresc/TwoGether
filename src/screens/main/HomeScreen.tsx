import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions, Platform, TouchableOpacity, Modal as RNModal } from 'react-native';
import { Text, Button, Card, Avatar, Chip, TextInput, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { useResponsiveDesign } from '../../hooks/useResponsiveDesign';
import { HomeStackParamList } from '../../navigation/MainNavigator';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width: screenWidth } = Dimensions.get('window');

// Types
type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'HomeMain'>;

interface QuickActionButtonProps {
  icon: any; // MaterialCommunityIcons icon name
  title: string;
  onPress: () => void;
  color?: string;
}

const HomeScreen = () => {
  const { user, partner } = useAuth();
  const { horizontalPadding, spacing, fontSizes, isSmallScreen } = useResponsiveDesign();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [refreshing, setRefreshing] = useState(false);
  const [showPlanDateModal, setShowPlanDateModal] = useState(false);
  const [planDateTitle, setPlanDateTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [planDateLocation, setPlanDateLocation] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [prefilledIdea, setPrefilledIdea] = useState<any>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (showPlanDateModal) {
      setSelectedDate(null);
      setSelectedTime(null);

      // If we have a prefilled idea, use it
      if (prefilledIdea) {
        setPlanDateTitle(prefilledIdea.title);
      }
    }
  }, [showPlanDateModal, prefilledIdea]);

  // Format date for display as MM/DD/YYYY
  const formatDateForDisplay = (date: Date | null): string => {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Format time for display
  const formatTimeForDisplay = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Handle date picker change
  const onDateChange = (event: any, selectedDate?: Date) => {
    console.log('Date change event:', event.type, selectedDate);
    if (Platform.OS === 'android' && event.type === 'dismissed') {
      return; // Don't update on dismiss
    }
    if (selectedDate) {
      console.log('Setting selected date to:', selectedDate);
      setSelectedDate(selectedDate);
    }
  };

  // Handle time picker change
  const onTimeChange = (event: any, selectedTime?: Date) => {
    console.log('Time change event:', event.type, selectedTime);
    if (Platform.OS === 'android' && event.type === 'dismissed') {
      return; // Don't update on dismiss
    }
    if (selectedTime) {
      console.log('Setting selected time to:', selectedTime);
      setSelectedTime(selectedTime);
    }
  };

  const handlePlanDate = () => {
    if (planDateTitle.trim() && planDateLocation.trim() && selectedDate && selectedTime) {
      // Format date as YYYY-MM-DD for calendar
      const eventDate = selectedDate.toISOString().split('T')[0];
      const eventTime = formatTimeForDisplay(selectedTime);

      const newEvent = {
        id: Date.now().toString(),
        title: planDateTitle.trim(),
        date: eventDate,
        time: eventTime,
        location: planDateLocation.trim(),
        type: 'planned' as const,
        plannedBy: 'you' as const,
      };

      console.log('Creating new event:', newEvent);
      // Navigate to calendar with the new event data
      navigation.navigate('Calendar', { newEvent });

      // Reset form
      setPlanDateTitle('');
      setPlanDateLocation('');
      setSelectedDate(null);
      setSelectedTime(null);
      setPrefilledIdea(null);
      setShowPlanDateModal(false);
    }
  };

  const closeModal = () => {
    setShowPlanDateModal(false);
    setPrefilledIdea(null);
    setShowDatePicker(false);
    setShowTimePicker(false);
    // Reset form fields
    setPlanDateTitle('');
    setPlanDateLocation('');
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Cleanup on unmount or navigation
  useEffect(() => {
    return () => {
      // Cleanup any open modals when component unmounts
      setShowPlanDateModal(false);
      setShowDatePicker(false);
      setShowTimePicker(false);
    };
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'movies':
        navigation.navigate('Movies');
        break;
      case 'restaurants':
        navigation.navigate('Restaurants');
        break;
      case 'activities':
        navigation.navigate('Calendar', {});
        break;
      case 'calendar':
        navigation.navigate('Calendar', {});
        break;
      case 'ideas':
        // Navigate to Discover tab
        navigation.navigate('Discover' as never);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

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

  const QuickActionButton = ({ icon, title, onPress, color = colors.primary }: QuickActionButtonProps) => (
    <View style={styles.quickActionItem}>
      <Button
        mode="contained"
        onPress={onPress}
        style={[styles.quickActionButton, { backgroundColor: color }]}
        contentStyle={styles.quickActionContent}
        labelStyle={styles.quickActionLabel}
      >
        <View style={styles.quickActionInner}>
          <MaterialCommunityIcons name={icon} size={24} color={colors.surface} />
          <Text style={[styles.quickActionText, { color: colors.surface }]}>{title}</Text>
        </View>
      </Button>
    </View>
  );

  const mockDateIdeas = [
    {
      id: '1',
      title: 'Sunset Picnic',
      description: 'Pack your favorite snacks and watch the sunset together',
      emoji: '🌅',
    },
    {
      id: '2',
      title: 'Cooking Together',
      description: 'Try a new recipe and cook a meal together',
      emoji: '👨‍🍳',
    },
    {
      id: '3',
      title: 'Movie Marathon',
      description: 'Binge-watch your favorite series with popcorn',
      emoji: '🍿',
    },
  ];

  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);

  // Rotate date ideas every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdeaIndex((prev) => (prev + 1) % mockDateIdeas.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle "Plan This Date" button from inspiration
  const handlePlanThisDate = () => {
    const currentIdea = mockDateIdeas[currentIdeaIndex];
    setPrefilledIdea(currentIdea);
    setShowPlanDateModal(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
      >
        {/* Welcome Section */}
        <View style={[styles.welcomeContainer, { marginBottom: spacing.lg }]}>
          <Card style={styles.welcomeCard}>
            <Card.Content style={styles.welcomeContent}>
              <View style={styles.welcomeHeader}>
                <Avatar.Icon size={48} icon="heart" style={styles.welcomeAvatar} />
                <View style={styles.welcomeTextContainer}>
                  <Text variant="titleMedium" style={[styles.welcomeTitle, { fontSize: fontSizes.medium }]}>
                    {getGreeting()}, {user?.name || 'there'}!
                  </Text>
                  <Text variant="bodySmall" style={[styles.welcomeSubtitle, { fontSize: fontSizes.small }]}>
                    {getPartnerStatus()}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActionsContainer, { marginBottom: spacing.lg }]}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { fontSize: fontSizes.medium, marginBottom: spacing.md }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            <View style={styles.quickActionsRow}>
              <QuickActionButton
                icon="heart-plus"
                title="Plan Date"
                onPress={() => {
                  console.log('Plan Date button pressed');
                  setPrefilledIdea(null);
                  setShowPlanDateModal(true);
                }}
                color={colors.heart}
              />
              <QuickActionButton
                icon="calendar-heart"
                title="Calendar"
                onPress={() => navigation.navigate('Calendar', {})}
                color={colors.primary}
              />
            </View>
            <View style={styles.quickActionsRow}>
              <QuickActionButton
                icon="message-text"
                title="Messages"
                onPress={() => navigation.navigate('Messages' as never)}
                color={colors.secondary}
              />
              <QuickActionButton
                icon="lightbulb"
                title="Ideas"
                onPress={() => handleQuickAction('ideas')}
                color={colors.tertiary}
              />
            </View>
          </View>
        </View>

        {/* Date Inspiration */}
        <View style={[styles.inspirationContainer, { marginBottom: spacing.lg }]}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { fontSize: fontSizes.medium, marginBottom: spacing.md }]}>
            Date Inspiration
          </Text>
          <Card style={styles.inspirationCard}>
            <Card.Content style={styles.inspirationContent}>
              <Text style={styles.inspirationEmoji}>
                {mockDateIdeas[currentIdeaIndex].emoji}
              </Text>
              <Text variant="titleSmall" style={[styles.inspirationTitle, { fontSize: fontSizes.medium }]}>
                {mockDateIdeas[currentIdeaIndex].title}
              </Text>
              <Text variant="bodyMedium" style={[styles.inspirationDescription, { fontSize: fontSizes.small }]}>
                {mockDateIdeas[currentIdeaIndex].description}
              </Text>
              <Button
                mode="outlined"
                onPress={handlePlanThisDate}
                style={styles.inspirationButton}
              >
                Plan This Date
              </Button>
            </Card.Content>
          </Card>
        </View>

        {/* Upcoming Dates */}
        <View style={[styles.upcomingContainer, { marginBottom: spacing.lg }]}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { fontSize: fontSizes.medium, marginBottom: spacing.md }]}>
            Upcoming Dates
          </Text>
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <MaterialCommunityIcons name="calendar-heart" size={48} color={colors.textSecondary} />
              <Text variant="bodyMedium" style={[styles.emptyText, { fontSize: fontSizes.small }]}>
                No upcoming dates planned yet
              </Text>
              <Button mode="contained" onPress={() => navigation.navigate('Calendar', {})} style={styles.emptyButton}>
                Plan Your First Date
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Plan Date Modal - Using React Native Modal */}
      <RNModal
        visible={showPlanDateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Plan a Date</Text>
            <View style={styles.closeButtonPlaceholder} />
          </View>

          <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.modalForm}>
              <Text style={styles.modalSubtitle}>Let's plan something special together!</Text>

              <TextInput
                label="What are you planning? *"
                value={planDateTitle}
                onChangeText={setPlanDateTitle}
                mode="outlined"
                style={styles.modalInput}
                placeholder="e.g., Dinner at Italian restaurant"
              />

              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeButton}>
                  <TextInput
                    label="Date *"
                    value={formatDateForDisplay(selectedDate)}
                    mode="outlined"
                    style={styles.dateTimeInput}
                    editable={false}
                    placeholder="MM/DD/YYYY"
                    onPressIn={() => {
                      console.log('Date picker pressed');
                      setShowDatePicker(true);
                    }}
                    right={<TextInput.Icon
                      icon="calendar"
                      onPress={() => {
                        console.log('Date icon pressed');
                        setShowDatePicker(true);
                      }}
                    />}
                  />
                </View>

                <View style={styles.dateTimeButton}>
                  <TextInput
                    label="Time *"
                    value={formatTimeForDisplay(selectedTime)}
                    mode="outlined"
                    style={styles.dateTimeInput}
                    editable={false}
                    placeholder="HH:MM AM/PM"
                    onPressIn={() => {
                      console.log('Time picker pressed');
                      setShowTimePicker(true);
                    }}
                    right={<TextInput.Icon
                      icon="clock"
                      onPress={() => {
                        console.log('Time icon pressed');
                        setShowTimePicker(true);
                      }}
                    />}
                  />
                </View>
              </View>

              {/* Date Picker inside modal */}
              {showDatePicker && (
                <View style={styles.pickerContainer}>
                  <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Select Date</Text>
                    <Button
                      mode="contained"
                      onPress={() => setShowDatePicker(false)}
                      style={styles.pickerHeaderButton}
                      compact
                    >
                      Done
                    </Button>
                  </View>
                  <View style={styles.pickerWrapper}>
                    <DateTimePicker
                      value={selectedDate || new Date()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onDateChange}
                      minimumDate={new Date()}
                      maximumDate={(() => {
                        // Set maximum date to 2 years from now to prevent endless spinning
                        const maxDate = new Date();
                        maxDate.setFullYear(maxDate.getFullYear() + 2);
                        return maxDate;
                      })()}
                      style={styles.picker}
                      textColor={colors.text}
                      accentColor={colors.primary}
                    />
                  </View>
                  {selectedDate && (
                    <Text style={styles.selectedValueText}>
                      Selected: {formatDateForDisplay(selectedDate)}
                    </Text>
                  )}
                </View>
              )}

              {/* Time Picker inside modal */}
              {showTimePicker && (
                <View style={styles.pickerContainer}>
                  <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Select Time</Text>
                    <Button
                      mode="contained"
                      onPress={() => setShowTimePicker(false)}
                      style={styles.pickerHeaderButton}
                      compact
                    >
                      Done
                    </Button>
                  </View>
                  <View style={styles.pickerWrapper}>
                    <DateTimePicker
                      value={selectedTime || (() => {
                        const defaultTime = new Date();
                        defaultTime.setHours(19, 0, 0, 0); // 7:00 PM
                        return defaultTime;
                      })()}
                      mode="time"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onTimeChange}
                      is24Hour={false}
                      neutralButtonLabel="Clear"
                      timeZoneOffsetInMinutes={undefined}
                      style={styles.picker}
                      textColor={colors.text}
                      accentColor={colors.primary}
                    />
                  </View>
                  {selectedTime && (
                    <Text style={styles.selectedValueText}>
                      Selected: {formatTimeForDisplay(selectedTime)}
                    </Text>
                  )}
                </View>
              )}

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
          </ScrollView>

          <View style={styles.modalActions}>
            <View style={styles.modalButtonRow}>
              <Button
                mode="outlined"
                onPress={closeModal}
                style={styles.modalActionButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handlePlanDate}
                style={styles.modalActionButton}
                disabled={!planDateTitle.trim() || !planDateLocation.trim() || !selectedDate || !selectedTime}
                loading={false}
              >
                Plan Date
              </Button>
            </View>
            <View style={styles.modalButtonRow}>
              <Button
                mode="outlined"
                onPress={() => {
                  console.log('Save as draft');
                }}
                style={styles.modalActionButton}
                icon="content-save"
              >
                Save Draft
              </Button>
              <Button
                mode="contained"
                onPress={handlePlanDate}
                style={styles.modalActionButton}
                icon="share"
                buttonColor={colors.secondary}
              >
                Share
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </RNModal>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  welcomeContainer: {
    marginBottom: 24,
  },
  welcomeCard: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  welcomeContent: {
    padding: 20,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeAvatar: {
    backgroundColor: colors.primary,
    marginRight: 16,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: colors.text,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    paddingHorizontal: 8,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quickActionItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionButton: {
    borderRadius: 16,
    height: 90,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  quickActionContent: {
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 0, // Hide the default label
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  inspirationContainer: {
    marginBottom: 24,
  },
  inspirationCard: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  inspirationContent: {
    alignItems: 'center',
    padding: 24,
  },
  inspirationEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  inspirationTitle: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  inspirationDescription: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  inspirationButton: {
    marginTop: 8,
  },
  upcomingContainer: {
    marginBottom: 24,
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
    marginBottom: 16,
  },
  emptyButton: {
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonPlaceholder: {
    width: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalSubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    flexGrow: 1,
  },
  modalForm: {
    padding: 20,
  },
  modalInput: {
    marginBottom: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateTimeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateTimeInput: {
    flex: 1,
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalActionButton: {
    flex: 1,
    marginHorizontal: 6,
  },
  pickerContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  pickerHeaderButton: {
    minWidth: 80,
  },
  pickerWrapper: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  picker: {
    height: 200,
    width: '100%',
  },
  selectedValueText: {
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
  pickerButton: {
    marginTop: 16,
  },
});

export default HomeScreen; 