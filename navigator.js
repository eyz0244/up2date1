import { createStackNavigator } from "@react-navigation/stack";
import Page1 from "./Page1";
import Page2 from "./Page2";

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Page1">
      <Stack.Screen name="Page1" component={Page1} />
      <Stack.Screen name="Page2" component={Page2} />
    </Stack.Navigator>
  );
}
