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

  const Title = () => (
    <View style={styles.textContainer}>
      <Text style={styles.text}>Bienvenid@</Text>
      <Text style={styles.text}>a</Text>
      <Text style={styles.text}>Cinefy</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <MaskedView
        maskElement={<Title />}
      >
        <LinearGradient
          colors={["#ff0004", "rgb(168, 34, 0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {/* Invisible text to define mask size */}
          <Title />
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

  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 33,
    fontWeight: "bold",
    color: "black",
  },

  gradient: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});