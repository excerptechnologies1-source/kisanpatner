import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<Props> = ({
  visible,
  title,
  message,
  onClose,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View className="bg-white w-full rounded-2xl p-5 text-center">
          <Text className="text-lg font-heading text-gray-900 mb-2">
            {title}
          </Text>

          <Text className="text-sm font-medium text-gray-600 mb-4">
            {message}
          </Text>

          <TouchableOpacity
            onPress={onClose}
            className="bg-[#1FAD4E] py-3 rounded-lg"
          >
            <Text className="text-white text-center font-medium">
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
