/* ==========================================================================
   EMPLOIS DU TEMPS DE DÉMONSTRATION (partagés par l'écran A et l'écran B)
   Chaque emploi du temps est une entrée de la barre de recherche.

   id     : identifiant passé dans l'URL de l'écran B (main.html?id=...)
   label  : nom affiché et recherché
   icon   : icône Font Awesome dans le volet de suggestions
   events : séances, de deux sortes
            - récurrentes : weekday (0 = lundi ... 6 = dimanche), répétées chaque semaine
              du semestre (TERM_START → TERM_END), ou seulement les semaines listées
              dans weeks (1 = semaine de TERM_START)
            - ponctuelles : date ("AAAA-MM-JJ")
            type : cm | td | tp | pg | ex | re (détermine la couleur)
   ========================================================================== */
const TERM_START = new Date(2027, 8, 6);  // lundi 06/09/2027 : début des séances récurrentes
const TERM_END = new Date(2027, 9, 1);    // vendredi 01/10/2027 : fin des séances récurrentes

const timetables = [
    {
        id: "iese5",
        label: "POLYTECH / IESE5 - Internet des objets",
        icon: "fa-user-group",
        events: [
            // --- Semaine type ---
            { weekday: 0, start: "8h00",  end: "10h00", type: "cm", code: "CM 012", title: "IHM",                where: "Amphi E" },
            { weekday: 0, start: "10h15", end: "12h15", type: "td", code: "TD 104", title: "IHM",                where: "Salle B102" },
            { weekday: 0, start: "14h00", end: "17h00", type: "tp", code: "TP 201", title: "Systèmes embarqués", where: "Le D." },

            { weekday: 1, start: "9h00",  end: "12h00", type: "cm", code: "CM 021", title: "Sécurité réseaux",   where: "Amphi F" },
            { weekday: 1, start: "13h30", end: "15h30", type: "td", code: "TD 108", title: "Anglais",            where: "Salle E204" },

            { weekday: 2, start: "7h00",  end: "17h00", type: "pg", code: "PG 001", title: "LoRaWAN",            where: "Le D.",   weeks: [1, 3] },
            { weekday: 2, start: "8h00",  end: "10h00", type: "cm", code: "CM 025", title: "Cloud et IoT",       where: "Amphi C", weeks: [2, 4] },

            { weekday: 3, start: "8h00",  end: "10h00", type: "cm", code: "CM 014", title: "Gestion de projet",  where: "Amphi K200" },
            { weekday: 3, start: "10h15", end: "12h15", type: "td", code: "TD 104", title: "IHM",                where: "Salle B102" },
            { weekday: 3, start: "14h00", end: "18h00", type: "pg", code: "PG 002", title: "Projet IoT",         where: "Le D." },

            { weekday: 4, start: "9h30",  end: "12h30", type: "tp", code: "TP 203", title: "Réseaux",            where: "Salle B102" },
            { weekday: 4, start: "14h00", end: "16h00", type: "cm", code: "CM 030", title: "Droit du numérique", where: "Amphi C", weeks: [1, 2, 3] },

            // --- Ponctuelles ---
            { date: "2027-09-01", start: "9h00",  end: "12h00", type: "re", code: "RE 001", title: "Réunion de rentrée", where: "Amphi E" },
            { date: "2027-09-02", start: "14h00", end: "17h00", type: "tp", code: "TP 000", title: "Mise à niveau C",    where: "Le D." },
            { date: "2027-09-18", start: "8h00",  end: "12h00", type: "ex", code: "EX 001", title: "Examen IHM",         where: "Amphi G" },
            { date: "2027-09-29", start: "13h00", end: "18h00", type: "pg", code: "PG 003", title: "Démo projets IoT",   where: "Le D." },
            { date: "2027-10-01", start: "14h00", end: "16h00", type: "ex", code: "EX 002", title: "Examen Réseaux",     where: "Amphi F" }
        ]
    },
    {
        id: "mounier",
        label: "POLYTECH - Prof. Mounier",
        icon: "fa-chalkboard-user",
        events: [
            // --- Semaine type ---
            { weekday: 0, start: "8h00",  end: "10h00", type: "cm", code: "CM 012", title: "IHM",             where: "IESE5 · Amphi E" },
            { weekday: 0, start: "10h15", end: "12h15", type: "td", code: "TD 104", title: "IHM",             where: "IESE5 · B102" },
            { weekday: 0, start: "14h00", end: "16h00", type: "td", code: "TD 105", title: "IHM",             where: "INFO4 · B102" },

            { weekday: 1, start: "8h00",  end: "10h00", type: "cm", code: "CM 040", title: "IHM",             where: "INFO4 · Amphi F" },
            { weekday: 1, start: "13h30", end: "17h30", type: "tp", code: "TP 110", title: "Prototypage IHM", where: "INFO4 · B102", weeks: [2, 3, 4] },

            { weekday: 3, start: "10h15", end: "12h15", type: "td", code: "TD 104", title: "IHM",             where: "IESE5 · B102" },

            { weekday: 4, start: "9h30",  end: "12h30", type: "tp", code: "TP 203", title: "Réseaux",         where: "IESE5 · B102" },

            // --- Ponctuelles ---
            { date: "2027-09-01", start: "9h00",  end: "12h00", type: "re", code: "RE 001", title: "Réunion de rentrée",  where: "IESE5 · Amphi E" },
            { date: "2027-09-15", start: "14h00", end: "16h00", type: "re", code: "RE 010", title: "Réunion pédagogique", where: "Salle des profs" },
            { date: "2027-09-18", start: "8h00",  end: "12h00", type: "ex", code: "EX 001", title: "Examen IHM",          where: "IESE5 · Amphi G" },
            { date: "2027-10-01", start: "14h00", end: "16h00", type: "ex", code: "EX 002", title: "Examen Réseaux",      where: "IESE5 · Amphi F" }
        ]
    },
    {
        id: "b102",
        label: "Salle Polytech B102",
        icon: "fa-door-open",
        events: [
            // --- Semaine type ---
            { weekday: 0, start: "10h15", end: "12h15", type: "td", code: "TD 104", title: "IHM",              where: "IESE5 · Mounier" },
            { weekday: 0, start: "14h00", end: "16h00", type: "td", code: "TD 105", title: "IHM",              where: "INFO4 · Mounier" },

            { weekday: 1, start: "13h30", end: "17h30", type: "tp", code: "TP 110", title: "Prototypage IHM",  where: "INFO4 · Mounier", weeks: [2, 3, 4] },

            { weekday: 2, start: "8h00",  end: "12h00", type: "td", code: "TD 220", title: "Algorithmique",    where: "INFO3 · Rivière" },
            { weekday: 2, start: "13h30", end: "15h30", type: "td", code: "TD 221", title: "Bases de données", where: "INFO3 · Rivière", weeks: [1, 2] },

            { weekday: 3, start: "10h15", end: "12h15", type: "td", code: "TD 104", title: "IHM",              where: "IESE5 · Mounier" },

            { weekday: 4, start: "9h30",  end: "12h30", type: "tp", code: "TP 203", title: "Réseaux",          where: "IESE5 · Mounier" },
            { weekday: 4, start: "14h00", end: "17h00", type: "tp", code: "TP 230", title: "Électronique",     where: "IESE3 · Garnier" },

            // --- Ponctuelles ---
            { date: "2027-09-02", start: "9h00",  end: "11h00", type: "re", code: "MA 001", title: "Maintenance salle", where: "Service informatique" }
        ]
    }
];

/* ==========================================================================
   SÉANCES D'UN JOUR DONNÉ
   ========================================================================== */
const pad2 = (n) => String(n).padStart(2, '0');

// Date -> "AAAA-MM-JJ" (date locale, sans fuseau)
function toISODate(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

// Séances de l'emploi du temps ce jour-là (récurrentes du semestre + ponctuelles)
function eventsOn(timetable, date) {
    const iso = toISODate(date);
    const weekday = (date.getDay() + 6) % 7;  // 0 = lundi
    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const inTerm = day >= TERM_START && day <= TERM_END;
    const week = Math.floor(Math.round((day - TERM_START) / 86400000) / 7) + 1;

    return timetable.events.filter(ev => ev.date
        ? ev.date === iso
        : inTerm && ev.weekday === weekday && (!ev.weeks || ev.weeks.includes(week)));
}
