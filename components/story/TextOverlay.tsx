import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ColorPicker from "./ColorPicker";

const TEXT_STYLES = [
  { id: "default", label: "Text", style: "" },
  { id: "bold", label: "Text", style: "font-bold" },
  { id: "italic", label: "Text", style: "italic" },
  { id: "serif", label: "Text", style: "font-serif" },
  { id: "mono", label: "Text", style: "font-mono" },
];

interface TextOverlayProps {
  visible: boolean;
  onClose: () => void;
  onTextAdd: (text: string, color: string, style: string) => void;
}

const TextOverlay: React.FC<TextOverlayProps> = ({
  visible,
  onClose,
  onTextAdd,
}) => {
  const [text, setText] = useState("");
  const [selectedColor, setSelectedColor] = useState("hsl(0, 100%, 50%)");
  const [selectedStyle, setSelectedStyle] = useState("default");

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-black/35">
          <BlurView intensity={24} className="absolute inset-0" tint="dark" />
          <View className="flex-1">
            <View className="flex-row justify-between items-center px-4 pt-14 pb-3">
              <TouchableOpacity
                onPress={onClose}
                className="w-10 h-10 rounded-full bg-[#F3F3F326]/[15%] items-center justify-center"
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (text.trim().length > 0) {
                    onTextAdd(text, selectedColor, selectedStyle);
                    setText("");
                  }
                }}
                className="px-6 py-2 bg-secondary rounded-full"
              >
                <Text className="text-white font-bold">Done</Text>
              </TouchableOpacity>
            </View>
            <View className="absolute right-6 top-6 z-30">
              <ColorPicker
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />
            </View>
            <View className="flex-1 justify-center items-center px-4">
              <View
                className="rounded-2xl px-6 py-3 min-w-[120px] min-h-[56px] items-center justify-center"
                style={{
                  backgroundColor: selectedColor + "cc",
                }}
              >
                <TextInput
                  placeholder="Add text"
                  placeholderTextColor="#666"
                  value={text}
                  onChangeText={setText}
                  multiline
                  className={`text-white text-center text-2xl w-full py-1 px-1 ${
                    TEXT_STYLES.find((s) => s.id === selectedStyle)?.style ?? ""
                  }`}
                />
              </View>
            </View>
            <View className="absolute bottom-0 left-0 right-0 p-3">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-2"
                contentContainerStyle={{ alignItems: "center" }}
              >
                {TEXT_STYLES.map((style) => (
                  <TouchableOpacity
                    key={style.id}
                    onPress={() => setSelectedStyle(style.id)}
                    className={`px-4 py-2 rounded-full mr-3 ${
                      selectedStyle === style.id ? "bg-white/20" : "bg-[#2228]"
                    }`}
                  >
                    <Text className={`text-white text-lg ${style.style}`}>
                      {style.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TextOverlay;
