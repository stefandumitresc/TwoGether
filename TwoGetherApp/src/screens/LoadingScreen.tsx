import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LoadingScreen = () => {
  // Adjust logo size based on screen size
  const logoSize = Math.min(screenWidth * 0.3, screenHeight * 0.15, 120);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/icon.png')}
          style={[styles.logo, { width: logoSize, height: logoSize }]}
          resizeMode="contain"
        />
        <Text variant="headlineMedium" style={styles.title}>
          TwoGether
        </Text>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Math.max(screenWidth * 0.05, 20),
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
});

export default LoadingScreen; 