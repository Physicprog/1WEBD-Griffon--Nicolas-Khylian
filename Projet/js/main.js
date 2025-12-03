import './index.js';
import { sendNotification } from './utils/notif.js';

const API_KEY = 'b084c691';
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

let erreurMessage = document.getElementById("ErrorText");


async function tryFetchAPI() {
    try {
        const response = await fetch(`${BASE_URL}&t=Inception`); //requete vers le film Ineption pour tester l'API
        const data = await response.json();
        console.log('API fetch success:', data);
        sendNotification('Site loaded successfully. Welcome!', true);
        erreurMessage.style.display = "none";
    } catch (error) {
        sendNotification('Not able to load the website, please wait and try again', false);
        erreurMessage.style.display = "block";
    }
}
tryFetchAPI();




export async function fetchMovie(id) {
    try {
        const response = await fetch(`${BASE_URL}&i=${id}`);
        const movie = await response.json();
        return movie;
    } catch (error) {
        console.error('Failed to fetch movie:', error);
        sendNotification('Unable to retrieve movie. Please try again later.', false);
    }
}