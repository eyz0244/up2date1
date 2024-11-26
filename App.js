import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context"; // Import SafeAreaProvider
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons
import ModalComponent from "./components/ModalComponent";
import Page1 from "./screens/Page1";
import Page2 from "./screens/Page2";

const Tab = createBottomTabNavigator();
import { UserProvider } from "./UserContext";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => setModalVisible(!modalVisible);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <ModalComponent visible={modalVisible} toggleModal={toggleModal} />
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            options={{
              headerShown: false, // Hide the header
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" color={color} size={size} />
              ),
            }}
          >
            {(props) => (
              <Page1
                {...props}
                toggleModal={toggleModal}
                modalVisible={modalVisible}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="News"
            options={{
              headerShown: false, // Hide the header
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="newspaper-outline" color={color} size={size} />
              ),
            }}
          >
            {(props) => (
              <Page2
                {...props}
                toggleModal={toggleModal}
                modalVisible={modalVisible}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
