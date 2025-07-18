import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import SwitchToggle from "react-native-switch-toggle";

import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface NotificationSettings {
  communityOwnerPosts: boolean;
  communityMemberPosts: boolean;
  likesOnPosts: boolean;
  commentsOnPosts: boolean;
  communityOwnerComment: boolean;
  tags: boolean;
  chatReply: boolean;
  newMessage: boolean;
}

interface SettingItemProps {
  label: string;
  enabled: boolean;
  onToggle: () => void;
  showViewider?: boolean;
}

interface SectionHeaderProps {
  title: string;
}

const NotificationsSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    communityOwnerPosts: false,
    communityMemberPosts: true,
    likesOnPosts: false,
    commentsOnPosts: true,
    communityOwnerComment: true,
    tags: false,
    chatReply: true,
    newMessage: false,
  });

  const router = useRouter();

  const toggleSetting = (key: keyof NotificationSettings): void => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const SettingItem = ({
    label,
    enabled,
    onToggle,
    showViewider = true,
  }: SettingItemProps) => (
    <View>
      <View className="flex-row items-center justify-between py-4 px-4">
        <Text className="text-white/60 text-[16px] font-medium">{label}</Text>
        {/* <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: "#4B5563", true: "#0368FF" }}
          thumbColor={"#fff"}
        /> */}
        <SwitchToggle
          switchOn={enabled}
          onPress={onToggle}
          circleColorOff="#fff"
          circleColorOn="#fff"
          backgroundColorOn="#0368FF"
          backgroundColorOff="#4B5563"
          containerStyle={{
            width: 48,
            height: 28,
            borderRadius: 25,
            padding: 3,
            paddingLeft: 0,
          }}
          circleStyle={{
            width: 22,
            height: 22,
            borderRadius: 11,
          }}
        />
      </View>
      {showViewider && <View className="" />}
    </View>
  );

  const SectionHeader = ({ title }: SectionHeaderProps) => (
    <View className="px-6 py-4 pt-8 border-b-[0.2px] border-[#565656]/30">
      <Text className="text-brandWhite text-[20px] font-semibold">{title}</Text>
    </View>
  );

  const insets = useSafeAreaInsets(); // Handles iPhone home indicator space

  return (
    <SafeAreaView
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-[#121212]"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pb-4">
        <TouchableOpacity
          onPress={() =>
            router.replace(RouterConstantUtil.profile.settings as any)
          }
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <Image source={icons.back} className="w-14 h-14" />
        </TouchableOpacity>
        <Text className="text-white text-[20px] font-bold">Notification</Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 pb-0 ">
        <View className="mt-6">
          <SectionHeader title="Communities" />
          <View className=" mx-6  overflow-hidden">
            <SettingItem
              label="Community owner posts"
              enabled={settings.communityOwnerPosts}
              onToggle={() => toggleSetting("communityOwnerPosts")}
            />
            <SettingItem
              label="Community member posts"
              enabled={settings.communityMemberPosts}
              onToggle={() => toggleSetting("communityMemberPosts")}
            />
            <SettingItem
              label="Likes on your posts"
              enabled={settings.likesOnPosts}
              onToggle={() => toggleSetting("likesOnPosts")}
            />
            <SettingItem
              label="Comments on your posts"
              enabled={settings.commentsOnPosts}
              onToggle={() => toggleSetting("commentsOnPosts")}
            />
            <SettingItem
              label="Community owner comment"
              enabled={settings.communityOwnerComment}
              onToggle={() => toggleSetting("communityOwnerComment")}
              showViewider={false}
            />
          </View>
        </View>

        {/* Groups Section */}
        <View className="mt-8">
          <SectionHeader title="Groups" />
          <View className=" mx-6  overflow-hidden">
            <SettingItem
              label="Tags"
              enabled={settings.tags}
              onToggle={() => toggleSetting("tags")}
            />
            <SettingItem
              label="Chat reply"
              enabled={settings.chatReply}
              onToggle={() => toggleSetting("chatReply")}
            />
            <SettingItem
              label="New message"
              enabled={settings.newMessage}
              onToggle={() => toggleSetting("newMessage")}
              showViewider={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsSettings;
