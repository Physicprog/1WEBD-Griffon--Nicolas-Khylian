import { sendNotification } from "./utils/notif.js";
import { loadTendance, loadRandomMovies } from "./getMovie.js";


export const API_KEY = '4f914d881bdc09c47a4587b5a0a2c6c7';
export const BASE_URL = 'https://api.themoviedb.org/3';


let erreurMessage = document.getElementById("ErrorText");
let noerreurMessage = document.getElementById("noError");

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

async function tryFetchAPI() {
    const data = await getMovieFromURL(
        `${BASE_URL}/movie/1196207?api_key=${API_KEY}&append_to_response=videos`
    );

    if (!data || data === null) { 
        sendNotification('Unable to retrieve movie. Please try again later.', false);
        erreurMessage.style.display = "block";
        noerreurMessage.style.display = "none";
        return;
    }

    if (window.location.href.includes( "movie.html") && i === true) {
        sendNotification('Site loaded successfully. Welcome!', true);
        
    }
    erreurMessage.style.display = "none";
    noerreurMessage.style.display = "block";
}

tryFetchAPI();



async function MovieNameToId(input) {
}

export async function getTrendingMovies() {
    const url = `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`; 
    const resultat = await fetch(url);
    const data = await resultat.json();
    const films = data.results.slice(0, 6); //max 6 film (pas 7 car moches sur ecran de pc)
    return films;
}

export async function getRandomMovies() {
    const randomVal = Math.floor(Math.random() * 400);
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${randomVal}`;
    const resultat = await fetch(url);
    const data = await resultat.json();
    console.log(data)
    return data.results;
}


async function runGallerie() {
    await tryFetchAPI();
    loadTendance();
    loadRandomMovies();
}
runGallerie()

