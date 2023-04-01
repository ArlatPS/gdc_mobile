import { DealsListGame, StoreFromShark } from "../../globalTypes";
import { Text, View, FlatList } from "react-native";
import { useState, useEffect } from "react";

// import FreeGames from "@/components/root/freeGames";
// import getStores from "@/lib/getStores";
// import ListOfDeals from "@/components/listOfDeals";
// import UserDeals from "../components/auth/userDeals";

// to assure for production is at least one free game
const freeGameForProd: DealsListGame = {
  internalName: "JUSTCAUSE2",
  title: "Just Cause 2",
  metacriticLink: "/game/pc/just-cause-2",
  dealID: "n4VivWiz9xVo54bIegFI2S0MZGlMViNEL%2B4QMfk9zW4%3D",
  storeID: "3",
  gameID: "180",
  salePrice: "1.50",
  normalPrice: "14.99",
  isOnSale: "1",
  savings: "89.993329",
  metacriticScore: "84",
  steamRatingText: "Very Positive",
  steamRatingPercent: "90",
  steamRatingCount: "38792",
  steamAppID: "8190",
  releaseDate: 1269302400,
  lastChange: 1679567745,
  dealRating: "9.8",
  thumb:
    "https://cdn.cloudflare.steamstatic.com/steam/apps/8190/capsule_sm_120.jpg?t=1660140289",
};

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
  }, []);

  //   let free = await fetchFreeGames();
  // get stores
  //   const stores = await getStores();
  if (bestDeals != undefined) {
    // for production extra cards with free games
    // free = [...free, freeGameForProd, freeGameForProd];
    return (
      <View>
        <Text>Best Deals</Text>
        {bestDeals.length > 0 && stores.length > 0 ? (
          <FlatList
            data={bestDeals}
            keyExtractor={(deal) => deal.dealID}
            renderItem={({ item }) => (
              <View>
                <Text>{item.title}</Text>
              </View>
            )}
          />
        ) : null}
        {bestDeals.map((deal) => {
          return (
            <View>
              <Text>{deal.title}</Text>
            </View>
          );
        })}
      </View>
    );
  }
  return (
    <View>
      <Text>Cheap Shark unavailable</Text>
    </View>
  );
}
