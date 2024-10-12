import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface IColorPickerProps extends LinearGradientProps {
  pickerWidth: number;
  onColorPickerChange: (color: string) => void;
}
const ColorPicker: React.FC<IColorPickerProps> = ({
  colors,
  start,
  end,
  pickerWidth,
  onColorPickerChange,
}) => {
  const translationX = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const gradientWidth = 300;
  const bulletWidth = 30;

  const inputRange = colors.map(
    (_, index) => (index / colors.length) * pickerWidth,
  );
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translationX.value,
        },
      ],
    };
  });
  const internalBullet = useAnimatedStyle(() => {
    const bulletColor = interpolateColor(
      translationX.value,
      inputRange,
      colors,
    );
    if (onColorPickerChange) {
      onColorPickerChange(bulletColor);
    }
    return {
      backgroundColor: bulletColor,
    };
  });

  function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
  }

  const panGesture = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
    })

    .onChange((event) => {
      const maxTranslateX = gradientWidth - bulletWidth;
      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        0,
        maxTranslateX,
      );
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View>
        <LinearGradient
          colors={colors}
          start={start}
          end={end}
          style={styles.linearGradientView}
        />
        <Animated.View style={[styles.pickerBullet, animatedStyles]}>
          <Animated.View style={[styles.internalBullet, internalBullet]} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default React.memo(ColorPicker);

const styles = StyleSheet.create({
  linearGradientView: {
    height: 30,
    width: 300,
    borderRadius: 15,
    maxHeight: 30,
    margin: "auto",
  },
  pickerBullet: {
    position: "absolute",
    backgroundColor: "#fff",
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  internalBullet: {
    width: 15,
    height: 15,
    borderRadius: 15,
    margin: "auto",
  },
});
