import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import Button from "../components/Button";
import useStore from "../store";
import { formatPricePerMinute } from "../utils";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackNavigatorParamsList } from "@/app";
import useBLE from "@/useBLE";

interface TimeOptionsProps {}

const TimeOptions: React.FC<TimeOptionsProps> = () => {
  const { connectedDevice } = useBLE();
  const navigation =
    useNavigation<StackNavigationProp<RootStackNavigatorParamsList>>();
  const store = useStore();
  const pricePerMin = store.rate;

  const goToNextPage = () => {
    navigation.navigate("PIX Request");
  };

  const handleTimePress = (minutes: number) => {
    store.setTime(minutes);
    store.setTotalSeconds(minutes * 60);
    store.setPrice(minutes * pricePerMin);
    goToNextPage();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione o tempo desejado</Text>
      <View>
        <Button
          onPress={() => handleTimePress(10)}
          title={`10 min - ${formatPricePerMinute(pricePerMin, 10)}`}
        />
        <Button
          onPress={() => handleTimePress(30)}
          title={`30 min - ${formatPricePerMinute(pricePerMin, 30)}`}
        />
        <Button
          onPress={() => handleTimePress(45)}
          title={`45 min - ${formatPricePerMinute(pricePerMin, 45)}`}
        />
        <Button
          onPress={() => handleTimePress(60)}
          title={`1 hora - ${formatPricePerMinute(pricePerMin, 60)}`}
        />
        <Button
          title={"Ir para controles"}
          onPress={() => navigation.navigate("Tempo restante e controles")}
          hidden={!store.isRent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  } as TextStyle,
});

export default TimeOptions;
