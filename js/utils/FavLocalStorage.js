export function saveMovie(movie) {
    let saved = JSON.parse(localStorage.getItem('savedMovies')) || [];
    
    for (let m of saved) {
        if (m.id === movie.id) {
            return false; 
        }
    }
    saved.push(movie);
    localStorage.setItem('savedMovies', JSON.stringify(saved));
    return true;
}

export function getSavedMovies() {
    return JSON.parse(localStorage.getItem('savedMovies')) || [];
}

export function removeMovie(movieId) {
    const saved = getSavedMovies();
    const newList = saved.filter(m => m.id !== movieId);
    localStorage.setItem('savedMovies', JSON.stringify(newList));
}

export function clearAllMovies() {
    localStorage.removeItem('savedMovies');
}
