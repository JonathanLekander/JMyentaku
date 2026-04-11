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
    <div>
        <strong>${anime.title}</strong> - Puntuación: ${anime.score || 'N/A'} - Episodios: ${anime.episodes || 'N/A'}
    </div>
    <hr>
`);

// TOP Mangas
cargarDatos('https://api.jikan.moe/v4/top/manga?limit=5', 'top-mangas', manga => `
    <div>
        <strong>${manga.title}</strong> - Puntuación: ${manga.score || 'N/A'}
    </div>
    <hr>
`);

// TOP Actores
cargarDatos('https://api.jikan.moe/v4/top/people?limit=5', 'top-actors', actor => `
    <div>
        <strong>${actor.name}</strong> - Favoritos: ${actor.favorites || 'N/A'} 
    </div>
    <hr>
`);