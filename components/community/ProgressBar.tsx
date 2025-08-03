import { View } from "react-native";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View className="mb-3">
      <View className="w-full h-2.5 bg-[#FFFFFF]/20 rounded-full">
        <View
          className="h-full bg-white rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
};

export default ProgressBar;
