import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

// Grey placeholder shaped like a CourseCard, shown while courses load.
const SkeletonCard = () => {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={[styles.block, { width: '70%', height: 16 }]} />
      <View style={[styles.block, { width: '45%', height: 12 }]} />
      <View style={[styles.block, { width: '100%', height: 6 }]} />
      <View style={[styles.block, styles.button]} />
    </Animated.View>
  );
};

export default SkeletonCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  block: {
    backgroundColor: colors.skeleton,
    borderRadius: 4,
  },
  button: {
    width: 100,
    height: 36,
    alignSelf: 'flex-end',
  },
});
