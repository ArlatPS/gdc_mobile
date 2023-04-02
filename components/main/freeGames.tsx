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
import {
  CalculateTimeLeftType,
  calculateTimeLeft,
  getStoreToDisplay,
} from "../../lib/freeGamesFunctions";

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
          <Text
            style={[
              {
                color: theme.white,
                marginLeft: 10,
                fontSize: 12,
                fontFamily: "Prompt",
              },
            ]}
          >
            {gameStore.storeName}
          </Text>
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
      <Text
        style={{
          color: theme.white,
          textAlign: "center",
          fontFamily: "Prompt",
          fontSize: 14,
          marginVertical: 6,
        }}
      >
        {game.title}
      </Text>
      {/* display time left if offer is from Epic - they last 7 days */}
      {game.storeID == "25" ? (
        timeLeft.format == "days" ? (
          <View style={styles.timeView}>
            <Text style={[styles.blueTime, { fontSize: 18 }]}>
              {timeLeft.value}
            </Text>
            {/* if one day then day otherwise days */}
            <Text style={[styles.blueTime]}>
              {timeLeft.value == 1 ? "day" : "days"} left
            </Text>
          </View>
        ) : (
          <View style={styles.timeView}>
            <Text style={[styles.redTime, { fontSize: 18 }]}>
              {timeLeft.value > 0 ? timeLeft.value : 0}
            </Text>
            <Text style={[styles.redTime]}>
              {timeLeft.value == 1 ? "hour" : "hours"} left
            </Text>
          </View>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  freeGameCard: {
    width: 202,
    marginVertical: 10,
    borderColor: theme.red,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: theme.night,
    shadowColor: theme.red,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
  },
  coverImg: { height: 100, width: 200 },
  gameStore: {
    // backgroundColor: "red",
    flexWrap: "nowrap",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  timeView: {
    padding: 10,
  },
  blueTime: {
    color: theme.blue,
    textAlign: "center",
    fontSize: 14,
  },
  redTime: {
    color: theme.red,
    textAlign: "center",
    fontSize: 14,
  },
});
