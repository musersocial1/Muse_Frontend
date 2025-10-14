import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  Modal,
  PanResponder,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface CropOverlayProps {
  visible: boolean;
  mediaUri: string;
  onClose: () => void;
  onCrop: (cropData: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
  isVideo?: boolean;
}

const HANDLE_SIZE = 24;
const MIN_CROP_SIZE = 100;

const CropOverlay: React.FC<CropOverlayProps> = ({
  visible,
  mediaUri,
  onClose,
  onCrop,
  isVideo = false,
}) => {
  const initialWidth = SCREEN_WIDTH * 0.8;
  const initialHeight = SCREEN_HEIGHT * 0.5;
  const initialX = (SCREEN_WIDTH - initialWidth) / 2;
  const initialY = (SCREEN_HEIGHT - initialHeight) / 2 - 50;

  const [cropArea, setCropArea] = useState({
    x: initialX,
    y: initialY,
    width: initialWidth,
    height: initialHeight,
  });

  const updateCropArea = (updates: Partial<typeof cropArea>) => {
    setCropArea((prev) => ({ ...prev, ...updates }));
  };

  const createCornerPanResponder = (corner: string) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const { dx, dy } = gesture;

        switch (corner) {
          case "topLeft":
            const newX = Math.max(0, cropArea.x + dx);
            const newY = Math.max(0, cropArea.y + dy);
            const newWidth = Math.max(MIN_CROP_SIZE, cropArea.width - dx);
            const newHeight = Math.max(MIN_CROP_SIZE, cropArea.height - dy);
            updateCropArea({
              x: newX,
              y: newY,
              width: newWidth,
              height: newHeight,
            });
            break;

          case "topRight":
            const trNewY = Math.max(0, cropArea.y + dy);
            const trNewWidth = Math.max(MIN_CROP_SIZE, cropArea.width + dx);
            const trNewHeight = Math.max(MIN_CROP_SIZE, cropArea.height - dy);
            updateCropArea({
              y: trNewY,
              width: trNewWidth,
              height: trNewHeight,
            });
            break;

          case "bottomLeft":
            const blNewX = Math.max(0, cropArea.x + dx);
            const blNewWidth = Math.max(MIN_CROP_SIZE, cropArea.width - dx);
            const blNewHeight = Math.max(MIN_CROP_SIZE, cropArea.height + dy);
            updateCropArea({
              x: blNewX,
              width: blNewWidth,
              height: blNewHeight,
            });
            break;

          case "bottomRight":
            const brNewWidth = Math.max(MIN_CROP_SIZE, cropArea.width + dx);
            const brNewHeight = Math.max(MIN_CROP_SIZE, cropArea.height + dy);
            updateCropArea({
              width: brNewWidth,
              height: brNewHeight,
            });
            break;
        }
      },
    });
  };

  const topLeftPan = useRef(createCornerPanResponder("topLeft")).current;
  const topRightPan = useRef(createCornerPanResponder("topRight")).current;
  const bottomLeftPan = useRef(createCornerPanResponder("bottomLeft")).current;
  const bottomRightPan = useRef(
    createCornerPanResponder("bottomRight")
  ).current;

  // Pan responder for moving the entire crop area
  const movePan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const newX = Math.max(
          0,
          Math.min(SCREEN_WIDTH - cropArea.width, cropArea.x + gesture.dx)
        );
        const newY = Math.max(
          0,
          Math.min(SCREEN_HEIGHT - cropArea.height, cropArea.y + gesture.dy)
        );
        updateCropArea({ x: newX, y: newY });
      },
    })
  ).current;

  const handleDone = () => {
    onCrop({
      x: cropArea.x,
      y: cropArea.y,
      width: cropArea.width,
      height: cropArea.height,
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-black/35">
          <BlurView intensity={24} className="absolute inset-0" tint="dark" />
          <View className="absolute inset-0 bg-primary">
            {/* Header */}
            <View className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-4 pt-12 pb-4 z-50">
              <TouchableOpacity
                onPress={onClose}
                className="w-12 h-12 rounded-full bg-[#3C3C3E] items-center justify-center"
              >
                <Ionicons name="chevron-back" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDone}
                className="px-6 py-3 bg-[#007AFF] rounded-full"
              >
                <Text className="text-white font-semibold text-base">Done</Text>
              </TouchableOpacity>
            </View>

            {/* Media Preview */}
            <View className="flex-1 justify-center items-center">
              {isVideo ? (
                <Video
                  source={{ uri: mediaUri }}
                  style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                    position: "absolute",
                  }}
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                  shouldPlay
                  isMuted
                />
              ) : (
                <Image
                  source={{ uri: mediaUri }}
                  style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                    position: "absolute",
                  }}
                  resizeMode="contain"
                />
              )}

              {/* Dark Overlay */}
              <View
                style={{
                  position: "absolute",
                  width: SCREEN_WIDTH,
                  height: SCREEN_HEIGHT,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                }}
                pointerEvents="none"
              />

              {/* Clear Crop Area */}
              <View
                style={{
                  position: "absolute",
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height,
                  backgroundColor: "transparent",
                }}
                pointerEvents="none"
              />

              {/* Crop Border with Rounded Corners */}
              <View
                style={{
                  position: "absolute",
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height,
                  borderWidth: 3,
                  borderColor: "white",
                  borderRadius: 20,
                }}
                pointerEvents="none"
              />

              {/* Grid Lines */}
              <View
                style={{
                  position: "absolute",
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height,
                }}
                pointerEvents="none"
              >
                {/* Vertical lines */}
                <View
                  style={{
                    position: "absolute",
                    left: cropArea.width / 3,
                    width: 1,
                    height: cropArea.height,
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    left: (cropArea.width * 2) / 3,
                    width: 1,
                    height: cropArea.height,
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  }}
                />
                {/* Horizontal lines */}
                <View
                  style={{
                    position: "absolute",
                    top: cropArea.height / 3,
                    width: cropArea.width,
                    height: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    top: (cropArea.height * 2) / 3,
                    width: cropArea.width,
                    height: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  }}
                />
              </View>

              {/* Corner Handles */}
              {/* Top Left */}
              <View
                {...topLeftPan.panHandlers}
                style={{
                  position: "absolute",
                  left: cropArea.x - HANDLE_SIZE / 2,
                  top: cropArea.y - HANDLE_SIZE / 2,
                  width: HANDLE_SIZE * 2,
                  height: HANDLE_SIZE * 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: HANDLE_SIZE,
                    height: HANDLE_SIZE,
                    borderTopWidth: 4,
                    borderLeftWidth: 4,
                    borderColor: "white",
                    borderTopLeftRadius: 8,
                  }}
                />
              </View>

              {/* Top Right */}
              <View
                {...topRightPan.panHandlers}
                style={{
                  position: "absolute",
                  left: cropArea.x + cropArea.width - HANDLE_SIZE / 2,
                  top: cropArea.y - HANDLE_SIZE / 2,
                  width: HANDLE_SIZE * 2,
                  height: HANDLE_SIZE * 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: HANDLE_SIZE,
                    height: HANDLE_SIZE,
                    borderTopWidth: 4,
                    borderRightWidth: 4,
                    borderColor: "white",
                    borderTopRightRadius: 8,
                  }}
                />
              </View>

              {/* Bottom Left */}
              <View
                {...bottomLeftPan.panHandlers}
                style={{
                  position: "absolute",
                  left: cropArea.x - HANDLE_SIZE / 2,
                  top: cropArea.y + cropArea.height - HANDLE_SIZE / 2,
                  width: HANDLE_SIZE * 2,
                  height: HANDLE_SIZE * 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: HANDLE_SIZE,
                    height: HANDLE_SIZE,
                    borderBottomWidth: 4,
                    borderLeftWidth: 4,
                    borderColor: "white",
                    borderBottomLeftRadius: 8,
                  }}
                />
              </View>

              {/* Bottom Right */}
              <View
                {...bottomRightPan.panHandlers}
                style={{
                  position: "absolute",
                  left: cropArea.x + cropArea.width - HANDLE_SIZE / 2,
                  top: cropArea.y + cropArea.height - HANDLE_SIZE / 2,
                  width: HANDLE_SIZE * 2,
                  height: HANDLE_SIZE * 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: HANDLE_SIZE,
                    height: HANDLE_SIZE,
                    borderBottomWidth: 4,
                    borderRightWidth: 4,
                    borderColor: "white",
                    borderBottomRightRadius: 8,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CropOverlay;
