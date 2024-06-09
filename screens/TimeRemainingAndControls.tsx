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
  const [flag, setFLag] = useState<boolean>(false);
  const [change, setChange] = useState<number>(0);

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
          connectToDevice(device);
          setFLag(true);
        }
      });
    }
  }, [change]);

  const store = useStore();
  const seconds = Math.floor(
    store.endTime.getTime() / 1000 - new Date().getTime() / 1000
  );

  const handleButton1Press = () => {
    if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
      send(connectedDevice, "up");
    } else {
      setFLag(false);
      setChange(change + 1);
    }
  };

  const handleButton2Press = () => {
    if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
      send(connectedDevice, "left");
    } else {
      setFLag(false);
      setChange(change + 1);
    }
  };

  const handleButton3Press = () => {
    if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
      send(connectedDevice, "right");
    } else {
      setFLag(false);
      setChange(change + 1);
    }
  };

  const handleButton4Press = () => {
    if (connectedDevice && connectedDevice.name?.includes("Parasunflower")) {
      send(connectedDevice, "down");
    } else {
      setFLag(false);
      setChange(change + 1);
    }
  };

  const handleResetPress = () => {
    // TODO: remover
    navigation.navigate("Home");
    store.clearTime();
    store.clearPrice();
  };

  const handleSwitchPress = () => {
    if (connectedDevice) {
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
    if (sec === 0) {
      navigation.navigate("Mapa");
    }
  };

  const connectionText = () => {
    if (flag) {
      return <></>;
    } else {
      return <Text>O bluetooth do Parasunflower está desconectado</Text>;
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
            <Button onPress={handleButton1Press} title="Inclinar para cima" />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Button
              style={{ flex: 1 }}
              onPress={handleButton2Press}
              title="Rot. esquerda"
            />
            <Button
              style={{ flex: 1 }}
              onPress={handleButton3Press}
              title="Rot. direita"
            />
          </View>
          <View>
            <Button onPress={handleButton4Press} title="Inclinar para baixo" />
            <Button
              onPress={handleSwitchPress}
              title={option === 1 ? "Auto" : "Manual"}
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
            flag
              ? () => {
                  disconnectFromDevice();
                  setFLag(false);
                }
              : () => {
                  setChange(change + 1);
                }
          }
          title={flag ? "Desconectar Bluetooth" : "Conectar Bluetooth"}
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
