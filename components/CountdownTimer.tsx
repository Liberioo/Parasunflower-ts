import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface CountdownTimerProps {
  initialSeconds: number;
  title: string;
  onChange?: (newSeconds: number) => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  title,
  onChange,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          const newSeconds = prevSeconds - 1;
          if (onChange) {
            onChange(newSeconds);
          }
          return newSeconds;
        }
        return prevSeconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onChange]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.timer}>{formatTime(seconds)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  timer: {
    fontSize: 48,
    fontWeight: "bold",
  } as TextStyle,
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  } as TextStyle,
});

export default CountdownTimer;
