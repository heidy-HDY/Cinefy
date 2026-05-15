import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // 👈 iconos bonitos
import Informacion from "../screens/informacion";
import Favoritos from "../screens/Favoritos";
import Usuario from "../screens/ajustesUsuario";

const Tab = createBottomTabNavigator();

//componente TabsNavigator crea una barra de navegación inferior en tu aplicación móvil,
//  que permite al usuario moverse fácilmente entre diferentes secciones tocando íconos.

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Informacion"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#e91e1eff",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Informacion") {
            iconName = "home";
          } else if (route.name === "Favoritos") {
            iconName = "heart";
          } else if (route.name === "Usuario") {
            iconName = "person";
          } else {
            iconName = "help"; // 👈 ícono por defecto para evitar errores
          }


          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Casita que lleva a información */}
      <Tab.Screen name="Informacion" component={Informacion} />

      {/* ❤ Favoritos */}
      <Tab.Screen name="Favoritos" component={Favoritos} />

      {/* 👤 Usuario */}
      <Tab.Screen name="Usuario" component={Usuario} />

    </Tab.Navigator>
    );
}


