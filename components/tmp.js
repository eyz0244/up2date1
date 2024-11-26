import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { styles } from "../styles";

const Banner = () => (
  <View style={styles.banner}>
    <Text style={styles.bannerText}>Stay Up2Date!</Text>
    <Text style={styles.bannerText2}>Get Updates on Topics Now!</Text>
  </View>
);

// const styles = StyleSheet.create({
//   banner: {
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#f8f9fa",
//     padding: 10,
//     width: "100%",
//     marginBottom: 16,
//   },
//   bannerText: { fontSize: 18, fontWeight: "bold" },
// });

export default Banner;
