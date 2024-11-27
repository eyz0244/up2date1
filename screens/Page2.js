import React, { useState, useEffect, useRef, useContext } from "react";
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
} from "react-native";
import { styles } from "../styles";
import UserIcon from "../components/UserIcon";
import { UserContext } from "../UserContext"; // Import UserContext for session handling

const { width } = Dimensions.get("window");

const Page2 = ({ route, navigation }) => {
  const query = route.params?.query || "";
  const setQueriesList = route.params?.setQueriesList || (() => {});
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
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

  if (!isLoggedIn) {
    // If the user is not logged in, redirect or show a login required message
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.loginRequiredText}>You must log in to view this page.</Text>
        <Button title="Login" onPress={login} />
      </SafeAreaView>
    );
  }

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
            zIndex: 1000, // Ensure the sliding menu stays above other content
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={localStyles.menuContent}>
          <TouchableOpacity onPress={isLoggedIn ? logout : login}>
            <Text style={localStyles.menuText}>
              {isLoggedIn ? "Log Out" : "Sign-Up / Login"}
            </Text>
          </TouchableOpacity>
          <Text style={localStyles.menuText}>Settings</Text>
        </View>
      </Animated.View>

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
    zIndex: 999,
  },
  menuContent: {
    padding: 20,
  },
  menuText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default Page2;
