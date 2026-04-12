function cargarDatos(url, contenedorId, mapearItem) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const contenedor = document.getElementById(contenedorId);
            contenedor.innerHTML = '';
            data.data.forEach(item => {
                contenedor.innerHTML += mapearItem(item);
            });
        })
        .catch(() => {
            document.getElementById(contenedorId).innerHTML = '<p>Error loading data</p>';
        });
}

document.getElementById('top-animes').innerHTML = '<p>Loading...</p>';
document.getElementById('top-mangas').innerHTML = '<p>Loading...</p>';
document.getElementById('top-actors').innerHTML = '<p>Loading...</p>';

// TOP Animes
cargarDatos('https://api.jikan.moe/v4/top/anime?limit=10', 'top-animes', anime => `
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
cargarDatos('https://api.jikan.moe/v4/top/manga?limit=5', 'top-mangas', manga => `
    <div class="item" data-id="${manga.mal_id}" data-type="manga">
        <img src="${manga.images.jpg.image_url}" alt="${manga.title}">
        <div class="item-info">
            <div class="item-title">${manga.title}</div>
            <div class="item-stats">Puntuación: ${manga.score || 'N/A'}</div>
            <div class="item-desc">${manga.synopsis || 'N/A'}</div>
        </div>
    </div>
`);

// TOP Actores
cargarDatos('https://api.jikan.moe/v4/top/people?limit=5', 'top-actors', actor => `
    <div class="item" data-id="${actor.mal_id}" data-type="people">
        <img src="${actor.images.jpg.image_url}" alt="${actor.name}">
        <div class="item-info">
            <div class="item-title">${actor.name}</div>
            <div class="item-stats">Favoritos: ${actor.favorites || 'N/A'}</div>
            <div class="item-desc">${actor.about || 'N/A'}</div>
        </div>
    </div>
`);

//nota "?" es if ":" es else "=>" es función flecha, lo podemos hacer de otra manera pero con esto el codigo queda mas corto y legible, el "||" es para mostrar "N/A" si no hay puntuación o episodios disponibles.