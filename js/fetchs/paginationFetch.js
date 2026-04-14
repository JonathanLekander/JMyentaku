let currentPage = 1;
let currentType = 'anime';
let currentGenre = null;

// 👉 CARGAR CON PAGINACIÓN
async function loadWithPagination(page = 1, type = 'anime', genreId = null) {
    const container = document.getElementById('anime-list');

    if (!container) return;

    currentPage = page;
    currentType = type;
    currentGenre = genreId;

    try {
        container.innerHTML = "<p>Cargando...</p>";

        let url = `https://api.jikan.moe/v4/${type}?page=${page}`;

        if (genreId) {
            url += `&genres=${genreId}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        displayItems(data.data, type);
        renderPagination(data.pagination);

    } catch (error) {
        container.innerHTML = "<p>Error</p>";
        console.error(error);
    }
}

//render

function renderPagination(pagination) {
    const container = document.getElementById('pagination');
    if (!container) return;

    container.innerHTML = "";

    const totalPages = pagination.last_visible_page;

    // flecha
    const prev = document.createElement('button');
    prev.classList.add('page-btn', 'page-arrow');
    prev.innerHTML = '‹';
    prev.disabled = currentPage === 1;

    prev.addEventListener('click', () => {
        loadWithPagination(currentPage - 1, currentType, currentGenre);
    });

    container.appendChild(prev);

    
    for (let i = 1; i <= Math.min(3, totalPages); i++) {
        const btn = createPageButton(i);
        container.appendChild(btn);
    }

    //si hay muchas paginas
    if (totalPages > 4) {
        const dots = document.createElement('span');
        dots.textContent = "...";
        dots.style.color = "#888";
        container.appendChild(dots);
    }

    // ultima pagina
    if (totalPages > 3) {
        const lastBtn = createPageButton(totalPages);
        container.appendChild(lastBtn);
    }

    // flecha
    const next = document.createElement('button');
    next.classList.add('page-btn', 'page-arrow');
    next.innerHTML = '›';
    next.disabled = currentPage === totalPages;

    next.addEventListener('click', () => {
        loadWithPagination(currentPage + 1, currentType, currentGenre);
    });

    container.appendChild(next);
}

function createPageButton(page) {
    const btn = document.createElement('button');
    btn.classList.add('page-btn');
    btn.textContent = page;

    if (page === currentPage) {
        btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
        loadWithPagination(page, currentType, currentGenre);
    });

    return btn;
}

