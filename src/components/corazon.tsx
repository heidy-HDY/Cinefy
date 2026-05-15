// components/CorazonFavorito.tsx
import React from "react";
import { Text, TouchableOpacity } from "react-native";

export default function CorazonFavorito({
  activo,
  onPress,
  tamaño = 18,
}: {
  activo: boolean;
  onPress: () => void;
  tamaño?: number;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={{ fontSize: tamaño }}>
        {activo ? "❤️" : "🤍"}
      </Text>
    </TouchableOpacity>
  );
}
