const HISTORY_KEY = 'viewing_history';
const MAX_HISTORY_ITEMS = 50; 

export const ACTION_TYPES = {
    VIEW_ANIME: 'view_anime',
    VIEW_MANGA: 'view_manga',
    VIEW_PEOPLE: 'view_people',
    SEARCH: 'search'
};


export function getHistory() {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

export function addToHistory(type, id, title, imageUrl, extraData = {}) {
    const history = getHistory();
    
    const newItem = {
        id: `${type}_${id}`, 
        type: type,
        contentId: id,
        title: title,
        imageUrl: imageUrl,
        timestamp: Date.now(),
        date: new Date().toISOString(),
        ...extraData
    };
    
    const lastItem = history[0];
    if (lastItem && lastItem.contentId === id && lastItem.type === type) {
      
        lastItem.timestamp = Date.now();
        lastItem.date = new Date().toISOString();
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        return;
    }
    
    history.unshift(newItem);
    
    if (history.length > MAX_HISTORY_ITEMS) {
        history.pop();
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}


export function removeFromHistory(id) {
    const history = getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
}

export function clearHistory() {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
}

export function getHistoryByType(type) {
    const history = getHistory();
    return history.filter(item => item.type === type);
}