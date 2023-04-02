import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainScreen from "../screens/mainScreen";
import TabBarHomeIcon from "../components/navigation/tabBarHomeIcon";

const BottomTabs = createBottomTabNavigator();

export const BottomTabsNavigator: React.FC = () => {
  return (
    <BottomTabs.Navigator>
      <BottomTabs.Screen
        name="Home"
        component={MainScreen}
        options={{ tabBarIcon: ({ size }) => <TabBarHomeIcon size={size} /> }}
      />
    </BottomTabs.Navigator>
  );
};
