import { Image, ScrollView, Text, View } from "react-native";
import BestDeals from "../components/main/bestDeals";
import WebView from "react-native-webview";
import NameEffect from "../components/main/nameEffect";
import { theme } from "../theme";
import FreeGames from "../components/main/freeGames";
import { useState, useEffect } from "react";
import { StoreFromShark } from "../globalTypes";

export default function MainScreen() {
  const [stores, setStores] = useState<StoreFromShark[]>([]);
  useEffect(() => {
    async function getStores() {
      try {
        const response = await fetch(
          "https://www.cheapshark.com/api/1.0/stores"
        );
        const responseJSON = (await response.json()) as StoreFromShark[];
        setStores(responseJSON);
      } catch {}
    }
    getStores();
  }, []);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.night }}>
      <NameEffect text="GAMES DONE CHEAP" />
      <View style={{ flex: 1, alignItems: "center" }}>
        <Image
          source={require("../assets/logoGDC_white.png")}
          style={{ height: 50, aspectRatio: 1 }}
        />
      </View>
      <FreeGames stores={stores} />
      <BestDeals stores={stores} />
    </ScrollView>
  );
}
