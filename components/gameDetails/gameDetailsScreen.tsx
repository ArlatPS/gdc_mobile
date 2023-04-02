import { Text, View, StyleSheet, Image } from "react-native";

export default function GameDetailsScreen({ route }: { route?: any }) {
  return (
    <View>
      <Text>BONJOUR {route.params.id}</Text>
    </View>
  );
}
