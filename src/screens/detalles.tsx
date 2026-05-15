import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import { getMovieDetails, getMovieCredits, getMovieVideos } from "../services/api";
import BotonGeneral from "../components/botonGeneral";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import CorazonFavorito from "../components/corazon"; // ✅ Se importa el componente reutilizable de corazón

export default function Detalles({ route }: any) {
  const id = route?.params?.id;

  const [detalle, setDetalle] = useState<any>(null);// guarda la información completa de la película.
  const [actores, setActores] = useState<any[]>([]);//contiene los actores principales.
  const [trailer, setTrailer] = useState<string | null>(null);//guarda el enlace del tráiler en YouTube.
  const [cargando, setCargando] = useState(true);//controla si se está esperando la respuesta de la API.
  const [esFavorita, setEsFavorita] = useState(false);//indica si la película está marcada como favorita por el usuario.

  useEffect(() => {
    if (!id) return;

    async function cargar() {//Se obtienen los detalles de la película, el reparto y los videos disponibles desde la API de TMDb.
      try {
        const d = await getMovieDetails(id);
        const c = await getMovieCredits(id);
        const v = await getMovieVideos(id);

        setDetalle(d);
        setActores(c?.cast?.slice(0, 5) || []);//- Se guarda la información de la película y los primeros 5 actores.

        const videos = v?.results || [];

        let trailerVideo = videos.find(//- Se busca el tráiler en español, inglés o cualquier idioma disponible en YouTube.
        // Si se encuentra, se guarda el enlace.
          (vid: any) =>
            vid.type === "Trailer" &&
            vid.site === "YouTube" &&
            vid.iso_639_1 === "es"
        );

        if (!trailerVideo) {
          trailerVideo = videos.find(
            (vid: any) =>
              vid.type === "Trailer" &&
              vid.site === "YouTube" &&
              vid.iso_639_1 === "en"
          );
        }

        if (!trailerVideo) {
          trailerVideo = videos.find(
            (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
          );
        }

        if (!trailerVideo) {
          trailerVideo = videos.find(
            (vid: any) =>
              (vid.type === "Teaser" || vid.type === "Clip") &&
              vid.site === "YouTube"
          );
        }

        if (trailerVideo) {
          setTrailer(`https://www.youtube.com/watch?v=${trailerVideo.key}`);
        } else {
          setTrailer(null);
        }

        // Verificar si ya está en favoritos
        if (auth.currentUser && d?.id) {
          const ref = doc(db, "favoritos", `${auth.currentUser.uid}_${d.id}`);
          const snap = await getDoc(ref);
          setEsFavorita(snap.exists());
        }
      } catch (error) {
        console.error("Error al cargar detalles:", error);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [id]);

  //- Si la película ya es favorita, se elimina de Firestore.
  // Si no lo es, se guarda como favorita con los datos del usuario y la película.

  const alternarFavorito = async () => {
    const user = auth.currentUser;
    if (!user || !detalle) return;

    const ref = doc(db, "favoritos", `${user.uid}_${detalle.id}`);

    try {
      if (esFavorita) {
        await deleteDoc(ref);
        setEsFavorita(false);
      } else {
        await setDoc(ref, {
          userId: user.uid,
          peliculaId: detalle.id,
          titulo: detalle.title,
          poster: detalle.poster_path,
          fechaGuardado: new Date(),
        });
        setEsFavorita(true);
      }
    } catch (error) {
      console.log("❌ Error al alternar favorito:", error);
    }
  };

  if (cargando)
    return <ActivityIndicator size="large" color="purple" style={{ flex: 1 }} />;
  if (!detalle)
    return <Text style={styles.error}>Película no encontrada</Text>;

  return (
    //- Se muestra:Imagen del póster,Título de la película,Ícono de corazón para marcar como favorita,
    // Sinopsis,Botón para ver el tráiler,Lista horizontal de actores con foto y nombre.

    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      {detalle.poster_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${detalle.poster_path}` }}
          style={styles.poster}
          resizeMode="cover"
        />
      )}
      <View style={styles.tituloRow}>
        <Text style={styles.titulo}>{detalle.title}</Text>
        <CorazonFavorito // ✅ Se usa el mismo componente de corazón que en Favoritos
          activo={esFavorita}
          onPress={alternarFavorito}
          tamaño={24}
        />
      </View>

      <Text style={styles.subtitulo}>📝 Sinopsis</Text>
      <Text style={styles.texto}>{detalle.overview || "No disponible"}</Text>

      {trailer && (
        <View style={styles.trailerButton}>
          <BotonGeneral
            title="Ver Trailer"
            onPress={() => Linking.openURL(trailer!)}
          />
        </View>
      )}

      <Text style={styles.subtitulo}>👥 Actores principales</Text>
      <FlatList
        horizontal
        data={actores}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View style={styles.actorCard}>
            <View style={styles.actorImgWrapper}>
              {item.profile_path ? (
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w200${item.profile_path}`,
                  }}
                  style={styles.actorImg}
                  resizeMode="contain"
                />
              ) : (
                <View style={[styles.actorImg, styles.actorPlaceholder]}>
                  <Text style={styles.actorPlaceholderText}>Sin foto</Text>
                </View>
              )}
            </View>
            <Text style={styles.actorNombre}>
              {item.name ? item.name : "Sin nombre"}
            </Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  poster: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  tituloRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  texto: {
    fontSize: 15,
    marginTop: 5,
    textAlign: "justify",
  },
  trailerButton: {
    alignItems: "center",
    marginTop: 15,
  },
  actorCard: {
    width: 100,
    alignItems: "center",
    marginRight: 12,
  },
  actorImgWrapper: {
    width: 80,
    height: 120,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  actorImg: {
    width: "100%",
    height: "100%",
  },
  actorPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  actorPlaceholderText: {
    fontSize: 10,
    color: "#555",
    textAlign: "center",
  },
  actorNombre: {
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
    fontWeight: "500",
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
  scrollContent: {
    paddingBottom: 90,
  },
});