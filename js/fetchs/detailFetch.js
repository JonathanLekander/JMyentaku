import { addToHistory } from '../storage/historyStorage.js';
import { getFavorites, isFavorite } from '../storage/favoriteStorage.js';
import { openFavoriteModal } from "../events/favoriteFormHandler.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const type = urlParams.get('type');

let currentItem = null;

async function loadDetail() {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/${type}/${id}`);
        const data = await response.json();
        const item = data.data;
        currentItem = item;
        
        const title = type === 'people' ? item.name : item.title;
        const imageUrl = item.images?.jpg?.image_url;
        
        addToHistory(type, item.mal_id, title, imageUrl, {
            score: item.score,
            episodes: item.episodes,
            status: item.status
        });

        displayDetail(item);
    } catch (error) {
        document.getElementById('detail-content').innerHTML = '<p>Error loading details</p>';
        console.error(error);
    }
}

function displayDetail(item) {
    const container = document.getElementById('detail-content');

    const title = type === 'people' ? item.name : item.title;
    const image = type === 'people'
        ? item.images.jpg.image_url
        : item.images.jpg.large_image_url;

    const trailerUrl = item.trailer?.embed_url || null;
    
    // Verificar 
    const isFav = isFavorite(item.mal_id.toString(), type);

    container.innerHTML = `    

    <div class="detail-layout">

        <button class="back-btn" id="back-btn">
            <i class="fas fa-arrow-left"></i>
        </button>
        
        <!-- IMAGEN + STATS -->
        <div class="aside-detail">
            <img src="${image}" alt="${title}">

            <!-- Botón de favoritos -->
            <button class="detail-fav-btn ${isFav ? 'active' : ''}" 
                    data-id="${item.mal_id}" 
                    data-type="${type}"
                    data-title="${title}"
                    data-image="${image}">
                <i class="${isFav ? 'fas fa-bookmark' : 'far fa-bookmark'}"></i>
                <span>${isFav ? 'Saved to Favorites' : 'Save to Favorites'}</span>
            </button>

            <div class="stats">
                ${item.score ? `<p><i class="fas fa-star"></i> <strong>Score:</strong> <span class="stat-value">${item.score}</span></p>` : ''}
                ${item.popularity ? `<p><i class="fas fa-chart-line"></i> <strong>Popularity:</strong> <span class="stat-value">#${item.popularity}</span></p>` : ''}
                ${item.favorites ? `<p><i class="fas fa-heart"></i> <strong>Favorites:</strong> <span class="stat-value">${item.favorites.toLocaleString()}</span></p>` : ''}
                ${item.episodes ? `<p><i class="fas fa-play-circle"></i> <strong>Episodes:</strong> <span class="stat-value">${item.episodes}</span></p>` : ''}
                ${item.duration ? `<p><i class="fas fa-clock"></i> <strong>Duration:</strong> <span class="stat-value">${item.duration}</span></p>` : ''}
                ${item.rank ? `<p><i class="fas fa-trophy"></i> <strong>Rank:</strong> <span class="stat-value">#${item.rank}</span></p>` : ''}
                ${item.status ? `<p><i class="fas fa-info-circle"></i> <strong>Status:</strong> <span class="stat-value">${item.status}</span></p>` : ''}
                ${item.year ? `<p><i class="fas fa-calendar"></i> <strong>Year:</strong> <span class="stat-value">${item.year}</span></p>` : ''}
            </div>
        </div>

        <!-- TEXTO + TRAILER -->
        <div class="detail">
            <h1>${title}</h1>
            ${item.title_japanese ? `<p class="japanese-title">${item.title_japanese}</p>` : ''}

            <p><strong>${type === 'people' ? 'About' : 'Synopsis'}:</strong> 
            ${item.synopsis || item.about || 'No information available'}</p>

            ${trailerUrl ? `
            <div class="trailer-container">
                <h3><i class="fas fa-video"></i> Trailer</h3>
                <iframe src="${trailerUrl}" allowfullscreen></iframe>
            </div>
            ` : ''}
        </div>

    </div>
    `;
    
   
    const favBtn = document.querySelector('.detail-fav-btn');
    if (favBtn) {
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            openFavoriteModal({
                id: favBtn.dataset.id,
                type: favBtn.dataset.type,
                title: favBtn.dataset.title,
                image: favBtn.dataset.image
            }, favBtn);
        });
    }
}

function setupDetailEvents() {
    document.addEventListener("click", (e) => {
        if (e.target.id === "back-btn") {
            window.history.back();
        }
    });
}

window.addEventListener('favoriteAdded', (e) => {
    const { id, type: favType } = e.detail;
    
    // verificar si el favorito agregado corresponde al item actual
    if (id === currentItem?.mal_id?.toString() && favType === type) {
        const favBtn = document.querySelector('.detail-fav-btn');
        if (favBtn) {
            favBtn.classList.add('active');
            const icon = favBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bookmark';
            }
            const span = favBtn.querySelector('span');
            if (span) {
                span.textContent = 'Saved to Favorites';
            }
        }
    }
});

loadDetail();
setupDetailEvents();