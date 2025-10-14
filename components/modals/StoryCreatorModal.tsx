import StoryCreator from "@/components/story/StoryCreator";
import React from "react";
import { Modal } from "react-native";

interface StoryCreatorModalProps {
  visible: boolean;
  onClose: () => void;
}

const StoryCreatorModal: React.FC<StoryCreatorModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StoryCreator onClose={onClose} />
    </Modal>
  );
};

export default StoryCreatorModal;
