document.addEventListener("DOMContentLoaded", loadFavorites);

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

async function loadFavorites() {
    const container = document.getElementById("favorites-list");
    const favorites = getFavorites();

    
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                ⭐ Aún no hay favoritos
            </div>
        `;
        return;
    }

    container.innerHTML = "<div>Loading...</div>";

    try {
        const promises = favorites.map(id =>
            fetch(`https://api.jikan.moe/v4/anime/${id}`)
                .then(res => res.json())
        );

        const results = await Promise.all(promises);

        container.innerHTML = "";

        results.forEach(res => {
            const anime = res.data;

            const card = document.createElement("div");
            card.classList.add("item");

            card.innerHTML = `
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <div class="item-info">
                    <div class="item-title">${anime.title}</div>
                    ${anime.score ? `<div class="item-stats"> ✰ ${anime.score}</div>` : ''}
                </div>
            `;

            card.addEventListener("click", () => {
                window.location.href = `detail.html?id=${anime.mal_id}&type=anime`;
            });

            container.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="error-message">
                Error cargando favoritos
            </div>
        `;
    }
}