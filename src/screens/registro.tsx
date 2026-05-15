//importacion de interfas react,componentes y configuracion del firebase 
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import Input from "../components/input";
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Registro({ navigation }: any) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [errors, setErrors] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    let newErrors: any = {};

    if (!nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!email) newErrors.email = "El correo es obligatorio";
    if (!password) newErrors.password = "La contraseña es obligatoria";
    if (password.length > 0 && password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        nombre,
        email,
        descripcion,
        creado: new Date(),
      });

      // 🔥 TU CÓDIGO ORIGINAL DE ALERTA
      Alert.alert("Éxito", "Usuario registrado con éxito 🎉");

      navigation.navigate("Inicio");

    } catch (error: any) {
      console.log("❌ Error:", error.code, error.message);

      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "Este correo ya está registrado");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "El correo no es válido");
      } else {
        Alert.alert("Error", "No se pudo registrar el usuario");
      }
    }
  };

  const cancelar = () => {
    navigation.navigate("Inicio");
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo3.png")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Registro</Text>

      <Input placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
      {errors.nombre ? <Text style={styles.error}>{errors.nombre}</Text> : null}

      <Input
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

      <Input
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2} onPress={cancelar}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  logo: {
    width: 220,
    height: 220,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },

  input: {
    marginBottom: 12,
    width: "100%",
  },

  error: {
    color: "red",
    marginBottom: 10,
    width: "100%",
    paddingLeft: 10,
  },

  button: {
    backgroundColor: "#ba1717ff",
    padding: 13,
    borderRadius: 8,
    width: "60%",
    alignItems: "center",
    marginTop: 15,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  button2: {
    backgroundColor: "rgb(166, 161, 161)",
    padding: 13,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    marginTop: 10,
  },
});