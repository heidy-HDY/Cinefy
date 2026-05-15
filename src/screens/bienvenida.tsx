import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

export default function Bienvenida({ navigation }: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Principal");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <View style={styles.center}>
            <Text style={styles.maskText}>Bienvenid@</Text>
            <Text style={styles.maskText}>a</Text>
            <Text style={styles.maskText}>Cinefy</Text>
          </View>
        }
      >
        <LinearGradient
          colors={["#ff0004", "rgb(168, 34, 0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {/* ESTE TEXTO DEBE SER INVISIBLE SIEMPRE */}
          <View style={styles.center}>
            <Text style={styles.hiddenText}>Bienvenid@</Text>
            <Text style={styles.hiddenText}>a</Text>
            <Text style={styles.hiddenText}>Cinefy</Text>
          </View>
        </LinearGradient>
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  maskedView: {
    width: 300,
    height: 200,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  gradient: {
    flex: 1,
  },

  maskText: {
    fontSize: 33,
    fontWeight: "bold",
    color: "white", // IMPORTANTE: máscara = blanco
    textAlign: "center",
  },

  hiddenText: {
    fontSize: 33,
    fontWeight: "bold",
    opacity: 0, // clave para evitar texto negro en web
  },
});