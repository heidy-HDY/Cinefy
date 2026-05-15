import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Animated,
} from "react-native";

import { getNowPlaying } from "../services/api";
import BotonVer from "../components/botonVer";

export default function Informacion({ navigation }: any) {

  const [cartelera, setCartelera] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // 🔥 ANIMACIÓN ESTRENOS
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    getNowPlaying("CO")
      .then((data) => {

        const hoy = new Date();
        const hace30dias = new Date();
        hace30dias.setDate(hoy.getDate() - 30);

        if (!Array.isArray(data?.results)) {
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
          />
        </View>
      </View>

      {/* CARTELERA */}
      <Text style={styles.header}>En cartelera</Text>

      <FlatList
        data={cartelera}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        renderItem={({ item }) => {

          if (item.tipo === "boton") {
            return (
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                }}
              >
                <TouchableOpacity
                  style={styles.botonCard}
                  onPress={() => navigation.navigate("Estrenos")}
                >
                  <Text style={styles.estrenosText}>
                    🚀 Ver próximos estrenos
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          }

          return (
            <View style={styles.card}>

              <TouchableOpacity
                onPress={() => navigation.navigate("Detalles", { id: item.id })}
              >
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                  style={styles.posterImage}
                />
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
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
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
    flex: 1,
    maxWidth: 300,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
  },

  inputBusqueda: {
    height: 40,
  },

  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
    marginLeft: 12,
  },

  // ===== PELICULAS =====
  card: {
    width: 190,
    marginRight: 13,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },

  posterImage: {
    width: 190,
    height: 210,
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
    height: 210,
    marginRight: 12,
    backgroundColor: "#ba1717",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  estrenosText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  // ===== GENEROS (MEJORADOS) =====
  generoCard: {
    width: 175,
    height: 175,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    alignItems: "center",
  },

  generoImage: {
    width: 175,
    height: 115,
    resizeMode: "cover",
  },

  generoTitulo: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 6,
    textAlign: "center",
  },
});