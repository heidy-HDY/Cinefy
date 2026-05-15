//-Se importan los módulos necesarios para crear la interfaz, aplicar estilos, usar efectos secundarios (useEffect) y aplicar una máscara con degradado.

import React, { useEffect } from "react";
import { View, Text, StyleSheet} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";



export default function Bienvenida({navigation}:any) {
  useEffect(() => {
    //- Al cargar la pantalla, se inicia un temporizador de 2 segundos,Luego redirige automáticamente a la pantalla "Principal",Se limpia el temporizador si el componente se desmonta antes de tiempo.

    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      navigation.replace("Principal");
    }, 2000);
    return () => clearTimeout(timer);
  },[navigation]);

  return (

    //Se muestra un texto con efecto de degradado usando MaskedView y LinearGradient.
    <View style={styles.container}>
      <MaskedView
        maskElement={
          <View style={styles.center}>
            <Text style={styles.title}>Bienvenid@</Text>
            <Text style={styles.title}>a</Text>
            <Text style={styles.title}>Cinefy</Text>
          </View>
        }
      >
        <LinearGradient
          colors={["#ff0004ff", "rgb(168, 34, 0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          
          <View style={styles.center}>
            <Text style={[styles.title, { opacity: 0 }]}>Bienvenid@</Text>
            <Text style={[styles.title, { opacity: 0 }]}>a</Text>
            <Text style={[styles.title, { opacity: 0 }]}>Cinefy</Text>
          </View>
        </LinearGradient>
      </MaskedView>
      
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 290,
    backgroundColor: "#fff",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 33,
    fontWeight: "bold",
    color: "black", 
  },
  gradient: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
});
