// import React from "react";
// import { TouchableOpacity, Image, StyleSheet } from "react-native";
// import { styles } from "../styles";

// const UserIcon = ({ onPress }) => (
//   <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
//     <Image
//       source={{ uri: "https://example.com/user-icon.png" }}
//       style={styles.userIcon}
//     />
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   iconContainer: { alignSelf: "flex-start", margin: 16 },
//   userIcon: { width: 50, height: 50, borderRadius: 25 },
// });

// UserIcon.js
import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
const UserIcon = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
      <View style={styles.icon} />
    </TouchableOpacity>
  );
};

// const styles = StyleSheet.create({
//   icon: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "lightpink",
//     position: "absolute",
//     top: 20,
//     left: 20,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     marginBottom: 120,
//     marginRight: 20,
//   },
// });

const styles = StyleSheet.create({
  iconContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 2,
  },
  icon: {
    width: 80,
    height: 80,
    backgroundColor: "#ffc0cb", // Light pink
    borderRadius: 40,
  },
});

export default UserIcon;
