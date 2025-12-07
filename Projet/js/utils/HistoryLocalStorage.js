export function saveMovie(movie) {
    const saved = getSavedMovies();

    for (var i = 0; i < saved.length; i++) {
        if (saved[i].id === movie.id) {
            return false; 
        }
    }
    saved.push(movie);
    localStorage.setItem('savedMovies', JSON.stringify(saved));
    return true;
}


export function getSavedMovies() {
    var data = localStorage.getItem('savedMovies');
    if (data === null) {
        return [];
    }
        return JSON.parse(data);
}


export function removeMovie(movieId) {
    const saved = getSavedMovies();
    var newList = [];

    for (var i = 0; i < saved.length; i++) {
        if (saved[i].id !== movieId) {
            newList.push(saved[i]);
        }
    }
    localStorage.setItem('savedMovies', JSON.stringify(newList));
}
export function clearAllMovies() {
    localStorage.removeItem('savedMovies');
}