import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ToastAndroid,
} from "react-native";
import Button from "../components/Button";
import CountdownTimer from "../components/CountdownTimer";
import useStore from "../store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackNavigatorParamsList } from "@/app";
import useBLE from "@/useBLE";
import { showTopToast } from "@/utils";

interface TimeRemainingAndControlsProps {}

const TimeRemainingAndControls: React.FC<
  TimeRemainingAndControlsProps
> = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    send,
  } = useBLE();
  const navigation =
    useNavigation<StackNavigationProp<RootStackNavigatorParamsList>>();
  const [option, setOption] = useState(0); // 0 - auto, 1 - manual
  const [flag, setFLag] = useState<boolean>(false);
  const [change, setChange] = useState<number>(0);
  const [btn1, setBtn1] = useState<boolean>(true);
  const [btn2, setBtn2] = useState<boolean>(true);
  const [btn3, setBtn3] = useState<boolean>(true);
  const [btn4, setBtn4] = useState<boolean>(true);

  useEffect(() => {
    const scanForDevices = async () => {
      const isPermissionsEnabled = await requestPermissions();
      if (isPermissionsEnabled) {
        scanForPeripherals();
      }
    };
    if (
      !connectedDevice ||
      (!connectedDevice.name?.includes("Parasunflower") && !flag)
    ) {
      setFLag(false);
      scanForDevices();
      allDevices.forEach((device) => {
        if (device.name?.includes("Parasunflower")) {
          connectToDevice(device, ["rent"]);
          setFLag(true);
        }
      });
      // if (!flag) {
      //   showTopToast(
      //     "Nenhum dispositivo Parasunflower foi detectado nas proximidades!",
      //     ToastAndroid.LONG
      //   );
      // }
    }
  }, [change]);

  const store = useStore();
  const seconds = store.totalSeconds;

  const handleButton1Press = async () => {
    setBtn1(false);
    if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
      send(connectedDevice, "up");
    } else {
      setFLag(false);
      setChange(change + 1);
    }
    setTimeout(() => setBtn1(true), 2500);
  };

  const handleButton2Press = async () => {
    setBtn2(false);
    if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
      send(connectedDevice, "left");
    } else {
      setFLag(false);
      setChange(change + 1);
    }
    setTimeout(() => setBtn2(true), 1500);
  };

  const handleButton3Press = async () => {
    setBtn3(false);
    if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
      send(connectedDevice, "right");
    } else {
      setFLag(false);
      setChange(change + 1);
    }
    setTimeout(() => setBtn3(true), 1500);
  };

  const handleButton4Press = async () => {
    setBtn4(false);
    if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
      send(connectedDevice, "down");
    } else {
      setFLag(false);
      setChange(change + 1);
    }
    setTimeout(() => setBtn4(true), 2500);
  };

  const handleSwitchPress = () => {
    if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
      setOption(option === 1 ? 0 : 1);
      send(connectedDevice, option === 1 ? "auto" : "manual");
    } else {
      setFLag(false);
      setChange(change + 1);
    }
  };

  const handleAddTimePress = () => {
    navigation.navigate("Adição de Tempo");
  };

  const handleEndTime = (sec: number) => {
    if (sec === 300) {
      showTopToast(
        "Apenas 5 minutos restantes!\nLembrando que você sempre pode adicionar mais tempo!",
        ToastAndroid.LONG
      );
    }
    if (sec <= 0) {
      if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
        store.setIsRent(false);
        setOption(option === 1 ? 0 : 1);
        send(connectedDevice, "free");
        navigation.navigate("Mapa");
      } else {
        setFLag(false);
        setChange(change + 1);
      }
    }
    store.setTotalSeconds(sec);
  };

  const connectionText = () => {
    if (isConnected()) {
      return <></>;
    } else {
      return (
        <Text style={styles.btwarning}>
          Por favor conecte-se ao bluetooth do Parasunflower
        </Text>
      );
    }
  };

  const renderMenu = () => {
    if (option === 1) {
      return (
        <View style={[styles.container, { flex: 5 }]}>
          <CountdownTimer
            title={"Tempo Restante"}
            initialSeconds={seconds}
            onChange={handleEndTime}
          />
          {connectionText()}
          <View>
            <Button
              onPress={handleButton1Press}
              title="Inclinar para cima"
              disabled={(!isConnected() && !btn1) || !btn1}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Button
              style={{ flex: 1 }}
              onPress={handleButton2Press}
              title="Rot. esquerda"
              disabled={(!isConnected() && !btn2) || !btn2}
            />
            <Button
              style={{ flex: 1 }}
              onPress={handleButton3Press}
              title="Rot. direita"
              disabled={(!isConnected() && !btn3) || !btn3}
            />
          </View>
          <View>
            <Button
              onPress={handleButton4Press}
              title="Inclinar para baixo"
              disabled={(!isConnected() && !btn4) || !btn4}
            />
            <Button
              onPress={handleSwitchPress}
              title={option === 1 ? "Auto" : "Manual"}
              disabled={!isConnected()}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={[styles.container, { flex: 5 }]}>
          <CountdownTimer
            title={"Tempo Restante"}
            initialSeconds={seconds}
            onChange={handleEndTime}
          />
          {connectionText()}
          <View>
            <Text style={styles.title}>
              Parasunflower está no modo automático
            </Text>
          </View>
          <View>
            <Button
              onPress={handleSwitchPress}
              title={option === 1 ? "Auto" : "Manual"}
              disabled={!isConnected()}
            />
          </View>
        </View>
      );
    }
  };

  const isConnected = () => {
    if (connectedDevice && connectedDevice.name?.includes("Parasunflower"))
      return true;
    return false;
  };

  return (
    <View style={styles.container}>
      {renderMenu()}
      <View style={styles.container}>
        <Button onPress={handleAddTimePress} title={"Adicione mais tempo"} />
        <Button
          onPress={
            isConnected()
              ? () => {
                  disconnectFromDevice();
                  setFLag(false);
                }
              : () => {
                  setChange(change + 1);
                }
          }
          title={isConnected() ? "Desconectar Bluetooth" : "Conectar Bluetooth"}
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
    textAlign: "center",
  } as TextStyle,
  btwarning: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "red",
  } as TextStyle,
});

export default TimeRemainingAndControls;
