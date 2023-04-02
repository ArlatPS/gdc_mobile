import { Image, ScrollView, Text, View } from "react-native";
import BestDeals from "../components/main/bestDeals";
import WebView from "react-native-webview";
import NameEffect from "../components/main/nameEffect";

export default function MainScreen() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <NameEffect text="GAMES DONE CHEAP" />
      <WebView
        source={{ uri: "https://embed.lottiefiles.com/animation/78811" }}
        style={{ flex: 1 }}
        originWhitelist={["*"]}
      />
      <Image
        source={require("../assets/gdclog.png")}
        style={{ height: 50, aspectRatio: 1 }}
      />
      <BestDeals />
    </ScrollView>
  );
}
