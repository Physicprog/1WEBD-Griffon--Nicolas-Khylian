import { loadHistory, clearHistory } from './getMovie.js';

// Charge l'historique au démarrage
window.addEventListener('DOMContentLoaded', () => {
    loadHistory();
});

// Bouton clear history
document.getElementById('clearHistory')?.addEventListener('click', clearHistory);