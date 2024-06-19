import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps {
  onPress?: () => void;
  title: string | null;
  style?: ViewStyle;
  disabled?: boolean;
  hidden?: boolean; // New prop to control visibility
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  style,
  disabled = false,
  hidden = false, // Default value for the new prop
}) => {
  if (hidden) {
    return null; // Do not render the button if hidden is true
  }

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      style={[styles.button, style, disabled && styles.disabledButton]}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledButtonText]}>
        {title}
      </Text>
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
  disabledButton: {
    backgroundColor: "gray",
  } as ViewStyle,
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  } as TextStyle,
  disabledButtonText: {
    color: "lightgray",
  } as TextStyle,
});

export default Button;
