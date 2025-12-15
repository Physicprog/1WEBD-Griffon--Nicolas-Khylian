import {
  loadHistory,
  clearHistory,
  loadMovieDetails,
  loadTendance,
  loadRandomMovies,
} from "./getMovie.js";

window.addEventListener("DOMContentLoaded", () => {
  loadTendance();
  loadRandomMovies();
  loadMovieDetails();
  loadHistory();

  const clearBtn = document.getElementById("clearHistory");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearHistory);
  }
});
