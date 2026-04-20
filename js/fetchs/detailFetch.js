import { addToHistory } from '../storage/historyStorage.js';

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const type = urlParams.get('type');

async function loadDetail() {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/${type}/${id}`);
        const data = await response.json();
        const item = data.data;
        
        if (type === 'anime' || type === 'manga' || type === 'people') {
            const title = type === 'people' ? item.name : item.title;
            const imageUrl = item.images?.jpg?.image_url;
            
            addToHistory(
                type,                        
                item.mal_id,                 
                title,                       
                imageUrl,                    
                {
                    score: item.score,
                    episodes: item.episodes,
                    status: item.status
                }
            );
        }
        
        displayDetail(item);
    } catch (error) {
        document.getElementById('detail-content').innerHTML = '<p>Error loading details</p>';
        console.error(error);
    }
}

function displayDetail(item) {
    const container = document.getElementById('detail-content');
    
    if (type === 'anime') {
        const trailerUrl = item.trailer?.embed_url || null;
        container.innerHTML = `
        <div class="detail-layout">
            <aside class="aside-detail">
                <img src="${item.images.jpg.large_image_url}" alt="${item.title}">
                <div class="stats">
                    <p><i class="fas fa-star"></i> <strong>Score:</strong> ${item.score || 'N/A'}</p>
                    <p><i class="fas fa-heart"></i> <strong>Favorites:</strong> ${item.favorites || 'N/A'}</p>
                    <p><i class="fas fa-play-circle"></i> <strong>Episodes:</strong> ${item.episodes || 'N/A'}</p>
                    <p><i class="fas fa-clock"></i> <strong>Duration:</strong> ${item.duration || 'N/A'}</p>
                    <p><i class="fas fa-trophy"></i> <strong>Rank:</strong> #${item.rank || 'N/A'}</p>
                    <p><i class="fas fa-chart-line"></i> <strong>Popularity:</strong> #${item.popularity || 'N/A'}</p>
                    <p><i class="fas fa-info-circle"></i> <strong>Status:</strong> ${item.status || 'N/A'}</p>
                    <p><i class="fas fa-calendar"></i> <strong>Year:</strong> ${item.year || 'N/A'}</p>
                </div>
            </aside>
            
            <div class="detail">
                <h1> ${item.title}</h1>
                <p class="japanese-title">${item.title_japanese || ''}</p>
                <p><i class="fas fa-align-left"></i> <strong>Synopsis:</strong> ${item.synopsis || 'No synopsis available'}</p>
                ${trailerUrl ? `
                    <div class="trailer-container">
                        <h3><i class="fas fa-video"></i> Trailer</h3>
                        <iframe src="${trailerUrl}"></iframe>
                    </div>
                ` : '<p><i class="fas fa-video-slash"></i> No trailer available</p>'}
            </div>
        </div>
        `;}
        else if (type === 'manga') {
            container.innerHTML = `
            <div class="detail-layout">
                <aside class="aside-detail">
                    <img src="${item.images.jpg.large_image_url}" alt="${item.title}">
                    <div class="stats">
                        <p><i class="fas fa-star"></i> <strong>Score:</strong> ${item.score || 'N/A'}</p>
                        <p><i class="fas fa-heart"></i> <strong>Favorites:</strong> ${item.favorites || 'N/A'}</p>
                        <p><i class="fas fa-book"></i> <strong>Volumes:</strong> ${item.volumes || 'N/A'}</p>
                        <p><i class="fas fa-book-open"></i> <strong>Chapters:</strong> ${item.chapters || 'N/A'}</p>
                        <p><i class="fas fa-trophy"></i> <strong>Rank:</strong> #${item.rank || 'N/A'}</p>
                        <p><i class="fas fa-chart-line"></i> <strong>Popularity:</strong> #${item.popularity || 'N/A'}</p>
                        <p><i class="fas fa-user-pen"></i> <strong>Authors:</strong> ${item.authors?.map(a => a.name).join(', ') || 'N/A'}</p>
                    </div>
                </aside>
                
                <div class="detail">
                    <h1> ${item.title}</h1>
                    <p class="japanese-title">${item.title_japanese || ''}</p>
                    <p><i class="fas fa-align-left"></i> <strong>Synopsis:</strong> ${item.synopsis || 'No synopsis available'}</p>
                    <div class="detail-genres">
                        <h3><i class="fas fa-tags"></i> Genres</h3>
                        <p>${item.genres.map(g => g.name).join(', ') || 'N/A'}</p>
                    </div>
                </div>
            </div>
            `;}
    else if (type === 'people') {
        container.innerHTML = `
        <div class="detail-layout">
            <aside class="aside-detail">
                <img src="${item.images.jpg.image_url}" alt="${item.name}">
                <div class="stats">
                    <p><i class="fas fa-user"></i> <strong>Given Name:</strong> ${item.given_name || 'N/A'}</p>
                    <p><i class="fas fa-user-tie"></i> <strong>Family Name:</strong> ${item.family_name || 'N/A'}</p>
                    <p><i class="fas fa-heart"></i> <strong>Favorites:</strong> ${item.favorites || 'N/A'}</p>
                </div>
            </aside>
            
            <div class="detail">
                <h1>${item.name}</h1>
                <p><i class="fas fa-align-left"></i> <strong>About:</strong> ${item.about || 'No biography available'}</p>
            </div>
        </div>
        `;
    }
}

loadDetail();