import { getHistory, clearHistory, removeFromHistory } from '../storage/historyStorage.js';

function loadHistory() {
    const container = document.getElementById('history-list');
    if (!container) return;
    
    const history = getHistory();
    
    if (history.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-history"></i> No history yet.
                <p>Start exploring animes and mangas!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    history.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('item');
        card.dataset.id = item.contentId;
        card.dataset.type = item.type;
        
        const date = new Date(item.timestamp);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        
        let typeIcon = '';
        let typeLabel = '';
        if (item.type === 'anime') {
            typeIcon = '<i class="fas fa-film"></i>';
            typeLabel = 'ANIME';
        } else if (item.type === 'manga') {
            typeIcon = '<i class="fas fa-book-open"></i>';
            typeLabel = 'MANGA';
        }
        else if (item.type === 'people') {
            typeIcon = '<i class="fas fa-microphone"></i>';
            typeLabel = 'VOICE ACTOR';
        }
                
        card.innerHTML = `
            <img src="${item.imageUrl || '../Images/placeholder.jpg'}" alt="${item.title}">
            <button class="remove-history-btn" data-id="${item.id}">
                <i class="fas fa-times"></i>
            </button>
            <div class="item-info">
                <div class="item-title">${item.title}</div>
                <div class="item-stats">
                    ${typeIcon} ${typeLabel}
                    <span class="history-date">
                        <i class="fas fa-clock"></i> ${formattedDate}
                    </span>
                </div>
                ${item.score ? `<div class="item-stats"><i class="fas fa-star"></i> ${item.score}</div>` : ''}
            </div>
        `;
        
        if (item.type !== 'search') {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.remove-history-btn')) {
                    window.location.href = `detail.html?id=${item.contentId}&type=${item.type}`;
                }
            });
        }
        
        container.appendChild(card);
    });
}

// delete item individual
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.remove-history-btn');
    if (btn) {
        e.stopPropagation();
        const id = btn.dataset.id;
        removeFromHistory(id);
        loadHistory();
    }
});


const clearBtn = document.getElementById('clear-history-btn');
const confirmDialog = document.getElementById('confirm-dialog');
const dialogConfirm = document.getElementById('dialog-confirm');
const dialogCancel = document.getElementById('dialog-cancel');

if (clearBtn && confirmDialog) {
    clearBtn.addEventListener('click', () => {
        confirmDialog.showModal();
    });
    
    dialogConfirm?.addEventListener('click', () => {
        clearHistory();
        loadHistory();
        confirmDialog.close();
    });
    
    dialogCancel?.addEventListener('click', () => {
        confirmDialog.close();
    });
    
   
    confirmDialog.addEventListener('click', (e) => {
        if (e.target === confirmDialog) {
            confirmDialog.close();
        }
    });
}


document.addEventListener('DOMContentLoaded', loadHistory);