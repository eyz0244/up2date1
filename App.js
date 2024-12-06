import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Page1 from "./Page1";
import Page2 from "./Page2";
import { UserProvider } from "./UserContext"; // User context for managing auth state
import { collection, getDocs } from "firebase/firestore";
import { db } from "./utils/firebaseConfig"; // Firestore configuration

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    const testFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        console.log(
          "Connected to Firestore. Users:",
          querySnapshot.docs.map((doc) => doc.data())
        );
      } catch (error) {
        console.error("Error connecting to Firestore:", error.message);
      }
    };

    testFirestore();
  }, []);

  return (
    <UserProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === "Page1") {
                  iconName = focused ? "home" : "home-outline";
                } else if (route.name === "Page2") {
                  iconName = focused ? "list" : "list-outline";
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "tomato",
              tabBarInactiveTintColor: "gray",
            })}
          >
            <Tab.Screen name="Page1" component={Page1} />
            <Tab.Screen name="Page2" component={Page2} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </UserProvider>
  );
}
