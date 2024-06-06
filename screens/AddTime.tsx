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
  const minuteTime = 60;

  const handle10minPress = () => {
    store.setTime(10);
    store.setPrice(10 * pricePerMin);
    goToPayment();
  };

  const handle30minPress = () => {
    store.setTime(30);
    store.setPrice(30 * pricePerMin);
    goToPayment();
  };

  const handle45minPress = () => {
    store.setTime(45);
    store.setPrice(45 * pricePerMin);
    goToPayment();
  };

  const handle1hourPress = () => {
    store.setTime(60);
    store.setPrice(60 * pricePerMin);
    goToPayment();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione o tempo a mais desejado</Text>
      <View style={styles.buttonsBottomSpacing}>
        <Button
          onPress={handle10minPress}
          title={`10 min - ${formatPricePerMinute(pricePerMin, 10)}`}
        ></Button>
        <Button
          onPress={handle30minPress}
          title={`30 min - ${formatPricePerMinute(pricePerMin, 30)}`}
        ></Button>
        <Button
          onPress={handle45minPress}
          title={`45 min - ${formatPricePerMinute(pricePerMin, 45)}`}
        ></Button>
        <Button
          onPress={handle1hourPress}
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
