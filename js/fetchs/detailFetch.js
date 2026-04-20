import { addToHistory } from '../storage/historyStorage.js';

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const type = urlParams.get('type');

async function loadDetail() {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/${type}/${id}`);
        const data = await response.json();
        const item = data.data;
        
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

    container.innerHTML = `
    <div class="detail-layout">

        <!-- IMAGEN + STATS -->
        <div class="aside-detail">
            <img src="${image}" alt="${title}">

            <div class="stats">
                ${item.score ? `<p><i class="fas fa-star"></i> Score: ${item.score}</p>` : ''}
                ${item.favorites ? `<p><i class="fas fa-heart"></i> Favorites: ${item.favorites}</p>` : ''}
                ${item.episodes ? `<p><i class="fas fa-play-circle"></i> Episodes: ${item.episodes}</p>` : ''}
                ${item.duration ? `<p><i class="fas fa-clock"></i> Duration: ${item.duration}</p>` : ''}
                ${item.rank ? `<p><i class="fas fa-trophy"></i> Rank: #${item.rank}</p>` : ''}
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
}

loadDetail();