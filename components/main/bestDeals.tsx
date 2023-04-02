import { DealsListGame, StoreFromShark } from "../../globalTypes";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  Linking,
  Alert,
  Pressable,
} from "react-native";
import WebView from "react-native-webview";
import { useState, useEffect, useCallback } from "react";
import { theme } from "../../theme";

// import FreeGames from "@/components/root/freeGames";
// import getStores from "@/lib/getStores";
// import ListOfDeals from "@/components/listOfDeals";
// import UserDeals from "../components/auth/userDeals";

// filter out deals that don't have steamAppID and are not free
// and prevent repetitions of games (common with this API)
function filterDeals(deals: DealsListGame[]) {
  const filtered: DealsListGame[] = [];
  deals.forEach((deal) => {
    if (deal.steamAppID != null) {
      if (Number(deal.salePrice) > 0) {
        filtered.push(deal);
      }
    }
  });
  // set for checking if seen before
  const seen = new Set();
  const readyToBeDisplayed = [];
  for (let i = 0; i < filtered.length; i++) {
    if (!seen.has(filtered[i].steamAppID)) {
      seen.add(filtered[i].steamAppID);
      readyToBeDisplayed.push(filtered[i]);
    }
  }
  return readyToBeDisplayed;
}

// also fetch return free games (which can be repeated - offers from different stores)
// async function fetchFreeGames() {
//   try {
//     const response = await fetch(
//       `https://www.cheapshark.com/api/1.0/deals?pageSize=20&upperPrice=0`,
//       { next: { revalidate: 10 * 60 } }
//     );
//     const responseJSON = (await response.json()) as DealsListGame[];
//     return responseJSON;
//   } catch {
//     console.error("CHEAP SHARK API UNAVAILABLE");
//   }
// }

export default function BestDeals() {
  const [bestDeals, setBestDeals] = useState<DealsListGame[]>([]);
  const [stores, setStores] = useState<StoreFromShark[]>([]);
  //   const bestDeals = await fetchBestDeals(15);
  useEffect(() => {
    async function fetchBestDeals(length: number) {
      // fetch two pages to guarantee at least 15 good results
      // revalidate best deals every 10 minutes
      try {
        let results: DealsListGame[] = [];
        for (let i = 0; i < 3; i++) {
          const response = await fetch(
            `https://www.cheapshark.com/api/1.0/deals?pageSize=60&pageNumber=${i}`
          );
          const responseJSON = (await response.json()) as DealsListGame[];
          results = [...results, ...responseJSON];
        }
        // filtering
        const filteredDeals = filterDeals(results);
        setBestDeals(filteredDeals.slice(0, length));
      } catch {}
    }
    async function getStores() {
      try {
        const response = await fetch(
          "https://www.cheapshark.com/api/1.0/stores"
        );
        const responseJSON = (await response.json()) as StoreFromShark[];
        setStores(responseJSON);
      } catch {}
    }
    fetchBestDeals(15);
    getStores();
  }, []);

  //   let free = await fetchFreeGames();
  // get stores
  //   const stores = await getStores();
  // for production extra cards with free games
  // free = [...free, freeGameForProd, freeGameForProd];
  if (bestDeals.length > 0 && stores.length > 0) {
    return (
      <View style={{ flex: 1 }}>
        <Text>Best Deals</Text>
        <View style={[styles.table]}>
          <View style={[styles.row]}>
            <View style={[styles.cell0]}>
              <Text style={[styles.header]}>Store</Text>
            </View>
            <View style={[styles.cell1]}>
              <Text style={[styles.header]}>Cover</Text>
            </View>
            <View style={[styles.cell2]}>
              <Text style={[styles.header]}>Title</Text>
            </View>
            <View style={[styles.cell3]}>
              <Text style={[styles.header]}>Price</Text>
            </View>
            <View style={[styles.cell4]}>
              <Text style={[styles.header]}>Save</Text>
            </View>
            <View style={[styles.cell5]}>
              <Text style={[styles.header]}>Deal</Text>
            </View>
          </View>
          {bestDeals.map((deal) => (
            <Deal deal={deal} key={deal.dealID} stores={stores} />
          ))}
        </View>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: "https://embed.lottiefiles.com/animation/78811" }}
        style={{ flex: 1 }}
        originWhitelist={["*"]}
      />
    </View>
  );
}

function Deal({
  deal,
  stores,
}: {
  deal: DealsListGame;
  stores: StoreFromShark[];
}) {
  const url = `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`;
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);
  return (
    <View style={[styles.row]}>
      <View style={[styles.cell0]}>
        <Image
          style={[styles.cell0Img]}
          source={{
            uri: `https://www.cheapshark.com/${
              stores[+deal.storeID - 1].images.logo
            }`,
          }}
        />
      </View>
      <View style={[styles.cell1]}>
        {deal.steamAppID !== null ? (
          <Image source={{ uri: deal.thumb }} style={[styles.cell1ImgWide]} />
        ) : (
          <Image source={{ uri: deal.thumb }} style={[styles.cell1ImgHigh]} />
        )}
      </View>
      <View style={[styles.cell2]}>
        <Text style={[styles.cell2]}>{deal.title}</Text>
      </View>
      <View style={[styles.cell3]}>
        <Text style={[styles.cell3]}>{deal.salePrice}$</Text>
      </View>
      <View style={[styles.cell4]}>
        <Text style={[styles.cell4]}>{Math.floor(+deal.savings)}%</Text>
      </View>
      <View style={[styles.cell5]}>
        <Pressable onPress={handlePress} style={[styles.cell5]}>
          <Text style={[styles.cell5]}>Go to!</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    padding: 1,
    borderColor: theme.red,
    borderWidth: 2,
    backgroundColor: theme.night,
    borderTopWidth: 0,
  },
  row: {
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    textAlign: "center",
    paddingVertical: 5,
    borderTopColor: theme.red,
    borderWidth: 2,
    backgroundColor: theme.night,
  },
  header: {
    color: theme.white,
    textAlign: "center",
    fontSize: 11,
  },
  cell0: {
    width: 30,
    textAlign: "center",
    fontSize: 10,
    color: theme.white,
  },
  cell0Img: {
    height: 30,
    width: 30,
  },
  cell1: {
    width: 90,
    color: theme.white,
    textAlign: "center",
    fontSize: 10,
  },
  cell1ImgHigh: {
    height: 30,
    width: 22,
  },
  cell1ImgWide: {
    height: 30,
    width: 90,
  },
  cell2: {
    width: 120,
    textAlign: "center",
    fontSize: 10,
    color: theme.white,
  },
  cell3: {
    width: 50,
    textAlign: "center",
    fontSize: 12,
    color: theme.white,
  },
  cell4: {
    width: 50,
    textAlign: "center",
    fontSize: 12,
    color: theme.white,
  },
  cell5: {
    width: 50,
    textAlign: "center",
    fontSize: 12,
    textDecorationStyle: "solid",
    textDecorationColor: theme.white,
    textDecorationLine: "underline",
    color: theme.white,
  },
});
