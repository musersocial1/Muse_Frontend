import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface DraggableTextProps {
  text: string;
  color: string;
  styleId: string;
  onDelete: () => void;
  stylesList: { id: string; label: string; style: string }[];
}

const OVERLAY_WIDTH = 200;
const OVERLAY_HEIGHT = 70;
const DELETE_ZONE_Y = SCREEN_HEIGHT - 100;

const DraggableText: React.FC<DraggableTextProps> = ({
  text,
  color,
  styleId,
  onDelete,
  stylesList,
}) => {
  const [showDelete, setShowDelete] = useState(false);

  const initialX = (SCREEN_WIDTH - OVERLAY_WIDTH) / 2;
  const initialY = (SCREEN_HEIGHT - OVERLAY_HEIGHT) / 2;

  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const lastOffset = useRef({ x: initialX, y: initialY });

  const deleteAnim = useRef(new Animated.Value(0)).current;

  // Reset position when text changes
  useEffect(() => {
    lastOffset.current = { x: initialX, y: initialY };
    pan.setValue({ x: 0, y: 0 });
  }, [text, initialX, initialY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setShowDelete(true);
        Animated.spring(deleteAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        pan.setOffset(lastOffset.current);
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        setShowDelete(false);
        Animated.spring(deleteAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();

        pan.flattenOffset();

        const currentX = (pan.x as any).__getValue();
        const currentY = (pan.y as any).__getValue();
        lastOffset.current = { x: currentX, y: currentY };

        // Trigger delete if dragged near bottom zone
        if (gesture.moveY > DELETE_ZONE_Y) {
          onDelete();
        }
      },
    })
  ).current;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Delete Zone */}
      {showDelete && (
        <Animated.View
          className="absolute bottom-10 left-0 right-0 z-50 items-center"
          style={{
            opacity: deleteAnim,
            transform: [
              {
                scale: deleteAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          }}
        >
          <Ionicons
            name="trash"
            size={38}
            color="#ff3b3b"
            style={{
              backgroundColor: "rgba(0,0,0,0.25)",
              borderRadius: 9999,
              padding: 12,
            }}
          />
        </Animated.View>
      )}

      {/* Draggable Text */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          position: "absolute",
          zIndex: 20,
          width: OVERLAY_WIDTH,
          minHeight: OVERLAY_HEIGHT,
          transform: [
            { translateX: Animated.add(new Animated.Value(initialX), pan.x) },
            { translateY: Animated.add(new Animated.Value(initialY), pan.y) },
          ],
        }}
      >
        <View
          className="rounded-2xl px-6 py-3 min-w-[120px] min-h-[56px] items-center justify-center"
          style={{
            backgroundColor: color + "cc",
          }}
        >
          <Text
            className={`text-white text-center text-2xl ${
              stylesList.find((s) => s.id === styleId)?.style ?? ""
            }`}
          >
            {text}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default DraggableText;
