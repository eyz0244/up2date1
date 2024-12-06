import React, { useState, useRef, useContext, useEffect } from "react";
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
  Modal,
} from "react-native";
import Banner from "../components/tmp";
import { styles } from "../styles";
import UserIcon from "../components/UserIcon";
import { UserContext } from "../UserContext"; // Import UserContext
import {
  getUserData,
  addUserTopic,
  signUpUser,
} from "../utils/firebaseService"; // Import Firestore functions

const { width } = Dimensions.get("window");

const Page1 = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [topics, setTopics] = useState([]); // Store topics fetched from Firestore
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const slideAnim = useRef(new Animated.Value(-width)).current;
  const { isLoggedIn, login, logout } = useContext(UserContext);

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

  const handleAddTopic = async () => {
    if (query.trim()) {
      await addUserTopic("user-id", query); // Replace "user-id" with the logged-in user's ID
      setTopics([...topics, query]); // Update local state
      setQuery("");
      Keyboard.dismiss();
    }
  };

  const fetchTopics = async () => {
    const userData = await getUserData("user-id"); // Replace "user-id" with the logged-in user's ID
    if (userData && userData.topics) {
      setTopics(userData.topics);
    }
  };

  const handleSignUp = async () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    try {
      await signUpUser(email, password);
      setIsAuthModalVisible(false);
      setEmail("");
      setPassword("");
      fetchTopics();
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTopics();
    }
  }, [isLoggedIn]);

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
          <TouchableOpacity onPress={() => setIsAuthModalVisible(true)}>
            <Text style={localStyles.menuText}>
              {isLoggedIn ? "Log Out" : "Sign-Up / Login"}
            </Text>
          </TouchableOpacity>
          <Text style={localStyles.menuText}>Settings</Text>
        </View>
      </Animated.View>

      <Modal
        visible={isAuthModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAuthModalVisible(false)}
      >
        <View style={localStyles.modalContainer}>
          <View style={localStyles.modalContent}>
            <Text style={localStyles.modalTitle}>Sign-Up / Login</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {emailError && (
              <Text style={localStyles.errorText}>{emailError}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {passwordError && (
              <Text style={localStyles.errorText}>{passwordError}</Text>
            )}
            <View style={localStyles.modalButtons}>
              <Button title="Sign Up" onPress={handleSignUp} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => setIsAuthModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      <UserIcon onPress={toggleMenu} />
      <Banner />
      <View style={localStyles.inputContainer}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Topic"
          style={[styles.input, localStyles.searchInput]}
        />
        <Button title="Add Topic" onPress={handleAddTopic} />
      </View>

      <FlatList
        data={topics}
        renderItem={({ item }) => (
          <View style={localStyles.tableRow}>
            <Text style={localStyles.tableText}>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => `${item}-${index}`}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalButtons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 5,
  },
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
  },
  tableRow: {
    backgroundColor: "#f8f9fa",
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
  },
  tableText: {
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});

export default Page1;
