import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainScreen from "../screens/mainScreen";

const BottomTabs = createBottomTabNavigator();

export const BottomTabsNavigator: React.FC = () => {
  return (
    <BottomTabs.Navigator>
      <BottomTabs.Screen name="Home" component={MainScreen} />
    </BottomTabs.Navigator>
  );
};
