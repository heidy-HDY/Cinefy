/*import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Holi</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffa2e5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/inicio";
import RegisterScreen from "./src/screens/registro";
import Bienvenida from "./src/screens/bienvenida";
import Principal from "./src/screens/principal";
import Detalles from "./src/screens/detalles";
import Informacion from "./src/screens/informacion";
import Estrenos from "./src/screens/estrenos";
import VistaGenero from "./src/screens/vistaGenero";
import Favoritos from "./src/screens/Favoritos";
import Usuario from "./src/screens/ajustesUsuario";
import BusquedaResultados from "./src/screens/BusquedaResultados";
import TabsNavigator from "./src/navigation/tabNavigation"; 



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen name="Inicio" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegisterScreen} />
        <Stack.Screen name="Bienvenida" component={Bienvenida} />
        <Stack.Screen name="Principal" component={Principal} />
        <Stack.Screen name="Detalles" component={Detalles} />
        <Stack.Screen name="Informacion" component={Informacion} />
        <Stack.Screen name="Estrenos" component={Estrenos} />
        <Stack.Screen name="VistaGenero" component={VistaGenero}/>
        <Stack.Screen name="Favoritos" component={Favoritos}/>
        <Stack.Screen name="Usuario" component={Usuario}/>
        <Stack.Screen name="BusquedaResultados" component={BusquedaResultados}/>
        <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
