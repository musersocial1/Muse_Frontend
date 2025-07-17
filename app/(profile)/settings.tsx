import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useRouter } from "expo-router";
import { ChevronRight, LogOut } from "lucide-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SETTINGS_ITEMS = [
  {
    label: "Change your password",
    icon: icons.lock,
    route: RouterConstantUtil.profile.changepassword,
    type: "normal",
  },
  {
    label: "Terms of use",
    icon: icons.terms,
    route: RouterConstantUtil.profile.termsofuse,
    type: "normal",
  },
  {
    label: "Help desk",
    icon: icons.helpdesk,
    route: RouterConstantUtil.profile.helpdesk,
    type: "normal",
  },
  {
    label: "Notifications",
    icon: icons.notifications,
    route: RouterConstantUtil.profile.notifications,
    type: "normal",
  },
  {
    label: "Tags",
    icon: icons.tags,
    route: RouterConstantUtil.profile.tags,
    type: "normal",
  },
  {
    label: "Privacy",
    icon: icons.eyeclose,
    route: RouterConstantUtil.profile.privacy,
    type: "normal",
  },
  {
    label: "Communities and invoice",
    icon: icons.communities,
    route: RouterConstantUtil.profile.communities,
    type: "normal",
  },
  {
    label: "Log out",
    icon: null,
    route: "/",
    type: "logout",
  },
];

const SettingsItem = ({
  label,
  icon,
  route,
  type,
}: {
  label: string;
  icon: any;
  route: string;
  type: "normal" | "logout";
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (type === "logout") {
      router.dismissAll();
      router.replace("/(auth)" as any);
    } else {
      router.push(route as any);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`flex-row items-center p-3 rounded-full ${
        type === "logout" ? "bg-red-500/10" : "bg-[#1C1C1C]"
      }`}
    >
      <View
        className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
          type === "logout" ? "bg-red-500/20" : "bg-white/10"
        }`}
      >
        {type === "logout" ? (
          <LogOut color="#EF4444" size={24} />
        ) : (
          <Image source={icon} className="w-6 h-6" resizeMode="contain" />
        )}
      </View>

      <View className="flex-1">
        <Text
          className={`text-base font-medium ${
            type === "logout" ? "text-red-400" : "text-white"
          }`}
        >
          {label}
        </Text>
      </View>

      <ChevronRight color={type === "logout" ? "#EF4444" : "gray"} size={20} />
    </TouchableOpacity>
  );
};

const Settings = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Handles iPhone home indicator space

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="flex-1 bg-[#121212]"
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between px-6 pb-4">
          <TouchableOpacity
            onPress={() =>
              router.replace(RouterConstantUtil.tabs.profile as any)
            }
            className="w-10 h-10 rounded-full items-center justify-center"
          >
            <Image source={icons.back} className="w-14 h-14" />
          </TouchableOpacity>
          <Text className="text-white text-[20px] font-bold">Settings</Text>
          <View className="w-10" />
        </View>

        <ScrollView className="px-4 mt-4">
          <View className="space-y-4 gap-3">
            {SETTINGS_ITEMS.map((item, index) => (
              <SettingsItem
                key={index}
                label={item.label}
                icon={item.icon}
                route={item.route}
                type={item.type as any}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Settings;
