/* ==========================================================================
   PARAMÈTRES PARTAGÉS (écran A : ade.html, écran B : main.html)
   Langue (fr / en) et thème (clair / sombre), conservés dans le navigateur.
   À charger dans le <head> : le thème est appliqué avant l'affichage.
   ========================================================================== */
const SETTINGS_KEY = 'ade-settings';
const DEFAULT_SETTINGS = { lang: 'fr', theme: 'dark' };

/* ==========================================================================
   TRADUCTIONS
   Éléments statiques : attributs data-i18n (texte), data-i18n-aria (aria-label),
   data-i18n-title (infobulle), data-i18n-placeholder.
   Textes générés en JS : t('clé', { variable }).
   ========================================================================== */
const I18N = {
    fr: {
        pageSearch: "ADE - Recherche",
        pageTimetable: "Emploi du temps - ADE",
        search: "Recherche",
        searchAction: "Rechercher",
        clearSearch: "Effacer la recherche",
        hintNavigate: "Naviguer",
        hintEnter: "Entrée",
        hintSelect: "Sélectionner",
        hintEscape: "Échap",
        hintClose: "Fermer",
        close: "Fermer",
        noEvents: "Aucune séance ce jour-là.",
        eventCount: "{n} séance(s)",
        noResults: "Aucun résultat trouvé pour \"{query}\"",
        searchPlaceholder: "Rechercher un emploi du temps",
        addPlaceholder: "Ajouter…",
        removeLayer: "Retirer {label}",
        favorite: "Favori : {labels}",
        addFavorite: "Ajouter aux favoris",
        removeFavorite: "Retirer des favoris",
        allFavorites: "Tous les favoris",
        settings: "Paramètres",
        defaultView: "Par défaut",
        previous: "Précédent",
        next: "Suivant",
        export: "Exporter",
        subscription: "Lien d'abonnement",
        subscriptionHint: "Se met à jour tout seul dans votre agenda. Lien fictif : le vrai sera fourni par le serveur.",
        copy: "Copier",
        copied: "Copié !",
        downloadIcs: "Télécharger (.ics)",
        downloadIcsHint: "Séances de la période affichée ({range}), à importer dans un agenda.",
        print: "Imprimer / PDF",
        printHint: "Vue actuelle, via la fenêtre d'impression du navigateur.",
        calendar: "Calendrier",
        goToDate: "Aller à une date",
        previousMonth: "Mois précédent",
        nextMonth: "Mois suivant",
        zoomIn: "Vue plus détaillée",
        zoomOut: "Vue plus large",
        moreEvent: "+{n} autre",
        moreEvents: "+{n} autres",
        language: "Langue",
        theme: "Thème",
        light: "Clair",
        dark: "Sombre"
    },
    en: {
        pageSearch: "ADE - Search",
        pageTimetable: "Timetable - ADE",
        search: "Search",
        searchAction: "Search",
        clearSearch: "Clear search",
        hintNavigate: "Navigate",
        hintEnter: "Enter",
        hintSelect: "Select",
        hintEscape: "Esc",
        hintClose: "Close",
        close: "Close",
        noEvents: "No classes that day.",
        eventCount: "{n} class(es)",
        noResults: "No results for \"{query}\"",
        searchPlaceholder: "Search for a timetable",
        addPlaceholder: "Add…",
        removeLayer: "Remove {label}",
        favorite: "Favorite: {labels}",
        addFavorite: "Add to favorites",
        removeFavorite: "Remove from favorites",
        allFavorites: "All favorites",
        settings: "Settings",
        defaultView: "Default",
        previous: "Previous",
        next: "Next",
        export: "Export",
        subscription: "Subscription link",
        subscriptionHint: "Updates by itself in your calendar app. Placeholder link: the real one will come from the server.",
        copy: "Copy",
        copied: "Copied!",
        downloadIcs: "Download (.ics)",
        downloadIcsHint: "Classes for the period shown ({range}), to import into a calendar app.",
        print: "Print / PDF",
        printHint: "Current view, through the browser's print dialog.",
        calendar: "Calendar",
        goToDate: "Go to a date",
        previousMonth: "Previous month",
        nextMonth: "Next month",
        zoomIn: "More detailed view",
        zoomOut: "Wider view",
        moreEvent: "+{n} more",
        moreEvents: "+{n} more",
        language: "Language",
        theme: "Theme",
        light: "Light",
        dark: "Dark"
    }
};

/* ==========================================================================
   ÉTAT & PERSISTANCE
   ========================================================================== */
const settings = loadSettings();
applyTheme();

function loadSettings() {
    try {
        const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
        return {
            lang: saved.lang in I18N ? saved.lang : DEFAULT_SETTINGS.lang,
            theme: ['light', 'dark'].includes(saved.theme) ? saved.theme : DEFAULT_SETTINGS.theme
        };
    } catch {
        return { ...DEFAULT_SETTINGS };
    }
}

function saveSettings() {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
        // Stockage indisponible : réglages gardés pour cette page seulement
    }
}

// Change un réglage, l'applique partout et prévient la page (événement 'settingschange')
function setSetting(name, value) {
    settings[name] = value;
    saveSettings();
    applyTheme();
    applyTranslations();
    document.dispatchEvent(new CustomEvent('settingschange'));
}

function applyTheme() {
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.lang = settings.lang;
}

/* ==========================================================================
   TRADUCTION & FORMATS
   ========================================================================== */
function t(key, vars = {}) {
    const text = I18N[settings.lang][key] ?? I18N.fr[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '');
}

// 10.25 -> "10h15" (fr) / "10:15" (en)
function formatTime(hours) {
    const h = Math.floor(hours);
    const m = String(Math.round((hours - h) * 60)).padStart(2, '0');
    return settings.lang === 'en' ? `${h}:${m}` : `${h}h${m}`;
}

function applyTranslations(root = document) {
    root.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
    root.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    root.querySelectorAll('[data-i18n-title]').forEach(el => el.title = t(el.dataset.i18nTitle));
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el => el.placeholder = t(el.dataset.i18nPlaceholder));
}

// Avant les scripts de la page : leurs textes générés utilisent déjà la bonne langue
document.addEventListener('DOMContentLoaded', () => applyTranslations());

/* ==========================================================================
   PANNEAU DES PARAMÈTRES (ouverture / fermeture : initPopover, popover.js)
   button : bouton qui ouvre / ferme le panneau
   panel  : panneau contenant des boutons [data-setting][data-value]
   ========================================================================== */
function initSettingsPanel(button, panel) {
    const options = panel.querySelectorAll('[data-setting]');

    function syncOptions() {
        options.forEach((opt) => {
            opt.setAttribute('aria-pressed', settings[opt.dataset.setting] === opt.dataset.value);
        });
    }

    initPopover(button, panel);

    options.forEach((opt) => {
        opt.addEventListener('click', () => {
            setSetting(opt.dataset.setting, opt.dataset.value);
            syncOptions();
        });
    });

    syncOptions();
}
