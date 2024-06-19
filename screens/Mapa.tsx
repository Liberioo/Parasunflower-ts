import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ViewStyle, TextStyle } from "react-native";
import Button from "../components/Button";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackNavigatorParamsList } from "@/app";
import useStore from "@/store";

interface MapaProps {}

const Mapa: React.FC<MapaProps> = () => {
  const store = useStore();
  const navigation =
    useNavigation<StackNavigationProp<RootStackNavigatorParamsList>>();
  const [location, setLocation] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapRegion, setRegion] = useState<Region | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [parasolLocations, setParasolLocations] = useState<
    Array<[number, number]>
  >([]);
  const latDelta = 0.0922;
  const longDelta = 0.0421;
  useEffect(() => {
    const getUserLocationAsync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation("Permission to access location was denied");
        setErrorMsg("Permission to access location was denied");
        return;
      }
      try {
        let {
          coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({});
        setLocation(JSON.stringify({ latitude, longitude }));
        setLatitude(latitude);
        setLongitude(longitude);
        // Center the map on the location we just fetched.
        setRegion({
          latitude,
          longitude,
          latitudeDelta: latDelta,
          longitudeDelta: longDelta,
        });
      } catch (error) {
        console.error(error);
      }
    };
    const getParasolLocationsFromApiAsync = async () => {
      try {
        const response = await fetch(
          "http://18.191.166.173/api/get_parasuns_positions"
        );
        const json = await response.json();
        setParasolLocations(
          json.map((item: { latitude: number; longitude: number }) => [
            item.latitude,
            item.longitude,
          ])
        );
      } catch (error) {
        console.error(error);
      }
    };
    getUserLocationAsync();
    getParasolLocationsFromApiAsync();
  }, []);
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={true}
        showsUserLocation={true}
        initialRegion={mapRegion ?? undefined}
        onRegionChange={(region) => setRegion(region)}
      >
        {parasolLocations.map((item, index) => (
          <Marker
            title="Guarda-sol"
            description="Esse guarda-sol está disponível."
            coordinate={{ latitude: item[0], longitude: item[1] }}
            key={index}
          />
        ))}
      </MapView>
      <Text style={styles.text}>
        Caso já tenha nos achado, basta ler o QR code localizado no guarda-sol!
      </Text>
      <Button
        onPress={() => navigation.navigate("Ler QR Code")}
        title="Ler QR Code"
      />
      <Button
        title={"Ir para controles"}
        onPress={() => navigation.navigate("Tempo restante e controles")}
        hidden={!store.isRent}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  text: {
    textAlign: "center",
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
    marginRight: 5,
  } as TextStyle,
  map: {
    width: "80%",
    height: "70%",
    paddingBottom: 10,
  } as ViewStyle,
});

export default Mapa;
