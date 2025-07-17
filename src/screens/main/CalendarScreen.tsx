import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, Modal as RNModal } from 'react-native';
import { Text, Button, Card, Portal, Modal, TextInput, Chip, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { useResponsiveDesign } from '../../hooks/useResponsiveDesign';
import { HomeStackParamList, DiscoverStackParamList } from '../../navigation/MainNavigator';

const { width: screenWidth } = Dimensions.get('window');

// Types
type CalendarRouteProps = RouteProp<HomeStackParamList, 'Calendar'> | RouteProp<DiscoverStackParamList, 'Calendar'>;

interface DateEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  time?: string;
  type: 'planned' | 'suggested' | 'completed';
  plannedBy: 'you' | 'partner';
  location?: string;
  description?: string;
}

// Initial mock data for demonstration
const initialMockEvents: DateEvent[] = [
  {
    id: '1',
    title: 'Dinner at Luigi\'s',
    date: '2024-01-15',
    time: '19:00',
    type: 'planned',
    plannedBy: 'you',
    location: 'Downtown',
    description: 'Anniversary dinner reservation',
  },
  {
    id: '2',
    title: 'Movie Night',
    date: '2024-01-20',
    time: '20:30',
    type: 'planned',
    plannedBy: 'partner',
    location: 'Home',
    description: 'Watch the new rom-com',
  },
  {
    id: '3',
    title: 'Coffee Date',
    date: '2024-01-12',
    time: '10:00',
    type: 'completed',
    plannedBy: 'you',
    location: 'Starbucks',
  },
  {
    id: '4',
    title: 'Art Gallery Visit',
    date: '2024-01-25',
    type: 'suggested',
    plannedBy: 'partner',
    location: 'Modern Art Museum',
  },
];

const CalendarScreen = () => {
  const { user, partner } = useAuth();
  const { horizontalPadding, spacing, fontSizes, isSmallScreen } = useResponsiveDesign();
  const route = useRoute<CalendarRouteProps>();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');

  // New state for HomeScreen-style modal
  const [planDateTitle, setPlanDateTitle] = useState('');
  const [modalSelectedDate, setModalSelectedDate] = useState<Date | null>(null);
  const [modalSelectedTime, setModalSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [events, setEvents] = useState<DateEvent[]>(initialMockEvents);

  // Handle new event from navigation params - save directly to calendar
  useEffect(() => {
    const params = route.params;
    if (params?.newEvent) {
      console.log('Saving new event from navigation:', params.newEvent);

      // Add the event directly to the calendar
      setEvents(prevEvents => {
        // Check if event already exists to avoid duplicates
        const eventExists = prevEvents.some(event =>
          event.date === params.newEvent.date &&
          event.title === params.newEvent.title &&
          event.time === params.newEvent.time
        );

        if (!eventExists) {
          const newCalendarEvent: DateEvent = {
            id: params.newEvent.id || Date.now().toString(),
            title: params.newEvent.title,
            date: params.newEvent.date,
            time: params.newEvent.time,
            type: params.newEvent.type || 'planned',
            plannedBy: params.newEvent.plannedBy || 'you',
            location: params.newEvent.location,
          };
          console.log('Added new event to calendar:', newCalendarEvent);
          return [...prevEvents, newCalendarEvent];
        }
        return prevEvents;
      });

      // Navigate calendar to the event's date
      if (params.newEvent.date) {
        const eventDate = new Date(params.newEvent.date);
        setCurrentDate(eventDate);
        setSelectedDate(params.newEvent.date);
        console.log('Navigated calendar to event date:', eventDate);
      }
    }
  }, [route.params]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  // Get today's date in local timezone (YYYY-MM-DD format)
  const todayString = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Get events for current month
  const monthEvents = useMemo(() => {
    const monthString = `${year}-${String(month + 1).padStart(2, '0')}`;
    return events.filter((event: DateEvent) => event.date.startsWith(monthString));
  }, [year, month, events]);

  // Get events for a specific date
  const getEventsForDate = (date: string) => {
    return monthEvents.filter((event: DateEvent) => event.date === date);
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: `${year}-${String(month).padStart(2, '0')}-${String(daysInPrevMonth - i).padStart(2, '0')}`,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        day,
        isCurrentMonth: true,
        date: dateString,
        events: getEventsForDate(dateString),
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: `${year}-${String(month + 2).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      });
    }

    return days;
  }, [year, month, daysInMonth, firstDayOfMonth, daysInPrevMonth, monthEvents]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(month - 1);
    } else {
      newDate.setMonth(month + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDatePress = (date: string, events: DateEvent[]) => {
    setSelectedDate(date);
    if (events.length > 0) {
      setShowEventModal(true);
    }
  };

  const handleAddEvent = () => {
    if (newEventTitle.trim() && selectedDate) {
      const newEvent: DateEvent = {
        id: Date.now().toString(),
        title: newEventTitle.trim(),
        date: selectedDate,
        time: newEventTime.trim() || undefined,
        location: newEventLocation.trim() || undefined,
        type: 'planned',
        plannedBy: 'you',
      };

      setEvents(prevEvents => [...prevEvents, newEvent]);
      setNewEventTitle('');
      setNewEventTime('');
      setNewEventLocation('');
      setShowAddModal(false);
    }
  };

  // Helper functions from HomeScreen for date/time formatting and handling
  const formatDateForDisplay = (date: Date | null): string => {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatTimeForDisplay = (time: Date | null): string => {
    if (!time) return '';
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    console.log('CalendarScreen date change:', event.type, selectedDate);
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type === 'dismissed') {
        return; // Don't update on dismiss
      }
    }
    if (selectedDate) {
      console.log('Setting modal selected date to:', selectedDate);
      setModalSelectedDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    console.log('CalendarScreen time change:', event.type, selectedTime);
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      if (event.type === 'dismissed') {
        return; // Don't update on dismiss
      }
    }
    if (selectedTime) {
      console.log('Setting modal selected time to:', selectedTime);
      setModalSelectedTime(selectedTime);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setPlanDateTitle('');
    setModalSelectedDate(null);
    setModalSelectedTime(null);
    setShowDatePicker(false);
    setShowTimePicker(false);
    setNewEventLocation('');
  };

  // Cleanup on unmount or navigation
  useEffect(() => {
    return () => {
      // Cleanup any open modals when component unmounts
      setShowAddModal(false);
      setShowEventModal(false);
      setShowDatePicker(false);
      setShowTimePicker(false);
    };
  }, []);

  const handlePlanDate = () => {
    if (planDateTitle.trim() && modalSelectedDate && modalSelectedTime) {
      const dateStr = modalSelectedDate.toISOString().split('T')[0];
      const timeStr = formatTimeForDisplay(modalSelectedTime);

      const newEvent: DateEvent = {
        id: Date.now().toString(),
        title: planDateTitle.trim(),
        date: dateStr,
        time: timeStr,
        type: 'planned',
        plannedBy: 'you',
        location: newEventLocation.trim() || undefined,
      };

      setEvents(prev => [...prev, newEvent]);

      // Navigate to the created event's date and select it
      setCurrentDate(modalSelectedDate);
      setSelectedDate(dateStr);

      closeModal();
    }
  };

  const getEventTypeColor = (type: DateEvent['type']) => {
    switch (type) {
      case 'planned': return colors.primary;
      case 'suggested': return colors.secondary;
      case 'completed': return colors.textSecondary;
      default: return colors.primary;
    }
  };

  const getEventTypeIcon = (type: DateEvent['type']) => {
    switch (type) {
      case 'planned': return 'calendar-check';
      case 'suggested': return 'lightbulb-outline';
      case 'completed': return 'check-circle';
      default: return 'calendar';
    }
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Helper function to format date in local timezone
  const formatLocalDate = (dateString: string, options: Intl.DateTimeFormatOptions) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={[styles.content, { paddingHorizontal: horizontalPadding }]}>
        {/* Calendar Header */}
        <View style={styles.header}>
          <View style={styles.monthNavigation}>
            <IconButton
              icon="chevron-left"
              size={24}
              onPress={() => navigateMonth('prev')}
            />
            <TouchableOpacity onPress={goToToday}>
              <Text variant="headlineSmall" style={[styles.monthTitle, { fontSize: fontSizes.large }]}>
                {monthNames[month]} {year}
              </Text>
            </TouchableOpacity>
            <IconButton
              icon="chevron-right"
              size={24}
              onPress={() => navigateMonth('next')}
            />
          </View>
          <Button
            mode="outlined"
            onPress={goToToday}
            compact
            style={styles.todayButton}
          >
            Today
          </Button>
        </View>

        {/* Calendar Grid */}
        <Card style={styles.calendarCard}>
          <Card.Content style={styles.calendarContent}>
            {/* Day headers */}
            <View style={styles.dayHeadersRow}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={[styles.dayHeader, { fontSize: fontSizes.small }]}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar days */}
            <View style={styles.calendarGrid}>
              {calendarDays.map((dayData, index) => {
                const isToday = dayData.date === todayString;
                const hasEvents = dayData.events && dayData.events.length > 0;
                const isSelected = dayData.date === selectedDate;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCell,
                      isToday && styles.todayCell,
                      isSelected && styles.selectedCell,
                      !dayData.isCurrentMonth && styles.otherMonthCell,
                    ]}
                    onPress={() => handleDatePress(dayData.date, dayData.events || [])}
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                        { fontSize: fontSizes.small },
                        isToday && styles.todayText,
                        isSelected && styles.selectedText,
                        !dayData.isCurrentMonth && styles.otherMonthText,
                      ]}
                    >
                      {dayData.day}
                    </Text>
                    {hasEvents && (
                      <View style={styles.eventIndicators}>
                        {dayData.events!.slice(0, 3).map((event: DateEvent, eventIndex: number) => (
                          <View
                            key={eventIndex}
                            style={[
                              styles.eventDot,
                              { backgroundColor: getEventTypeColor(event.type) },
                            ]}
                          />
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card.Content>
        </Card>

        {/* Selected Date Events */}
        {selectedDate && (
          <View style={[styles.selectedDateSection, { marginTop: spacing.lg }]}>
            <Text variant="titleMedium" style={[styles.selectedDateTitle, { fontSize: fontSizes.medium }]}>
              {formatLocalDate(selectedDate, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>

            {selectedDateEvents.length > 0 ? (
              <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
                {selectedDateEvents.map((event: DateEvent) => (
                  <Card key={event.id} style={[styles.eventCard, { marginBottom: spacing.sm }]}>
                    <Card.Content>
                      <View style={styles.eventHeader}>
                        <View style={styles.eventInfo}>
                          <Text variant="titleSmall" style={[styles.eventTitle, { fontSize: fontSizes.medium }]}>
                            {event.title}
                          </Text>
                          {event.time && (
                            <Text variant="bodySmall" style={[styles.eventTime, { fontSize: fontSizes.small }]}>
                              🕐 {event.time}
                            </Text>
                          )}
                          {event.location && (
                            <Text variant="bodySmall" style={[styles.eventLocation, { fontSize: fontSizes.small }]}>
                              📍 {event.location}
                            </Text>
                          )}
                        </View>
                        <View style={styles.eventMeta}>
                          <MaterialCommunityIcons
                            name={getEventTypeIcon(event.type)}
                            size={20}
                            color={getEventTypeColor(event.type)}
                          />
                          <Chip
                            mode="outlined"
                            compact
                            style={[styles.plannedByChip, { backgroundColor: colors.surfaceVariant }]}
                            textStyle={{ fontSize: fontSizes.small }}
                          >
                            {event.plannedBy === 'you' ? 'You' : partner?.name || 'Partner'}
                          </Chip>
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </ScrollView>
            ) : (
              <Card style={styles.emptyEventCard}>
                <Card.Content style={styles.emptyEventContent}>
                  <MaterialCommunityIcons name="calendar-plus" size={32} color={colors.textSecondary} />
                  <Text variant="bodyMedium" style={[styles.emptyEventText, { fontSize: fontSizes.small }]}>
                    No events planned for this day
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => setShowAddModal(true)}
                    style={styles.addEventButton}
                  >
                    Plan Something
                  </Button>
                </Card.Content>
              </Card>
            )}
          </View>
        )}
      </View>

      {/* Plan Date Modal - HomeScreen Style */}
      <RNModal
        visible={showAddModal}
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
                    value={formatDateForDisplay(modalSelectedDate)}
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
                    value={formatTimeForDisplay(modalSelectedTime)}
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
                      value={modalSelectedDate || new Date()}
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
                  {modalSelectedDate && (
                    <Text style={styles.selectedValueText}>
                      Selected: {formatDateForDisplay(modalSelectedDate)}
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
                      value={modalSelectedTime || (() => {
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
                  {modalSelectedTime && (
                    <Text style={styles.selectedValueText}>
                      Selected: {formatTimeForDisplay(modalSelectedTime)}
                    </Text>
                  )}
                </View>
              )}

              <TextInput
                label="Where? (optional)"
                value={newEventLocation}
                onChangeText={setNewEventLocation}
                mode="outlined"
                style={styles.modalInput}
                placeholder="e.g., Downtown, Luigi's Restaurant"
              />
            </View>
          </ScrollView>

          <View style={styles.modalButtonContainer}>
            <Button mode="outlined" onPress={closeModal} style={styles.modalCancelButton}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handlePlanDate}
              style={styles.modalPlanButton}
              disabled={!planDateTitle.trim() || !modalSelectedDate || !modalSelectedTime}
              loading={false}
            >
              Plan Date
            </Button>
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
  content: {
    flex: 1,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthTitle: {
    color: colors.text,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  todayButton: {
    borderColor: colors.primary,
  },
  calendarCard: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  calendarContent: {
    padding: 12,
  },
  dayHeadersRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    color: colors.textSecondary,
    fontWeight: 'bold',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 8,
    marginVertical: 2,
  },
  todayCell: {
    backgroundColor: colors.primary + '20',
  },
  selectedCell: {
    backgroundColor: colors.primary,
  },
  otherMonthCell: {
    opacity: 0.3,
  },
  dayNumber: {
    color: colors.text,
    fontWeight: '500',
  },
  todayText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  otherMonthText: {
    color: colors.textSecondary,
  },
  eventIndicators: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 2,
    gap: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  selectedDateSection: {
    flex: 1,
  },
  selectedDateTitle: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventTime: {
    color: colors.primary,
    marginBottom: 2,
  },
  eventLocation: {
    color: colors.textSecondary,
  },
  eventMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  plannedByChip: {
    backgroundColor: colors.surfaceVariant,
  },
  emptyEventCard: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  emptyEventContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyEventText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  addEventButton: {
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 100,
  },
  modalForm: {
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalInput: {
    marginBottom: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateTimeButton: {
    flex: 1,
  },
  dateTimeInput: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 20,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  pickerHeaderButton: {
    borderRadius: 20,
  },
  pickerWrapper: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  picker: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  selectedValueText: {
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '500',
    marginTop: 8,
    fontSize: 14,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalCancelButton: {
    flex: 1,
  },
  modalPlanButton: {
    flex: 1,
  },
});

export default CalendarScreen; 