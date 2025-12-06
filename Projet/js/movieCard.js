/*{adult: false, backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg', belongs_to_collection: null, budget: 160000000, genres: Array(3), …}
adult
: 
false
backdrop_path
: 
"/s3TBrRGB1iav7gFOCNx3H31MoES.jpg"
belongs_to_collection
: 
null
budget
: 
160000000
genres
: 
(3) [{…}, {…}, {…}]
homepage
: 
"https://www.warnerbros.com/movies/inception"
id
: 
27205
imdb_id
: 
"tt1375666"
origin_country
: 
(2) ['US', 'GB']
original_language
: 
"en"
original_title
: 
"Inception"
overview
: 
"Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious."
popularity
: 
23.0474
poster_path
: 
"/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg"
production_companies
: 
(3) [{…}, {…}, {…}]
production_countries
: 
(2) [{…}, {…}]
release_date
: 
"2010-07-15"
revenue
: 
839030630
runtime
: 
148
spoken_languages
: 
(4) [{…}, {…}, {…}, {…}]
status
: 
"Released"
tagline
: 
"Your mind is the scene of the crime."
title
: 
"Inception"
video
: 
false
videos
: 
{results: Array(21)}
vote_average
: 
8.37
vote_count
: 
38299
[[Prototype]]
: 
Object
*/

import { sendNotification } from "./utils/notif.js";

export function movieToDico(movie) {
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

export function createStarRating(movie) {
    const dict = movieToDico(movie);
    const rate = Math.round(parseFloat(dict.vote_average) / 2); 
    
    const container = document.createElement('div');
    container.className = 'rate';
    
    if (rate === 0) {
        const p = document.createElement('p');
        p.textContent = 'Not rated yet';
        container.appendChild(p);
        return container;
    }

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('img');
        
        if (i <= rate) {
            star.src = './../Assets/img/fav.png';
        } else {
            star.src = './../Assets/img/nofav.png';
        }
        
        star.className = 'star';
        container.appendChild(star);
    }
    
    return container;
}

export function createMovieImage(movie) {
    const dict = movieToDico(movie);
    const img = document.createElement('img');
    const chemin = dict.poster_path;
    
    if (chemin === 'null') {
        img.src = './../Assets/img/NoPreview.gif';
    } else {
        img.src = 'https://image.tmdb.org/t/p/w500/' + chemin;
    }
    
    return img;
}

export function createMovieTitle(movie) {
    const dict = movieToDico(movie);
    const h5 = document.createElement('h5');
    const textMovie = dict.title;

    if (!textMovie || textMovie === 'null') {
        h5.textContent = "Title not available";
        return h5;
    }

    const max = 25;
    let finalTitle = textMovie;
    if (textMovie.length > max) {
        finalTitle = textMovie.slice(0, max) + "...";
        h5.addEventListener('click', () => {
            sendNotification(`Movie Title: ${textMovie}`, true, 4500)
        });
    }

    h5.textContent = finalTitle;  
    return h5;
}


export function createMovieYear(movie) {
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

export function caption(movie) {
    const dict = movieToDico(movie);
    const p = document.createElement('p');
    const text = dict.overview;


    if (!text || text === 'null') {
        p.textContent = "Date not available";
        return p;
    }


    const max = 650;
    if (text.length > max) {
        text = text.slice(0, max) + "...";
        h5.addEventListener('click', () => {
            sendNotification(`Movie caption: ${text}`, true, 12000)
        });
    }


    p.textContent = text;
    return p;
}


export function createMovieCard(movie, options = ['title', 'rating', 'year', 'overview', 'image']) {
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
                container.appendChild(caption(movie));
                break;
            case 'image':
                card.appendChild(caption(movie));
                break
            case 'poster':
                card.appendChild(createMovieImage(movie));
                break;
        }
    });
    
    card.appendChild(container);
    return card;
}