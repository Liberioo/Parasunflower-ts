import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../components/Button";
import useStore from "../store";
import { formatPricePerMinute } from "../utils";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackNavigatorParamsList } from "@/app";

export default function AddTime() {
  const navigation =
    useNavigation<StackNavigationProp<RootStackNavigatorParamsList>>();
  const store = useStore();

  const goToPayment = () => {
    navigation.navigate("PIX Request");
  };

  const pricePerMin = store.rate;
  const currentTime = store.totalSeconds;

  const handleTimePress = (minutes: number) => {
    store.setTime(minutes);
    store.setTotalSeconds(currentTime + minutes * 60);
    store.setPrice(minutes * pricePerMin);
    goToPayment();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione o tempo a mais desejado</Text>
      <View style={styles.buttonsBottomSpacing}>
        <Button
          onPress={() => handleTimePress(10)}
          title={`10 min - ${formatPricePerMinute(pricePerMin, 10)}`}
        ></Button>
        <Button
          onPress={() => handleTimePress(30)}
          title={`30 min - ${formatPricePerMinute(pricePerMin, 30)}`}
        ></Button>
        <Button
          onPress={() => handleTimePress(45)}
          title={`45 min - ${formatPricePerMinute(pricePerMin, 45)}`}
        ></Button>
        <Button
          onPress={() => handleTimePress(60)}
          title={`1 hora - ${formatPricePerMinute(pricePerMin, 60)}`}
        ></Button>
      </View>
      <Text style={styles.text}>
        O tempo máximo de locação por vez são duas horas!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginLeft: 5,
    marginRight: 5,
  },
  buttonsBottomSpacing: {
    marginBottom: 10,
  },
});
