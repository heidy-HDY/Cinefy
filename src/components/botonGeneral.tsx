import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  title:string;
  onPress: () => void;
};

export default function BotonGeneral({ title, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ba1717ff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    width: 133,   // 👈 aquí fijas un ancho igual para todos
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});