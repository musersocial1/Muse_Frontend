import { CheckCircle, XCircle } from "lucide-react-native";
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
      <CheckCircle size={18} color="green" className="mr-2" />
    ) : (
      <XCircle size={18} color="red" className="mr-2" />
    )}
    <Text className="text-black/50 text-[20px] font-sfpro-regular capitalize text-sm ml-2">
      {label}
    </Text>
  </View>
);
