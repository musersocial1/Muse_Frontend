import DragToClose from "@/components/navigations/DragToClose";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DateData, Calendar as RNCalendar } from "react-native-calendars";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";

interface CalendarSheetProps {
  visible: boolean;
  onClose: () => void;
  sheetY: any;
  insets: { bottom: number };
  blurOpacity: any;
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

const CalendarSheet: React.FC<CalendarSheetProps> = ({
  visible,
  onClose,
  sheetY,
  insets,
  blurOpacity,
  selectedDate,
  onSelectDate,
}) => {
  if (!visible) return null;

  const fromYYYYMMDD = (s: string) => {
    const [y, m, d] = s.split("-").map((n) => parseInt(n, 10));
    return new Date(y, m - 1, d);
  };

  const marked =
    selectedDate != null
      ? {
          [selectedDate]: {
            selected: true,
            selectedColor: "#0368FF",
            selectedTextColor: "#FFFFFF",
          },
        }
      : undefined;

  return (
    <View className="flex-1">
      <TouchableOpacity
        activeOpacity={1}
        style={StyleSheet.absoluteFillObject}
        onPress={onClose}
      >
        <FadingBlurBackground opacity={blurOpacity} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          pointerEvents="box-none"
          style={{ marginBottom: insets.bottom }}
          className="flex-1 pb-3 px-3 items-center justify-end"
        >
          <Animated.View
            style={{
              transform: [{ translateY: sheetY }],
              width: "100%",
            }}
            className="w-full max-w-lg"
          >
            <View className="bg-[#1D1D1C] w-full border border-white/10 rounded-[30px] overflow-hidden">
              <DragToClose translateY={sheetY} onClose={onClose} />

              <View className="px-4 pb-4 pt-2">
                <RNCalendar
                  current={selectedDate ?? undefined}
                  onDayPress={(day: DateData) => {
                    onSelectDate(day.dateString);
                  }}
                  markedDates={marked}
                  enableSwipeMonths
                  firstDay={1}
                  renderArrow={(direction) => (
                    <View className="bg-[#F6F6F61A]/[10%] p-3 rounded-full">
                      <Feather
                        name={
                          direction === "left"
                            ? "chevron-left"
                            : "chevron-right"
                        }
                        size={18}
                        color="#FFFFFF"
                      />
                    </View>
                  )}
                  theme={{
                    backgroundColor: "transparent",
                    calendarBackground: "transparent",
                    todayTextColor: "#FFFFFF",
                    dayTextColor: "#FFFFFF",
                    textDisabledColor: "rgba(255,255,255,0.3)",
                    monthTextColor: "#FFFFFF",
                    textDayFontWeight: "600",
                    textMonthFontWeight: "700",
                    textDayHeaderFontWeight: "700",
                    textDayFontSize: 16,
                    textMonthFontSize: 20,
                    textDayHeaderFontSize: 12,
                    arrowColor: "#FFFFFF",
                    selectedDayBackgroundColor: "#0368FF",
                    selectedDayTextColor: "#FFFFFF",
                  }}
                  style={{
                    borderRadius: 24,
                    paddingHorizontal: 4,
                    paddingBottom: 8,
                  }}
                />

                {/* Actions */}
                <View className="flex-row space-x-4 gap-4 mt-2">
                  <TouchableOpacity
                    onPress={() => {
                      onSelectDate(null);
                      onClose();
                    }}
                    className="flex-1 bg-[#44444499]/[60%] rounded-full py-4"
                  >
                    <Text className="text-white text-center text-lg font-bold">
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      if (selectedDate) {
                        const d = fromYYYYMMDD(selectedDate);
                        onSelectDate(d.toISOString().split("T")[0]);
                      }
                      onClose();
                    }}
                    className="flex-1 bg-[#0368FF] rounded-full py-4"
                  >
                    <Text className="text-white text-center text-lg font-bold">
                      Select
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CalendarSheet;
