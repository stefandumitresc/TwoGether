import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions, TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import HomeScreen from '../screens/main/HomeScreen';
import IdeasScreen from '../screens/main/IdeasScreen';
import ChatScreen from '../screens/main/ChatScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import MoviesScreen from '../screens/main/MoviesScreen';
import RestaurantsScreen from '../screens/main/RestaurantsScreen';
import StayAtHomeScreen from '../screens/main/StayAtHomeScreen';
import VirtualDatesScreen from '../screens/main/VirtualDatesScreen';
import CalendarScreen from '../screens/main/CalendarScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { colors } from '../theme';

// Stack param lists for each tab
export type HomeStackParamList = {
  HomeMain: undefined;
  Movies: undefined;
  Restaurants: undefined;
  StayAtHome: undefined;
  VirtualDates: undefined;
  Calendar: { newEvent?: any };
};

export type DiscoverStackParamList = {
  DiscoverMain: undefined;
  Movies: undefined;
  Restaurants: undefined;
  StayAtHome: undefined;
  VirtualDates: undefined;
  Calendar: { newEvent?: any };
};

export type MessagesStackParamList = {
  MessagesMain: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  MainTabs: undefined;
  Movies: undefined;
  Restaurants: undefined;
  StayAtHome: undefined;
  VirtualDates: undefined;
  Calendar: { newEvent?: any };
  Ideas: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();
const DiscoverStack = createStackNavigator<DiscoverStackParamList>();
const MessagesStack = createStackNavigator<MessagesStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const { height: screenHeight } = Dimensions.get('window');

// Stack Navigators for each tab
const HomeStackNavigator = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <HomeStack.Navigator
      screenOptions={{
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
      }}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerTitle: 'TwoGether',
          headerLeft: () => (
            <TouchableOpacity
              onPress={openDrawer}
              style={{ marginLeft: 16, padding: 8 }}
            >
              <MaterialCommunityIcons name="menu" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <HomeStack.Screen
        name="Movies"
        component={MoviesScreen}
        options={{
          headerTitle: 'Movies & Entertainment',
          headerBackTitle: undefined
        }}
      />
      <HomeStack.Screen
        name="Restaurants"
        component={RestaurantsScreen}
        options={{
          headerTitle: 'Restaurants & Dining',
          headerBackTitle: undefined
        }}
      />
      <HomeStack.Screen
        name="StayAtHome"
        component={StayAtHomeScreen}
        options={{
          headerTitle: 'Stay at Home',
          headerBackTitle: undefined
        }}
      />
      <HomeStack.Screen
        name="VirtualDates"
        component={VirtualDatesScreen}
        options={{
          headerTitle: 'Virtual Dates',
          headerBackTitle: undefined
        }}
      />
      <HomeStack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          headerTitle: 'Calendar',
          headerBackTitle: undefined,
        }}
      />
    </HomeStack.Navigator>
  );
};

const DiscoverStackNavigator = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <DiscoverStack.Navigator
      screenOptions={{
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
      }}
    >
      <DiscoverStack.Screen
        name="DiscoverMain"
        component={IdeasScreen}
        options={{
          headerTitle: 'Discover',
          headerLeft: () => (
            <TouchableOpacity
              onPress={openDrawer}
              style={{ marginLeft: 16, padding: 8 }}
            >
              <MaterialCommunityIcons name="menu" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <DiscoverStack.Screen
        name="Movies"
        component={MoviesScreen}
        options={{
          headerTitle: 'Movies & Entertainment',
          headerBackTitle: undefined,
        }}
      />
      <DiscoverStack.Screen
        name="Restaurants"
        component={RestaurantsScreen}
        options={{
          headerTitle: 'Restaurants & Dining',
          headerBackTitle: undefined,
        }}
      />
      <DiscoverStack.Screen
        name="StayAtHome"
        component={StayAtHomeScreen}
        options={{
          headerTitle: 'Stay at Home',
          headerBackTitle: undefined,
        }}
      />
      <DiscoverStack.Screen
        name="VirtualDates"
        component={VirtualDatesScreen}
        options={{
          headerTitle: 'Virtual Dates',
          headerBackTitle: undefined,
        }}
      />
      <DiscoverStack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          headerTitle: 'Calendar',
          headerBackTitle: undefined,
        }}
      />
    </DiscoverStack.Navigator>
  );
};

const MessagesStackNavigator = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <MessagesStack.Navigator
      screenOptions={{
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
      }}
    >
      <MessagesStack.Screen
        name="MessagesMain"
        component={ChatScreen}
        options={{
          headerTitle: 'Messages',
          headerLeft: () => (
            <TouchableOpacity
              onPress={openDrawer}
              style={{ marginLeft: 16, padding: 8 }}
            >
              <MaterialCommunityIcons name="menu" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
    </MessagesStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <ProfileStack.Navigator
      screenOptions={{
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
      }}
    >
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          headerTitle: 'Profile',
          headerLeft: () => (
            <TouchableOpacity
              onPress={openDrawer}
              style={{ marginLeft: 16, padding: 8 }}
            >
              <MaterialCommunityIcons name="menu" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
    </ProfileStack.Navigator>
  );
};

const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();

  // Calculate tab bar height based on screen size and safe area
  const tabBarHeight = Math.max(60 + insets.bottom, 80);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Headers are handled by stack navigators
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
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverStackNavigator}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesStackNavigator}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.surface,
          width: 280,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
        swipeEnabled: true,
        swipeMinDistance: 50,
      }}
      initialRouteName="MainTabs"
    >
      <Drawer.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="Movies"
        component={MoviesScreen}
        options={{
          drawerLabel: 'Movies & Entertainment',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="movie" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Restaurants"
        component={RestaurantsScreen}
        options={{
          drawerLabel: 'Restaurants & Dining',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="silverware-fork-knife" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="StayAtHome"
        component={StayAtHomeScreen}
        options={{
          drawerLabel: 'Stay at Home',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="VirtualDates"
        component={VirtualDatesScreen}
        options={{
          drawerLabel: 'Virtual Dates',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="video" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          drawerLabel: 'Calendar',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-heart" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Ideas"
        component={IdeasScreen}
        options={{
          drawerLabel: 'Browse Ideas',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="lightbulb" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default MainNavigator; 