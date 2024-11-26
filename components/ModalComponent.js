import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  PanResponder,
} from "react-native";
import { styles } from "../styles";

const ModalComponent = ({ visible, toggleModal }) => {
  const slideAnim = useRef(new Animated.Value(-300)).current;

  const [panResponder] = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) toggleModal();
        else
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
      },
    })
  );

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(-300);
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: -300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <>
      {visible && (
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>User Profile</Text>
          {/* Add additional user profile details here */}
        </View>
      </Animated.View>
    </>
  );
};

export default ModalComponent;
