import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

export const ValidationItem = ({
  label,
  passed,
}: {
  label: string;
  passed: boolean;
}) => (
  <View className="flex-row mt-2 items-center ">
    {passed ? (
      <Feather
        name="check-circle"
        size={18}
        color="green"
        style={{ marginRight: 8 }}
      />
    ) : (
      <Feather
        name="x-circle"
        size={18}
        color="red"
        style={{ marginRight: 8 }}
      />
    )}
    <Text className="text-black/50 text-[20px] font-sfpro-regular capitalize text-sm ml-2">
      {label}
    </Text>
  </View>
);
