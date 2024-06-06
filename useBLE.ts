/* eslint-disable no-bitwise */

import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {BleError, BleManager, Characteristic, Device} from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";

const ESP_UUID = "";
const ESP_CHARACTERISTIC = "";

interface BluetoothLowEnergyApi {
    requestPermissions(): Promise<boolean>;
    scanForPeripherals(): void;
    allDevices: Device[];
    connectToDevice: (deviceId: Device) => Promise<void>;
    connectedDevice: Device | null;
    endTime: Date;
}

function useBLE(): BluetoothLowEnergyApi {
    const bleManager = useMemo(() => new BleManager(), [])

    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null)
    const [endTime, setEndTime] = useState<Date>(new Date());

    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: "Permissão para escanear",
                message: "Aplicativo requere escaneamento Bluetooth",
                buttonPositive: "OK",
            }
        )
        const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: "Permissão para conectar",
                message: "Aplicativo requere conexão Bluetooth",
                buttonPositive: "OK",
            }
        )
        const bluetoothFineLocationPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Localização",
                message: "Aplicativo requere acesso à localização",
                buttonPositive: "OK",
            }
        )

        return (
            bluetoothScanPermission === "granted" &&
            bluetoothConnectPermission === "granted" &&
            bluetoothFineLocationPermission === "granted"
        )
    }

    const requestPermissions = async () => {
        if(Platform.OS === "android"){
            if((ExpoDevice.platformApiLevel ?? -1) < 31) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Localização",
                        message: "Aplicativo requere acesso à localização",
                        buttonPositive: "OK",
                    }
                )

                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                const isAndroid31PermissionGranted = await requestAndroid31Permissions();
                return isAndroid31PermissionGranted;
            }
        } else {
            return true;
        }
    }

    const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex((device) => nextDevice.id === device.id) > -1;

    const scanForPeripherals = () => {
        bleManager.startDeviceScan(null, null, (error, device) => {
            if(error){
                console.log(error);
            }
            if(device){ //if(device && device.name?.includes("Parasunflower")){
                setAllDevices((prevState) => {
                    if(!isDuplicateDevice(prevState, device)){
                        return [...prevState, device];
                    }
                    return prevState;
                })
            }
        })
    }

    const connectToDevice = async (device : Device) => {
        try{
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();
        } catch (e) {
            console.log("ERRO NA CONEXÃO", e);
        }
    }

    const onEndTimeUpdate = (
        error: BleError | null,
        characteristic: Characteristic | null
    ) => {
        if(error){
            console.log(error);
            return
        } else if(!characteristic?.value){
            console.log("No Data Received");
            return
        }

        const rawData = base64.decode(characteristic.value);
        let innerEndTime = new Date();

        const firstBitValue: number = Number(rawData) & 0x01;

        if(firstBitValue === 0){
            // innerEndTime = rawData[1].charCodeAt(0);
        } else {
            // innerEndTime = 
            // Number(rawData[1].charCodeAt(0) << 8) +
            // Number(rawData[2].charCodeAt(2));
        }
    }

    const startStreamingData = async (device: Device) => {
        if(device){
            device.monitorCharacteristicForService(
                ESP_UUID,
                ESP_CHARACTERISTIC,
                onEndTimeUpdate
            )
        } else {
            console.log("Nenhum dispositivo conectado")
        }
    }

    return {
        scanForPeripherals,
        requestPermissions,
        allDevices,
        connectToDevice,
        connectedDevice,
        endTime,
    }
}

export default useBLE;