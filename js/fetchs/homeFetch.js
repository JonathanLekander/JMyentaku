async function fetchData(url, containerId, mapItem, delay = 0) {
    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    try {
        const response = await fetch(url);
        
        if (response.status === 429) {
            console.log('Rate limit, retrying...');
            await new Promise(resolve => setTimeout(resolve, 500));
            return fetchData(url, containerId, mapItem, 0);
        }
        
        const data = await response.json();
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        data.data.forEach(item => {
            container.innerHTML += mapItem(item);
        });
    } catch (error) {
        console.error('Error:', error);
        document.getElementById(containerId).innerHTML = '<p>Error loading data</p>';
    }
}

document.getElementById('top-animes').innerHTML = '<p>Loading...</p>';
document.getElementById('top-mangas').innerHTML = '<p>Loading...</p>';
document.getElementById('top-actors').innerHTML = '<p>Loading...</p>';

// TOP Animes
fetchData('https://api.jikan.moe/v4/top/anime?limit=10', 'top-animes', anime => `
    <div class="item" data-id="${anime.mal_id}" data-type="anime">
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
        <div class="item-info">
            <div class="item-title">${anime.title}</div>
            <div class="item-stats">Score: ${anime.score || 'N/A'} - Episodes: ${anime.episodes || 'N/A'}</div>
            <div class="item-desc">${anime.synopsis ? anime.synopsis.substring(0, 120) + '...' : 'No description'}</div>
        </div>
    </div>
`);

// TOP Mangas
fetchData('https://api.jikan.moe/v4/top/manga?limit=5', 'top-mangas', manga => `
    <div class="item" data-id="${manga.mal_id}" data-type="manga">
        <img src="${manga.images.jpg.image_url}" alt="${manga.title}">
        <div class="item-info">
            <div class="item-title">${manga.title}</div>
            <div class="item-stats">Score: ${manga.score || 'N/A'}</div>
            <div class="item-desc">${manga.synopsis || 'N/A'}</div>
        </div>
    </div>
`);

// TOP Actores
fetchData('https://api.jikan.moe/v4/top/people?limit=5', 'top-actors', actor => `
    <div class="item" data-id="${actor.mal_id}" data-type="people">
        <img src="${actor.images.jpg.image_url}" alt="${actor.name}">
        <div class="item-info">
            <div class="item-title">${actor.name}</div>
            <div class="item-stats">Favorites: ${actor.favorites || 'N/A'}</div>
            <div class="item-desc">${actor.about || 'N/A'}</div>
        </div>
    </div>
`);

//nota "?" es if ":" es else "=>" es función flecha, lo podemos hacer de otra manera pero con esto el codigo queda mas corto y legible, el "||" es para mostrar "N/A" si no hay puntuación o episodios disponibles.