import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  SafeAreaView,
  Button,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  PanResponder,
  Modal,
  TextInput,
} from "react-native";
import { styles } from "../styles";
import UserIcon from "../components/UserIcon";
import { validateSession, clearSession } from "../utils/sessionManager";

const { width } = Dimensions.get("window");

const Page2 = ({ route, navigation }) => {
  const query = route.params?.query || "";
  const setQueriesList = route.params?.setQueriesList || (() => {});
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const handleAddToPage1 = () => {
    setQueriesList((prevList) => {
      if (!prevList.includes(query.trim()) && query.trim()) {
        return [...prevList, query];
      }
      return prevList;
    });
  };

  useEffect(() => {
    if (query) {
      const fetchArticles = async () => {
        try {
          const response = await fetch(
            `https://newsapi.org/v2/everything?q=${query}&apiKey=a7897f3ce6634dd7bbc7cb35f3ebf7c2`
          );
          const data = await response.json();
          const filteredArticles = data.articles.filter(
            (article) => article.title !== "[Removed]"
          );

          filteredArticles.sort(
            (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
          );

          setArticles(filteredArticles);
        } catch (error) {
          console.error("Error fetching articles:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchArticles();
    } else {
      setLoading(false);
    }
  }, [query]);

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
      setIsAuthModalVisible(false);
      setEmail("");
      setPassword("");
      setIsLoggedIn(true); // Log the user in
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Log the user out
  };

  return loading ? (
    <ActivityIndicator size="large" />
  ) : (
    // <View style={styles.container}>
    <SafeAreaView style={[styles.container, { flex: 1 }]}>
      {/* Sliding Menu */}
      {isMenuVisible && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={[localStyles.overlay, { zIndex: 999 }]} />
        </TouchableWithoutFeedback>
      )}
      <Animated.View
        style={[
          localStyles.slidingMenu,
          {
            transform: [{ translateX: slideAnim }],
            zIndex: 1000, // Ensure the sliding menu stays above other content
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

      {/* Modal for Login */}
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

      {/* Main Content */}
      <UserIcon
        onPress={toggleMenu}
        style={{ zIndex: isMenuVisible ? 0 : 10 }}
      />
      <Text style={styles.titlePage2}>Results for: {query}</Text>

      <View style={localStyles.buttonRow}>
        <View style={localStyles.button}>
          <Button title="Home" onPress={() => navigation.navigate("Home")} />
        </View>
        <View style={localStyles.button}>
          <Button title="Add Topic" onPress={handleAddToPage1} />
        </View>
      </View>

      {articles.length > 0 ? (
        <FlatList
          data={articles}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => Linking.openURL(item.url)}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemSource}>
                {item.source.name} -{" "}
                {new Date(item.publishedAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.url}
        />
      ) : (
        <Text style={styles.noResultsText}>
          No articles found for this query.
        </Text>
      )}
      {/* </View> */}
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
    alignSelf: "center",
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
  slidingMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.75,
    height: "100%",
    backgroundColor: "#f2f2f2",
    zIndex: 1000,
    paddingTop: 20,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999, // Overlay stays on top
  },
  menuContent: {
    padding: 20,
  },
  menuText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  modalButtons: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});

export default Page2;
