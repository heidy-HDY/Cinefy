import React, { useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

export default function Bienvenida({ navigation }: any) {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Principal");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  // ================= WEB =================
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <Text style={styles.webText}>Bienvenid@</Text>
        <Text style={styles.webText}>a</Text>
        <Text style={styles.webText}>Cinefy</Text>
      </View>
    );
  }

  // ================= MOBILE =================
  return (
    <View style={styles.container}>
      <MaskedView
        maskElement={
          <View style={styles.center}>
            <Text style={styles.mobileText}>Bienvenid@</Text>
            <Text style={styles.mobileText}>a</Text>
            <Text style={styles.mobileText}>Cinefy</Text>
          </View>
        }
      >
        <LinearGradient
          colors={["#ff0004", "rgb(168, 34, 0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  gradient: {
    width: 320,
    height: 180,
  },

  mobileText: {
    fontSize: 38,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },

  // ===== WEB gradient text =====
  webText: {
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",

    color: "transparent",

    backgroundImage:
      "linear-gradient(90deg, #ff0004, rgb(168, 34, 0))",

    backgroundClip: "text",

    WebkitBackgroundClip: "text",
  } as any,
});