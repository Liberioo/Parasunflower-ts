import { View, TextInput, StyleSheet, ToastAndroid } from "react-native";
import Button from "../components/Button";
import CountdownTimer from "../components/CountdownTimer";
import useStore from "../store";
import * as Clipboard from "expo-clipboard";
import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackNavigatorParamsList } from "@/app";
import useBLE from "@/useBLE";
import { useState } from "react";
import { Device } from "react-native-ble-plx";
import { showTopToast } from "@/utils";

export default function PIXResponse() {
  const navigation =
    useNavigation<StackNavigationProp<RootStackNavigatorParamsList>>();
  const store = useStore();
  const [change, setChange] = useState<number>(0);

  React.useEffect(() => {
    const getPaymentResponse = async () => {
      try {
        // console.log(store.rentalid);
        const response = await fetch(
          `http://18.191.166.173/api/check_payment/${store.rentalid}`
        );
        const json = await response.json();
        if (json.payment_status === "approved") {
          showTopToast("Pagamento recebido!", ToastAndroid.SHORT);
          console.log(json.expiration_date);
          store.setEndTime(new Date(json.expiration_date));
          store.setIsRent(true);
          handlePress();
        } else if (json.payment_status === "cancelled") {
          navigation.navigate("PIX Request");
        }
      } catch (error) {
        console.error(error);
      }
    };
    const interval = setInterval(() => {
      getPaymentResponse();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(store.pixCode);
  };

  const handlePress = () => {
    store.clearPrice();
    navigation.navigate("Tempo restante e controles");
  };

  const handleEndTime = (newSeconds: number) => {
    setChange(change + 1);
    if (newSeconds === 0) {
      navigation.navigate("PIX Request");
    }
  };

  return (
    <View style={styles.container}>
      <CountdownTimer
        title={"Você tem 5 minutos para efetuar o pagamento."}
        initialSeconds={300}
        onChange={handleEndTime}
      />
      <TextInput
        style={styles.code}
        editable={false}
        selectTextOnFocus={false}
        value={store.pixCode}
      />
      <Button title={"Copiar chave PIX"} onPress={copyToClipboard} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  },
  text: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  code: {
    color: "black",
    fontSize: 16,
    backgroundColor: "lightgray",
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
