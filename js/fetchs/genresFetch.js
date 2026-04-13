async function loadGenres(type) {
    const container = document.getElementById('genres-container');

    if (!container) return;

    try {
        const response = await fetch(`https://api.jikan.moe/v4/genres/${type}`);
        const data = await response.json();

        container.innerHTML = "";

        // 👉 botón "Todos"
        const allBtn = document.createElement('div');
        allBtn.classList.add('genre-btn', 'active');
        allBtn.textContent = "Todos";
        container.appendChild(allBtn);

        data.data.forEach(genre => {
            const btn = document.createElement('div');
            btn.classList.add('genre-btn');
            btn.textContent = genre.name;

            btn.addEventListener('click', () => {
                document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                console.log("Genero seleccionado:", genre.mal_id);
                // 👉 después acá vas a filtrar
            });

            container.appendChild(btn);
        });

    } catch (error) {
        console.error("Error cargando géneros:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.toLowerCase();

    if (path.includes('anime')) {
        loadGenres('anime');
    } else if (path.includes('manga')) {
        loadGenres('manga');
    }
});

//mover las flechitas de generos
function setupGenresScroll() {
    const container = document.getElementById('genres-container');
    const prev = document.getElementById('genres-prev');
    const next = document.getElementById('genres-next');

    if (!container || !prev || !next) return;

    next.addEventListener('click', () => {
        container.scrollBy({ left: 120, behavior: 'smooth' });
    });

    prev.addEventListener('click', () => {
        container.scrollBy({ left: -120, behavior: 'smooth' });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.toLowerCase();

    if (path.includes('anime')) {
        loadGenres('anime');
    } else if (path.includes('manga')) {
        loadGenres('manga');
    }

    setupGenresScroll();
});

if (container.scrollWidth <= container.clientWidth) {
    prev.style.display = 'none';
    next.style.display = 'none';
}

