export function getFavorites(type) {
    const key = `favorites_${type}`;
    return JSON.parse(localStorage.getItem(key)) || [];
}

export function getAllFavorites() {
    const animeFavs = getFavorites('anime').map(id => ({ id, type: 'anime' }));
    const mangaFavs = getFavorites('manga').map(id => ({ id, type: 'manga' }));
    return [...animeFavs, ...mangaFavs];
}


export function setFavorites(type, favorites) {
    const key = `favorites_${type}`;
    localStorage.setItem(key, JSON.stringify(favorites));
}

export function addFavorite(type, id) {
    const favorites = getFavorites(type);
    const idString = id.toString();
    
    if (!favorites.includes(idString)) {
        favorites.push(idString);
        setFavorites(type, favorites);
        return true;
    }
    return false;
}

export function removeFavorite(type, id) {
    const favorites = getFavorites(type);
    const idString = id.toString();
    const newFavorites = favorites.filter(fav => fav !== idString);
    
    if (newFavorites.length !== favorites.length) {
        setFavorites(type, newFavorites);
        return true;
    }
    return false;
}

export function isFavorite(type, id) {
    const favorites = getFavorites(type);
    return favorites.includes(id.toString());
}

export function toggleFavorite(type, id) {
    if (isFavorite(type, id)) {
        removeFavorite(type, id);
        return false;
    } else {
        addFavorite(type, id);
        return true;
    }
}