import { loadHistory, clearHistory } from './getMovie.js';

window.addEventListener('DOMContentLoaded', () => {
    loadHistory();
});

$document.getElementById('clearHistory')?.addEventListener('click', clearHistory);