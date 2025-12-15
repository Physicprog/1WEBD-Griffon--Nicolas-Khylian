import { sendNotification } from "./utils/notif.js";

export const API_KEY = "4f914d881bdc09c47a4587b5a0a2c6c7";
export const BASE_URL = "https://api.themoviedb.org/3";

export let erreurMessage = document.getElementById("ErrorText");
export let noerreurMessage = document.getElementById("noError");

async function getMovieFromURL(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchMovie(movieId) {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-EN`;
  const response = await fetch(url);
  return await response.json();
}

async function tryFetchAPI() {
  const data = await getMovieFromURL(
    `${BASE_URL}/movie/1196207?api_key=${API_KEY}&append_to_response=videos`
  );

  if (!data || data === null) {
    sendNotification(
      "Unable to retrieve movie. Please try again later.",
      false
    );
    if (erreurMessage) erreurMessage.style.display = "block";
    if (noerreurMessage) noerreurMessage.style.display = "none";
    return;
  }

  if (erreurMessage) erreurMessage.style.display = "none";
  if (noerreurMessage) noerreurMessage.style.display = "block";
}

export async function getTrendingMovies() {
  const url = `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`;
  const resultat = await fetch(url);
  const data = await resultat.json();
  const films = data.results.slice(0, 6);
  return films;
}

export async function getMovieByName(searchInput) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
    searchInput
  )}`;
  const resultat = await fetch(url);
  const data = await resultat.json();
  return data.results;
}

export async function getRandomMovies() {
  const randomVal = Math.floor(Math.random() * 400);
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${randomVal}`;
  const resultat = await fetch(url);
  const data = await resultat.json();
  return data.results;
}

tryFetchAPI();
