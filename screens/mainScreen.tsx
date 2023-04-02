import { Image, Text, View } from "react-native";
import BestDeals from "../components/main/bestDeals";
import WebView from "react-native-webview";

export default function MainScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Text>GG</Text>
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
    </View>
  );
}
