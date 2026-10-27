/* ==========================================================================
   PANNEAUX FLOTTANTS (popups) : paramètres, calendrier de navigation...
   button : bouton qui ouvre / ferme le panneau
   panel  : le panneau (.tt-popover), ouvert avec la classe .open
   onOpen : appelé juste avant chaque ouverture (pour mettre le contenu à jour)
   Fermeture : nouveau clic sur le bouton, clic à l'extérieur ou Échap.
   Retourne { close }.
   ========================================================================== */
function initPopover(button, panel, { onOpen } = {}) {
    const isOpen = () => panel.classList.contains('open');

    function setOpen(open) {
        if (open && onOpen) onOpen();
        panel.classList.toggle('open', open);
        button.setAttribute('aria-expanded', open);
    }

    button.addEventListener('click', () => setOpen(!isOpen()));

    // composedPath : chemin du clic au moment où il a eu lieu, valable même si
    // l'élément cliqué a été retiré entre-temps (contenu du panneau régénéré)
    document.addEventListener('click', (e) => {
        const path = e.composedPath();
        if (isOpen() && !path.includes(panel) && !path.includes(button)) setOpen(false);
    });

    // Échap : le focus revient sur le bouton
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) {
            setOpen(false);
            button.focus();
        }
    });

    return { close: () => setOpen(false) };
}
