import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    //backgroundColor: "#f9f9f9",
    backgroundColor: "lavender",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    width: "100%",
    paddingHorizontal: 8,
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 300,
    backgroundColor: "white",
    padding: 16,
    zIndex: 1000,
  },
  modalContent: { flex: 1, justifyContent: "center" },
  modalText: { fontSize: 18, marginBottom: 20 },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  banner: {
    alignItems: "center",
    justifyContent: "center",
    /*backgroundColor: "#f8f9fa",*/
    backgroundColor: "lavender",
    padding: 10,
    width: "100%",
    marginBottom: 25,
    marginTop: 70,
  },
  bannerText: { fontSize: 32, fontWeight: "bold", color: "darkslategrey" },
  bannerText2: { fontSize: 18, fontWeight: "bold", color: "darkslategrey" },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333", // Darker text for better readability
  },
  titlePage2: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
    //position: "absolute",
    //top: 20,
    color: "#333", // Darker text for better readability
  },
  textPage2: {
    fontSize: 24,
    fontWeight: "bold",
    //marginBottom: 50,
    color: "#333", // Darker text for better readability
  },
  itemContainer: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff", // White background for each item
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
    width: "100%", // Make it full width for better spacing
  },
  itemText: {
    fontSize: 18,
    color: "#555", // Softer text color for items
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a0dab", // Google-style link color
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  itemSource: {
    fontSize: 14,
    color: "#888",
  },
  noResultsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#dc3545",
  },
});
