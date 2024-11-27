import React, { useState, useRef, useContext } from "react";
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
import { UserContext } from "../UserContext"; // Import UserContext for session handling

const { width } = Dimensions.get("window");

const Page1 = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [queriesList, setQueriesList] = useState([]);
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
          <TouchableOpacity onPress={isLoggedIn ? logout : login}>
            <Text style={localStyles.menuText}>
              {isLoggedIn ? "Log Out" : "Sign-Up / Login"}
            </Text>
          </TouchableOpacity>
          <Text style={localStyles.menuText}>Settings</Text>
        </View>
      </Animated.View>

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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
});

export default Page1;
