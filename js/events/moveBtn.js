function setupMoveBtn(containerId, prevBtnId, nextBtnId) {
    const container = document.getElementById(containerId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);

    if (!container || !prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', () => {
        container.scrollBy({ left: -300, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        container.scrollBy({ left: 300, behavior: 'smooth' });
    });

    // 🖱️ Drag
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

        moved = Math.abs(walk);
        container.scrollLeft = scrollLeft - walk;
    });

    container.dataset.moved = 0;

    container.addEventListener('mousemove', () => {
        container.dataset.moved = moved;
    });
}

function setupItemClick() {
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.item');

        if (!item) return;

        console.log("CLICK detectado");

        const id = item.dataset.id;
        const type = item.dataset.type;

        if (!id || !type) return;

        window.location.href = `detail.html?id=${id}&type=${type}`;
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