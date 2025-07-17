import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const useResponsiveDesign = () => {
  const insets = useSafeAreaInsets();

  // Screen size categories
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
  const isLargeScreen = screenWidth >= 414;

  // Responsive padding
  const horizontalPadding = Math.max(screenWidth * 0.05, 16);
  const verticalPadding = Math.max(screenHeight * 0.02, 16);

  // Safe area adjusted heights
  const safeAreaTop = Math.max(insets.top, 20);
  const safeAreaBottom = Math.max(insets.bottom, 20);
  const headerHeight = Math.max(56 + insets.top, 80);
  const tabBarHeight = Math.max(60 + insets.bottom, 80);

  // Responsive font sizes
  const fontSizes = {
    small: isSmallScreen ? 12 : 14,
    medium: isSmallScreen ? 14 : 16,
    large: isSmallScreen ? 16 : 18,
    title: isSmallScreen ? 20 : 24,
    headline: isSmallScreen ? 24 : 28,
  };

  // Responsive spacing
  const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  };

  // Button sizes
  const buttonHeight = isSmallScreen ? 44 : 48;
  const buttonPadding = isSmallScreen ? 12 : 16;

  return {
    screenWidth,
    screenHeight,
    insets,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    horizontalPadding,
    verticalPadding,
    safeAreaTop,
    safeAreaBottom,
    headerHeight,
    tabBarHeight,
    fontSizes,
    spacing,
    buttonHeight,
    buttonPadding,
  };
}; 