import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface DropdownItem {
  id: string;
  title: string;
  icon: string;
  action: () => void;
  isDestructive?: boolean;
}

interface CommunityDropdownProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onMembers: () => void;
  onPause: () => void;
  onModerators: () => void;
  onNewRequests: () => void;
  onDelete: () => void;
}

const CommunityDropdown: React.FC<CommunityDropdownProps> = ({
  visible,
  onClose,
  onEdit,
  onMembers,
  onPause,
  onModerators,
  onNewRequests,
  onDelete,
}) => {
  const dropdownItems: DropdownItem[] = [
    {
      id: "edit",
      title: "Edit community",
      icon: "edit-2",
      action: () => {
        onEdit();
        onClose();
      },
    },
    {
      id: "members",
      title: "Members",
      icon: "users",
      action: () => {
        onMembers();
        onClose();
      },
    },
    {
      id: "pause",
      title: "Pause community",
      icon: "pause-circle",
      action: () => {
        onPause();
        onClose();
      },
    },
    {
      id: "moderators",
      title: "Moderators",
      icon: "user-plus",
      action: () => {
        onModerators();
        onClose();
      },
    },
    {
      id: "requests",
      title: "New requests",
      icon: "user-check",
      action: () => {
        onNewRequests();
        onClose();
      },
    },
    {
      id: "delete",
      title: "Delete community",
      icon: "trash-2",
      action: () => {
        onDelete();
        onClose();
      },
      isDestructive: true,
    },
  ];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1">
          <View
            className="absolute top-32 right-[20%] bg-[#121212CC]/[80%] rounded-2xl z-50 min-w-[200px] p-2"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.25,
              shadowRadius: 94.13,
              elevation: 16,
            }}
          >
            {dropdownItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={item.action}
                className={`flex-row items-center px-4 py-5 ${
                  index !== dropdownItems.length - 1
                    ? "border-b border-white/10"
                    : ""
                }`}
                activeOpacity={0.7}
              >
                <Feather
                  name={item.icon as any}
                  size={20}
                  color={item.isDestructive ? "#EF4444" : "white"}
                />
                <Text
                  className={`ml-4 text-[16px] font-medium ${
                    item.isDestructive ? "text-red-400" : "text-white"
                  }`}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CommunityDropdown;
