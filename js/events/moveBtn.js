function setupMoveBtn(containerId, prevBtnId, nextBtnId) {
    const container = document.getElementById(containerId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);

    if (!container || !prevBtn || !nextBtn) return;

    // Botones
    prevBtn.addEventListener('click', () => {
        container.scrollBy({ left: -300, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        container.scrollBy({ left: 300, behavior: 'smooth' });
    });

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let moved = 0;

    container.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX;
        scrollLeft = container.scrollLeft;
        moved = 0;
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;

        const x = e.pageX;
        const walk = x - startX;

        moved += Math.abs(walk); //acumulamos movimiento

        container.scrollLeft = scrollLeft - walk;
    });

    container.addEventListener('click', (e) => {
        if (moved > 10) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
}

function setupItemClick() {
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        item.addEventListener('click', (e) => {
            console.log("CLICK detectado"); // 👈 para debug

            const id = item.dataset.id;
            const type = item.dataset.type;

            window.location.href = `detail.html?id=${id}&type=${type}`;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        setupMoveBtn('top-animes', 'prev-animes', 'next-animes');
        setupMoveBtn('top-mangas', 'prev-mangas', 'next-mangas');
        setupMoveBtn('top-actors', 'prev-actors', 'next-actors');
        
        setupItemClick();
    }, 1000);
});