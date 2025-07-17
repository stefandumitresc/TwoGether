import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { colors } from '../theme';
import { useResponsiveDesign } from '../hooks/useResponsiveDesign';

interface CustomDrawerContentProps {
  navigation: any;
  state: any;
  descriptors: any;
}

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = ({ navigation, state, descriptors }) => {
  const { spacing, fontSizes } = useResponsiveDesign();

  const datePlanningItems = [
    { name: 'Movies', label: 'Movies & Entertainment', icon: 'movie', tab: 'Home' },
    { name: 'Restaurants', label: 'Restaurants & Dining', icon: 'silverware-fork-knife', tab: 'Home' },
    { name: 'StayAtHome', label: 'Stay at Home', icon: 'home-variant', tab: 'Home' },
    { name: 'VirtualDates', label: 'Virtual Dates', icon: 'video', tab: 'Home' },
  ];

  const calendarItems = [
    { name: 'Calendar', label: 'Calendar', icon: 'calendar-heart', tab: 'Home' },
    { name: 'Ideas', label: 'Browse Ideas', icon: 'lightbulb', tab: 'Discover' },
  ];

  const relationshipItems = [
    { name: 'MoodTracker', label: 'Mood Tracker', icon: 'emoticon-happy' },
    { name: 'MemoryCollection', label: 'Memory Collection', icon: 'camera-image' },
    { name: 'MilestoneTracker', label: 'Milestone Tracker', icon: 'trophy' },
    { name: 'SurpriseGenerator', label: 'Surprise Generator', icon: 'gift' },
  ];

  const preferencesItems = [
    { name: 'DatePreferences', label: 'Date Preferences', icon: 'heart-cog' },
    { name: 'NotificationSettings', label: 'Notifications', icon: 'bell' },
    { name: 'AccountSettings', label: 'Account Settings', icon: 'account-cog' },
  ];

  const handleNavigation = (item: any) => {
    // Close the drawer first
    navigation.closeDrawer();

    // Navigate to the appropriate tab and screen
    if (item.tab) {
      navigation.navigate('MainTabs', {
        screen: item.tab,
        params: {
          screen: item.name === 'Ideas' ? 'DiscoverMain' : item.name,
          params: item.name === 'Calendar' ? {} : undefined
        }
      });
    }
  };

  const renderSection = (title: string, items: any[], isComingSoon = false) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { fontSize: fontSizes.medium, color: colors.textSecondary }]}>
        {title}
      </Text>
      {items.map((item) => (
        <DrawerItem
          key={item.name}
          label={item.label}
          icon={({ color, size }) => (
            <MaterialCommunityIcons name={item.icon} size={size} color={color} />
          )}
          onPress={() => {
            if (isComingSoon) {
              // Show coming soon message
              return;
            }
            handleNavigation(item);
          }}
          activeTintColor={colors.primary}
          inactiveTintColor={isComingSoon ? colors.textSecondary : colors.text}
          labelStyle={[
            styles.drawerLabel,
            { fontSize: fontSizes.medium },
            isComingSoon && { opacity: 0.5 }
          ]}
          style={[
            styles.drawerItem,
            isComingSoon && { opacity: 0.5 }
          ]}
        />
      ))}
    </View>
  );

  return (
    <DrawerContentScrollView style={styles.container}>
      <View style={[styles.header, { paddingTop: spacing.lg }]}>
        <MaterialCommunityIcons name="heart" size={32} color={colors.primary} />
        <Text style={[styles.headerTitle, { fontSize: fontSizes.large, color: colors.text }]}>
          TwoGether
        </Text>
        <Text style={[styles.headerSubtitle, { fontSize: fontSizes.small, color: colors.textSecondary }]}>
          Date Planning Made Easy
        </Text>
      </View>

      {renderSection('Date Planning', datePlanningItems)}
      {renderSection('Calendar & Events', calendarItems)}
      {renderSection('Relationship Tools', relationshipItems, true)}
      {renderSection('Preferences', preferencesItems, true)}

      <View style={styles.footer}>
        <Text style={[styles.footerText, { fontSize: fontSizes.small, color: colors.textSecondary }]}>
          Version 1.0.0
        </Text>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 10,
  },
  headerTitle: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  headerSubtitle: {
    marginTop: 4,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  drawerItem: {
    marginHorizontal: 10,
    borderRadius: 8,
  },
  drawerLabel: {
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 20,
  },
  footerText: {
    opacity: 0.7,
  },
});

export default CustomDrawerContent; 