import { StatusBar } from "expo-status-bar";
import { BottomTabsNavigator } from "./navigation/bottomNav";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";

import { View } from "react-native";
import { StackNavigator } from "./navigation/stackNavigator";
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
    Orienta: require("./assets/fonts/Orienta-Regular.ttf"),
    Prompt: require("./assets/fonts/Prompt-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <StackNavigator />
        <StatusBar style="dark" />
      </NavigationContainer>
    </View>
  );
}
