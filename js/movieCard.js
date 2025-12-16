import { sendNotification } from "./utils/notif.js";
import {
  saveMovie,
  getSavedMovies,
  removeMovie,
} from "./utils/FavLocalStorage.js";
import { API_KEY, BASE_URL } from "./api.js";

export function movieToDico(movie) {
  if (!movie) return {};
  const dict = {};
  for (let i in movie) {
    let value = movie[i];
    switch (true) {
      case value === null:
        value = "null";
        break;
      case typeof value === "boolean":
        value = value ? "true" : "false";
        break;
      case typeof value === "object":
        value = "object";
        break;
      default:
        value = String(value);
    }
    dict[i] = value;
  }
  return dict;
}

export function getImageUrl(path, size = "w500") {
  if (!path || path === "null" || path === null) {
    return null;
  }
  const baseSize = size === "original" ? "original" : size;
  return `https://image.tmdb.org/t/p/${baseSize}${path}`;
}

export function getPosterUrl(movie) {
  const dict = movieToDico(movie);
  return getImageUrl(dict.poster_path, "w500") || "./Assets/img/NoPreview.gif";
}

export function getBackdropUrl(movie) {
  const dict = movieToDico(movie);
  return (
    getImageUrl(dict.backdrop_path, "original") || "./Assets/img/NoBackdrop.gif"
  );
}

export function createRuntime(movie) {
  const dict = movieToDico(movie);
  const p = document.createElement("p");
  const runtime = parseInt(dict.runtime);
  if (!runtime || runtime === 0) {
    p.textContent = "Runtime not available";
    return p;
  }
  p.textContent = `${runtime} min`;
  return p;
}

export function createFavoriteButton(movie) {
  const button = document.createElement("img");
  button.className = "favorite-btn";
  button.alt = "Favorite";

  const updateButtonState = () => {
    const savedMovies = getSavedMovies("History");
    const isFavorite = savedMovies.some((m) => m.id === movie.id);
    button.src = isFavorite ? "./Assets/img/1.png" : "./Assets/img/2.png";
    return isFavorite;
  };

  updateButtonState();

  button.addEventListener("click", function (event) {
    event.stopPropagation();
    const isFavorite = updateButtonState();

    if (isFavorite) {
      removeMovie(movie.id, "History");
      sendNotification(`"${movie.title}" removed from favorites!`, false, 3000);
    } else {
      saveMovie(movie, "History");
      sendNotification(`"${movie.title}" added to favorites!`, true, 3000);
    }

    updateButtonState();
  });

  return button;
}

export function createStarRating(movie) {
  const dict = movieToDico(movie);
  const rate = Math.round(parseFloat(dict.vote_average) / 2);

  const container = document.createElement("div");
  container.className = "rate";
  container.setAttribute("data-aos", "zoom-in");
  container.setAttribute("data-aos-duration", "2100");

  container.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  if (rate === 0) {
    const p = document.createElement("p");
    p.textContent = "Not rated yet";
    container.appendChild(p);
    container.appendChild(createFavoriteButton(movie));
    return container;
  }

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("img");
    star.src = i <= rate ? "./Assets/img/fav.png" : "./Assets/img/nofav.png";
    star.className = "star";
    container.appendChild(star);
  }

  container.appendChild(createFavoriteButton(movie));
  return container;
}

export function createLetterboxNote(movie) {
  const dict = movieToDico(movie);
  const p = document.createElement("p");
  const popularity = Math.round(dict.popularity);
  p.textContent = popularity;
  return p;
}

export function formatDate(dateString) {
  if (!dateString || typeof dateString !== "string") {
    console.log("invalid date format");
    return "Date not available";
  }

  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;

  const [year, month, day] = parts;
  return `${day}-${month}-${year}`;
}

export function createLanguageMovie(movie) {
  const dict = movieToDico(movie);
  const p = document.createElement("p");
  const language = dict.original_language.toUpperCase();
  p.textContent = language;
  return p;
}

export function formatMoney(amount) {
  const num = Number(amount);
  if (num >= 1000000000) {
    return `${Math.round(num / 1000000000)} Billions $`;
  }
  if (num >= 1000000) {
    return `${Math.round(num / 1000000)} Millions $`;
  }
  return `${num.toLocaleString()}$`;
}

export function createActorCard(actor, showRole = false) {
  const card = document.createElement("div");
  card.className = showRole ? "actor" : "actor-card";

  const name = document.createElement("p");
  name.className = "actor-name";
  name.textContent = actor.name;
  card.appendChild(name);

  if (showRole && actor.character) {
    const role = document.createElement("span");
    role.className = "actor-role";
    role.textContent = actor.character;
    card.appendChild(role);
  }

  return card;
}

export function createCastSection(credits, showRole = false, maxActors = 5) {
  const section = document.createElement("div");
  section.className = showRole ? "details-cast" : "cast-section";

  if (!credits || !Array.isArray(credits.cast) || credits.cast.length === 0) {
    return section;
  }

  if (!showRole) {
    const title = document.createElement("h3");
    title.textContent = "Main actors";
    section.appendChild(title);
  }

  const list = document.createElement("div");
  list.className = showRole ? "" : "cast-list";

  const actorCount = Math.min(maxActors, credits.cast.length);
  for (let i = 0; i < actorCount; i++) {
    list.appendChild(createActorCard(credits.cast[i], showRole));
  }

  section.appendChild(list);
  return section;
}

export function createGenresSection(genres) {
  const container = document.createElement("div");
  container.className = "details-genres";

  if (!genres || !Array.isArray(genres) || genres.length === 0) {
    return container;
  }

  genres.forEach((genre) => {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-aos", "zoom-in");
    wrapper.setAttribute("data-aos-duration", "1000");

    const tag = document.createElement("span");
    tag.className = "genre-tag";
    tag.textContent = genre.name;

    wrapper.appendChild(tag);
    container.appendChild(wrapper);
  });

  return container;
}

export function createMovieCost(movie) {
  const dict = movieToDico(movie);
  const p = document.createElement("p");
  const cost = Math.round(dict.budget);

  if (!cost || cost === 0) {
    p.textContent = "Cost not available";
    return p;
  }

  p.textContent = cost;
  return p;
}

export function createMovieGain(movie) {
  const dict = movieToDico(movie);
  const p = document.createElement("p");
  const gain = Math.round(dict.revenue);
  if (!gain || gain === 0) {
    p.textContent = "Gain not available";
    return p;
  }
  p.textContent = gain;
  return p;
}

export function createMovieProfit(movie) {
  const dict = movieToDico(movie);
  const p = document.createElement("p");
  const profit = Math.round(dict.revenue - dict.budget);
  if (!profit) {
    p.textContent = "Profit not available";
    return p;
  }
  p.textContent = profit;
  return p;
}

export function createMovieImage(movie) {
  const img = document.createElement("img");
  const posterUrl = getPosterUrl(movie);

  img.src = posterUrl;
  if (posterUrl === "./Assets/img/NoPreview.gif") {
    img.classList.add("no-preview");
  }

  return img;
}

export function createBackdropImage(movie) {
  const backdropImg = document.querySelector(".details-backdrop img");
  const backdropUrl = getBackdropUrl(movie);

  backdropImg.src = backdropUrl;
}

export function createMovieTitle(movie) {
  const dict = movieToDico(movie);
  const h5 = document.createElement("h5");
  const textMovie = dict.title;

  if (!textMovie || textMovie === "null") {
    h5.textContent = "Title not available";
    return h5;
  }

  const max = 18;
  let finalTitle = textMovie;
  if (textMovie.length > max) {
    finalTitle = textMovie.slice(0, max) + "...";
    h5.addEventListener("click", function (event) {
      event.stopPropagation();
      sendNotification(`Movie Title: ${textMovie}`, true, 4500);
    });
  }

  h5.textContent = finalTitle;
  return h5;
}

export function createMovieYear(movie) {
  const dict = movieToDico(movie);
  const p = document.createElement("p");
  const date = dict.release_date;

  if (!date || date === "null" || date.length < 4) {
    p.textContent = "Date not available";
    return p;
  }

  const annee = date.substring(0, 4);
  p.textContent = annee;
  return p;
}

export function caption(movie, smallOverview = false) {
  const dict = movieToDico(movie);
  const p = document.createElement("p");
  var text = dict.overview;

  if (!text || text === "null") {
    p.textContent = "Description not available";
    return p;
  }

  if (smallOverview === true) {
    const max = 40;
    if (text.length > max) {
      text = text.slice(0, max) + "...";
    }
  }

  p.textContent = text;
  return p;
}

export async function fetchCredits(movieId) {
  const url = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-EN`;
  const response = await fetch(url);
  if (!response.ok) {
    console.log("credit error");
    return null;
  }
  return await response.json();
}

export function createMovieElement(
  movie,
  options = [
    "title",
    "rating",
    "year",
    "overview",
    "poster",
    "backdrop",
    "letterbox",
    "cost",
    "gain",
    "profit",
  ],
  smallOverview = true,
  cat = "card",
  select = true
) {
  const element = document.createElement("div");
  const container = document.createElement("div");

  if (cat === "card") {
    element.className = "card";
    container.className = "container";
  } else if (cat === "details") {
    element.className = "movie-details-card";
    container.className = "movie-details-content";
  } else {
    console.error("Error: unknown category for movie element");
    return element;
  }

  options.forEach((option) => {
    switch (option) {
      case "backdrop":
        element.appendChild(createBackdropImage(movie));
        break;
      case "poster":
        container.appendChild(createMovieImage(movie));
        break;
      case "title":
        container.appendChild(createMovieTitle(movie));
        break;
      case "rating":
        container.appendChild(createStarRating(movie));
        break;
      case "year":
        container.appendChild(createMovieYear(movie));
        break;
      case "overview":
        container.appendChild(caption(movie, smallOverview));
        break;
      case "letterbox":
        container.appendChild(createLetterboxNote(movie));
        break;
      case "cost":
        container.appendChild(createMovieCost(movie));
        break;
      case "gain":
        container.appendChild(createMovieGain(movie));
        break;
      case "profit":
        container.appendChild(createMovieProfit(movie));
        break;
      case "runtime":
        container.appendChild(createRuntime(movie));
        break;
    }
  });

  element.appendChild(container);

  if (cat === "card" && select) {
    element.addEventListener("click", () => {
      localStorage.setItem("selectedMovie", JSON.stringify(movie));
      window.location.href = `movie.html`;
    });
  }

  return element;
}
