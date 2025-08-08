import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const CommunityNameScreen = ({ data, onUpdate, onNext }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 ">
      <TouchableOpacity
        onPress={() => RouterConstantUtil.community.start}
        activeOpacity={0.7}
        className="ml-5 h-14 w-14 border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
        // bg-white/10 = white at 10% opacity, matches that soft look in your image
      >
        <Feather
          name="chevron-left"
          size={20}
          color="#fff"
          style={{ opacity: 0.7 }}
        />
      </TouchableOpacity>

      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        {/* Main Content */}
        <View className="flex-1 justify-center items-center">
          <View className="w-full">
            <TextInput
              editable={true}
              value={data.name}
              onChangeText={(text) => onUpdate({ name: text })}
              placeholder="Enter community name"
              placeholderTextColor="rgba(255, 255, 255, 1)"
              className="bg-transparent border-none px-6 py-8 text-white text-[28px] font-bold text-center"
              cursorColor="#FFFFFF"
              style={styles.textInput}
              multiline={false}
              textAlign="center"
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CommunityNameScreen;

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textInput: {
    lineHeight: 40,
    minHeight: 80,
    width: "100%",
  },
  continueButton: {
    backgroundColor: "#0368FF",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
