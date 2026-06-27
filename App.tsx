import "react-native-gesture-handler";
import "./global.css";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInterFonts
} from "@expo-google-fonts/inter";
import {
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts as useOutfitFonts
} from "@expo-google-fonts/outfit";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastHost } from "@/components/ToastHost";
import { colors } from "@/constants/theme";
import { AppNavigator } from "@/navigation/AppNavigator";

export default function App() {
  const [interLoaded] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
  });
  const [outfitLoaded] = useOutfitFonts({
    Outfit_600SemiBold,
    Outfit_700Bold
  });

  if (!interLoaded || !outfitLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AppNavigator />
        <ToastHost />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary[50]
  }
});
