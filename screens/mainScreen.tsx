import { Image, ScrollView, Text, View } from "react-native";
import BestDeals from "../components/main/bestDeals";
import WebView from "react-native-webview";
import NameEffect from "../components/main/nameEffect";
import { theme } from "../theme";

export default function MainScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.night }}>
      <NameEffect text="GAMES DONE CHEAP" />
      <View style={{ flex: 1, alignItems: "center" }}>
        <Image
          source={require("../assets/logoGDC_white.png")}
          style={{ height: 50, aspectRatio: 1 }}
        />
      </View>
      <BestDeals />
    </ScrollView>
  );
}
