import { getAllFavorites, removeFavorite } from '../storage/favoriteStorage.js';

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

    const favorites = getAllFavorites();  

    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                ⭐ There are not favorites yet! ⭐
            </div>
        `;
        return;
    }

    container.innerHTML = "<div>Loading...</div>";

    try {
        const results = [];

        for (let fav of favorites) {
            try {
                const res = await fetch(`https://api.jikan.moe/v4/${fav.type}/${fav.id}`);

                if (!res.ok) {
                    console.log("ID inválido:", fav.id);
                    continue;
                }

                const data = await res.json();

                if (!data.data) continue;

                results.push({ ...data.data, itemType: fav.type });

                await new Promise(r => setTimeout(r, 300));

            } catch (err) {
                console.log("Error con ID:", fav.id);
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
            return title.includes(currentSearchTerm);
        });
    }
    
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

        card.innerHTML = `
            <img src="${item.images.jpg.image_url}" alt="${title}">
            
            <button class="fav-btn active" data-id="${item.mal_id}" data-type="${item.itemType}">
                ★
            </button>
            
            <div class="item-info">
                <div class="item-title">${title}</div>
                <div class="item-stats">
                    ${item.score ? `✰ ${item.score}` : ''}
                    <span style="margin-left: 8px; font-size: 10px; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 10px;">
                        ${typeLabel}
                    </span>
                </div>
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