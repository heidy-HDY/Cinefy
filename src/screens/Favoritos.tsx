import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import CorazonFavorito from "../components/corazon"; // Componente de corazón agregado

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState<any[]>([]);//guarda la lista de películas marcadas como favoritas por el usuario.
  const [cargando, setCargando] = useState(true);//- cargando: controla si los datos están siendo cargados desde Firestore.

  const cargarFavoritos = async () => {
    const usuario = auth.currentUser;
    if (!usuario) return;
    //- Se consulta la colección favoritos en Firestore para obtener todas las películas guardadas por el usuario actual.
    try {
      const consulta = query(collection(db, "favoritos"), where("userId", "==", usuario.uid));
      const resultado = await getDocs(consulta);
      const lista = resultado.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavoritos(lista);//Se guarda la lista en el estado favoritos.

    } catch (error) {
      console.log("❌ Error al cargar favoritos:", error);
    }

    setCargando(false);
  };

  //Cada vez que el usuario entra a la pantalla de favoritos, se recargan los datos automáticamente.
  useFocusEffect(
    useCallback(() => {
      cargarFavoritos();
    }, [])
  );

  const eliminarTodos = async () => {
    //- Muestra una alerta de confirmación.
    //Si el usuario acepta, se eliminan todos los documentos de favoritos en Firestore.
    //Se actualiza el estado para reflejar que ya no hay favoritos.

    Alert.alert(
      "Eliminar todos",
      "¿Estás seguro de que quieres borrar todas tus películas favoritas?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const usuario = auth.currentUser;
            if (!usuario) return;

            try {
              const consulta = query(collection(db, "favoritos"), where("userId", "==", usuario.uid));
              const resultado = await getDocs(consulta);

              const eliminaciones = resultado.docs.map((docu) =>
                deleteDoc(doc(db, "favoritos", docu.id))
              );

              await Promise.all(eliminaciones);
              setFavoritos([]);
              alert("✅ Todos los favoritos han sido eliminados.");
            } catch (error) {
              console.log("❌ Error al eliminar favoritos:", error);
              alert("No se pudieron eliminar los favoritos.");
            }
          },
        },
      ]
    );
  };

  const eliminarFavorito = async (peliculaId: number) => {
    //- Elimina una película favorita individualmente al tocar el corazón.
    const usuario = auth.currentUser;
    if (!usuario) return;

    try {
      const q = query(
        collection(db, "favoritos"),
        where("userId", "==", usuario.uid),
        where("peliculaId", "==", peliculaId)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach((docu) => deleteDoc(doc(db, "favoritos", docu.id)));
      setFavoritos((prev) => prev.filter((item) => item.peliculaId !== peliculaId));
    } catch (error) {
      console.log("❌ Error al eliminar favorito:", error);
    }
  };

  if (cargando) {
    return (
      <SafeAreaView style={estilos.contenedor}>
        <ActivityIndicator size="large" color="#d10000" />
      </SafeAreaView>
    );
  }

  if (favoritos.length === 0) {
    return (
      <SafeAreaView style={estilos.contenedor}>
        <Text style={estilos.titulo}>Tus películas favoritas</Text>
        <Text style={estilos.mensajeVacio}>No has guardado ninguna película.</Text>
      </SafeAreaView>
    );
  }

  //Si cargando es true, se muestra un spinner.
  //Si no hay favoritos, se muestra un mensaje indicando que no hay películas guardadas.
  //Si hay favoritos, se muestra una lista en dos columnas con:
  //Imagen del póster.Título de la película.Botón para eliminar todos los favoritos.

  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={estilos.filaTitulo}>
        <Text style={estilos.titulo}>Tus películas favoritas</Text>
        <TouchableOpacity onPress={eliminarTodos}>
          <Text style={estilos.iconoEliminar}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={favoritos}
        keyExtractor={(item, index) => `${item.peliculaId}-${index}`}
        numColumns={2}
        contentContainerStyle={estilos.lista}
        columnWrapperStyle={estilos.fila}
        renderItem={({ item }) => (
          <View style={estilos.tarjeta}>
            {item.poster ? (
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster}` }}
                style={estilos.imagen}
              />
            ) : (
              <View style={[estilos.imagen, estilos.imagenVacia]}>
                <Text style={estilos.textoVacio}>Sin imagen</Text>
              </View>
            )}
            <Text style={estilos.nombrePelicula}>{item.titulo}</Text>
            <CorazonFavorito
              activo={true}
              onPress={() => eliminarFavorito(item.peliculaId)}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  filaTitulo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000ff",
  },
  iconoEliminar: {
    fontSize: 20,
    color: "#d10000",
  },
  mensajeVacio: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
    textAlign: "center",
  },
  lista: {
    paddingHorizontal: 12,
  },
  fila: {
    justifyContent: "space-between",
  },
  tarjeta: {
    flex: 1,
    margin: 8,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },
  imagen: {
    width: 140,
    height: 200,
    borderRadius: 10,
  },
  imagenVacia: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  textoVacio: {
    fontSize: 12,
    color: "#555",
  },
  nombrePelicula: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});