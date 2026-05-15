import React, { useEffect, useState } from "react";
import {View,Text,FlatList,TouchableOpacity,Image,ActivityIndicator,StyleSheet} from "react-native";
import { getUpcoming } from "../services/api";
import BotonVer from "../components/botonVer";

export default function Estrenos({ navigation }: any) {
  const [estrenos, setEstrenos] = useState<any[]>([]);//- estrenos: guarda la lista de películas próximas a estrenarse.
  const [cargando, setCargando] = useState(true);//cargando: controla si se está esperando la respuesta de la API.

  useEffect(() => {
    getUpcoming("CO")//- Al cargar la pantalla, se llama a getUpcoming("CO") para obtener películas próximas a estrenarse en Colombia.
      .then((data) => {
        if (!data || !Array.isArray(data.results)) {
          console.warn("No se recibieron estrenos válidos");
          setEstrenos([]);
          return;
        }
        setEstrenos(data.results);//Si los datos son válidos, se guardan en el estado estrenos.

      })
      .catch((error) => {
        console.error("Error al obtener estrenos:", error);
      })
      .finally(() => {
        setCargando(false); //Al final, se desactiva el estado de carga
      });
  }, []);

  if (cargando) {//Mientras se espera la respuesta de la API, se muestra un spinner de carga.
    return <ActivityIndicator size="large" color="purple" style={{ flex: 1 }} />;
  }

  return (
    //- Se muestra una lista en dos columnas con tarjetas de películas.
    //Cada tarjeta incluye:
    //Imagen del póster (o mensaje si no hay imagen).
    //Título de la película.
    //Fecha de estreno.
    //Botón “Ver” que lleva a la pantalla de detalles.

    <View style={styles.screen}>
      <FlatList
        data={estrenos}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Detalles", { id: item.id })}
              style={styles.imageContainer}
            >
              {item.poster_path ? (
                <Image
                  source={{ uri:`https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                  style={styles.posterImage}
                />
              ) : (
                <View style={[styles.posterImage, styles.imagePlaceholder]}>
                  <Text style={styles.placeholderText}>Sin imagen</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.cardFooter}>
              <Text style={styles.movieTitle} numberOfLines={1} ellipsizeMode="tail">
                {item.title}
              </Text>
              <Text style={styles.fecha}>{item.release_date}</Text>
              <BotonVer
                title="Ver"
                onPress={() => navigation.navigate("Detalles", { id: item.id })}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    maxWidth: "48%",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  posterImage: {
    width: "100%",
    height: 220,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  imagePlaceholder: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    height: 220,
  },
  placeholderText: {
    textAlign: "center",
    fontSize: 12,
    color: "#555",
  },
  cardFooter: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: "space-between",
    alignItems: "center",
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  fecha: {
    fontSize: 12,
    color: "#555",
    marginTop:4,
},
});
