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
            document.getElementById(contenedorId).innerHTML = '<p>Error al cargar</p>';
        });
}

document.getElementById('top-animes').innerHTML = '<p>Cargando animes...</p>';
document.getElementById('top-mangas').innerHTML = '<p>Cargando mangas...</p>';
document.getElementById('top-actors').innerHTML = '<p>Cargando actores...</p>';

// TOP Animes
cargarDatos('https://api.jikan.moe/v4/top/anime?limit=5', 'top-animes', anime => `
    <div class="item">
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
        <div class="info">
            <strong>${anime.title}</strong> - Score: ${anime.score || 'N/A'} - Episodes: ${anime.episodes || 'N/A'}
            <p>${anime.synopsis ? anime.synopsis.substring(0, 500) + '...' : 'Sin descripción'}</p>
        </div>
    </div>
    <hr>
`);

// TOP Mangas
cargarDatos('https://api.jikan.moe/v4/top/manga?limit=5', 'top-mangas', manga => `
    <div class="item">
        <img src="${manga.images.jpg.image_url}" alt="${manga.title}">
        <div class="info">
            <strong>${manga.title}</strong> - Score: ${manga.score || 'N/A'} - Chapters: ${manga.chapters || 'N/A'}
            <p>${manga.synopsis ? manga.synopsis.substring(0, 500) + '...' : 'Sin descripción'}</p>
        </div>
    </div>
    <hr>
`);

// TOP Actores
cargarDatos('https://api.jikan.moe/v4/top/people?limit=5', 'top-actors', actor => `
    <div class="item">
        <img src="${actor.images.jpg.image_url}" alt="${actor.name}">
        <div class="info">
            <strong>${actor.name}</strong> - Favorites: ${actor.favorites || 'N/A'}
        </div>
    </div>
    <hr>
`);

//nota "?" es if ":" es else "=>" es función flecha, lo podemos hacer de otra manera pero con esto el codigo queda mas corto y legible, el "||" es para mostrar "N/A" si no hay puntuación o episodios disponibles.