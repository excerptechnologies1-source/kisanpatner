
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from "react-native";
import 'react-native-reanimated';
import '../global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    // Simple loader while fonts load
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

   
  return (
   
      <Stack  screenOptions={{headerShown:false}}>
        <Stack.Screen name="(auth)/onboading" />
        <Stack.Screen name="(farmer)/_layout" />
        <Stack.Screen name="(trader)/_layout" />
      </Stack>
    
  );
}
