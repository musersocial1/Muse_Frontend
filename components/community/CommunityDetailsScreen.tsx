import { icons } from "@/constants/icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ProgressBar from "./ProgressBar";

interface CommunityData {
  name: string;
  coverImage?: string;
  bio?: string;
}

const CommunityEdit: React.FC<{
  data: CommunityData;
  onUpdate: (data: Partial<CommunityData>) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onUpdate, onNext, onBack }) => {
  const [bioText, setBioText] = useState(data.bio || "");
  const [showActions, setShowActions] = useState(false);

  const wordCount = bioText.split(" ").filter((word) => word.length > 0).length;
  const remainingWords = Math.max(0, 65 - wordCount);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need access to your photo library"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onUpdate({ coverImage: result.assets[0].uri });
      setShowActions(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "We need access to your camera");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onUpdate({ coverImage: result.assets[0].uri });
      setShowActions(false);
    }
  };

  const deleteImage = () => {
    onUpdate({ coverImage: undefined });
    setShowActions(false);
  };

  const showImageOptions = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            "Edit image",
            "Delete image",
            "Upload from gallery",
            "Take from camera",
            "Cancel",
          ],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 4,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              pickImage();
              break;
            case 1:
              deleteImage();
              break;
            case 2:
              pickImage();
              break;
            case 3:
              takePhoto();
              break;
          }
        }
      );
    } else {
      setShowActions(true);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.headerSection}>
          <Image
            source={{
              uri:
                data.coverImage ||
                "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400",
            }}
            style={styles.backgroundImage}
            resizeMode="cover"
          />

          <LinearGradient
            colors={[
              "rgba(255,106,0,0.9)",
              "rgba(255,106,0,0.9)",
              "rgba(255,106,0,0.7)",
              "#000000",
            ]}
            locations={[0, 0.35, 0.7, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientOverlay}
          />

          <TouchableOpacity
            className="absolute top-3 left-2 h-14 w-14 z-20"
            onPress={onBack}
          >
            <Image source={icons.back_3} className="h-14 w-14 opacity-50" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editImageButton}
            onPress={showImageOptions}
          >
            <View style={styles.editImageContainer}>
              <Text style={styles.editImageText}>Edit image</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
          >
            <View className="bg-[#1C1C1CB2]/[70%] p-2 rounded-xl">
              <Text style={styles.communityName}>
                {data.name || "Dancemania"}
              </Text>
            </View>

            <View style={styles.bioSection}>
              <View style={styles.textInputContainer}>
                <Text style={styles.sectionTitle}>Community bio</Text>

                <TextInput
                  value={bioText}
                  onChangeText={(text) => {
                    setBioText(text);
                    onUpdate({ bio: text });
                  }}
                  placeholder="Tell people what this community is about..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  style={styles.textInput}
                  multiline
                  maxLength={500}
                />
                <View style={styles.wordCounterContainer}>
                  <Text style={styles.wordCounterText}>
                    {remainingWords} words remaining
                  </Text>
                  <View style={styles.progressCircleContainer}>
                    <View style={styles.progressCircleBackground} />
                    <View
                      style={[
                        styles.progressCircle,
                        {
                          borderTopColor:
                            wordCount <= 65 ? "#10B981" : "#EF4444",
                          transform: [
                            { rotate: `${(wordCount / 65) * 360 - 90}deg` },
                          ],
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.spacer} />
          </ScrollView>

          <View style={styles.bottomSection}>
            <ProgressBar currentStep={3} totalSteps={7} />

            <TouchableOpacity onPress={onNext} style={styles.continueButton}>
              <Text style={styles.continueButtonText}>Save & Continue</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showActions && Platform.OS === "android" && (
          <View style={styles.actionSheetOverlay}>
            <View style={styles.actionSheetContainer}>
              <TouchableOpacity
                style={styles.actionSheetButtonHighlight}
                onPress={pickImage}
              >
                <Text style={styles.actionSheetTextHighlight}>Edit image</Text>
              </TouchableOpacity>

              <View style={styles.actionSheetSeparator} />

              <TouchableOpacity
                style={styles.actionSheetButton}
                onPress={deleteImage}
              >
                <Text style={styles.actionSheetText}>Delete image</Text>
              </TouchableOpacity>

              <View style={styles.actionSheetSeparator} />

              <TouchableOpacity
                style={styles.actionSheetButton}
                onPress={pickImage}
              >
                <Text style={styles.actionSheetText}>Upload from gallery</Text>
              </TouchableOpacity>

              <View style={styles.actionSheetSeparator} />

              <TouchableOpacity
                style={styles.actionSheetButton}
                onPress={takePhoto}
              >
                <Text style={styles.actionSheetText}>Take from camera</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowActions(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255,106,0,0.4)",
    position: "relative",
  },
  headerSection: {
    height: "36%",
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 30,
  },
  blurButton: {
    borderRadius: 20,
    padding: 12,
  },
  editImageButton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  editImageContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  editImageText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  contentSection: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  communityName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
    marginTop: 9,
    marginBottom: 9,
  },
  bioSection: {
    marginBottom: 32,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "white",
  },
  textInputContainer: {
    backgroundColor: "#1C1C1CB2",
    borderRadius: 16,
    padding: 20,
  },
  textInput: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
    minHeight: 100,
    textAlignVertical: "top",
  },
  wordCounterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  wordCounterText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginRight: 12,
  },
  progressCircleContainer: {
    position: "relative",
    width: 20,
    height: 20,
  },
  progressCircleBackground: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  progressCircle: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
    borderTopWidth: 2,
  },
  linksSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  spacer: {
    height: 80,
  },
  bottomSection: {
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  continueButton: {
    backgroundColor: "#007AFF",
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  actionSheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionSheetContainer: {
    width: 280,
    backgroundColor: "rgba(60, 60, 60, 0.95)",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  actionSheetButtonHighlight: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 16,
    alignItems: "center",
  },
  actionSheetTextHighlight: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  actionSheetButton: {
    backgroundColor: "rgba(60, 60, 60, 0.95)",
    paddingVertical: 16,
    alignItems: "center",
  },
  actionSheetText: {
    color: "white",
    fontSize: 18,
    fontWeight: "400",
  },
  actionSheetSeparator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  cancelButton: {
    marginTop: 16,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default CommunityEdit;
