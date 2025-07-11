export const colors = {
  // Primary colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Secondary colors
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Success colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
  },

  // Surface colors
  surface: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    elevated: '#ffffff',
  },

  // Text colors
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    tertiary: '#94a3b8',
    inverse: '#ffffff',
    disabled: '#cbd5e1',
    onWarning: '#ffffff',
  },

  // Border colors
  border: {
    primary: '#e2e8f0',
    secondary: '#f1f5f9',
    tertiary: '#f8fafc',
  },

  // Shadow colors
  shadow: {
    primary: 'rgba(0, 0, 0, 0.1)',
    secondary: 'rgba(0, 0, 0, 0.05)',
    tertiary: 'rgba(0, 0, 0, 0.025)',
  },

  // Overlay colors
  overlay: {
    primary: 'rgba(0, 0, 0, 0.5)',
    secondary: 'rgba(0, 0, 0, 0.3)',
    tertiary: 'rgba(0, 0, 0, 0.1)',
  },

  // Brand colors
  brand: {
    primary: '#6366f1', // Indigo
    secondary: '#8b5cf6', // Violet
    accent: '#06b6d4', // Cyan
  },

  // Status colors
  status: {
    online: '#10b981',
    offline: '#6b7280',
    away: '#f59e0b',
    busy: '#ef4444',
  },
};

// Dark theme colors
export const darkColors = {
  ...colors,
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
  },
  surface: {
    primary: '#1e293b',
    secondary: '#334155',
    tertiary: '#475569',
    elevated: '#334155',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    inverse: '#0f172a',
    disabled: '#475569',
  },
  border: {
    primary: '#334155',
    secondary: '#475569',
    tertiary: '#64748b',
  },
}; 