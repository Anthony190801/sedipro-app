/**
 * ============================================================================
 * DATOS DEL TORNEO - SEDICHAMPIONS LEAGUE 2026
 * ============================================================================
 *
 * ¡IMPORTANTE PARA EL EDITOR!
 * Este archivo contiene TODA la información del torneo. Modifícalo con cuidado
 * siguiendo las instrucciones en cada sección. No necesitas saber programación.
 *
 * GUÍA RÁPIDA DE EDICIÓN (06 de Agosto):
 *   1. Para AGREGAR UN EQUIPO: copia y pega una línea de equipo dentro de la
 *      lista "teams" de la disciplina correspondiente (fútbol o vóley).
 *   2. Para CAMBIAR UN NOMBRE: edita el texto entre comillas después de "name".
 *   3. Para CAMBIAR HORARIOS: modifica los valores de "time" en la sección
 *      "schedule" de cada cancha.
 *   4. NO modifiques los "id" una vez asignados.
 *   5. NO borres las comillas, comas ni llaves {} — se romperá la página.
 *
 * Si tienes dudas, consulta con el equipo de sistemas ANTES de modificar.
 * ============================================================================
 */

// ============================================================================
// SECCIÓN 1: INFORMACIÓN GENERAL DEL EVENTO
// ============================================================================

export const eventInfo = {
  /** Nombre completo del torneo */
  name: "SEDICHAMPIONS LEAGUE 2026",

  /** Fecha del evento (texto libre para mostrar en la página) */
  date: "Sábado 08 de Agosto",

  /** Hora de inicio (texto libre) */
  time: "08:00 AM",

  /** Lugar donde se realizará el torneo */
  venue: "Golden Club",

  /** Dirección o referencia adicional del local (opcional) */
  address: "",
};

// ============================================================================
// SECCIÓN 2: REGLAS RÁPIDAS (se muestran en la pestaña de cada disciplina)
// ============================================================================

export const quickRules = {
  futbol7: [
    "Fútbol 7 — Partidos de 30 minutos.",
    "En caso de empate, definición por 3 penales.",
    "Máximo 10 jugadores por equipo.",
    "Premio: S/ 500 para el equipo campeón.",
  ],
  voleyMixto: [
    "Vóley Mixto — Al mejor de 3 sets.",
    "Cada set se juega a 15 puntos.",
    "Máximo 8 jugadores por equipo.",
    "Máximo 3 varones en cancha simultáneamente.",
    "Premio: S/ 250 para el equipo campeón.",
  ],
};

// ============================================================================
// SECCIÓN 3: DISCIPLINAS Y EQUIPOS INSCRITOS
// ============================================================================
//
// PARA AGREGAR UN EQUIPO NUEVO:
//   Copia UNA de estas líneas (desde { hasta }, incluyendo la coma final):
//
//     {
//       id: 99,              ← Cambia 99 por el siguiente número disponible
//       name: "NOMBRE REAL", ← Cambia por el nombre del equipo
//       color: "#672577",    ← Color representativo (opcional, usa #672577 si no tienes)
//     },
//
//   Y pégala al final de la lista de equipos (antes del corchete ]).
//   ASEGÚRATE de poner una coma después de cada equipo excepto el último.
// ============================================================================

export const disciplines = {
  /**
   * FÚTBOL 7
   * Premio: S/ 500
   * Partidos de 30 min | Máx 10 jugadores por equipo
   */
  futbol7: {
    name: "Fútbol 7",
    prize: "S/ 500",
    matchDuration: "30 min",
    maxPlayers: 10,
    tiebreaker: "Definición por 3 penales",

    /** Lista de equipos inscritos en Fútbol 7 */
    teams: [
      { id: 1, name: "Los Galácticos", color: "#672577" },
      { id: 2, name: "Real UNT", color: "#3454A1" },
      { id: 3, name: "Atlético Campus", color: "#2B2D67" },
      { id: 4, name: "Deportivo Ingeniería", color: "#7C4191" },
      { id: 5, name: "FC Contabilidad", color: "#10B981" },
      { id: 6, name: "Sport Derecho", color: "#F59E0B" },
      { id: 7, name: "Medicina FC", color: "#EF4444" },
      { id: 8, name: "Los Titanes", color: "#3B82F6" },
      { id: 9, name: "Agronomía United", color: "#4A6BB8" },
      { id: 10, name: "Económicas FC", color: "#1E3A5F" },
    ],
  },

  /**
   * VÓLEY MIXTO
   * Premio: S/ 250
   * Al mejor de 3 sets (15 pts) | Máx 8 jugadores | Máx 3 varones en cancha
   */
  voleyMixto: {
    name: "Vóley Mixto",
    prize: "S/ 250",
    sets: "Al mejor de 3 sets (15 pts)",
    maxPlayers: 8,
    maxMenOnCourt: 3,

    /** Lista de equipos inscritos en Vóley Mixto */
    teams: [
      { id: 1, name: "Spikers UNT", color: "#672577" },
      { id: 2, name: "Las Panteras", color: "#3454A1" },
      { id: 3, name: "Matadoras", color: "#2B2D67" },
      { id: 4, name: "Cóndor Vóley", color: "#7C4191" },
      { id: 5, name: "Aces de Derecho", color: "#10B981" },
      { id: 6, name: "Remate Contable", color: "#F59E0B" },
      { id: 7, name: "Sexteto Médico", color: "#EF4444" },
      { id: 8, name: "Bloqueo Farmacia", color: "#3B82F6" },
    ],
  },
};

// ============================================================================
// SECCIÓN 4: HORARIOS Y CANCHAS
// ============================================================================
//
// ESTRUCTURA:
//   Cada disciplina tiene un arreglo "schedule" con objetos que representan
//   una ronda del torneo. Cada ronda contiene:
//     - round: nombre de la ronda (ej: "Cuartos de Final")
//     - matches: lista de partidos de esa ronda
//         - time:  hora programada (formato: "HH:MM AM/PM")
//         - court: nombre de la cancha (ej: "Cancha 1", "Cancha 2")
//         - teamA / teamB: nombres de los equipos o "PASE DIRECTO" / "POR DEFINIR"
//
// PARA ACTUALIZAR EL DÍA DEL EVENTO:
//   1. Busca el partido que necesitas modificar.
//   2. Cambia "teamA" y "teamB" por los nombres reales de los equipos.
//   3. Si un equipo tiene PASE DIRECTO, el partido dirá "PASE DIRECTO" en un lado
//      y el nombre del equipo en el otro. NO borres los partidos con BYE.
//   4. Cambia "time" y "court" según la programación real.
// ============================================================================

export const schedules = {
  futbol7: [
    {
      round: "Ronda Preliminar",
      matches: [
        { time: "08:00 AM", court: "Cancha 1", teamA: "Los Galácticos", teamB: "Económicas FC" },
        { time: "08:00 AM", court: "Cancha 2", teamA: "Agronomía United", teamB: "Los Titanes" },
        { time: "08:35 AM", court: "Cancha 1", teamA: "Real UNT", teamB: "PASE DIRECTO" },
        { time: "08:35 AM", court: "Cancha 2", teamA: "Atlético Campus", teamB: "PASE DIRECTO" },
        { time: "09:10 AM", court: "Cancha 1", teamA: "Deportivo Ingeniería", teamB: "PASE DIRECTO" },
        { time: "09:10 AM", court: "Cancha 2", teamA: "FC Contabilidad", teamB: "PASE DIRECTO" },
        { time: "09:45 AM", court: "Cancha 1", teamA: "Sport Derecho", teamB: "PASE DIRECTO" },
        { time: "09:45 AM", court: "Cancha 2", teamA: "Medicina FC", teamB: "PASE DIRECTO" },
      ],
    },
    {
      round: "Cuartos de Final",
      matches: [
        { time: "10:20 AM", court: "Cancha 1", teamA: "POR DEFINIR", teamB: "POR DEFINIR" },
        { time: "10:20 AM", court: "Cancha 2", teamA: "POR DEFINIR", teamB: "POR DEFINIR" },
        { time: "10:55 AM", court: "Cancha 1", teamA: "POR DEFINIR", teamB: "POR DEFINIR" },
        { time: "10:55 AM", court: "Cancha 2", teamA: "POR DEFINIR", teamB: "POR DEFINIR" },
      ],
    },
    {
      round: "Semifinal",
      matches: [
        { time: "11:30 AM", court: "Cancha 1", teamA: "POR DEFINIR", teamB: "POR DEFINIR" },
        { time: "11:30 AM", court: "Cancha 2", teamA: "POR DEFINIR", teamB: "POR DEFINIR" },
      ],
    },
    {
      round: "Final",
      matches: [
        { time: "12:10 PM", court: "Cancha 1", teamA: "POR DEFINIR", teamB: "POR DEFINIR" },
      ],
    },
  ],

  voleyMixto: [
    {
      round: "Cuartos de Final",
      matches: [
        { time: "08:00 AM", court: "Cancha Vóley 1", teamA: "Spikers UNT", teamB: "Bloqueo Farmacia" },
        { time: "08:00 AM", court: "Cancha Vóley 2", teamA: "Las Panteras", teamB: "Sexteto Médico" },
        { time: "08:50 AM", court: "Cancha Vóley 1", teamA: "Matadoras", teamB: "Remate Contable" },
        { time: "08:50 AM", court: "Cancha Vóley 2", teamA: "Cóndor Vóley", teamB: "Aces de Derecho" },
      ],
    },
    {
      round: "Semifinal",
      matches: [
        { time: "09:40 AM", court: "Cancha Vóley 1", teamA: "POR DEFINIR", teamB: "POR DEFINIR" },
        { time: "09:40 AM", court: "Cancha Vóley 2", teamA: "POR DEFINIR", teamB: "POR DEFINIR" },
      ],
    },
    {
      round: "Final",
      matches: [
        { time: "10:30 AM", court: "Cancha Vóley 1", teamA: "POR DEFINIR", teamB: "POR DEFINIR" },
      ],
    },
  ],
};
