import { View, Text, StyleSheet } from "react-native";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackNavigatorParamsList } from "@/app";

interface HomeProps {}

const HomeScreen: React.FC<HomeProps> = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackNavigatorParamsList>>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parasunflower</Text>
      <View>
        <Button
          onPress={() => navigation.navigate("Seleção de Tempo")}
          title="Time Option Menu"
        />
        <Button
          onPress={() => navigation.navigate("Adição de Tempo")}
          title="Add Time Menu"
        />
        <Button onPress={() => navigation.navigate("Mapa")} title="Nos Ache!" />
        <Button
          onPress={() => navigation.navigate("Tempo restante e controles")}
          title="Time Remaining/Controls Menu"
        />
        <Button
          onPress={() => navigation.navigate("Mapa")}
          title="Normal Flow"
        />
      </View>
    </View>
  );
};

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
});

export default HomeScreen;
