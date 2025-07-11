import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { typography } from '../styles/typography';

interface OfflineIndicatorProps {
  isVisible: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        🔌 Offline Mode - Some features may be limited
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warning[500],
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.text.body2,
    color: colors.text.onWarning,
    textAlign: 'center',
  },
}); 