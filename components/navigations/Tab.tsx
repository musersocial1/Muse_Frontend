import { usePathname, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabIcon, tabsConfig } from "./TabConfig";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: "transparent",
        position: "absolute",
        bottom: insets.bottom || 20,
        left: 0,
        right: 0,
        marginHorizontal: 34,
        height: 60,
        flexDirection: "row",
        justifyContent: "space-around",
        borderRadius: 30,
      }}
    >
      {tabsConfig.map((tab) => {
        const focused = pathname === `/${tab.name}`;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(`/${tab.name}` as any)}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TabIcon
              focused={focused}
              icon={tab.icon}
              title={tab.title}
              isProfile={tab.isProfile}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
