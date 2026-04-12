const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const type = urlParams.get('type');

async function loadDetail() {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/${type}/${id}`);
        const data = await response.json();
        displayDetail(data.data);
    } catch (error) {
        document.getElementById('detail-content').innerHTML = '<p>Error loading details</p>';
        console.error(error);
    }
}

function displayDetail(item) {
    const container = document.getElementById('detail-content');
    
    if (type === 'anime') {
        container.innerHTML = `
            <div class="detail">
                <img src="${item.images.jpg.large_image_url}" alt="${item.title}">
                <h1>${item.title}</h1>
                <p><strong>Japanese Title:</strong> ${item.title_japanese || 'N/A'}</p>
                <p><strong>Score:</strong> ${item.score || 'N/A'}</p>
                <p><strong>Episodes:</strong> ${item.episodes || 'N/A'}</p>
                <p><strong>Status:</strong> ${item.status || 'N/A'}</p>
                <p><strong>Year:</strong> ${item.year || 'N/A'}</p>
                <p><strong>Genres:</strong> ${item.genres.map(g => g.name).join(', ')}</p>
                <p><strong>Synopsis:</strong> ${item.synopsis || 'No synopsis available'}</p>
                <br><br>
                <a href="home.html">← Back to Home</a>
            </div>
        `;}
        else if (type === 'manga') {
        container.innerHTML = `
            <div class="detail">
                <img src="${item.images.jpg.large_image_url}" alt="${item.title}">
                <h1>${item.title}</h1>
                <p><strong>Score:</strong> ${item.score || 'N/A'}</p>
                <p><strong>Volumes:</strong> ${item.volumes || 'N/A'}</p>
                <p><strong>Chapters:</strong> ${item.chapters || 'N/A'}</p>
                <p><strong>Status:</strong> ${item.status || 'N/A'}</p>
                <p><strong>Synopsis:</strong> ${item.synopsis || 'No synopsis available'}</p>

                <br><br>
                <a href="home.html">← Back to Home</a>
            </div>
        `;} 
        else if (type === 'people') {
        container.innerHTML = `
            <div class="detail">
                <img src="${item.images.jpg.image_url}" alt="${item.name}">
                <h1>${item.name}</h1>
                <p><strong>Given Name:</strong> ${item.given_name || 'N/A'}</p>
                <p><strong>Favorites:</strong> ${item.favorites || 'N/A'}</p>
                <p><strong>About:</strong> ${item.about || 'No biography available'}</p>
                <br><br>
                <a href="home.html">← Back to Home</a>
            </div>
        `;
    }
}

loadDetail();