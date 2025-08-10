import { TouchableOpacity, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const FloatingAIButton = ({
  setShowAIModal,
}: {
  setShowAIModal: (val: boolean) => void;
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      scale.value = withSpring(1.1);
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: (event) => {
      scale.value = withSpring(1);

      if (
        Math.abs(event.translationX) > 50 ||
        Math.abs(event.translationY) > 50
      ) {
        runOnJS(setShowAIModal)(true);
      }

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[
          {
            position: "absolute",
            right: 0,
            top: "40%",
            marginTop: -25,
            zIndex: 1000,
          },
          animatedStyle,
        ]}
      >
        <TouchableOpacity
          onPress={() => setShowAIModal(true)}
          activeOpacity={0.8}
          style={{
            width: 20,
            height: 80,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderTopLeftRadius: 25,
            borderBottomLeftRadius: 25,
            justifyContent: "center",
            paddingLeft: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View
            style={{
              width: 4,
              height: 24,
              backgroundColor: "white",
              borderRadius: 2,
              alignSelf: "flex-start",
            }}
          />
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default FloatingAIButton;
