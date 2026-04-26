import { showSpinner } from "../UI/spinner.js";
import { fetchWithRetry } from "../utils/fetchWithRetry.js";
import { showToast } from "../UI/notifications.js";

async function fetchData(url, containerId, mapItem, errorMessage = "Error loading data") {
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    showSpinner(container);

    try {
        const data = await fetchWithRetry(url, {}, 3, 1000);

        if (!data.data || data.data.length === 0) {
            container.innerHTML = '<p>No data available</p>';
            return;
        }

        container.innerHTML = '';
        data.data.forEach(item => {
            container.innerHTML += mapItem(item);
        });

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = `<p class="error-message">${errorMessage}. Please try again later.</p>`;
        showToast(errorMessage, "error");
    }
}

//TOP ANIMES
fetchData('https://api.jikan.moe/v4/top/anime?limit=10', 'top-animes', anime => `
    <div class="item" data-id="${anime.mal_id}" data-type="anime">
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}" loading="lazy">
        <div class="item-info">
            <div class="item-title">${anime.title}</div>
            <div class="item-stats">
                <i class="fas fa-star"></i> ${anime.score || 'N/A'} 
                <i class="fas fa-play-circle"></i> ${anime.episodes || 'N/A'} eps
                <i class="fas fa-heart"></i> ${anime.favorites || 'N/A'} faves
            </div>
            <div class="item-desc">${anime.synopsis ? anime.synopsis.substring(0, 120) + '...' : 'No description'}</div>
        </div>
    </div>
`, "Failed to load top animes");

//TOP MANGAS
fetchData('https://api.jikan.moe/v4/top/manga?limit=5', 'top-mangas', manga => `
    <div class="item" data-id="${manga.mal_id}" data-type="manga">
        <img src="${manga.images.jpg.image_url}" alt="${manga.title}" loading="lazy">
        <div class="item-info">
            <div class="item-title">${manga.title}</div>
            <div class="item-stats">
                <i class="fas fa-star"></i> ${manga.score || 'N/A'}
                <i class="fas fa-heart"></i> ${manga.favorites || 'N/A'} faves
                <i class="fas fa-book"></i> ${manga.volumes || 'N/A'} vols
            </div>
            <div class="item-desc">${manga.synopsis ? manga.synopsis.substring(0, 120) + '...' : 'No description'}</div>
        </div>
    </div>
`, "Failed to load top mangas");

//TOP ACTORS
fetchData('https://api.jikan.moe/v4/top/people?limit=5', 'top-actors', actor => `
    <div class="item" data-id="${actor.mal_id}" data-type="people">
        <img src="${actor.images.jpg.image_url}" alt="${actor.name}" loading="lazy">
        <div class="item-info">
            <div class="item-title">${actor.name}</div>
            <div class="item-stats">
                <i class="fas fa-heart"></i> ${actor.favorites || 'N/A'} favorites
                <i class="fas fa-user"></i> ${actor.given_name || 'N/A'} 
            </div>
            <div class="item-desc">${actor.about ? actor.about.substring(0, 120) + '...' : 'No biography'}</div>
        </div>
    </div>
`, "Failed to load top voice actors");

//nota "?" es if ":" es else "=>" es función flecha, lo podemos hacer de otra manera pero con esto el codigo queda mas corto y legible, el "||" es para mostrar "N/A" si no hay puntuación o episodios disponibles.