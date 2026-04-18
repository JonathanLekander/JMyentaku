document.addEventListener("DOMContentLoaded", loadFavorites);

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

async function loadFavorites() {
    const container = document.getElementById("favorites-list");
    if (!container) return; // 

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
        const results = [];

        for (let id of favorites) {
            try {
                const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);

                if (!res.ok) {
                    console.log("ID inválido:", id);
                    continue;
                }

                const data = await res.json();

                if (!data.data) continue;

                results.push(data.data);

                // ⏱ evitar 429
                await new Promise(r => setTimeout(r, 300));

            } catch (err) {
                console.log("Error con ID:", id);
            }
        }

        if (results.length === 0) {
            container.innerHTML = `
                <div class="empty-message">
                    No se pudieron cargar favoritos
                </div>
            `;
            return;
        }

        container.innerHTML = "";

        results.forEach(anime => { 
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