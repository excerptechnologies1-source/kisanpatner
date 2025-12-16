import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";

// Keep navigation side effects out of render for release/minified builds
// to avoid any timing/race issues; show a tiny loader while redirecting.
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(auth)/onboarding");
  }, [router]);

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
