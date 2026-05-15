// components/Input.tsx
import React from "react";
import { TextInput, StyleSheet, View, Text, KeyboardTypeOptions, TextStyle } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  style?: TextStyle;
  showError?: boolean;
  errorMessage?: string;   // 👈 nuevo
};

export default function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  style,
  showError,
  errorMessage,
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          style,
          showError? styles.errorInput:null,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor="#888888ff"
      />
      {showError && errorMessage &&(
        <Text style={styles.errorText}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "80%",
    marginBottom: -2,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop:4,
  },
});
