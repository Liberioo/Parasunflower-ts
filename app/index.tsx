import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import TimeOptions from "../screens/TimeOptions";
import Mapa from "../screens/Mapa";
import AddTime from "../screens/AddTime";
import TimeRemainingAndControls from "../screens/TimeRemainingAndControls";
import PIXRequest from "../screens/PIXRequest";
import PIXResponse from "../screens/PIXResponse";
import QRCodeReader from "../screens/QRCodeReader";
import Bluetooth from "@/screens/Bluetooth";
import useStore from "@/store";
// import useBLE from './useBLE';

export type RootStackNavigatorParamsList = {
  Home: undefined;
  "Seleção de Carga": undefined;
  "Adição de Tempo": undefined;
  "Seleção de Tempo": undefined;
  Mapa: undefined;
  "Tempo restante e controles": undefined;
  "Ler QR Code": undefined;
  "PIX Request": undefined;
  "PIX Response": undefined;
  Bluetooth: undefined;
};

const Stack = createStackNavigator<RootStackNavigatorParamsList>();

export default function App() {
  const store = useStore();
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName={store.isRent ? "Tempo restante e controles" : "Mapa"}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Adição de Tempo" component={AddTime} />
        <Stack.Screen name="Seleção de Tempo" component={TimeOptions} />
        <Stack.Screen name="Mapa" component={Mapa} />
        <Stack.Screen
          name="Tempo restante e controles"
          component={TimeRemainingAndControls}
        />
        <Stack.Screen name="Ler QR Code" component={QRCodeReader} />
        <Stack.Screen name="PIX Request" component={PIXRequest} />
        <Stack.Screen name="PIX Response" component={PIXResponse} />
        <Stack.Screen name="Bluetooth" component={Bluetooth} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
