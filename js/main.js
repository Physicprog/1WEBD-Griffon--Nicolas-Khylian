import { loadHistory, clearHistory, LoadMovieDetails, loadTendance, loadRandomMovies } from "./getMovie.js";
import { getMovieByName } from "./api.js";









window.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.movie-container')) {
        loadTendance();
    }
    if (document.querySelector('.movie-random')) {
        loadRandomMovies();
    }
    if (document.getElementById('movieDetailsCard')) {
        LoadMovieDetails();
    }
    if (document.querySelector('.movie-history')) {
        loadHistory();
    }
    const clearBtn = document.getElementById('clearHistory');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearHistory);
    }
});






async function searchForAMovie() {
    const data = await getMovieFromURL(
        `${BASE_URL}/movie/1196207?api_key=${API_KEY}&append_to_response=videos`
    );

    if (!data || data === null) { 
        sendNotification('Unable to retrieve movie. Please try again later.', false);
        if (erreurMessage) erreurMessage.style.display = "block";
        if (noerreurMessage) noerreurMessage.style.display = "none";
        return;
    }

    if (erreurMessage) erreurMessage.style.display = "none";
    if (noerreurMessage) noerreurMessage.style.display = "block";
}
