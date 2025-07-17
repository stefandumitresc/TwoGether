import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { colors } from '../../theme';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const insets = useSafeAreaInsets();

  // Adjust logo size based on screen size
  const logoSize = Math.min(screenWidth * 0.4, screenHeight * 0.2, 150);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={[styles.content, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/icon.png')}
            style={[styles.logo, { width: logoSize, height: logoSize }]}
            resizeMode="contain"
          />
          <Text variant="displaySmall" style={styles.title}>
            TwoGether
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Plan perfect dates together
          </Text>
        </View>

        <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Log In
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Signup')}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Sign Up
          </Button>

          <Text variant="bodySmall" style={styles.tagline}>
            Connect with your partner and create memorable moments
          </Text>
        </View>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(screenWidth * 0.08, 20), // Responsive padding
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: screenHeight * 0.4, // Minimum height for logo area
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingTop: 20,
  },
  button: {
    marginVertical: 8,
  },
  buttonContent: {
    paddingVertical: 12, // Slightly larger touch target
  },
  tagline: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default WelcomeScreen; 