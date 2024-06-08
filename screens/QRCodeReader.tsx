import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ViewStyle,
  TextStyle,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import useStore from "../store";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackNavigatorParamsList } from "@/app";

interface QRCodeReaderProps {}

const QRCodeReader: React.FC<QRCodeReaderProps> = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackNavigatorParamsList>>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const store = useStore();

  const goToTimeOptions = () => {
    navigation.navigate("Seleção de Tempo");
  };

  useEffect(() => {
    const requestBarCodeScannerPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };
    requestBarCodeScannerPermission();
  }, []);

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    store.setQRCodeData(data);
    goToTimeOptions();
  };

  const renderCamera = () => {
    return (
      <>
        <View style={styles.cameraContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.camera}
          />
        </View>
      </>
    );
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Escaneie o QR Code localizado no guarda-sol
      </Text>
      {renderCamera()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  } as TextStyle,
  paragraph: {
    fontSize: 16,
    marginBottom: 40,
  } as TextStyle,
  cameraContainer: {
    width: "80%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 10,
    marginBottom: 40,
  } as ViewStyle,
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: "blue",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  } as ViewStyle,
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  } as TextStyle,
});

export default QRCodeReader;
