import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import Button from "../components/Button";
import CountdownTimer from "../components/CountdownTimer";
import useStore from "../store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackNavigatorParamsList } from "@/app";
import useBLE from "@/useBLE";

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
  const [isRent, setIsRent] = useState<boolean>(false);
  const [change, setChange] = useState<number>(0);

  // useEffect(() => {
  //   const scanForDevices = async () => {
  //     const isPermissionsEnabled = await requestPermissions();
  //     if (isPermissionsEnabled) {
  //       scanForPeripherals();
  //     }
  //   };
  //   if (
  //     !connectedDevice ||
  //     (!connectedDevice.name?.includes("Parasunflower") && !flag)
  //   ) {
  //     setFLag(false);
  //     scanForDevices();
  //     allDevices.forEach((device) => {
  //       if (device.name?.includes("Parasunflower")) {
  //         connectToDevice(device, ["rent", store.endTime.toDateString()]);
  //         setFLag(true);
  //       }
  //     });
  //   }
  // }, [change]);

  const store = useStore();
  const seconds = Math.floor(
    store.endTime.getTime() / 1000 - new Date().getTime() / 1000
  );

  const handleButton1Press = () => {
    if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
      send(connectedDevice, "up");
    } else {
      connection(["up"]);
    }
  };

  const handleButton2Press = () => {
    if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
      send(connectedDevice, "left");
    } else {
      connection(["left"]);
    }
  };

  const handleButton3Press = () => {
    if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
      send(connectedDevice, "right");
    } else {
      connection(["rent", "right"]);
    }
  };

  const handleButton4Press = () => {
    if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
      send(connectedDevice, "down");
    } else {
      connection(["down"]);
    }
  };

  const handleResetPress = () => {
    // TODO: remover
    navigation.navigate("Home");
    store.clearTime();
    store.clearPrice();
  };

  const handleSwitchPress = () => {
    if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
      setOption(option === 1 ? 0 : 1);
      send(connectedDevice, option === 1 ? "auto" : "manual");
    } else {
      connection([option === 1 ? "auto" : "manual"]);
    }
  };

  const handleAddTimePress = () => {
    navigation.navigate("Adição de Tempo");
  };

  const handleEndTime = (sec: number) => {
    if (sec === 0) {
      if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
        send(connectedDevice, "free");
      } else {
        connection(["free"]);
      }
      navigation.navigate("Mapa");
      setIsRent(false);
    }
  };

  const connectionText = () => {
    if (!connectedDevice || !connectedDevice.name?.includes("Parasunflower")) {
      return <></>;
    } else {
      return <Text>O bluetooth do Parasunflower está desconectado</Text>;
    }
  };

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const connection = (messages?: string[]) => {
    scanForDevices();
    allDevices.forEach((device) => {
      if (device.name?.includes("Parasunflower")) {
        if (messages) {
          connectToDevice(device, messages);
        } else {
          connectToDevice(device);
        }
      }
    });
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
              disabled={!isRent}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Button
              style={{ flex: 1 }}
              onPress={handleButton2Press}
              title="Rot. esquerda"
              disabled={!isRent}
            />
            <Button
              style={{ flex: 1 }}
              onPress={handleButton3Press}
              title="Rot. direita"
              disabled={!isRent}
            />
          </View>
          <View>
            <Button
              onPress={handleButton4Press}
              title="Inclinar para baixo"
              disabled={!isRent}
            />
            <Button
              onPress={handleSwitchPress}
              title={option === 1 ? "Auto" : "Manual"}
              disabled={!isRent}
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
              disabled={!isRent}
            />
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {renderMenu()}
      <View style={styles.container}>
        <Button onPress={handleAddTimePress} title={"Adicione mais tempo"} />
        <Button
          onPress={
            connectedDevice
              ? () => {
                  disconnectFromDevice();
                }
              : () => {
                  connection(["rent", store.endTime.toDateString()]);
                  setIsRent(true);
                }
          }
          title={
            connectedDevice ? "Desconectar Bluetooth" : "Conectar Bluetooth"
          }
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
});

export default TimeRemainingAndControls;
