import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import HomeScreen from '../screens/main/HomeScreen';
import MoviesScreen from '../screens/main/MoviesScreen';
import RestaurantsScreen from '../screens/main/RestaurantsScreen';
import StayAtHomeScreen from '../screens/main/StayAtHomeScreen';
import VirtualDatesScreen from '../screens/main/VirtualDatesScreen';
import { colors } from '../theme';

export type MainTabParamList = {
  Home: undefined;
  Movies: undefined;
  Restaurants: undefined;
  StayAtHome: undefined;
  VirtualDates: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const { height: screenHeight } = Dimensions.get('window');

const MainNavigator = () => {
  const insets = useSafeAreaInsets();

  // Calculate tab bar height based on screen size and safe area
  const tabBarHeight = Math.max(60 + insets.bottom, 80);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          height: tabBarHeight,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        },
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          height: Math.max(56 + insets.top, 80),
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarHideOnKeyboard: true, // Hide tab bar when keyboard is open
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-heart" size={size} color={color} />
          ),
          headerTitle: 'TwoGether',
        }}
      />
      <Tab.Screen
        name="Movies"
        component={MoviesScreen}
        options={{
          tabBarLabel: 'Movies',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="movie" size={size} color={color} />
          ),
          headerTitle: 'Movies',
        }}
      />
      <Tab.Screen
        name="Restaurants"
        component={RestaurantsScreen}
        options={{
          tabBarLabel: 'Dining',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="silverware-fork-knife" size={size} color={color} />
          ),
          headerTitle: 'Restaurants',
        }}
      />
      <Tab.Screen
        name="StayAtHome"
        component={StayAtHomeScreen}
        options={{
          tabBarLabel: 'At Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant" size={size} color={color} />
          ),
          headerTitle: 'Stay at Home',
        }}
      />
      <Tab.Screen
        name="VirtualDates"
        component={VirtualDatesScreen}
        options={{
          tabBarLabel: 'Virtual',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="video" size={size} color={color} />
          ),
          headerTitle: 'Virtual Dates',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator; 