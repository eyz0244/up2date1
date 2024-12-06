import React, { useState, useEffect, useRef, useContext } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  PanResponder,
} from "react-native";
import { styles } from "../styles";
import UserIcon from "../components/UserIcon";
import { addUserTopic, getUserData } from "../firebaseService"; // Firestore functions
import { UserContext } from "../UserContext"; // User context for auth state

const { width } = Dimensions.get("window");

const Page1 = ({ navigation }) => {
  const { user } = useContext(UserContext); // Get the current authenticated user
  const userId = user?.uid; // User ID from Firebase Authentication
  const [query, setQuery] = useState("");
  const [queriesList, setQueriesList] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx < -10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          slideAnim.setValue(Math.max(-width, gestureState.dx));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          closeMenu();
        } else {
          openMenu();
        }
      },
    })
  ).current;

  const openMenu = () => {
    setIsMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsMenuVisible(false));
  };

  const toggleMenu = () => {
    if (isMenuVisible) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const data = await getUserData(userId);
        if (data && data.topics) {
          setQueriesList(data.topics); // Load user's topics
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleAddTopic = async () => {
    if (!query.trim() || queriesList.includes(query)) return;
    try {
      await addUserTopic(userId, query);
      setQueriesList((prevList) => [...prevList, query]);
      setQuery("");
      Keyboard.dismiss();
    } catch (error) {
      console.error("Error adding topic:", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isMenuVisible && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={localStyles.overlay} />
        </TouchableWithoutFeedback>
      )}
      <Animated.View
        style={[
          localStyles.slidingMenu,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={localStyles.menuContent}>
          <Text style={localStyles.menuText}>Welcome, {user?.email}</Text>
          <Text style={localStyles.menuText}>Settings</Text>
        </View>
      </Animated.View>

      <UserIcon onPress={toggleMenu} />
      <View style={localStyles.inputContainer}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Add a topic"
          style={[styles.input, localStyles.searchInput]}
        />
        <View style={localStyles.buttonContainer}>
          <Button title="Add" onPress={handleAddTopic} />
        </View>
      </View>

      <FlatList
        data={queriesList}
        renderItem={({ item }) => (
          <View style={localStyles.tableRow}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Page2", { query: item, setQueriesList })
              }
            >
              <Text style={localStyles.tableText}>{item}</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => `${item}-${index}`}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  slidingMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: width * 0.75,
    backgroundColor: "#fff",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  menuContent: {
    padding: 20,
  },
  menuText: {
    fontSize: 18,
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    width: "75%",
  },
  buttonContainer: {
    marginLeft: 10,
    marginTop: -15.5,
  },
  tableRow: {
    backgroundColor: "#f8f9fa",
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default Page1;
