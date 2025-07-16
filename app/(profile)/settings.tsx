import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SETTINGS_ITEMS = [
  {
    label: "Change your password",
    icon: icons.lock,
    route: RouterConstantUtil.profile.changepassword,
  },
  {
    label: "Terms of use",
    icon: icons.terms,
    route: RouterConstantUtil.profile.termsofuse,
  },
  {
    label: "Help desk",
    icon: icons.helpdesk,
    route: RouterConstantUtil.profile.helpdesk,
  },
  {
    label: "Notifications",
    icon: icons.notifications,
    route: RouterConstantUtil.profile.notifications,
  },
  {
    label: "Tags",
    icon: icons.tags,
    route: RouterConstantUtil.profile.tags,
  },
  {
    label: "Privacy",
    icon: icons.eyeclose,
    route: RouterConstantUtil.profile.privacy,
  },
  {
    label: "Communities and invoice",
    icon: icons.communities,
    route: RouterConstantUtil.profile.communities,
  },
];

const SettingsItem = ({
  label,
  icon,
  route,
}: {
  label: string;
  icon: any;
  route: string;
}) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(route as any)}
      className="flex-row items-center py-4 px-5 bg-[#1C1C1C] rounded-full"
    >
      <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center mr-4">
        <Image source={icon} className="w-6 h-6" resizeMode="contain" />
      </View>

      <View className="flex-1">
        <Text className="text-white text-base font-medium">{label}</Text>
      </View>

      <ChevronRight color="gray" size={20} />
    </TouchableOpacity>
  );
};

const Settings = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between px-6 py-4">
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
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Settings;
