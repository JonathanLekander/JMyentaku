import { getFavorites, removeFavorite } from '../storage/favoriteStorage.js';
import { showSpinner } from "../UI/spinner.js";

let allFavoritesItems = [];
let currentSearchTerm = '';
let currentTypeFilter = 'all';

document.addEventListener("DOMContentLoaded", () => {
    loadFavorites();
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.toLowerCase();
            filterAndDisplayFavorites();
        });
    }
    
    const typeFilter = document.getElementById('type-filter');
    if (typeFilter) {
        typeFilter.addEventListener('change', (e) => {
            currentTypeFilter = e.target.value;
            filterAndDisplayFavorites();
        });
    }
});

async function loadFavorites() {
    const container = document.getElementById("favorites-list");
    if (!container) return;

    const favorites = getFavorites();  

    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                ⭐ There are no favorites yet! ⭐
            </div>
        `;
        return;
    }

    showSpinner(container);

    try {
        const results = [];

        for (let fav of favorites) {
            try {
                const res = await fetch(`https://api.jikan.moe/v4/${fav.type}/${fav.id}`);

                if (!res.ok) {
                    console.log("Invalid ID:", fav.id);
                    continue;
                }

                const data = await res.json();

                if (!data.data) continue;

                results.push({
                    ...data.data,
                    itemType: fav.type,
                    preferences: fav.preferences || null, 
                    createdAt: fav.createdAt || null
                });

                await new Promise(r => setTimeout(r, 300));

            } catch (err) {
                console.log("Error with ID:", fav.id);
            }
        }

        if (results.length === 0) {
            container.innerHTML = `
                <div class="empty-message">
                    Favorites could not be loaded. Please try again later.
                </div>
            `;
            return;
        }

        allFavoritesItems = results;
        filterAndDisplayFavorites();

    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="error-message">
                Error loading favorites. Please try again later.
            </div>
        `;
    }
}

function filterAndDisplayFavorites() {
    const container = document.getElementById("favorites-list");
    
    let filtered = [...allFavoritesItems];
    
    if (currentTypeFilter !== 'all') {
        filtered = filtered.filter(item => item.itemType === currentTypeFilter);
    }
    
    if (currentSearchTerm) {
        filtered = filtered.filter(item => {
            const title = (item.title || item.name || '').toLowerCase();
            const category = (item.preferences?.category || '').toLowerCase();
            const note = (item.preferences?.note || '').toLowerCase();
            return title.includes(currentSearchTerm) || 
                   category.includes(currentSearchTerm) || 
                   note.includes(currentSearchTerm);
        });
    }
    
    filtered.sort((a, b) => {
        const priorityA = a.preferences?.priority || 0;
        const priorityB = b.preferences?.priority || 0;
        return priorityB - priorityA;
    });
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                No favorites match your filters.
            </div>
        `;
        return;
    }
    
    container.innerHTML = "";
    
    filtered.forEach(item => { 
        const card = document.createElement("div");
        card.classList.add("item");
        
        card.dataset.id = item.mal_id;
        card.dataset.type = item.itemType;

        const title = item.title || item.name;
        const typeLabel = item.itemType === 'anime' ? 'ANIME' : 'MANGA';
        const prefs = item.preferences;
        
       //calculo de prioridad, lo vemos en la barra de progreso 
        const priorityPercent = prefs ? (prefs.priority / 5) * 100 : 0;
        
        // Mostrar estrellas segim prioridad
        const priorityStars = prefs ? "⭐".repeat(prefs.priority) : "";

        card.innerHTML = `
            <img src="${item.images.jpg.image_url}" alt="${title}">
            
            <button class="fav-btn active" data-id="${item.mal_id}" data-type="${item.itemType}">
                <i class="fas fa-bookmark"></i>
            </button>
            
            <div class="item-info">
                <div class="item-title">${title}</div>
                <div class="item-stats">
                    ${item.score ? `<i class="fas fa-star"></i> ${item.score}` : ''}
                    <span style="margin-left: 8px; font-size: 10px; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 10px;">
                        ${typeLabel}
                    </span>
                </div>
                
                ${prefs ? `
                <div class="preferences-info">
                    <!-- Prioridad -->
                    <div class="priority-row">
                        <div class="priority-header">
                            <span><i class="fas fa-chart-line"></i> Priority</span>
                            <span class="priority-value-badge">${priorityStars} ${prefs.priority}/5</span>
                        </div>
                        <div class="priority-bar-container">
                            <div class="priority-bar" style="width: ${priorityPercent}%;"></div>
                        </div>
                    </div>
                    
                    <!-- Categoría -->
                    <div class="category-row">
                        <i class="fas fa-tag"></i>
                        <span class="category-tag">${escapeHtml(prefs.category)}</span>
                    </div>
                    
                    <!-- Nota -->
                    ${prefs.note ? `
                    <div class="note-row">
                        <i class="fas fa-quote-left"></i>
                        <span class="note-text">"${escapeHtml(prefs.note.substring(0, 100))}${prefs.note.length > 100 ? '...' : ''}"</span>
                    </div>
                    ` : ''}
                </div>
                ` : ''}
            </div>
        `;

        card.addEventListener("click", (e) => {
            if (!e.target.closest('.fav-btn')) {
                window.location.href = `detail.html?id=${item.mal_id}&type=${item.itemType}`;
            }
        });

        container.appendChild(card);
    });
}


document.addEventListener("click", (e) => {
    const btn = e.target.closest(".fav-btn");
    
    if (btn) {
        e.stopPropagation();
        
        const id = btn.dataset.id;
        const type = btn.dataset.type;
        
        if (type && id) {
            removeFavorite(type, id);
            
            allFavoritesItems = allFavoritesItems.filter(item => 
                !(item.mal_id.toString() === id && item.itemType === type)
            );
            
            filterAndDisplayFavorites();
        }
    }
});