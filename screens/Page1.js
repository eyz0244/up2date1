import React, { useState, useRef } from "react";
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

const { width } = Dimensions.get("window");

const Page1 = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [queriesList, setQueriesList] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
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

  const handleAddTopic = () => {
    if (query.trim() && !queriesList.includes(query)) {
      setQueriesList([...queriesList, query]);
      setQuery("");
      Keyboard.dismiss();
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigation.navigate("News", { query, setQueriesList });
    }
  };

  const removeQuery = (itemToRemove) => {
    setQueriesList(queriesList.filter((item) => item !== itemToRemove));
  };

  const openAuthModal = () => {
    setIsAuthModalVisible(true);
    closeMenu();
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleLogin = () => {
    let isValid = true;

    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long."
      );
      isValid = false;
    }

    if (isValid) {
      // On successful login
      console.log("Logging in with", { email, password });
      setIsAuthModalVisible(false);
      setEmail("");
      setPassword("");
      setIsLoggedIn(true); // Set the login state to true
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Set the login state to false when logging out
  };

  return (
    // <SafeAreaView style={styles.container, }> update below is key
    //<SafeAreaView style={[styles.container, { flex: 1 }]}>
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
          <TouchableOpacity onPress={openAuthModal}>
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
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? (
              <Text style={localStyles.errorText}>{emailError}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {passwordError ? (
              <Text style={localStyles.errorText}>{passwordError}</Text>
            ) : null}
            <View style={localStyles.modalButtons}>
              <Button title="Login" onPress={handleLogin} />
              <Button
                title="Cancel"
                onPress={() => setIsAuthModalVisible(false)}
                color="red"
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
        <View style={localStyles.buttonContainer}>
          <Button title="Search" onPress={handleSearch} />
        </View>
      </View>

      <Button title="Add Topic" onPress={handleAddTopic} />

      <View style={localStyles.tableContainer}>
        <FlatList
          data={queriesList}
          renderItem={({ item }) => (
            <View style={localStyles.tableRow}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("News", { query: item, setQueriesList })
                }
                style={localStyles.queryContainer}
              >
                <Text style={localStyles.tableText}>{item}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeQuery(item)}
                style={localStyles.removeButton}
              >
                <Text style={localStyles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => `${item}-${index}`}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  // All the styles remain the same
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
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
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
  tableContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  tableRow: {
    backgroundColor: "#f8f9fa",
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  queryContainer: {
    flex: 0.75,
    backgroundColor: "lightgray",
  },
  tableText: {
    fontSize: 16,
    textAlign: "left",
  },
  removeButton: {
    flex: 0.25,
    alignItems: "flex-end",
  },
  removeText: {
    color: "red",
    opacity: 1,
    fontStyle: "italic",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default Page1;
