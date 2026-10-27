/* ==========================================================================
   FAVORIS PARTAGÉS (écran A : ade.html, écran B : main.html)
   Un favori = un ensemble de calques (liste d'ids de timetables.js),
   conservé dans le navigateur.
   ========================================================================== */

// Couleur d'identification de chaque calque (selon sa position dans timetables)
const LAYER_COLORS = ["#f472b6", "#2dd4bf", "#fb923c", "#a3e635", "#facc15"];
const layerColor = (t) => LAYER_COLORS[timetables.indexOf(t) % LAYER_COLORS.length];

const FAVORITES_KEY = 'ade-favorites';

function loadFavorites() {
    try {
        const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
        // Ignorer les ids qui ne correspondent plus à aucun emploi du temps
        return saved
            .map(ids => ids.filter(id => timetables.some(t => t.id === id)))
            .filter(ids => ids.length);
    } catch {
        return [];
    }
}

function saveFavorites(favorites) {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
        // Stockage indisponible (navigation privée...) : favoris gardés pour cette page seulement
    }
}

// Même ensemble de calques, quel que soit l'ordre
function sameSet(ids, list) {
    return ids.length === list.length && ids.every(id => list.some(t => t.id === id));
}

// Apparence d'un favori : ses calques, sa pastille (couleurs des calques) et son icône
function describeFavorite(ids) {
    const favLayers = timetables.filter(t => ids.includes(t.id));
    const colors = favLayers.map(layerColor);
    const slice = 100 / colors.length;
    return {
        layers: favLayers,
        background: colors.length === 1
            ? colors[0]
            : `conic-gradient(${colors.map((c, i) => `${c} ${i * slice}% ${(i + 1) * slice}%`).join(', ')})`,
        icon: favLayers.length === 1 ? favLayers[0].icon : 'fa-layer-group'
    };
}

// Raccourci d'un favori : pastille aux couleurs de ses calques.
// onOpen(calques) est appelé au clic avec les emplois du temps du favori.
function createFavoriteButton(ids, onOpen) {
    const fav = describeFavorite(ids);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tt-btn tt-fav';
    btn.style.background = fav.background;
    btn.title = fav.layers.map(t => t.label).join('\n');
    btn.setAttribute('aria-label', t('favorite', { labels: fav.layers.map(layer => layer.label).join(' + ') }));
    btn.innerHTML = `<i class="fa-solid ${fav.icon}"></i>`;
    btn.addEventListener('click', () => onOpen(fav.layers));
    return btn;
}
