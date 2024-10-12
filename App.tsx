import React, { useCallback, useState } from "react";
import { StyleSheet, Pressable, Text } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { generateRGB } from "./helpers";
import ColorPicker from "./components/ColorPicker";

const COLORS = [
  "rgb(242, 242, 242)",
  "rgb(204, 0, 0)",
  "rgb(0, 179, 0)",
  "rgb(77, 77, 255)",
  "rgb(255, 255, 77)",
  "rgb(204, 51, 255)",
  "rgb(255, 133, 51)",
  "rgb(153, 153, 153)",
];

export default function App() {
  const randomColor = useSharedValue(generateRGB(0, 255));
  const [openColorPicker, setOpenColorPicker] = useState<boolean>(false);

  const tap = Gesture.Tap().onEnd(() => {
    if (!openColorPicker) {

      randomColor.value = withTiming(generateRGB(0, 255), { duration: 250 });
    }
  });

  const onColorPickerOpen = () => setOpenColorPicker((prevState) => !prevState);
  const onColorPickerChange = useCallback((color: string) => {
    randomColor.value = color;
  }, []);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: randomColor.value,
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={tap}>
        <Animated.View style={[styles.box, animatedStyle]}>
          <Text>Hello there!</Text>
          <Pressable style={styles.touchable} onPress={onColorPickerOpen}>
            <Text>{openColorPicker ? "Close" : "Open"} Color Picker</Text>
          </Pressable>
          {openColorPicker ? (
            <ColorPicker
              colors={COLORS}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              pickerWidth={300}
              onColorPickerChange={onColorPickerChange}
            />
          ) : null}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: "100%",
    height: "100%",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
  },
  touchable: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 12,
    cursor: "pointer",
  },
});
