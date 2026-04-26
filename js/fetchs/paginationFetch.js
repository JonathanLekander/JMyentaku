import { getFavorites } from '../storage/favoriteStorage.js';
import { buildUrl } from './filterFetch.js';
import { openFavoriteModal } from "../events/favoriteFormHandler.js";
import { showSpinner } from "../UI/spinner.js";
import { fetchWithRetry } from "../utils/fetchWithRetry.js";
import { showToast } from "../UI/notifications.js";

let currentPage = 1;
let currentType = 'anime';
let currentGenre = null;

export async function loadWithPagination(page = 1, type = 'anime', genreId = null) {
    const container = document.getElementById('anime-list');
    if (!container) return;

    currentPage = page;
    currentType = type;
    currentGenre = genreId;

    try {
        showSpinner(container);

        let url;
        if (typeof buildUrl === 'function') {
            url = buildUrl(page, type);
        } else {
            url = `https://api.jikan.moe/v4/${type}?page=${page}`;
        }

        const data = await fetchWithRetry(url, {}, 3, 1000);
        
        if (!data.data || data.data.length === 0) {
            container.innerHTML = '<div class="empty-message">No items found</div>';
            renderPaginationFromAPI({ current_page: 1, has_next_page: false });
            return;
        }
        
        displayItems(data.data, type);
        renderPaginationFromAPI(data.pagination);

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i> 
                Error loading data. Please try again later.
            </div>
        `;
        showToast("Failed to load data. Please refresh the page.", "error");
    }
}

function renderPaginationFromAPI(pagination) {
    const container = document.getElementById('pagination');
    if (!container) return;

    container.innerHTML = '';

    if (pagination.current_page > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = ' < prev ';
        prevBtn.classList.add('page-btn', 'page-prev');
        prevBtn.addEventListener('click', () => {
            loadWithPagination(currentPage - 1, currentType, currentGenre);
        });
        container.appendChild(prevBtn);
    }

    const pageInfo = document.createElement('span');
    pageInfo.textContent = `page ${pagination.current_page}`;
    pageInfo.classList.add('page-info');
    container.appendChild(pageInfo);

    if (pagination.has_next_page) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = ' next >';
        nextBtn.classList.add('page-btn', 'page-next');
        nextBtn.addEventListener('click', () => {
            loadWithPagination(currentPage + 1, currentType, currentGenre);
        });
        container.appendChild(nextBtn);
    }
}

function displayItems(items, type) {
    const container = document.getElementById('anime-list');
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = '<div class="empty-message">No items found</div>';
        return;
    }

    container.innerHTML = '';

    const favorites = getFavorites();

    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('item');
        card.dataset.id = item.mal_id;
        card.dataset.type = type;

        const title = item.title || item.name || 'N/A';
        const imageUrl = item.images?.jpg?.image_url || '../Images/placeholder.jpg';

        const isFav = favorites.some(fav => fav.id === item.mal_id.toString() && fav.type === type);

        let statsHtml = '';
        if (item.score) statsHtml += `<i class="fas fa-star"></i> ${item.score} `;
        
        if (type === 'anime') {
            if (item.episodes) statsHtml += `<i class="fas fa-play-circle"></i> ${item.episodes} eps `;
            if (item.favorites) statsHtml += `<i class="fas fa-heart"></i> ${item.favorites} faves`;
        } else if (type === 'manga') {
            if (item.volumes) statsHtml += `<i class="fas fa-book"></i> ${item.volumes} vols `;
            if (item.chapters) statsHtml += `<i class="fas fa-book-open"></i> ${item.chapters} ch`;
        }

        card.innerHTML = `
            <img src="${imageUrl}" alt="${title}" loading="lazy">
            <button 
                class="fav-btn ${isFav ? 'active' : ''}" 
                data-id="${item.mal_id}" 
                data-type="${type}"
                data-title="${title}"
                data-image="${imageUrl}"
            >
                <i class="${isFav ? 'fas fa-bookmark' : 'far fa-bookmark'}"></i>
            </button>
            <div class="item-info">
                <div class="item-title">${title}</div>
                <div class="item-stats">${statsHtml}</div>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('.fav-btn')) return;
            window.location.href = `detail.html?id=${item.mal_id}&type=${type}`;
        });

        container.appendChild(card);
    });
}

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".fav-btn");
    if (!btn) return;

    openFavoriteModal({
        id: btn.dataset.id,
        type: btn.dataset.type,
        title: btn.dataset.title,
        image: btn.dataset.image
    }, btn);
});