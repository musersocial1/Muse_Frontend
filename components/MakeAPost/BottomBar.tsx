import { icons } from "@/constants/icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface ProgressProps {
  size: number;
  strokeWidth: number;
  radius: number;
  circumference: number;
  strokeDashoffset: number;
}

interface BottomBarProps {
  text: string;
  openGallery: () => void;
  openCamera: () => void;
  progressProps: ProgressProps;
  onPost: () => void; // 👈 new
}

export default function BottomBar({
  text,
  openGallery,
  openCamera,
  progressProps,
  onPost,
}: BottomBarProps) {
  const { size, strokeWidth, radius, circumference, strokeDashoffset } =
    progressProps;

  return (
    <View className=" flex   bg-[#121212] pt-4 right-0 left-0 absolute   bottom-0 flex-row  justify-between items-center ">
      <View className="flex-row  items-center gap-2">
        <View style={{ width: size, height: size }}>
          <Svg width={size} height={size}>
            <Circle
              stroke="#2c2c2c"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
            />
            <Circle
              stroke="#4ADE80" // green
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>
        </View>
        {/* Action buttons */}
        {/* <View className="flex flex-row gap-3"> */}
        {/* Image button */}
        <TouchableOpacity
          onPress={openGallery}
          className="w-11 h-11 rounded-full bg-yellow-900 items-center justify-center"
        >
          <Image
            source={icons.gallery}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Camera button */}
        <TouchableOpacity
          onPress={openCamera}
          className="w-11 h-11 rounded-full items-center justify-center"
        >
          <Image
            source={icons.camera}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      {/* Bottom "Next" button */}
      <View>
        <TouchableOpacity
          disabled={!text.trim()}
          onPress={onPost} // 👈 show communities modal
          //   onPress={() => router.push("/(makepost)/select-community")}
          className={`px-6  py-2 rounded-full ${
            text.trim() ? "bg-[#0368FF]" : "bg-gray-600"
          }`}
        >
          <Text className="text-white font-sfpro-bold text-xl ">Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
