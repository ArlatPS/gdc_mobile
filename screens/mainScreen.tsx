import { Image, ScrollView, Text, View } from "react-native";
import BestDeals from "../components/main/bestDeals";
import WebView from "react-native-webview";
import NameEffect from "../components/main/nameEffect";

export default function MainScreen() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <NameEffect text="GAMES DONE CHEAP" />
      <View style={{ flex: 1, alignItems: "center" }}>
        <Image
          source={require("../assets/gdclog.png")}
          style={{ height: 50, aspectRatio: 1 }}
        />
      </View>
      <BestDeals />
    </ScrollView>
  );
}
