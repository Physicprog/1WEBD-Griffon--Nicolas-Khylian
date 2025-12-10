export function saveMovie(movie, key = 'History') {
    let saved = JSON.parse(localStorage.getItem(key)) || [];
    
    for (let m of saved) {
        if (m.id === movie.id) {
            return false; 
        }
    }
    saved.push(movie);
    localStorage.setItem(key, JSON.stringify(saved));
    return true;
}

export function getSavedMovies(key = 'History') {
    return JSON.parse(localStorage.getItem(key)) || [];
}

export function removeMovie(movieId, key = 'savedMovies') {
    const saved = getSavedMovies(key);
    const newList = saved.filter(m => m.id !== movieId);
    localStorage.setItem(key, JSON.stringify(newList));
}

export function clearAllMovies(key = 'History') {
    localStorage.removeItem(key);
}