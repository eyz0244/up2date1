import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Button,
  StyleSheet,
} from "react-native";
import { UserContext } from "../UserContext";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Page2 = ({ route }) => {
  const { query } = route.params || {};
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(UserContext); // Access the user context

  useEffect(() => {
    const fetchArticles = async () => {
      if (!query) return;
      try {
        const articlesCollection = collection(db, "articles"); // Example collection
        const snapshot = await getDocs(articlesCollection);
        const data = snapshot.docs.map((doc) => doc.data());
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [query]);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={articles}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          )}
          keyExtractor={(item, index) => `${index}`}
        />
      )}
      <Button title="Back" onPress={() => route.params?.setQueriesList([])} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDescription: {
    fontSize: 14,
  },
});

export default Page2;
