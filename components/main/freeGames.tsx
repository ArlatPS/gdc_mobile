import { DealsListGame, StoreFromShark } from "../../globalTypes";
import { generalStyles, theme } from "../../theme";
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
import { useState, useEffect, useMemo } from "react";

export default function FreeGames({ stores }: { stores: StoreFromShark[] }) {
  const [freeGames, setFreeGames] = useState<DealsListGame[]>([]);
  useEffect(() => {
    // also fetch free games (which can be repeated - offers from different stores)
    async function fetchFreeGames() {
      try {
        const response = await fetch(
          `https://www.cheapshark.com/api/1.0/deals?pageSize=20&upperPrice=0`
        );
        const responseJSON = (await response.json()) as DealsListGame[];
        setFreeGames(responseJSON);
      } catch {
        console.error("CHEAP SHARK API UNAVAILABLE");
      }
    }
    fetchFreeGames();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Text style={generalStyles.headerForSection}>Free Games</Text>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {freeGames.map((game) => (
          <FreeGame game={game} stores={stores} key={game.dealID} />
        ))}
      </View>
    </View>
  );
}

function FreeGame({
  game,
  stores,
}: {
  game: DealsListGame;
  stores: StoreFromShark[];
}) {
  const gameStore = getStoreToDisplay(game, stores);
  // calculate time left to display
  const timeLeft: CalculateTimeLeftType = useMemo(() => {
    return calculateTimeLeft(game.lastChange);
  }, [game.lastChange]);
  return (
    <View style={[styles.freeGameCard]}>
      {gameStore ? (
        <View style={[styles.gameStore]}>
          <Image
            source={{
              uri: `https://www.cheapshark.com/${gameStore.images.logo}`,
            }}
            style={{ height: 30, aspectRatio: 1 }}
            alt="shop logo"
          />
          <Text style={[{ color: theme.white }]}>{gameStore.storeName}</Text>
        </View>
      ) : null}
      {game.steamAppID !== null ? (
        <Image
          source={{
            uri: `https://cdn.akamai.steamstatic.com/steam/apps/${game.steamAppID}/header.jpg`,
          }}
          alt="Cover photo from Steam"
          style={[styles.coverImg]}
        />
      ) : (
        <Image
          source={{ uri: game.thumb }}
          alt="Cover photo from CheapShark API"
          style={[styles.coverImg]}
        />
      )}
      <Text>{game.title}</Text>
      {/* display time left if offer is from Epic - they last 7 days */}
      {game.storeID === "25" ? (
        // if days then div with days class otherwise hours
        timeLeft.format === "days" ? (
          <View>
            <Text>{timeLeft.value}</Text>
            {/* if one day then day otherwise days */}
            <Text>{timeLeft.value == 1 ? "day" : "days"} left</Text>
          </View>
        ) : (
          <View>
            <Text>{timeLeft.value > 0 ? timeLeft.value : 0}</Text>
            <Text>{timeLeft.value == 1 ? "hour" : "hours"} left</Text>
          </View>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  freeGameCard: { width: 200, marginHorizontal: "auto" },
  coverImg: { height: 40, width: 80 },
  gameStore: { backgroundColor: "red" },
});

function getStoreToDisplay(game: DealsListGame, stores: StoreFromShark[]) {
  let gameStoreToDisplay: StoreFromShark | undefined = undefined;
  for (let i = 0; i < stores.length; i++) {
    if (stores[i].storeID == game.storeID) {
      gameStoreToDisplay = stores[i];
    }
  }
  return gameStoreToDisplay;
}

type CalculateTimeLeftType = {
  format: "hours" | "days";
  value: number;
};

function calculateTimeLeft(
  lastChange: number,
  now: number = Date.now()
): CalculateTimeLeftType {
  const end = lastChange * 1000 + 7 * 24 * 60 * 60 * 1000;
  const hoursEnd = Math.floor((end - now) / 1000 / 3600);

  if (hoursEnd < 24) {
    return { format: "hours", value: hoursEnd };
  }
  return { format: "days", value: Math.floor(hoursEnd / 24) };
}
