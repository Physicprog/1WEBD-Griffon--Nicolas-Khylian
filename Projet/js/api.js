import { sendNotification } from "./utils/notif.js";
import {loadTendance} from "./getMovie.js";

export const API_KEY = '4f914d881bdc09c47a4587b5a0a2c6c7';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';


let erreurMessage = document.getElementById("ErrorText");
let noerreurMessage = document.getElementById("noError");

export async function tryFetchAPI() {
    try {
        const data = await fetch(`https://api.themoviedb.org/3/movie/${1196207}?api_key=${API_KEY}&append_to_response=videos`); //test avec un film (inception)

        if (data) {
            sendNotification('Site loaded successfully. Welcome!', true);
            erreurMessage.style.display = "none";
            noerreurMessage.style.display = "block";
            console.log(await data.json());
        }
    } catch (error) {
        sendNotification('Unable to retrieve movie. Please try again later.', false);
        erreurMessage.style.display = "block";
        noerreurMessage.style.display = "none";
        console.log(data);

    }
}

tryFetchAPI();

async function MovieNameToId(input) {
    
}

export async function getTrendingMovies() {
    const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;
    const resultat = await fetch(url);
    const data = await resultat.json();
    const films = data.results.slice(0, 6); //max 6 film (pas 7 car moches sur ecran de pc)
    return films;
}


async function runTendance() {
    await tryFetchAPI();
    loadTendance();
}
 runTendance() 



