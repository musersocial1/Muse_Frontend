import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
type ProgressiveBlurProps = {
  useAlt: boolean;
};
const ProgressiveBlur: React.FC<ProgressiveBlurProps> = ({ useAlt }) => {
  const { width, height } = useWindowDimensions();

  // For now, we'll use state-driven switching for a clean UX.
  const [isAlt, setIsAlt] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: useAlt ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [useAlt]);

  return (
    <View
      style={{
        width,
        position: "absolute",
        bottom: 0,
        zIndex: 2,
      }}
      className="h-full"
    >
      <View className="h-full">
        <MaskedView
          // maskElement={<AnimatedLinearGradient useAlt={useAlt} />}
          maskElement={
            <>
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  { opacity: 1 },
                  // { opacity: Animated.subtract(1, fadeAnim) },
                ]}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0)", "black", "black"]}
                  locations={[0.1, 0.3, 1]}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,

                  // { opacity: fadeAnim }
                  { opacity: fadeAnim },
                ]}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.5)", "black", "black"]}
                  locations={[0, 0.25, 1]}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </>
          }
          style={[StyleSheet.absoluteFill]}
        >
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={Platform.OS == "android" ? 100 : 100}
            tint={
              Platform.OS == "android" ? "systemUltraThinMaterialDark" : "dark"
            }
            className=""
            style={[StyleSheet.absoluteFill]}
          ></BlurView>
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={Platform.OS == "android" ? 100 : 100}
            tint={
              Platform.OS == "android" ? "systemUltraThinMaterialDark" : "dark"
            }
            style={[StyleSheet.absoluteFill]}
          ></BlurView>
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={Platform.OS == "android" ? 100 : 100}
            tint={
              Platform.OS == "android" ? "systemUltraThinMaterialDark" : "dark"
            }
            className=""
            style={[StyleSheet.absoluteFill]}
          ></BlurView>
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={Platform.OS == "android" ? 100 : 100}
            tint={
              Platform.OS == "android" ? "systemUltraThinMaterialDark" : "dark"
            }
            className=" "
            style={[StyleSheet.absoluteFill]}
          >
            <View className="bg-black flex-1" />
          </BlurView>
        </MaskedView>
      </View>
    </View>
  );
};

export default ProgressiveBlur;
