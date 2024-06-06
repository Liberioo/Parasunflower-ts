// import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";
// import HomeScreen from "../screens/HomeScreen";
// import TimeOptions from "../screens/TimeOptions";
// import Mapa from "../screens/Mapa";
// import AddTime from "../screens/AddTime";
// import TimeRemainingAndControls from "../screens/TimeRemainingAndControls";
// import PIXRequest from "../screens/PIXRequest";
// import PIXResponse from "../screens/PIXResponse";
// import QRCodeReader from "../screens/QRCodeReader";
// // import useBLE from './useBLE';

// export type RootStackNavigatorParamsList = {
//   Home: undefined;
//   "Seleção de Carga": undefined;
//   "Adição de Tempo": undefined;
//   "Seleção de Tempo": undefined;
//   Mapa: undefined;
//   "Tempo restante e controles": undefined;
//   "Ler QR Code": undefined;
//   "PIX Request": undefined;
//   "PIX Response": undefined;
// };

// const Stack = createStackNavigator<RootStackNavigatorParamsList>();

// export default function App() {
//   return (
//     <NavigationContainer independent={true}>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="Adição de Tempo" component={AddTime} />
//         <Stack.Screen name="Seleção de Tempo" component={TimeOptions} />
//         <Stack.Screen name="Mapa" component={Mapa} />
//         <Stack.Screen
//           name="Tempo restante e controles"
//           component={TimeRemainingAndControls}
//         />
//         <Stack.Screen name="Ler QR Code" component={QRCodeReader} />
//         <Stack.Screen name="PIX Request" component={PIXRequest} />
//         <Stack.Screen name="PIX Response" component={PIXResponse} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeviceModal from "../DeviceConnectionModal";
// import { PulseIndicator } from "./PulseIndicator";
import useBLE from "../useBLE";

const App = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    endTime,
    // disconnectFromDevice,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <Text style={styles.heartRateTitleText}>Your Heart Rate Is:</Text>
            <Text style={styles.heartRateText}>{-1} bpm</Text>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please Connect to a Heart Rate Monitor
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={openModal} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>{"Connect"}</Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default App;
