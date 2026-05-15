import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Bienvenida from "../screens/bienvenida";

const Tab = createBottomTabNavigator();

export default function BarraNavegacion() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => {
          let iconSource;

          if (route.name === "Inicio") {
            iconSource = require("../../assets/casa.jpg");
          } else if (route.name === "Favoritos") {
            iconSource = require("../../assets/corazon.png");
          } else if (route.name === "Ajustes") {
            iconSource = require("../../assets/usuario.png");
          }

          return (
            <Image
              source={iconSource}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          );
        },
        tabBarShowLabel: true,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={Bienvenida} />
      <Tab.Screen name="Favoritos" component={Bienvenida} />
      <Tab.Screen name="Ajustes" component={Bienvenida} />
    </Tab.Navigator>
  );
}