//importacion de componentes y configuracion del firebase 
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import Input from "../components/input";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

//creacion de la funcion 
// email y password: almacenan lo que el usuario escribe.
//errors: guarda mensajes de error si los campos están vacíos o hay problemas al iniciar sesión.

export default function Inicio({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {//- Valida que los campos no estén vacíos,permite iniciar sesión con Firebase, Muestra alertas si hay errores.

    let newErrors: any = {};
    if (!email) newErrors.email = "El correo es obligatorio";
    if (!password) newErrors.password = "La contraseña es obligatoria";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Bienvenida");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "El usuario no existe");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Contraseña incorrecta");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Correo inválido");
      } else {
        Alert.alert("Error", "Correo o contraseña incorrecta.");
      }
    }
  };

  const handleResetPassword = async () => {//- Envía un correo de recuperación si el usuario lo solicita,Muestra alertas según el tipo de error.

    if (!email) {
      Alert.alert("Atención", "Por favor ingresa tu correo primero.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Éxito", "Te enviamos un enlace a tu correo para restablecer tu contraseña.");
    } catch (error: any) {
      if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Correo inválido.");
      } else if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "No existe una cuenta con este correo.");
      } else {
        Alert.alert("Error", "No se pudo enviar el correo de recuperación.");
      }
    }
  };

  //Muestra el logo, título, campos de entrada, botón de ingreso, enlace para recuperar contraseña y enlace para registrarse.

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo3.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Iniciar Sesión</Text>

      <Input
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

      <Input
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResetPassword}>
        <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate aquí</Text>
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

