//- Se importan los módulos necesarios para construir la interfaz (View, Text, Image, StyleSheet),Se importa un botón personalizado llamado BotonGeneral,Se usa MaskedView y LinearGradient para aplicar un efecto de degradado sobre el texto.

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import BotonGeneral from "../components/botonGeneral"; // importa tu componente
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";


export default function Principal({ navigation }:any) {//- Se define el componente Principal, 
// que recibe navigation para poder cambiar de pantalla.
   console.log("navigation state:", navigation.getState());
  return (
    <View style={styles.container}>
        <Image
          source={require("../../assets/collage.jpg")}
          style={styles.image}
        />

       <MaskedView
              maskElement={
                <View style={styles.center}>
                  <Text style={styles.title}>Todo sobre tus peliculas</Text>
                  <Text style={styles.title}>favoritas en un solo lugar.</Text>
                </View>
              }
            >
              <LinearGradient
                colors={["#ff0004ff", "#bd2b06ff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              >
                <View style={styles.center}>
                  <Text style={[styles.title, { opacity: 0 }]}>Todo sobre tus peliculas</Text>
                  <Text style={[styles.title, { opacity: 0 }]}>favoritas en un solo lugar.</Text>
                </View>
              </LinearGradient>
        </MaskedView>
        <View style={styles.boton}>
             <BotonGeneral title="Descubrir" onPress={() =>  navigation.navigate("Tabs")}/>
        </View>
        
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffffff",
    padding: 20,
  },
  image: {
    width: "150%",
    height: 270,
    marginBottom: 30,
    resizeMode: "cover",
    top:-45,
  },
  center: {
        justifyContent: "center",
        alignItems: "center",
    },
  title: {
        fontSize: 24,
        color: "black", 
        textAlign:"center",
    },
  gradient: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  boton:{
    top:-150,
  }
});

