import { getTrendingMovies } from './api.js';
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