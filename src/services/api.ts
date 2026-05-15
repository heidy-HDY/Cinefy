const API_KEY = "60cd5e95b6d39bc83cd82a3ba189e76a"; // clave v3
const BASE_URL = "https://api.themoviedb.org/3";

//  Películas en cartelera
export async function getNowPlaying(region: string = "CO") {//obtiene las películas que están actualmente en cartelera en una región específica
  const res = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=es-ES&region=${region}&page=1` //hace una peticion http a TMDB 
  );
  const data = await res.json();//- Convierte la respuesta en formato JSON para poder trabajar con ella.
  return { results: data.results };//- Devuelve un objeto con una propiedad results que contiene el arreglo de películas en cartelera.
}

// Próximos estrenos (carga varias páginas)
export async function getUpcoming(region: string = "CO") {//carga los próximos estrenos en varias páginas y elimina duplicados
  let todas: any[] = [];

  for (let i = 1; i <= 2; i++) {
    const res = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=es-ES&region=${region}&page=${i}`
    );
    const data = await res.json();

    //- Si hay resultados (data.results), se agregan al arreglo todas.
    if (data.results) {
      todas = todas.concat(data.results);
    }
  }

  // Eliminar duplicados por ID
  const sinDuplicados = todas.filter(
    (pelicula, index, self) =>
      index === self.findIndex((p) => p.id === pelicula.id)
  );

  return { results: sinDuplicados };
}

// Detalles de una película
export async function getMovieDetails(id: number) {//obtiene información detallada de una película por su ID
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`
  );
  return res.json();
}

// Créditos (actores) de una película
export async function getMovieCredits(id: number) {//recupera el reparto (actores) de una película
  const res = await fetch(
    `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=es-ES`
  );
  return res.json();
}

// Videos (trailers) de una película
export async function getMovieVideos(id: number) {//busca trailers y clips disponibles en YouTube.
  const res = await fetch(
    `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=es-ES`
  );
  return res.json();
}

// Películas por género (carga varias páginas)
export async function getMoviesByGenre(genreId: number) {//obtiene películas filtradas por género, ordenadas por popularidad
  let todas: any[] = [];

  for (let i = 1; i <= 4; i++) {
    const res = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=${genreId}&include_adult=false&sort_by=popularity.desc&page=${i}`
    );
    const data = await res.json();
    if (data.results) {
      todas = todas.concat(data.results);
    }
  }

  return { results: todas };
}

// Buscar películas por texto
export async function searchMovies(query: string) {// permite buscar películas por texto ingresado por el usuario.
  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(
        query
      )}&include_adult=false&page=1`
    );
    //- Convierte la respuesta en formato JSON y la devuelve directamente.
    // El resultado incluirá un arreglo results con las películas encontradas.

    return await res.json();
  } catch (error) {
    console.error("Error buscando películas:", error);
    return { results :[]};
  }
}
