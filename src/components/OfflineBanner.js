import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

function formatSavedAt(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isToday = date.toDateString() === new Date().toDateString();
  return isToday ? `today at ${time}` : `${date.toLocaleDateString()} ${time}`;
}

const OfflineBanner = ({ savedAt }) => {
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>
        You're offline. Showing courses saved {formatSavedAt(savedAt)}. Pull down to retry.
      </Text>
    </View>
  );
};

export default OfflineBanner;

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warningTint,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 13,
    color: colors.warning,
  },
});
