import React, { useEffect, useState } from "react";
import {View,Text,FlatList,Image,TouchableOpacity,ActivityIndicator,StyleSheet,} from "react-native";
import { searchMovies } from "../services/api"; 

export default function BusquedaResultados({ route, navigation }: any) {
  const { query } = route.params; // palabra que escribió el usuario
  const [resultados, setResultados] = useState<any[]>([]);//guarda las películas encontradas según la búsqueda del usuario.
  const [cargando, setCargando] = useState(true);//- cargando: indica si la app está esperando la respuesta de la API.

  useEffect(() => {
    searchMovies(query)//- Al cargar la pantalla, se llama a searchMovies(query) para buscar películas que coincidan con el texto ingresado por el usuario.
      .then((data) => {
        if (data && Array.isArray(data.results)) {
          setResultados(data.results);//Si hay resultados válidos, se guardan en el resultadp.
        } else {
          setResultados([]);//Si ocurre un error o no hay resultados, se muestra una lista vacía
        }
      })
      .catch((err) => console.error("Error en búsqueda:", err))
      .finally(() => setCargando(false));//Al finalizar, se desactiva el estado de carga
  }, [query]);

  if (cargando) {//- Si cargando es true, se muestra un spinner de carga.
    return (
      <ActivityIndicator size="large" color="purple" style={{ flex: 1 }} />
    );
  }

  //Si no hay resultados, se muestra un mensaje indicando que no se encontraron coincidencias.
  //Si hay resultados, se muestra una lista en dos columnas con:Imagen del póster (o mensaje si no hay imagen).Título de la película, navegación a la pantalla de detalles al tocar la tarjeta.


  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Resultados para: {query}</Text>
      {resultados.length === 0 ? (
        <Text style={styles.noResultados}>No se encontraron resultados</Text>
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Detalles", { id: item.id })}
            >
              {item.poster_path ? (
                <Image
                  source={{
                    uri:`https://image.tmdb.org/t/p/w200${item.poster_path}`,
                  }}
                  style={styles.poster}
                />
              ) : (
                <View style={[styles.poster, styles.placeholder]}>
                  <Text style={styles.placeholderText}>Sin imagen</Text>
                </View>
              )}
              <Text style={styles.movieTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  noResultados: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 5,
    alignItems: "center",
  },
  poster: {
    width: 150,
    height: 220,
    borderRadius: 8,
  },
  placeholder: {
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { fontSize: 12, color: "#555" },
  movieTitle: {
    marginTop: 6,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
},
});
