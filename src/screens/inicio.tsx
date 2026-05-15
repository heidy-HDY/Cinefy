import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from "react-native";

import Input from "../components/input";

import { auth } from "../../firebaseConfig";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function Inicio({ navigation }: any) {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // ===== ALERTA COMPATIBLE WEB + MOBILE =====
  const mostrarAlerta = (titulo: string, mensaje: string) => {

    if (Platform.OS === "web") {

      window.alert(`${titulo}\n\n${mensaje}`);

    } else {

      Alert.alert(titulo, mensaje);

    }
  };

  // ===== LOGIN =====
  const handleLogin = async () => {

    let newErrors: any = {};

    if (!email) newErrors.email = "El correo es obligatorio";

    if (!password)
      newErrors.password = "La contraseña es obligatoria";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigation.navigate("Bienvenida");

    } catch (error: any) {

      console.log(error.code);

      if (error.code === "auth/user-not-found") {

        mostrarAlerta(
          "Error",
          "El usuario no existe"
        );

      } else if (
        error.code === "auth/wrong-password"
      ) {

        mostrarAlerta(
          "Error",
          "Contraseña incorrecta"
        );

      } else if (
        error.code === "auth/invalid-email"
      ) {

        mostrarAlerta(
          "Error",
          "Correo inválido"
        );

      } else if (
        error.code === "auth/invalid-credential"
      ) {

        mostrarAlerta(
          "Error",
          "Correo o contraseña incorrectos"
        );

      } else {

        mostrarAlerta(
          "Error",
          "Correo o contraseña incorrecta."
        );
      }
    }
  };

  // ===== RECUPERAR CONTRASEÑA =====
  const handleResetPassword = async () => {

    if (!email) {

      mostrarAlerta(
        "Atención",
        "Por favor ingresa tu correo primero."
      );

      return;
    }

    try {

      await sendPasswordResetEmail(auth, email);

      mostrarAlerta(
        "Éxito",
        "Te enviamos un enlace a tu correo para restablecer tu contraseña, revisa la bandeja principal o Spam."
      );

    } catch (error: any) {

      console.log(error.code);

      if (error.code === "auth/invalid-email") {

        mostrarAlerta(
          "Error",
          "Correo inválido."
        );

      } else if (
        error.code === "auth/user-not-found"
      ) {

        mostrarAlerta(
          "Error",
          "No existe una cuenta con este correo."
        );

      } else {

        mostrarAlerta(
          "Error",
          "No se pudo enviar el correo de recuperación."
        );
      }
    }
  };

  return (
    <View style={styles.container}>

      <Image
        source={require("../../assets/logo3.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        Iniciar Sesión
      </Text>

      <Input
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {errors.email ? (
        <Text style={styles.error}>
          {errors.email}
        </Text>
      ) : null}

      <Input
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {errors.password ? (
        <Text style={styles.error}>
          {errors.password}
        </Text>
      ) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          Ingresar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleResetPassword}
      >
        <Text style={styles.forgotPassword}>
          ¿Olvidaste tu contraseña?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Registro")
        }
      >
        <Text style={styles.link}>
          ¿No tienes cuenta? Regístrate aquí
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
    backgroundColor: "#fff",
  },

  logo: {
    width: 310,
    height: 310,
    marginBottom: -40,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    marginBottom: 15,
    width: "100%",
  },

  button: {
    backgroundColor: "#ba1717ff",
    padding: 13,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  link: {
    color: "#007BFF",
    marginTop: 12,
    fontSize: 14,
  },

  error: {
    color: "red",
    fontSize: 14,
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginBottom: 5,
  },

  forgotPassword: {
    color: "#007BFF",
    marginTop: 8,
    fontSize: 14,
  },

});