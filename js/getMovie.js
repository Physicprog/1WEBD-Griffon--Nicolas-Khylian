import { getTrendingMovies, getRandomMovies, fetchMovie, getMovieByName } from './api.js';
import { createMovieElement, formatDate, formatMoney, fetchCredits, createStarRating, createBackdropImage, createMovieImage } from './movieCard.js';
import { getSavedMovies, clearAllMovies } from './utils/FavLocalStorage.js';
import { sendNotification } from './utils/notif.js';

export async function loadTendance(options = ['poster', 'title', 'rating', 'overview'], smallOverview = true) {
    const container = document.querySelector('.movie-container');
    if (!container) return;
    container.innerHTML = ''; 

    const trendingMovies = await getTrendingMovies();
    trendingMovies.forEach(movie => {
        const card = createMovieElement(movie, options, smallOverview, 'card', true);
        container.appendChild(card);
    });
}

export function loadRandomMovies(options = ['poster', 'title', 'rating', 'overview'], smallOverview = true) {
    setTimeout(async () => {
        const container = document.querySelector('.movie-random');
        if (!container) return;

        try {
            const randomMovies = await getRandomMovies();
            randomMovies.forEach(movie => {
                const card = createMovieElement(movie, options, smallOverview, 'card', true);
                container.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading random movies:', error);
        }
    }, 2000);
}

var isLoading = false;
window.addEventListener('scroll', async () => {
    const position = window.innerHeight + window.scrollY;
    const limite = document.body.offsetHeight;

    if (position >= limite - 100 && !isLoading) {
        isLoading = true;
        await loadRandomMovies();
        isLoading = false;
    }
});

export function loadHistory() {
    const container = document.querySelector('.movie-history');
    if (!container) return;

    const saved = getSavedMovies();
    container.innerHTML = '';

    if (!saved.length) {
        container.innerHTML = '<p>No movies saved yet</p>';
        return;
    }

    saved.forEach(movie => {
        const card = createMovieElement(movie, ['poster', 'title', 'rating', 'overview'], false);
        container.appendChild(card);
    });
}

export function clearHistory() {
    const saved = getSavedMovies(); 
    if (saved.length) {
        clearAllMovies();
        loadHistory();
        sendNotification('Favorites cleared!', true, 3000);
    } else {
        sendNotification('Already empty..', false, 3000);
    }
}




let searchInput = document.getElementById("site-search");
let SearchMovie = document.getElementById("searchForMovie");
let noSearchMovie = document.getElementById("NoSearchMovie");

searchInput.addEventListener('keyup', async () => {
    const input = searchInput.value;
    const results = await getMovieByName(input);

    SearchMovie.innerHTML = '';
    SearchMovie.className = 'card-search';

    const title = document.createElement('h1');
    title.textContent = 'Your movies search';
    title.className = 'search-title';
    SearchMovie.appendChild(title);

    if (results) {
        for (const movie of results) {
            const movieCard = createMovieElement(movie, ['poster', 'title', 'rating', 'overview'], true, 'card', true);
            SearchMovie.appendChild(movieCard);
        }
        SearchMovie.style.display = 'block';
        noSearchMovie.style.display = 'none';
    } else {
        const noResult = document.createElement('p');
        noResult.innerHTML = 'No movie found<br>Enter a correct movie name to start';
        noResult.className = 'search-message';
        SearchMovie.appendChild(noResult);
        noSearchMovie.style.display = 'none';
        SearchMovie.style.display = 'block';
    }
});


export async function LoadMovieDetails() {
    const container = document.getElementById('movieDetailsCard');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');
    
    if (!movieId) {
        container.innerHTML = '<p>No movie selected</p>';
        return;
    }

    try {
        const movie = await fetchMovie(movieId);
        const credits = await fetchCredits(movieId);

        let posterUrl = './Assets/img/NoPreview.gif';
        if (movie.poster_path && movie.poster_path !== 'null' && movie.poster_path !== null) {
            posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        }

        let backdropUrl = './Assets/img/NoBackdrop.gif';
        let backdropStyle = '';
        if (movie.backdrop_path && movie.backdrop_path !== 'null' && movie.backdrop_path !== null) {
            backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
            backdropStyle = 'filter: saturate(0) contrast(1.5) blur(2px);';
        }

        let castHTML = '';
        if (credits && credits.cast && credits.cast.length > 0) {
            const maxActors = 5;
            const actorCount = credits.cast.length < maxActors ? credits.cast.length : maxActors;
            
            for (let i = 0; i < actorCount; i++) {
                const actor = credits.cast[i];
                castHTML += `
                    <div class="actor">
                        <p class="actor-name">${actor.name}</p>
                        <span class="actor-role">${actor.character}</span>
                    </div>
                `;
            }
        }

        let genresHTML = '';
        if (movie.genres && movie.genres.length > 0) {
            for (let i = 0; i < movie.genres.length; i++) {
                genresHTML += `<span class="genre-tag">${movie.genres[i].name}</span>`;
            }
        }
        
        container.innerHTML = `
            <div class="details-backdrop">
                <img src="${backdropUrl}" alt="backdrop" style="${backdropStyle}">
            </div>

            <div class="details-content">
                <div class="details-poster">
                    <img src="${posterUrl}" alt="${movie.title}">
                </div>

                <div class="details-info">
                    <h1 class="details-title">${movie.title}</h1>

                    <div class="details-rating">
                        <div class="rating-stars-container"></div>
                        <span class="rating-number">${movie.vote_average.toFixed(1)}/10</span>
                    </div>

                    <div class="details-genres">
                        ${genresHTML}
                    </div>

                    <p class="details-overview">${movie.overview}</p>

                    <h3 class="section-title">Cast</h3>
                    <div class="details-cast">
                        ${castHTML}
                    </div>

                    <div class="details-metrics">
                        <div class="metric">
                            <span class="metric-label">Release Date</span>
                            <p class="metric-value">${formatDate(movie.release_date)}</p>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Budget</span>
                            <p class="metric-value">${formatMoney(movie.budget)}</p>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Revenue</span>
                            <p class="metric-value">${formatMoney(movie.revenue)}</p>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Runtime</span>
                            <p class="metric-value">${movie.runtime} min</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const ratingContainer = container.querySelector('.rating-stars-container');
        if (ratingContainer) {
            const starRating = createStarRating(movie);
            ratingContainer.appendChild(starRating);
        }

    } catch (error) {
        container.innerHTML = '<p class="error-message">Error loading movie</p>';
        console.error('Error:', error);
    }
}