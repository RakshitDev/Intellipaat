import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

const ProgressBar = ({ value, height = 6 }) => {
  const clamped = Math.min(100, Math.max(0, value));
  const done = clamped === 100;

  return (
    <View
      style={[styles.track, { height }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
    >
      <View
        style={[
          styles.fill,
          { width: `${clamped}%`, backgroundColor: done ? colors.success : colors.secondary },
        ]}
      />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  track: {
    flex: 1,
    backgroundColor: colors.secondaryTint,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
