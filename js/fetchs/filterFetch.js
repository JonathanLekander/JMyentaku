async function loadGenres(type) {
    const container = document.getElementById('genres-container');
    if (!container) return;

    try {
        const response = await fetch(`https://api.jikan.moe/v4/genres/${type}`);
        const data = await response.json();

        container.innerHTML = '';

        const allBtn = document.createElement('div');
        allBtn.classList.add('genre-btn', 'active');
        allBtn.textContent = 'ALL';
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
                loadWithPagination(1, type, genre.mal_id);
            });
            container.appendChild(btn);
        });

        setupGenresScroll();

    } catch (error) {
        console.error('Error cargando géneros:', error);
        container.innerHTML = '<div class="error-message">Error loading genres</div>';
    }
}

function setupGenresScroll() {
    const container = document.getElementById('genres-container');
    const prev = document.getElementById('genres-prev');
    const next = document.getElementById('genres-next');

    if (!container || !prev || !next) return;

    const scrollAmount = () => {
        const firstBtn = container.querySelector('.genre-btn');
        return firstBtn ? firstBtn.offsetWidth + 12 : 200;
    };

    next.addEventListener('click', () => {
        container.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });

    prev.addEventListener('click', () => {
        container.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
}

// Inicializar según la página actual
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.toLowerCase();

    if (path.includes('anime')) {
        loadGenres('anime');
        loadWithPagination(1, 'anime', null);
    } else if (path.includes('manga')) {
        loadGenres('manga');
        loadWithPagination(1, 'manga', null);
    }
});