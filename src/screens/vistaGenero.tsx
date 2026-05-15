import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import { getMoviesByGenre } from "../services/api";
import BotonVer from "../components/botonVer";
import { auth, db } from "../../firebaseConfig";
import { collection, query, where, getDocs, setDoc, deleteDoc, doc } from "firebase/firestore"; // ← 🆕 se agregó setDoc para usar ID personalizado

export default function VistaGenero({ route, navigation }: any) {
  const { generoId, titulo } = route.params;
  const [peliculas, setPeliculas] = useState<any[]>([]);//guarda las películas del género seleccionado.
  const [cargando, setCargando] = useState(true);// indica si los datos aún se están cargando.
  const [favoritos, setFavoritos] = useState<number[]>([]);//contiene los IDs de las películas marcadas como favoritas por el usuario.

  const cargarFavoritos = async () => {
    //- Se consulta la colección favoritos en Firestore para obtener las películas favoritas del usuario actual.
    const usuario = auth.currentUser;
    if (!usuario) return;

    try {
      const q = query(collection(db, "favoritos"), where("userId", "==", usuario.uid));
      const snapshot = await getDocs(q);
      const ids = snapshot.docs.map((doc) => doc.data().peliculaId);
      setFavoritos(ids);
    } catch (error) {
      console.log("Error al cargar favoritos:", error);
    }
  };

  //constante verifica si hay un usuario autenticado
  const toggleFavorito = async (pelicula: any) => {
    const usuario = auth.currentUser;
    if (!usuario) return;

    const yaEsFavorito = favoritos.includes(pelicula.id);

    try {
      //verifica si la película ya esta favorito
      if (yaEsFavorito) {
        //- 🔄 Se elimina el favorito usando el ID personalizado (igual que en Detalles)
        await deleteDoc(doc(db, "favoritos", `${usuario.uid}_${pelicula.id}`));
        setFavoritos((prev) => prev.filter((id) => id !== pelicula.id));
      } else {
        //- 🆕 Se guarda el favorito usando setDoc con ID personalizado para que Detalles lo reconozca
        await setDoc(doc(db, "favoritos", `${usuario.uid}_${pelicula.id}`), {
          userId: usuario.uid,
          peliculaId: pelicula.id,
          titulo: pelicula.title,
          poster: pelicula.poster_path,
        });
        setFavoritos((prev) => [...prev, pelicula.id]);
      }
    } catch (error) {
      console.log("Error al alternar favorito:", error);
    }
  };

  useEffect(() => {
    cargarFavoritos();

    getMoviesByGenre(generoId)
      .then((data) => {//Se consulta la API para obtener películas del género especificado
        if (data && Array.isArray(data.results)) {
          let filtradas = data.results;

          if (generoId === 10749) {//- Si el género es Romance (ID 10749), se filtran títulos y descripciones con contenido sensible.
            const palabrasSensibles = ["erótica", "sexual", "sexo", "sensual"];
            const titulosProhibidos = ["kiss and kill", "ligaw", "tuhog", "maalikaya"];

            filtradas = filtradas.filter((p: any) => {
              const overview = p.overview?.toLowerCase() ?? "";//Se obtiene la descripción de la película en minúsculas
              const titulo = p.title?.toLowerCase() ?? "";//Se obtiene el título de la película en minúsculas

              if (!overview || overview.trim() === "") return false;//Si no hay descripción o está vacía, se descarta la película

              const contienePalabraSensual = palabrasSensibles.some((palabra) =>
                overview.includes(palabra)
              );

              const tituloProhibido = titulosProhibidos.some((prohibido) =>
                titulo.includes(prohibido)
              );

              return !contienePalabraSensual && !tituloProhibido;
            });
          }

          setPeliculas(filtradas);
        } else {
          setPeliculas([]);
        }
      })
      .catch((error) => {
        console.error("Error al obtener películas por género:", error);
        setPeliculas([]);
      })
      .finally(() => {
        setCargando(false);
      });
  }, [generoId]);

  if (cargando) {
    return <ActivityIndicator size="large" color="purple" style={{ flex: 1 }} />;
  }

  if (peliculas.length === 0) {
    return (
      <View style={styles.screen}>
        <Text style={styles.header}>{titulo}</Text>
        <Text style={styles.noResults}>No se encontraron películas.</Text>
      </View>
    );
  }

  //- Si cargando es true, se muestra un spinner.Si no hay películas, se muestra un mensaje de “No se encontraron películas”.
  //Si hay resultados, se muestra una lista en dos columnas con:
  //Imagen del póster, Título. Botón “Ver” para ir a detalles.Ícono de corazón para marcar como favorito.

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>{titulo}</Text>
      <FlatList
        data={peliculas}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
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
            <Text style={styles.movieTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.botonesFila}>
              <BotonVer
                title="Ver"
                onPress={() => navigation.navigate("Detalles", { id: item.id })}
              />
              <TouchableOpacity onPress={() => toggleFavorito(item)}>
                <Text style={styles.corazon}>
                  {favoritos.includes(item.id) ? "❤️" : "🤍"}
                </Text>
              </TouchableOpacity>
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
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 12,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  posterImage: {
    width: 140,
    height: 200,
    borderRadius: 10,
  },
  imagePlaceholder: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    textAlign: "center",
    fontSize: 12,
    color: "#555",
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 6,
  },
  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 20,
  },
  botonesFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  corazon: {
    fontSize: 18,
  },
});