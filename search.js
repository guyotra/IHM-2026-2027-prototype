/* ==========================================================================
   RECHERCHE PARTAGÉE (écran A : ade.html, écran B : main.html)
   Les entrées recherchables sont les emplois du temps de timetables.js
   ========================================================================== */

/* ==========================================================================
   UTILITAIRES
   ========================================================================== */

// Ouvre la page emploi du temps (écran B) avec les calques donnés (main.html?id=a&id=b...)
function openTimetable(...selected) {
    const params = new URLSearchParams();
    selected.forEach(t => params.append('id', t.id));
    window.location.href = `main.html?${params}`;
}

// Surligner le texte correspondant
function highlightMatch(text, query) {
    const index = text.toLowerCase().indexOf(query);
    if (index === -1) return text;
    const start = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const end = text.slice(index + query.length);
    return `${start}<strong style="color: var(--accent-color); font-weight: 600;">${match}</strong>${end}`;
}

// Sécurité contre les XSS lors de l'injection
function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[m]);
}

/* ==========================================================================
   BARRE DE RECHERCHE + VOLET DÉROULANT
   input    : le champ texte
   dropdown : la liste <ul class="dropdown-menu">
   wrapper  : l'élément qui contient les deux (un clic en dehors ferme le volet)
   options  :
     onSelect(timetable)   : action quand on choisit une entrée (défaut : ouvrir l'écran B)
     isExcluded(timetable) : entrées à masquer des suggestions (ex. calques déjà affichés)
   Retourne { close } pour fermer le volet depuis l'extérieur.
   ========================================================================== */
function initSearch(input, dropdown, wrapper, { onSelect = openTimetable, isExcluded = () => false } = {}) {
    let activeIndex = -1; // Index de l'élément sélectionné au clavier (-1 = aucun)

    function filterAndRenderList(query) {
        const cleanQuery = query.toLowerCase().trim();

        // Si le champ est vide, fermer le volet
        if (cleanQuery === '') {
            closeDropdown();
            return;
        }

        // Filtrer la liste
        const filtered = timetables.filter(item =>
            !isExcluded(item) && item.label.toLowerCase().includes(cleanQuery)
        );

        // Vider le menu actuel
        dropdown.innerHTML = '';
        activeIndex = -1; // Réinitialiser la sélection au clavier

        if (filtered.length === 0) {
            dropdown.innerHTML = `<div class="no-results">${escapeHtml(t('noResults', { query }))}</div>`;
        } else {
            filtered.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'dropdown-item';
                li.setAttribute('role', 'option');
                li.setAttribute('data-index', index);
                li.innerHTML = `<i class="fa-solid ${item.icon}"></i><span>${highlightMatch(item.label, cleanQuery)}</span>`;

                // Événements de clic et survol
                li.addEventListener('click', () => onSelect(item));
                li.addEventListener('mouseenter', () => setSelection(index));

                dropdown.appendChild(li);
            });
        }

        dropdown.classList.add('open');
    }

    function closeDropdown() {
        dropdown.classList.remove('open');
        activeIndex = -1;
    }

    function setSelection(index) {
        const items = dropdown.querySelectorAll('.dropdown-item');
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
        activeIndex = index;
    }

    // Saisie utilisateur dans le champ
    input.addEventListener('input', () => filterAndRenderList(input.value));

    // Focus sur le champ de recherche
    input.addEventListener('focus', () => {
        if (input.value.trim() !== '') {
            filterAndRenderList(input.value);
        }
    });

    // Navigation Clavier (Flèche Haut / Bas / Entrée / Échap)
    input.addEventListener('keydown', (e) => {
        const items = dropdown.querySelectorAll('.dropdown-item');
        const isOpen = dropdown.classList.contains('open') && items.length > 0;

        // Entrée : fonctionne même volet fermé
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isOpen && activeIndex >= 0 && items[activeIndex]) {
                // Élément surligné via les flèches
                items[activeIndex].click();
            } else {
                // Sinon, premier emploi du temps correspondant (rien si aucun)
                const query = input.value.toLowerCase().trim();
                const match = query && timetables.find(t => !isExcluded(t) && t.label.toLowerCase().includes(query));
                if (match) onSelect(match);
            }
            return;
        }

        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (activeIndex < items.length - 1) {
                    setSelection(activeIndex + 1);
                } else {
                    setSelection(0); // Boucle au début
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (activeIndex > 0) {
                    setSelection(activeIndex - 1);
                } else {
                    setSelection(items.length - 1); // Boucle à la fin
                }
                break;

            case 'Escape':
                closeDropdown();
                break;
        }
    });

    // Clic à l'extérieur pour fermer le volet déroulant
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            closeDropdown();
        }
    });

    return { close: closeDropdown };
}
