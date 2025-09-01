import CreatePost from "@/components/MakeAPost/CreatePost";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreatePostStart({ showModal, onClose }: any) {
  const router = useRouter();
  const [text, setText] = useState("");
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={showModal} animationType="slide">
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom,
        }}
        className="flex-1 bg-[#121212] px-4 pt-12"
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => onClose()}>
            <Text className="text-white text-3xl">✕</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Go to drafts")}>
            <Text className="text-[#0368FF] font-sfpro-bold text-xl">
              Drafts
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          className="flex-1 bg-[#121212]"
          behavior={"padding"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // tweak for safe-area
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <CreatePost />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
