import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";

interface ButtonProps {
  onPress?: () => void;
  title: string;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({ onPress, title, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "orange",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  } as ViewStyle,
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  } as TextStyle,
});

export default Button;
