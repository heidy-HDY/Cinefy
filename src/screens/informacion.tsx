import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";

import { getNowPlaying } from "../services/api";
import BotonVer from "../components/botonVer";

export default function Informacion({ navigation }: any) {

  const [cartelera, setCartelera] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    getNowPlaying("CO")
      .then((data) => {

        const hoy = new Date();
        const hace30dias = new Date();
        hace30dias.setDate(hoy.getDate() - 30);

        if (!data || !Array.isArray(data.results)) {
          setCartelera([]);
          return;
        }

        const filtradas = data.results.filter((p: any) => {
          if (!p?.release_date) return false;
          const fecha = new Date(p.release_date);
          return fecha >= hace30dias && fecha <= hoy;
        });

        filtradas.push({ id: "boton-estrenos", tipo: "boton" });

        setCartelera(filtradas);
      })
      .catch((e) => console.log(e))
      .finally(() => setCargando(false));
  }, []);

  const generos = [
    { id: 35, titulo: "Comedia", imagen: require("../../assets/comedia.jpeg") },
    { id: 27, titulo: "Terror", imagen: require("../../assets/terror.jpg") },
    { id: 10749, titulo: "Romance", imagen: require("../../assets/romance.jpeg") },
    { id: 16, titulo: "Animación", imagen: require("../../assets/animada.avif") },
    { id: 28, titulo: "Acción", imagen: require("../../assets/accion.jpg") },
  ];

  if (cargando) {
    return <ActivityIndicator size="large" color="purple" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.screen}>

      {/* SEARCH */}
      <View style={styles.searchWrapper}>
        <Image source={require("../../assets/img2.png")} style={styles.profileIcon} />

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.inputBusqueda}
            placeholder="Buscar películas..."
            value={busqueda}
            onChangeText={setBusqueda}
            onSubmitEditing={() => {
              const texto = busqueda.trim();
              if (texto) {
                navigation.navigate("BusquedaResultados", { query: texto });
                setBusqueda("");
              }
            }}
          />

          <TouchableOpacity
            onPress={() => {
              const texto = busqueda.trim();
              if (texto) {
                navigation.navigate("BusquedaResultados", { query: texto });
                setBusqueda("");
              }
            }}
          >
            <Image source={require("../../assets/lupa.png")} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* CARTELERA */}
      <Text style={styles.header}>En cartelera</Text>

      <FlatList
        data={cartelera}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        renderItem={({ item }) => {

          if (item.tipo === "boton") {
            return (
              <TouchableOpacity
                style={styles.botonCard}
                onPress={() => navigation.navigate("Estrenos")}
              >
                <Text style={styles.estrenosText}>🚀 Ver próximos estrenos</Text>
              </TouchableOpacity>
            );
          }

          return (
            <View style={styles.card}>

              <TouchableOpacity
                onPress={() => navigation.navigate("Detalles", { id: item.id })}
              >
                {item.poster_path ? (
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                    style={styles.posterImage}
                  />
                ) : (
                  <View style={styles.posterImage}>
                    <Text>Sin imagen</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.cardFooter}>
                <Text style={styles.movieTitle} numberOfLines={1}>
                  {item.title}
                </Text>

                <Text style={styles.fecha}>
                  {item.release_date}
                </Text>

                <BotonVer
                  title="Ver"
                  onPress={() => navigation.navigate("Detalles", { id: item.id })}
                />
              </View>

            </View>
          );
        }}
      />

      {/* GENEROS */}
      <Text style={styles.header}>Sugerencias por género</Text>

      <FlatList
        data={generos}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.generoCard}
            onPress={() =>
              navigation.navigate("VistaGenero", {
                generoId: item.id,
                titulo: item.titulo,
              })
            }
          >
            <Image source={item.imagen} style={styles.generoImage} />
            <Text style={styles.generoTitulo}>{item.titulo}</Text>
          </TouchableOpacity>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    paddingVertical: 50,
    backgroundColor: "#fff",
  },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  profileIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    maxWidth: 300,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },

  inputBusqueda: {
    flex: 1,
    height: 40,
  },

  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#888",
  },

  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
    marginLeft: 12,
  },

  // CARTAS PELICULAS
  card: {
    width: 190,
    marginRight: 13,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },

  posterImage: {
    width: 190,
    height: 220,
  },

  cardFooter: {
    padding: 8,
    alignItems: "center",
  },

  movieTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  fecha: {
    fontSize: 12,
    color: "#555",
    marginBottom: 6,
  },

  botonCard: {
    width: 190,
    height: 220,
    marginRight: 12,
    backgroundColor: "#ba1717",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  estrenosText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  // GENEROS
  generoCard: {
    width: 160,
    height: 160,
    marginRight: 12,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    alignItems: "center",
  },

  generoImage: {
    width: 160,
    height: 100,
  },

  generoTitulo: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
});