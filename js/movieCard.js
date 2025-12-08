import { sendNotification } from "./utils/notif.js";
import { loadHistory } from './getMovie.js';
import { saveMovie, removeMovie, getSavedMovies } from './utils/FavLocalStorage.js';


function movieToDico(movie) {
    if (!movie) return {};
    const dict = {};
    for (let i in movie) {
        let value = movie[i];
        switch (true) {
            case value === null:
                value = 'null';
                break;
            case typeof value === 'boolean':
                value = value ? 'true' : 'false';
                break;
            case typeof value === 'object':
                value = 'object';
                break;
            default:
                value = String(value);
        }
        dict[i] = value;
    }
    return dict;
}


export function createFavoriteButton(movie) {
    const button = document.createElement('img');
    button.className = 'favorite-btn';
    button.alt = 'Favorite';

    const savedMovies = getSavedMovies();
    let isFavorite = false;
    for (let i = 0; i < savedMovies.length; i++) {
        if (savedMovies[i].id === movie.id) {
            isFavorite = true;
            break;
        }
    }
    
    if (isFavorite) {
        button.src = './Assets/img/1.png';
    } else {
        button.src = './Assets/img/2.png';
    }

    button.addEventListener('click', function(event) {
        event.stopPropagation();

        const savedMoviesNow = getSavedMovies();
        let isFavoriteNow = false;
        for (let i = 0; i < savedMoviesNow.length; i++) {
            if (savedMoviesNow[i].id === movie.id) {
                isFavoriteNow = true;
                break;
            }
        }

        if (isFavoriteNow) {
            removeMovie(movie.id);
            button.src = './Assets/img/2.png';
            sendNotification(`"${movie.title}" removed from favorites!`, false, 3000);
        } else {
            saveMovie(movie);
            button.src = './Assets/img/1.png';
            sendNotification(`"${movie.title}" added to favorites!`, true, 3000);
        }

        loadHistory();
    });

    return button;
}


function createStarRating(movie) {
    const dict = movieToDico(movie);
    const rate = Math.round(parseFloat(dict.vote_average) / 2); 
    
    const container = document.createElement('div');
    container.className = 'rate';

    container.addEventListener('click', function(event) { 
        event.stopPropagation();
    });

    if (rate === 0) {
        const p = document.createElement('p');
        p.textContent = 'Not rated yet';
        container.appendChild(p);
        container.appendChild(createFavoriteButton(movie));
        return container;
    }

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('img');
        
        if (i <= rate) {
            star.src = './Assets/img/fav.png'; 
        } else {
            star.src = './Assets/img/nofav.png';
        }
        
        star.className = 'star';
        container.appendChild(star);
    }
    
    container.appendChild(createFavoriteButton(movie));
    
    return container;
}


function createMovieImage(movie) {
    const dict = movieToDico(movie);
    const img = document.createElement('img');
    const chemin = dict.poster_path;
    
    if (chemin === 'null') {
        img.src = './Assets/img/NoPreview.gif';  
    } else {
        img.src = 'https://image.tmdb.org/t/p/w500/' + chemin;
    }
    
    return img;
}

function createMovieTitle(movie) {
    const dict = movieToDico(movie);
    const h5 = document.createElement('h5');
    const textMovie = dict.title;

    if (!textMovie || textMovie === 'null') {
        h5.textContent = "Title not available";
        return h5;
    }

    const max = 18;
    let finalTitle = textMovie;
    if (textMovie.length > max) {
        finalTitle = textMovie.slice(0, max) + "...";
        h5.addEventListener('click', function(event) {
            event.stopPropagation();  
            sendNotification(`Movie Title: ${textMovie}`, true, 4500);
        });
    }

    h5.textContent = finalTitle;  
    return h5;
}


function createMovieYear(movie) {
    const dict = movieToDico(movie);
    const p = document.createElement('p');
    const date = dict.release_date;

    if (!date || date === 'null' || date.length < 4) {
        p.textContent = "Date not available";
        return p;
    }

    const annee = date.substring(0, 4);
    p.textContent = annee;
    return p;
}

function caption(movie, smallOverview = false) {
    const dict = movieToDico(movie);
    const p = document.createElement('p');
    var text = dict.overview;

    if (!text || text === 'null') {
        p.textContent = "Date not available";
        return p;
    }

    if(smallOverview === true) {
        const max = 35;
        if (text.length > max) {
            text = text.slice(0, max) + "...";
        }
    }

    p.textContent = text;
    return p;
}


export function createMovieCard(movie, options = ['title', 'rating', 'year', 'overview', 'image'], smallOverview = false) {
    const card = document.createElement('div');
    card.className = 'card';

    const container = document.createElement('div');
    container.className = 'container';

    options.forEach(option => {
        switch(option) {
            case 'title':
                container.appendChild(createMovieTitle(movie));
                break;
            case 'rating':
                container.appendChild(createStarRating(movie));
                break;
            case 'year':
                container.appendChild(createMovieYear(movie));
                break;
            case 'overview':
                container.appendChild(caption(movie, smallOverview));
                break;
            case 'image':
                card.appendChild(createMovieImage(movie, false));
                break;
            case 'poster':
                card.appendChild(createMovieImage(movie));
                break;
        }
    });
    
    card.appendChild(container);
    
    card.addEventListener('click', () => {
        saveMovie(movie); 
        window.location.href = "movie.html?id=" + movie.id;
    });
    
    return card;
}
