import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import Button from "../components/Button";
import useStore from "../store";
import { formatPrice, showTopToast } from "../utils";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackNavigatorParamsList } from "@/app";

interface PIXRequestProps {}

const PIXRequest: React.FC<PIXRequestProps> = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackNavigatorParamsList>>();
  const store = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePress = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://18.191.166.173/api/create_rental/${store.QRCodeData}/${store.totalTime}`,
        {
          method: "POST",
        }
      );
      const json = await response.json();
      const [pixData, id] = [json.qr_code, json.rental_id];
      store.setPixCode(pixData);
      store.setRentalid(id);
      navigation.navigate("PIX Response");
    } catch (error) {
      showTopToast("Parece que ocorreu um erro!", ToastAndroid.SHORT);
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        O total a ser pago é {formatPrice(store.totalPrice)}
      </Text>
      <Button onPress={handlePress} title="Gerar PIX copia e cola" />
      {isLoading && <ActivityIndicator color={"black"} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  title: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  } as TextStyle,
});

export default PIXRequest;
