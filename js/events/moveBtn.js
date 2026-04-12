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
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    container.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });
    
    container.addEventListener('mouseleave', () => {
        isDown = false;
    });
    
    container.addEventListener('mouseup', () => {
        isDown = false;
    });
    
    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollLeft - walk;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        setupMoveBtn('top-animes', 'prev-animes', 'next-animes');
        setupMoveBtn('top-mangas', 'prev-mangas', 'next-mangas');
        setupMoveBtn('top-actors', 'prev-actors', 'next-actors');
    }, 500);
});