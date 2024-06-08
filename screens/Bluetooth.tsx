import React from "react";
import { Text, View } from "react-native";
import DeviceModal from "../components/DeviceConnectionModal";
import useBLE from "../useBLE";

const Bluetooth = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
  } = useBLE();

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  return (
    <View>
      <Text>Por favor se conecte com o guarda-sol</Text>
      <DeviceModal connectToPeripheral={connectToDevice} devices={allDevices} />
    </View>
  );
};

export default Bluetooth;
