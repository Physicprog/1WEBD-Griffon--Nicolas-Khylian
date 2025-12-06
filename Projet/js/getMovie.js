import { getTrendingMovies, getRandomMovies } from './api.js';
import { createMovieCard } from './movieCard.js';

export async function loadTendance(options = ['title', 'poster', 'rating']) {
    const container = document.querySelector('.movie-container');
    if (!container) {
        console.error('Element .movie-container not found in the DOM');
        return;
    }
    container.innerHTML = ''; 


    const trendingMovies = await getTrendingMovies();
    
    for (let movie of trendingMovies) {
        const carte = createMovieCard(movie, options);
        container.appendChild(carte);
    }
}

export function loadRandomMovies(options = ['title', 'poster', 'rating']) {
    setTimeout(async () => {
        const container = document.querySelector('.movie-random');
        if (!container) {
            console.error('.movie-random not found in the DOM');
            return;
        }

        const randomMovies = await getRandomMovies();

        for (let movie of randomMovies) {
            const card = createMovieCard(movie, options);
            container.appendChild(card);
        }
    }, 3500);
}



var isLoading = false;

window.addEventListener("scroll", async () => {
  const position = window.innerHeight + window.scrollY;
  const limite = document.body.offsetHeight;

  if (position >= limite - 100 && !isLoading) {
    isLoading = true;
        await loadRandomMovies();
    isLoading = false;
  }
});