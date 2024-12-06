import React, { useState, useEffect, useRef, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  PanResponder,
} from "react-native";
import { styles } from "../styles";
import { UserContext } from "../UserContext"; // Import UserContext
import {
  getUserData,
  addUserTopic,
  signUpUser,
} from "../utils/firebaseService"; // Import Firestore functions

const { width } = Dimensions.get("window");

const Page2 = ({ route, navigation }) => {
  const query = route.params?.query || "";
  const [articles, setArticles] = useState([]);
  const [topics, setTopics] = useState([]); // Store topics fetched from Firestore
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newTopic, setNewTopic] = useState("");

  const slideAnim = useRef(new Animated.Value(-width)).current;
  const { isLoggedIn, login, logout } = useContext(UserContext); // Use UserContext

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
    if (newTopic.trim()) {
      await addUserTopic("user-id", newTopic); // Replace "user-id" with the logged-in user's ID
      setTopics([...topics, newTopic]); // Update local state
      setNewTopic("");
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

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${query}&apiKey=a7897f3ce6634dd7bbc7cb35f3ebf7c2`
        );
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    if (query) {
      fetchArticles();
    } else {
      setLoading(false);
    }
  }, [query]);

  return loading ? (
    <ActivityIndicator size="large" />
  ) : (
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
            zIndex: 1000,
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

      {/* Auth Modal */}
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

      <Text style={styles.titlePage2}>Results for: {query}</Text>

      <View>
        <Text style={styles.title}>Your Topics</Text>
        <FlatList
          data={topics}
          renderItem={({ item }) => (
            <Text style={localStyles.topic}>{item}</Text>
          )}
          keyExtractor={(item, index) => `${item}-${index}`}
        />
      </View>

      <TextInput
        value={newTopic}
        onChangeText={setNewTopic}
        placeholder="Add a new topic"
        style={styles.input}
      />
      <Button title="Add Topic" onPress={handleAddTopic} />

      <FlatList
        data={articles}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => Linking.openURL(item.url)}
            style={styles.itemContainer}
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.url}
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
  menuContent: {
    padding: 20,
  },
  menuText: {
    fontSize: 18,
    marginBottom: 20,
  },
  topic: {
    fontSize: 16,
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 5,
    borderRadius: 5,
  },
});

export default Page2;
