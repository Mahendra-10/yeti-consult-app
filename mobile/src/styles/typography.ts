import { Platform } from 'react-native';

export const typography = {
  // Font families
  fontFamily: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    light: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
  },

  // Font weights
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },

  // Text styles
  text: {
    // Display styles
    display1: {
      fontSize: 48,
      fontWeight: 'bold' as const,
      lineHeight: 1.2,
      letterSpacing: -1,
    },
    display2: {
      fontSize: 36,
      fontWeight: 'bold' as const,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    display3: {
      fontSize: 30,
      fontWeight: 'bold' as const,
      lineHeight: 1.3,
      letterSpacing: -0.25,
    },

    // Heading styles
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      lineHeight: 1.2,
      letterSpacing: -0.25,
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      lineHeight: 1.3,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 24,
      fontWeight: 'semibold' as const,
      lineHeight: 1.3,
      letterSpacing: -0.25,
    },
    h4: {
      fontSize: 20,
      fontWeight: 'semibold' as const,
      lineHeight: 1.4,
      letterSpacing: -0.25,
    },
    h5: {
      fontSize: 18,
      fontWeight: 'semibold' as const,
      lineHeight: 1.4,
      letterSpacing: -0.25,
    },
    h6: {
      fontSize: 16,
      fontWeight: 'semibold' as const,
      lineHeight: 1.4,
      letterSpacing: -0.25,
    },

    // Body styles
    body1: {
      fontSize: 16,
      fontWeight: 'regular' as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    body2: {
      fontSize: 14,
      fontWeight: 'regular' as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    body3: {
      fontSize: 12,
      fontWeight: 'regular' as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    },

    // Button styles
    button1: {
      fontSize: 16,
      fontWeight: 'medium' as const,
      lineHeight: 1.5,
      letterSpacing: 0.5,
    },
    button2: {
      fontSize: 14,
      fontWeight: 'medium' as const,
      lineHeight: 1.5,
      letterSpacing: 0.5,
    },
    button3: {
      fontSize: 12,
      fontWeight: 'medium' as const,
      lineHeight: 1.5,
      letterSpacing: 0.5,
    },

    // Caption styles
    caption1: {
      fontSize: 12,
      fontWeight: 'regular' as const,
      lineHeight: 1.5,
      letterSpacing: 0.25,
    },
    caption2: {
      fontSize: 10,
      fontWeight: 'regular' as const,
      lineHeight: 1.5,
      letterSpacing: 0.25,
    },

    // Overline styles
    overline: {
      fontSize: 10,
      fontWeight: 'medium' as const,
      lineHeight: 1.5,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as const,
    },
  },
}; 