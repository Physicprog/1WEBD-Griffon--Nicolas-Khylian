import { getTrendingMovies, getRandomMovies } from './api.js';
import { createMovieCard } from './movieCard.js';
import { getSavedMovies, clearAllMovies } from './utils/HistoryLocalStorage.js';
import { sendNotification } from './utils/notif.js';

export async function loadTendance(options = ['title', 'poster', 'rating', 'overview'], smallOverview = true) {
    const container = document.querySelector('.movie-container');
    if (!container) {
        console.error('Element .movie-container not found in the DOM');
        return;
    }
    container.innerHTML = ''; 

    const trendingMovies = await getTrendingMovies();
    
    for (let movie of trendingMovies) {
        const carte = createMovieCard(movie, options, smallOverview);
        container.appendChild(carte);
    }
}

export function loadRandomMovies(options = ['title', 'poster', 'rating', 'overview'], smallOverview = true) {
    setTimeout(async () => {
        const container = document.querySelector('.movie-random');
        if (!container) {
            console.error('.movie-random not found in the DOM');
            return;
        }
        
        try {
            const randomMovies = await getRandomMovies();
            randomMovies.forEach(movie => {
                const card = createMovieCard(movie, options, smallOverview);
                container.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading random movies:', error);
        }
    }, 2000);
}

var isLoading = false;

window.addEventListener("scroll", async () => {
  const position = window.innerHeight + window.scrollY;
  const limite = document.body.offsetHeight;

  if (position >= limite - 100 && !isLoading) {
    isLoading = true;
    await loadRandomMovies(['title', 'poster', 'rating', 'overview'], true);
    isLoading = false;
  }
});

export function loadHistory(options = ['poster', 'title', 'rating']) {
    const container = document.querySelector('.movie-history');
    if (!container) {
        // Ne pas logger d'erreur si on n'est pas sur la page des favoris
        return;
    }
    
    container.innerHTML = '';
    const saved = getSavedMovies();
    
    if (saved.length === 0) {
        container.innerHTML = '<p>No movies saved yet</p>';
        return;
    }
    
    saved.forEach(movie => {
        const card = createMovieCard(movie, options, false);
        container.appendChild(card);
    });
}

export function clearHistory() {
    clearAllMovies();
    loadHistory();
    sendNotification('Favorites cleared!', true, 3000);
}