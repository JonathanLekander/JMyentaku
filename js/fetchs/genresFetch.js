
async function loadByGenre(genreId, type) {
    const container = document.getElementById('anime-list');

    if (!container) return;

    try {
        container.innerHTML = "<p>Cargando...</p>";

        let url = `https://api.jikan.moe/v4/${type}`;

        if (genreId) {
            url += `?genres=${genreId}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        displayItems(data.data, type);

    } catch (error) {
        container.innerHTML = "<p>Error cargando contenido</p>";
        console.error(error);
    }
}


function displayItems(items, type) {
    const container = document.getElementById('anime-list');

    container.innerHTML = "";

    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('item');

        card.dataset.id = item.mal_id;
        card.dataset.type = type;

        card.innerHTML = `
            <img src="${item.images.jpg.image_url}" alt="${item.title}">
            <p>${item.title}</p>
        `;

        
        card.addEventListener('click', () => {
            window.location.href = `detail.html?id=${item.mal_id}&type=${type}`;
        });

        container.appendChild(card);
    });
}


async function loadGenres(type) {
    const container = document.getElementById('genres-container');

    if (!container) return;

    try {
        const response = await fetch(`https://api.jikan.moe/v4/genres/${type}`);
        const data = await response.json();

        container.innerHTML = "";

        
        const allBtn = document.createElement('div');
        allBtn.classList.add('genre-btn', 'active');
        allBtn.textContent = "Todos";

        allBtn.addEventListener('click', () => {
            document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
            allBtn.classList.add('active');

            loadWithPagination(1, type, null);
        });

        container.appendChild(allBtn);

        
        data.data.forEach(genre => {
            const btn = document.createElement('div');
            btn.classList.add('genre-btn');
            btn.textContent = genre.name;

            btn.addEventListener('click', () => {
                document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                loadWithPagination(1, type, genre.mal_id); // 👈 🔥 PAGINADO
            });

            container.appendChild(btn);
        });

        setTimeout(() => {
            setupGenresScroll();
        }, 100);

    } catch (error) {
        console.error("Error cargando géneros:", error);
    }
}

function setupGenresScroll() {
    const container = document.getElementById('genres-container');
    const prev = document.getElementById('genres-prev');
    const next = document.getElementById('genres-next');

    if (!container || !prev || !next) return;

    function getScrollAmount() {
        const firstItem = container.querySelector('.genre-btn');
        return firstItem ? firstItem.offsetWidth + 12 : 100; 
        // 👆 12 = gap
    }

    next.addEventListener('click', () => {
        container.scrollBy({
            left: getScrollAmount(),
            behavior: 'smooth'
        });
    });

    prev.addEventListener('click', () => {
        container.scrollBy({
            left: -getScrollAmount(),
            behavior: 'smooth'
        });
    });
}

// 👉 INIT
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.toLowerCase();

    if (path.includes('anime')) {
        loadGenres('anime');
        loadWithPagination(1, 'anime'); // 👈 🔥 CAMBIO
    } 
    else if (path.includes('manga')) {
        loadGenres('manga');
        loadWithPagination(1, 'manga'); // 👈 🔥 CAMBIO
    }
});



