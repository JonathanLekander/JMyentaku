let currentPage = 1;
let currentType = 'anime';
let currentGenre = null;

async function loadWithPagination(page = 1, type = 'anime', genreId = null) {
    const container = document.getElementById('anime-list');
    if (!container) return;

    currentPage = page;
    currentType = type;
    currentGenre = genreId;

    try {
        container.innerHTML = '<div class="loading-spinner"> Loading...</div>';

        let url = `https://api.jikan.moe/v4/${type}?page=${page}`;
        
        if (genreId) {
            url += `&genres=${genreId}`;
        }

        const response = await fetch(url);
        
        if (response.status === 429) {
            container.innerHTML = '<div class="error-message"> Too many requests. Please wait 2 seconds...</div>';
            setTimeout(() => loadWithPagination(page, type, genreId), 2000);
            return;
        }

        const data = await response.json();
        displayItems(data.data, type);
        renderPaginationFromAPI(data.pagination);

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<div class="error-message"> Error loading data...</div>';
    }
}

function renderPaginationFromAPI(pagination) {
    const container = document.getElementById('pagination');
    if (!container) return;

    container.innerHTML = '';

    if (pagination.current_page > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = ' < prev ';
        prevBtn.classList.add('page-btn', 'page-prev');
        prevBtn.addEventListener('click', () => {
            loadWithPagination(currentPage - 1, currentType, currentGenre);
        });
        container.appendChild(prevBtn);
    }

    // pag actual
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `page ${pagination.current_page}`;
    pageInfo.classList.add('page-info');
    container.appendChild(pageInfo);


    if (pagination.has_next_page) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = ' next >';
        nextBtn.classList.add('page-btn', 'page-next');
        nextBtn.addEventListener('click', () => {
            loadWithPagination(currentPage + 1, currentType, currentGenre);
        });
        container.appendChild(nextBtn);
    }
}

function displayItems(items, type) {
    const container = document.getElementById('anime-list');
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = '<div class="empty-message">No items found</div>';
        return;
    }

    container.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('item');
        card.dataset.id = item.mal_id;
        card.dataset.type = type;

        const title = item.title || item.name || 'N/A';
        const imageUrl = item.images?.jpg?.image_url || '../Images/placeholder.jpg';

        card.innerHTML = `
            <img src="${imageUrl}" alt="${title}" loading="lazy">
            <div class="item-info">
                <div class="item-title">${title}</div>
                ${item.score ? `<div class="item-stats"> ✰ ${item.score}</div>` : ''}
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `detail.html?id=${item.mal_id}&type=${type}`;
        });

        container.appendChild(card);
    });
}