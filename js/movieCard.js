import { sendNotification } from "./utils/notif.js";
import { saveMovie, getSavedMovies, removeMovie } from "./utils/FavLocalStorage.js";
import { API_KEY, BASE_URL } from "./api.js";


export function movieToDico(movie) {
  // Convertit l'objet movie venant de l'API en dictionnaire
  const dict = {};
  if (!movie) return {};

  for (const key in movie) {
    let value = movie[key];
    switch (true) {

      case value === null:
        value = "null";
        break;
      case value === true || value === false:
        value = value ? "true" : "false";
        break;

      case value && value.constructor === Object:
        value = "object";
        break;

      default:
        value = String(value);
    }
    dict[key] = value;
  }
  return dict;
}

export function createRuntime(movie) {
  const dict = movieToDico(movie);
  const runtime = parseInt(dict.runtime);

  if (!runtime || runtime === "null" || runtime === "0") {
    return "Not available";
  }
  const runtimeInMinutes = parseInt(runtime);

  if (isNaN(runtimeInMinutes) || runtimeInMinutes === 0) {
    return "Not available";
  }

  if (runtimeInMinutes >= 60) {
    const h = Math.floor(runtimeInMinutes / 60);
    const m = runtimeInMinutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }

  return `${runtimeInMinutes}min`;
}

export function createFavoriteButton(movie) {
  const button = document.createElement("img");

  button.className = "favorite-btn";
  button.alt = "Favorite";

  const savedMovies = getSavedMovies("History");
  let isFavorite = false;
  for (let i = 0; i < savedMovies.length; i++) {
    if (savedMovies[i].id === movie.id) {
      isFavorite = true;
      break;
    }
  }

  if (isFavorite) {
    button.src = "./Assets/img/1.png";
  } else {
    button.src = "./Assets/img/2.png";
  }

  button.addEventListener("click", function (event) {
    event.stopPropagation();

    const savedMoviesNow = getSavedMovies("History");
    let isFavoriteNow = false;
    for (let i = 0; i < savedMoviesNow.length; i++) {
      if (savedMoviesNow[i].id === movie.id) {
        isFavoriteNow = true;
        break;
      }
    }

    if (isFavoriteNow) {
      removeMovie(movie.id, "History");
      button.src = "./Assets/img/2.png";
      sendNotification(`"${movie.title}" removed from favorites!`, false, 3000);
    } else {
      saveMovie(movie, "History");
      button.src = "./Assets/img/1.png";
      sendNotification(`"${movie.title}" added to favorites!`, true, 3000);
    }
  });

  return button;
}

export function createNoteLetterbox(movie) {
  const dict = movieToDico(movie);
  const p = document.createElement("p");
  const popularity = Math.round(dict.popularity);
  p.textContent = popularity;
  return p;
}

export function createStarRating(movie) {
  const dict = movieToDico(movie);
  const rate = Math.round(parseFloat(dict.vote_average) / 2);

  const container = document.createElement("div");
  container.className = "rate";

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

    if (i <= rate) {
      star.src = "./Assets/img/fav.png";
      star.setAttribute("alt", "Rating images");
    } else {
      star.src = "./Assets/img/nofav.png";
      star.setAttribute("alt", "No rating images");
    }

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

export function createDVDDate(movie) {
  const dict = movieToDico(movie);
  let dates;
  if (dict) {
    dates = dict.release_dates;
  }

  if (!dates || dates.length === 0) {
    const d = "Not able to get the date";
    return d;
  }

  const d = new Date(dates[0].release_date);
  return d.toISOString().slice(0, 10); //convertit en date AAAA-MM-JJ
}

export function OriginalLanguage(movie) {
  let lang;
  const dico = movieToDico(movie);
  if (dico) {
    lang = dico.original_language;
  }
  const p = document.createElement("p");

  const languageNames = {
    en: "English",
    fr: "French",
    es: "Spanish",
    de: "German",
    it: "Italian",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    pt: "Portuguese",
    ru: "Russian",
    ar: "Arabic",
    hi: "Hindi",
    nl: "Dutch",
    sv: "Swedish",
    no: "Norwegian",
    da: "Danish",
    pl: "Polish"
  };

  if (!lang || lang === "null") {
    p.textContent = "Language not available";
  } else if (languageNames[lang]) {
    p.textContent = languageNames[lang];
  } else {
    p.textContent = lang;
  }

  return p;
}

export function formatDate(dateString) {
  if (!dateString || typeof dateString !== "string") {
    return;
  }
  const parts = dateString.split("-");

  if (parts.length !== 3) {
    return dateString;
  }
  const [year, month, day] = parts;
  return `${day}-${month}-${year}`;
}

export function createCastSection(credits) {
  const section = document.createElement("div");
  section.className = "cast-section";

  if (!credits || !Array.isArray(credits.cast) || credits.cast.length === 0) {
    return section;
  }

  const title = document.createElement("h3");
  title.textContent = "Main actors";
  section.appendChild(title);

  const list = document.createElement("div");
  list.className = "cast-list";

  for (let i = 0; i < 5 && i < credits.cast.length; i++) {
    list.appendChild(createActorCard(credits.cast[i]));
  }

  section.appendChild(list);
  return section;
}

export function createActorCard(actor) {
  const card = document.createElement("div");
  card.className = "actor-card";

  const name = document.createElement("p");
  name.className = "actor-name";
  name.textContent = actor.name;
  card.appendChild(name);

  return card;
}

export function formatMoney(amount) {
  const num = Number(amount);
  if (num >= 1000000000) {
    return `${Math.round(num / 1000000000)} Billions $`;
  }
  if (num >= 1000000) {
    return `${Math.round(num / 1000000)} Millions $`;
  }

  return `${num}$`;
}

export function createMovieCost(movie) {
  const dict = movieToDico(movie);
  const p = document.createElement("p");
  const cost = Math.round(dict.budget);

  if (cost == null || isNaN(cost) || cost === 0) {
    p.textContent = "Cost not available";
    return p;
  }

  p.textContent = formatMoney(cost);
  return p;
}

export async function fetchCredits(movieId) {
  const url = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-EN`;
  const response = await fetch(url);
  if (!response.ok) {
    return;
  }

  return await response.json();

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
  const dict = movieToDico(movie);
  const img = document.createElement("img");
  const chemin = dict.poster_path;

  if (!chemin || chemin === "null" || chemin === null) {
    img.src = "./Assets/img/NoPreview.gif";
    img.classList.add("no-preview");
    img.setAttribute("alt", "No Movie Poster");
  } else {
    img.src = "https://image.tmdb.org/t/p/w500/" + chemin;
    img.setAttribute("alt", "Movie Poster");
  }

  return img;
}

export function createBackdropImage(movie) {
  const dict = movieToDico(movie);
  const backdropImg = document.querySelector(".details-backdrop img");
  const chemin = dict.backdrop_path;

  if (!chemin || chemin === "null" || chemin === null) {
    backdropImg.src = "Assets/img/NoBackdrop.gif";
    backdropImg.style.minHeight = "100vh";
  } else {
    backdropImg.src = `https://image.tmdb.org/t/p/original${chemin}`;
    backdropImg.style.filter = "saturate(0) contrast(1.5) blur(2px)";
  }
}

export function createMovieTitle(movie, cat = "card") {
  const dict = movieToDico(movie);
  const h5 = document.createElement("h5");
  const textMovie = dict.title;

  if (!textMovie || textMovie === "null") {
    h5.textContent = "Title not available";
    return h5;
  }

  const max = 18;
  let finalTitle = textMovie;
  if (cat === "details") {
    finalTitle = textMovie;
  } else
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

export function createMovieElement(movie, options = ["title", "rating", "year", "overview", "poster", "backdrop", "letterbox", "cost", "gain", "profit",], smallOverview = true, cat = "card", select = true) {
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
