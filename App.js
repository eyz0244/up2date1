import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context"; // Import SafeAreaProvider
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons
import ModalComponent from "./components/ModalComponent";
import Page1 from "./screens/Page1";
import Page2 from "./screens/Page2";
import { UserProvider, UserContext } from "./UserContext";
import { db } from "./firebaseConfig"; // Import Firebase configuration

const Tab = createBottomTabNavigator();

export default function App() {
  // Test Firebase connection on app start
  useEffect(() => {
    const testFirestore = async () => {
      try {
        const testQuery = await db.collection("testCollection").get();
        console.log("Firestore connected. Test data:", testQuery.docs.map((doc) => doc.data()));
      } catch (error) {
        console.error("Error connecting to Firestore:", error);
      }
    };
    testFirestore();
  }, []);

  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}

function MainApp() {
  const { isLoggedIn, login, logout } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => setModalVisible(!modalVisible);

  useEffect(() => {
    if (!isLoggedIn) {
      setModalVisible(true); // Show login modal if user is not logged in
    } else {
      setModalVisible(false); // Hide login modal when user logs in
    }
  }, [isLoggedIn]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <ModalComponent
          visible={modalVisible}
          toggleModal={toggleModal}
          onLogin={login} // Pass login function to ModalComponent
        />
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
                onLogout={logout} // Pass logout function to Page1
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
                onLogout={logout} // Pass logout function to Page2
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
