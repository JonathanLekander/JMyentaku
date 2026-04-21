const KEY = "favorites";

export function getFavorites() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function saveFavorites(favorites) {
    localStorage.setItem(KEY, JSON.stringify(favorites));
}

export function addFavorite(item) {
    const favorites = getFavorites();

    const exists = favorites.some(
        f => f.id === item.id && f.type === item.type
    );

    if (!exists) {
        favorites.push(item);
        saveFavorites(favorites);
    }
}

export function removeFavorite(id, type) {
    let favorites = getFavorites();

    favorites = favorites.filter(
        f => !(f.id === id && f.type === type)
    );

    saveFavorites(favorites);
}

export function isFavorite(id, type) {
    const favorites = getFavorites();

    return favorites.some(
        f => f.id === id && f.type === type
    );
}