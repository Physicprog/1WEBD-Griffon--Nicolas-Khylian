export function saveMovie(movie, key = "History") {
  let saved = localStorage.getItem(key);

  if (!saved) {
    saved = [];
  } else {
    saved = JSON.parse(saved);
  }

  for (let i = 0; i < saved.length; i++) {
    if (saved[i].id === movie.id) {
      return false;
    }
  }

  saved.push(movie);
  localStorage.setItem(key, JSON.stringify(saved));
  return true;
}

export function getSavedMovies(key = "History") {
  let saved = localStorage.getItem(key);

  if (!saved) {
    return [];
  }

  return JSON.parse(saved);
}

export function removeMovie(movieId, key = "History") {
  let saved = getSavedMovies(key);
  let newList = [];

  for (let i = 0; i < saved.length; i++) {
    if (saved[i].id !== movieId) {
      newList.push(saved[i]);
    }
  }

  localStorage.setItem(key, JSON.stringify(newList));
}

export function clearAllMovies(key = "History") {
  localStorage.removeItem(key);
}
