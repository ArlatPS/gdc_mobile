import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainScreen from "../screens/mainScreen";
import TabBarHomeIcon from "../components/navigation/tabBarHomeIcon";
import { theme } from "../theme";

const BottomTabs = createBottomTabNavigator();

export const BottomTabsNavigator: React.FC = () => {
  return (
    <BottomTabs.Navigator screenOptions={{ tabBarStyle: {} }}>
      <BottomTabs.Screen
        name="Home"
        component={MainScreen}
        options={{ tabBarIcon: ({ size }) => <TabBarHomeIcon size={size} /> }}
      />
    </BottomTabs.Navigator>
  );
};
