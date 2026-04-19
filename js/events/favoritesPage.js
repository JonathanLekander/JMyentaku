import { getAllFavorites, removeFavorite } from '../storage/favoriteStorage.js';

document.addEventListener("DOMContentLoaded", loadFavorites);

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

        container.innerHTML = "";

        results.forEach(item => { 
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

    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="error-message">
                Error loading favorites. Please try again later.
            </div>
        `;
    }
}


document.addEventListener("click", (e) => {
    const btn = e.target.closest(".fav-btn");
    
    if (btn) {
        e.stopPropagation();
        
        const id = btn.dataset.id;
        const type = btn.dataset.type;
        
        if (type && id) {
          
            removeFavorite(type, id);
            
            
            const card = btn.closest('.item');
            if (card) {
                card.remove();
            }
            
            const remainingFavorites = getAllFavorites();
            const container = document.getElementById("favorites-list");
            
            if (remainingFavorites.length === 0 && container) {
                container.innerHTML = `
                    <div class="empty-message">
                        ⭐ There are not favorites yet! ⭐
                    </div>
                `;
            }
        }
    }
});