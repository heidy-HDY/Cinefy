//- Importa React y funciones para manejar estado (useState) y efectos (useEffect), Importa componentes visuales de React Native, Importa Firebase para acceder al usuario actual (auth), la base de datos (db) y cerrar sesión

import React, { useEffect, useState } from "react";
import {View,Text,Image,StyleSheet,ActivityIndicator,TouchableOpacity,} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function Ajustes({ navigation }: any) {
  const [usuario, setUsuario] = useState<any>(null);//- usuario: guarda los datos del usuario desde Firestore.
  const [loading, setLoading] = useState(true);//- loading: controla si se está cargando la información.
  useEffect(() => {
    const cargarDatos = async () => {
      const user = auth.currentUser;//obtiene el usuario que está actualmente autenticado en Firebase.
      if (user) { //verfica q si haya un usuario autenticado
        try {
          const docRef = doc(db, "usuarios", user.uid);
          const docSnap = await getDoc(docRef);//obtiene los datos del documento del usuario desde Firestore.
          if (docSnap.exists()) {
            setUsuario(docSnap.data());//- Verifica si el documento existe.Si existe, guarda los datos del usuario en el estado usuario usando setUsuario.

          } else {
            console.log("No se encontró el documento del usuario.");
          }
        } catch (error) {
          console.log("Error al obtener datos del usuario:", error);
        }
      }
      setLoading(false);//- Después de intentar cargar los datos, se cambia loading a false para indicar que ya terminó la carga.
    };

    cargarDatos();//- se ejecuta inmediatamente dentro del useEffect.
  }, []);


  //Cierra la sesión del usuario actual,Redirige a la pantalla de inicio.

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Inicio");
    } catch (error) {
      console.log("❌ Error al cerrar sesión:", error);
    }
  };

  //Si los datos aún se están cargando, muestra un spinner de carga.

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2261ffff" />
      </View>
    );
  }

  //Convierte la fecha de creación del usuario en un formato legible.

  const fechaRegistro = usuario?.creado
    ? new Date(usuario.creado.seconds * 1000).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Sin fecha";


    //El renderizado Muestra el avatar, nombre, correo, descripción, fecha de registro y el botón para cerrar sesión.

    return (
      <View style={styles.container}>
        <Image source={require("../../assets/siluetaU.jpg")} style={styles.avatar} />
        <Text style={styles.nombre}>{usuario?.nombre || "Sin nombre"}</Text>
        <Text style={styles.email}>{auth.currentUser?.email}</Text>
        <Text style={styles.descripcion}>
        <Text style={{ fontWeight: "bold" }}>Descripción: </Text>
          {usuario?.descripcion || "Sin descripción"}
        </Text>
        <Text style={styles.fecha}>Registrado el: {fechaRegistro}</Text>

        <TouchableOpacity style={styles.botonCerrar} onPress={cerrarSesion}>
          <Text style={styles.botonTexto}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#007bff",
    backgroundColor: "#e9ecef",
  },
  nombre: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#343a40",
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
    fontWeight:"bold",
  },
  descripcion: {
    fontSize: 14,
    color: "#8e8e8eff",
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    fontWeight:"bold",
  },
  fecha: {
    fontSize: 12,
    color: "#8e8e8eff",
    marginTop: 10,
    fontWeight:"bold",
  },
  botonCerrar: {
    marginTop: 20,
    backgroundColor: "#ba1717ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});