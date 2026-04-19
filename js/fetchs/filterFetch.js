import { loadWithPagination } from '../fetchs/paginationFetch.js';

function buildUrl(page = 1, type = 'anime') {
    const search = document.getElementById('search-input')?.value;
    const genre = document.getElementById('genre-select')?.value;
    const dateSort = document.getElementById('date-sort')?.value;
    const scoreSort = document.getElementById('score-sort')?.value;

    let url = `https://api.jikan.moe/v4/${type}?page=${page}`;

    if (search) url += `&q=${search}`;
    if (genre) url += `&genres=${genre}`;

    if (scoreSort) {
        url += `&order_by=score&sort=${scoreSort}`;
    } else if (dateSort) {
        url += `&order_by=start_date&sort=${dateSort}`;
    }

    return url;
}


async function loadGenres(type) {
    const select = document.getElementById('genre-select');
    if (!select) return;

    try {
        const response = await fetch(`https://api.jikan.moe/v4/genres/${type}`);

        if (response.status === 429) {
            console.log('Rate limit genres...');
            setTimeout(() => loadGenres(type), 500);
            return;
        }

        const data = await response.json();

        if (!data.data) return; 

        select.innerHTML = '<option value="">All Genres</option>';

        data.data.forEach(g => {
            const option = document.createElement('option');
            option.value = g.mal_id;
            option.textContent = g.name;
            select.appendChild(option);
        });

    } catch (err) {
        console.error('Error genres:', err);
    }
}


function setupFilters(type) {
    const inputs = document.querySelectorAll('#search-input, #genre-select, #date-sort, #score-sort');

    inputs.forEach(el => {
        el.addEventListener('change', () => {
            loadWithPagination(1, type);
        });
    });

   
    document.getElementById('search-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadWithPagination(1, type);
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.toLowerCase();

    if (path.includes('anime')) {
        loadGenres('anime');
        setupFilters('anime');
        loadWithPagination(1, 'anime');
    }

    if (path.includes('manga')) {
        loadGenres('manga');
        setupFilters('manga');
        loadWithPagination(1, 'manga');
    }
});