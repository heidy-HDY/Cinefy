import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Principal from "../screens/principal";
import Detalles from "../screens/detalles";
import TabsNavigator from "./tabNavigation"; // aquí están Informacion, Favoritos y Usuario
import BusquedaResultados from "../screens/BusquedaResultados";
const Stack = createNativeStackNavigator();//const Stack Crea una instancia del Stack Navigator que se usará para definir las rutas

export default function AppNavigator() {//Define y exporta el componente AppNavigator, que será usado para manejar la navegación principal de la app.
  return (
    //Crea el contenedor de navegación tipo stack, y define que la pantalla inicial será Principal.
    <Stack.Navigator initialRouteName="Principal">
      <Stack.Screen name="Principal" component={Principal} options={{ headerShown: false }} />
      <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Detalles" component={Detalles} options={{ headerShown: true, title: "Detalles" }} />
      <Stack.Screen name="BusquedaResultados" component={BusquedaResultados}/>
  </Stack.Navigator>
    );

  // se define cómo se navega entre las pantallas, qué pantalla se muestra primero, y cómo se ven. 
  // Es la columna vertebral de la navegación.

}
