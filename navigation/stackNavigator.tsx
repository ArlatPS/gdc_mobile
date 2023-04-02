import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "../screens/mainScreen";
import { BottomTabsNavigator } from "./bottomNav";
import GameDetailsScreen from "../components/gameDetails/gameDetailsScreen";

const Stack = createStackNavigator();
export const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="App"
        component={BottomTabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Game Details" component={GameDetailsScreen} />
    </Stack.Navigator>
  );
};
