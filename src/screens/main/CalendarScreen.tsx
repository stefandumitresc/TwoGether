import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button, Card, Portal, Modal, TextInput, Chip, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { useResponsiveDesign } from '../../hooks/useResponsiveDesign';

const { width: screenWidth } = Dimensions.get('window');

// Types
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
  const route = useRoute();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [events, setEvents] = useState<DateEvent[]>(initialMockEvents);

  // Handle new event from navigation params
  useEffect(() => {
    const params = route.params as { newEvent?: DateEvent } | undefined;
    if (params?.newEvent) {
      setEvents(prevEvents => [...prevEvents, params.newEvent!]);
      setSelectedDate(params.newEvent.date);
      // Clear the navigation params to avoid adding the same event multiple times
      (route.params as any) = undefined;
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
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
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

      {/* Add Event Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={[styles.modalContainer, { margin: horizontalPadding }]}
        >
          <Text variant="titleLarge" style={[styles.modalTitle, { fontSize: fontSizes.large }]}>
            Plan a Date
          </Text>
          <Text variant="bodyMedium" style={[styles.modalDate, { fontSize: fontSizes.small }]}>
            {selectedDate && formatLocalDate(selectedDate, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>

          <TextInput
            label="What are you planning?"
            value={newEventTitle}
            onChangeText={setNewEventTitle}
            mode="outlined"
            style={styles.modalInput}
          />

          <TextInput
            label="Time (optional)"
            value={newEventTime}
            onChangeText={setNewEventTime}
            mode="outlined"
            placeholder="e.g., 7:00 PM"
            style={styles.modalInput}
          />

          <TextInput
            label="Location (optional)"
            value={newEventLocation}
            onChangeText={setNewEventLocation}
            mode="outlined"
            style={styles.modalInput}
          />

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowAddModal(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAddEvent}
              style={styles.modalButton}
              disabled={!newEventTitle.trim()}
            >
              Add Date
            </Button>
          </View>
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
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDate: {
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

export default CalendarScreen; 