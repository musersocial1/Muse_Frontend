import CameraScreen from "@/components/story/Camera";
import Preview from "@/components/story/Preview";
import React, { useState } from "react";
import { View } from "react-native";
import EditScreen from "./Edit";

export type StoryCreatorStep = "camera" | "preview" | "edit";

interface StoryCreatorProps {
  onClose: () => void;
}

const StoryCreator: React.FC<StoryCreatorProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState<StoryCreatorStep>("camera");
  const [mediaContent, setMediaContent] = useState<string | null>(null);

  const handleMediaCapture = (content: string) => {
    setMediaContent(content);
    setCurrentStep("preview");
  };

  const renderStep = () => {
    switch (currentStep) {
      case "camera":
        return (
          <CameraScreen onCapture={handleMediaCapture} onClose={onClose} />
        );

      case "preview":
        return (
          <Preview
            media={
              "https://res.cloudinary.com/dddc4rjme/image/upload/v1760441046/story_vz9kep.jpg"
            }
            onBack={() => setCurrentStep("camera")}
            onNext={() => setCurrentStep("edit")}
          />
        );
      case "edit":
        return (
          <EditScreen
            mediaUri={
              "https://res.cloudinary.com/dddc4rjme/video/upload/v1760442018/WhatsApp_Video_2025-10-14_at_11.00.29_AM_evzj8u.mp4"
            }
            // mediaUri={
            //   "https://res.cloudinary.com/dddc4rjme/image/upload/v1760441046/story_vz9kep.jpg"
            // }
            onBack={() => setCurrentStep("preview")}
            onPost={onClose}
          />
        );

      default:
        return null;
    }
  };

  return <View className="flex-1 bg-primary">{renderStep()}</View>;
};

export default StoryCreator;
