import { Platform } from "react-native";
import Toast from "react-native-toast-message";

const getTopOffset = () => {
  if (Platform.OS === "ios") {
    return 60;
  }
  return 40;
};

export const showSuccess = (message: string, desc?: string) => {
  Toast.show({
    type: "success",
    text1: message,
    text2: desc,
    position: "top",
    topOffset: getTopOffset(),
    visibilityTime: 3000,
    autoHide: true,
  });
};

export const showError = (message: string, desc: string) => {
  Toast.show({
    type: "error",
    text1: message,
    text2: desc,
    position: "top",
    topOffset: getTopOffset(),
    visibilityTime: 4000,
    autoHide: true,
  });
};

export const showInfo = (message: string, desc: string) => {
  Toast.show({
    type: "info",
    text1: message,
    text2: desc,
    position: "top",
    topOffset: getTopOffset(),
    visibilityTime: 3000,
    autoHide: true,
  });
};
