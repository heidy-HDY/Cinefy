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

  //- cartelera: guarda las películas que se están mostrando actualmente.
  // cargando: controla si se está esperando la respuesta de la API.
  // busqueda: almacena el texto que el usuario escribe en la barra de búsqueda.
  const [cartelera, setCartelera] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    getNowPlaying("CO")//- Al cargar la pantalla, se llama a la función getNowPlaying("CO") para obtener películas en cartelera en Colombia.
      .then((data) => {
        const hoy = new Date();// Se calcula un rango de fechas: desde hoy hasta hace 30 días.
        const hace30dias = new Date();
        hace30dias.setDate(hoy.getDate() - 30);

        if (!data || !Array.isArray(data.results)) {
          console.warn("No se recibieron resultados válidos");
          setCartelera([]);
          return;
        }

        const filtradas = data.results.filter((p: any) => {//Se filtran las películas que fueron estrenadas en ese rango de tiempo.
          if (!p || !p.release_date) return false;
          const fecha = new Date(p.release_date);
          return fecha >= hace30dias && fecha <= hoy;
        });

        //Se agrega un botón especial al final de la lista para ver los próximos estrenos.
        filtradas.push({ id: "boton-estrenos", tipo: "boton" });
        setCartelera(filtradas);//- Se guarda la lista filtrada en el estado cartelera
      })
      .catch((error) => {
        console.error("Error al obtener películas:", error);
      })
      .finally(() => {
        setCargando(false);
      });
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
      {/* 🔍 Barra de búsqueda con lupa */}
   <View style={styles.searchWrapper}>
    <Image
      source={require("../../assets/img2.png")} 
      style={styles.profileIcon}
    />
  <View style={styles.searchContainer}>
      <TextInput
        style={styles.inputBusqueda}
        placeholder="Buscar películas..."
        value={busqueda}
        onChangeText={setBusqueda}
        onSubmitEditing={() => {
          const texto = busqueda.trim();
          if (texto.length > 0) {
            navigation.navigate("BusquedaResultados", { query: texto });
            setBusqueda("");
          }
        }}
        returnKeyType="search"
      />
      <TouchableOpacity
        // Al escribir y presionar enter o la lupa, se navega a la pantalla "BusquedaResultados" con el texto ingresado.
        onPress={() => {
          const texto = busqueda.trim();
          if (texto.length > 0) {
            navigation.navigate("BusquedaResultados", { query: texto });
            setBusqueda("");
          }
        }}
      >
        <Image
          source={require("../../assets/lupa.png")}
          style={styles.searchIcon}
        />
      </TouchableOpacity>
    </View>
  </View>

      <Text style={styles.header}>En cartelera</Text>
      <FlatList
       //- Se muestra una lista horizontal de películas.Si es peliculas de estreno se muestra un botón para ver estrenos.Si es una película, se muestra su imagen, título, fecha y botón "Ver".

        style={styles.flatList}
        data={cartelera}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        renderItem={({ item }) => {
          if (item.tipo === "boton") {
            return (
              <TouchableOpacity
                style={[styles.card, styles.botonCard]}
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
                style={styles.imageContainer}
              >
                {item.poster_path ? (
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
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
          );
        }}
      />

      <Text style={styles.header}>Sugerencias por género</Text>
      <FlatList
        data={generos}//- Se muestra cada género como una tarjeta con imagen y nombre. Al tocarla, se navega a una vista filtrada por ese género.

        keyExtractor={(item) => item.id.toString()}
        horizontal
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

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    maxWidth: 300,
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
    marginBottom: 10,
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
    marginTop: -15,
  },

  leftIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 3,
  },

  inputBusqueda: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },

  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#888",
    marginLeft: 8,
  },

  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
    marginLeft: 12,
  },

  flatList: {
    marginBottom: 16,
  },

  // ===== TARJETAS PELÍCULAS =====
  card: {
    width: 190,
    marginRight: 13,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "visible",
    paddingBottom: 10,
  },

  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  posterImage: {
    width: 190,
    height: 260,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  imagePlaceholder: {
    backgroundColor: "#e0e0e0ff",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    textAlign: "center",
    fontSize: 12,
    color: "#555",
  },

  cardFooter: {
    paddingHorizontal: 8,
    paddingVertical: 10,
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
    marginTop: 4,
    marginBottom: 8,
  },

  botonCard: {
    width: 190,
    height: 260,
    marginRight: 12,
    backgroundColor: "#ba1717",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  estrenosText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 10,
  },

  // ===== GÉNEROS =====
  generoCard: {
    width: 170,
    height: 170,
    marginRight: 12,
    borderRadius: 10,
    overflow: "visible",
    backgroundColor: "#fff",
    alignItems: "center",
  },

  generoImage: {
    width: 170,
    height: 110,
    borderRadius: 10,
    resizeMode: "cover",
  },

  generoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 4,
  },
});