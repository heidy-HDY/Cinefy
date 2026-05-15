import React, { useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

export default function Bienvenida({ navigation }: any) {
  useEffect(() => {
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      navigation.replace("Principal");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>

      {Platform.OS === "web" ? (
        // ================= WEB (NETLIFY) =================
        <LinearGradient
          colors={["#ff0004ff", "rgb(168, 34, 0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientWeb}
        >
          <Text style={styles.titleWeb}>Bienvenid@</Text>
          <Text style={styles.titleWeb}>a</Text>
          <Text style={styles.titleWeb}>Cinefy</Text>
        </LinearGradient>

      ) : (
        // ================= MOBILE (EXPO) =================
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
      )}

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

  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  // ===== MOBILE =====
  gradient: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },

  // ===== WEB (NETLIFY) =====
  gradientWeb: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 33,
    fontWeight: "bold",
    color: "black",
  },

  titleWeb: {
    fontSize: 33,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});