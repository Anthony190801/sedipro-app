/**
 * ============================================================================
 * LÓGICA DE BRACKETS — SEDICHAMPIONS LEAGUE 2026
 * ============================================================================
 *
 * Funciones puras en JavaScript para calcular la estructura del torneo:
 *   - Determinar la potencia de 2 necesaria para el cuadro.
 *   - Asignar "PASE DIRECTO" (BYEs) según regla de la Sección 6.
 *   - Estructurar los partidos por ronda (Preliminar → Cuartos → Semis → Final).
 *
 * REGLA DE CLASIFICACIÓN (Sección 6):
 *   "Si la cantidad de equipos no es potencia de 2 (4, 8, 16), se asignan
 *    'PASE DIRECTO' (BYEs) mediante sorteo a los equipos necesarios para
 *    equilibrar el cuadro. Los demás juegan la ronda preliminar."
 *
 * No se modifica directamente — lo consume Bracket.jsx para renderizar el
 * árbol del torneo.
 * ============================================================================
 */

// ============================================================================
// UTILIDADES MATEMÁTICAS
// ============================================================================

/**
 * Calcula la siguiente potencia de 2 mayor o igual a `n`.
 * Ejemplos: nextPowerOfTwo(5) = 8, nextPowerOfTwo(10) = 16, nextPowerOfTwo(8) = 8.
 *
 * @param {number} n - Cantidad de equipos
 * @returns {number} Potencia de 2 requerida para un cuadro balanceado
 */
export function nextPowerOfTwo(n) {
  if (n <= 0) return 0;
  return Math.pow(2, Math.ceil(Math.log2(n)));
}

/**
 * Determina si un número es potencia exacta de 2.
 *
 * @param {number} n - Número a evaluar
 * @returns {boolean} true si n es 1, 2, 4, 8, 16, …
 */
export function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

// ============================================================================
// ASIGNACIÓN DE BYES (PASE DIRECTO)
// ============================================================================

/**
 * Calcula cuántos "PASE DIRECTO" (BYEs) se necesitan para completar el cuadro.
 * Ejemplo: 10 equipos → potencia de 2 = 16 → 6 BYEs.
 *
 * @param {number} teamCount - Cantidad de equipos inscritos
 * @returns {number} Cantidad de BYEs necesarios
 */
export function calculateByes(teamCount) {
  const target = nextPowerOfTwo(teamCount);
  return target - teamCount;
}

/**
 * Asigna "PASE DIRECTO" (BYEs) a equipos de forma aleatoria balanceada.
 * Utiliza un algoritmo determinista basado en semilla para que el sorteo
 * sea reproducible (misma semilla → mismos resultados).
 *
 * @param {Array} teams - Lista de equipos { id, name, color }
 * @param {number} [seed=2026] - Semilla para el sorteo (cambiar para re-sortear)
 * @returns {Array} Copia de teams con propiedad `bye: true` en los equipos sorteados
 */
export function assignByes(teams, seed = 2026) {
  if (!teams || teams.length === 0) return [];

  const byeCount = calculateByes(teams.length);
  if (byeCount === 0) {
    // No se necesitan BYEs — todos juegan
    return teams.map((team) => ({ ...team, bye: false }));
  }

  // Crear una copia y mezclar con semilla determinista (Fisher-Yates con PRNG)
  const shuffled = [...teams];
  const random = createSeededRandom(seed);

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Los primeros `byeCount` equipos reciben PASE DIRECTO
  const byeIds = new Set(shuffled.slice(0, byeCount).map((t) => t.id));

  return teams.map((team) => ({
    ...team,
    bye: byeIds.has(team.id),
  }));
}

// ============================================================================
// GENERADOR DE NÚMEROS ALEATORIOS CON SEMILLA (PRNG)
// ============================================================================

/**
 * Crea un generador de números pseudoaleatorios a partir de una semilla.
 * Algoritmo: mulberry32 — rápido, buena distribución, determinista.
 *
 * @param {number} seed - Semilla inicial
 * @returns {Function} Función que devuelve un número en [0, 1) en cada llamada
 */
function createSeededRandom(seed) {
  let state = seed | 0;
  return function () {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ============================================================================
// ESTRUCTURACIÓN DEL BRACKET
// ============================================================================

/**
 * Nombres estándar para las rondas según cantidad de equipos en el cuadro.
 */
const ROUND_NAMES = {
  2: ["Final"],
  4: ["Semifinal", "Final"],
  8: ["Cuartos de Final", "Semifinal", "Final"],
  16: ["Ronda Preliminar", "Cuartos de Final", "Semifinal", "Final"],
  32: ["Dieciseisavos", "Octavos de Final", "Cuartos de Final", "Semifinal", "Final"],
};

/**
 * Construye la estructura completa del bracket a partir de una lista de equipos.
 *
 * Formato de retorno:
 *   {
 *     rounds: [
 *       {
 *         name: "Cuartos de Final",
 *         matches: [
 *           { id: "match-1", teamA: {...}, teamB: {...}, time: "", court: "" },
 *           ...
 *         ]
 *       },
 *       ...
 *     ],
 *     totalTeams: 10,
 *     targetSlots: 16,
 *     byeCount: 6,
 *   }
 *
 * @param {Array} teams - Lista de equipos con { id, name, color, bye }
 * @param {Array} [schedule] - Arreglo de rondas con horarios (opcional, de tournamentData)
 * @returns {Object} Estructura del bracket lista para renderizar
 */
export function buildBracket(teams, schedule = []) {
  if (!teams || teams.length < 2) {
    return { rounds: [], totalTeams: teams?.length || 0, targetSlots: 0, byeCount: 0 };
  }

  // Asegurar que cada equipo tenga la propiedad `bye`
  const teamsWithBye = teams.map((t) => ({
    ...t,
    bye: t.bye !== undefined ? t.bye : false,
  }));

  // Mapa nombre → color para propagar el color a rondas siguientes
  const colorMap = {};
  for (const t of teamsWithBye) {
    if (t.name) colorMap[t.name] = t.color || '#672577';
  }

  const totalTeams = teamsWithBye.length;
  const targetSlots = nextPowerOfTwo(totalTeams);
  const byeCount = calculateByes(totalTeams);

  // Obtener los nombres de ronda según el tamaño del cuadro
  const roundNames = ROUND_NAMES[targetSlots] || generateRoundNames(targetSlots);

  // Separar equipos con BYE y sin BYE
  const byeTeams = teamsWithBye.filter((t) => t.bye);
  const playingTeams = teamsWithBye.filter((t) => !t.bye);

  // Construir las rondas
  const rounds = [];
  let currentRoundTeams = []; // Equipos que avanzan a la siguiente ronda

  // --- Primera ronda (Preliminar o la que corresponda) ---
  const firstRoundMatches = [];

  if (byeCount > 0 && playingTeams.length > 0) {
    // Crear TODOS los partidos de primera ronda (BYE + reales) para alinear con el schedule
    let matchIdx = 0;

    // --- Partidos BYE: "Equipo vs PASE DIRECTO" ---
    for (const team of byeTeams) {
      const scheduleMatch = findScheduleMatch(schedule, 0, matchIdx);

      firstRoundMatches.push({
        id: `match-r0-${matchIdx}`,
        teamA: team,
        teamB: { id: 0, name: "PASE DIRECTO", color: "#666", bye: true },
        time: scheduleMatch?.time || "",
        court: scheduleMatch?.court || "",
        winner: scheduleMatch?.winner || team.name, // BYE team avanza automático
      });

      currentRoundTeams.push({ ...team, source: "bye" });
      matchIdx++;
    }

    // --- Partidos reales: equipos que SÍ juegan ---
    for (let i = 0; i < playingTeams.length; i += 2) {
      const teamA = playingTeams[i];
      const teamB = playingTeams[i + 1] || null;

      const scheduleMatch = findScheduleMatch(schedule, 0, matchIdx);

      firstRoundMatches.push({
        id: `match-r0-${matchIdx}`,
        teamA: teamA,
        teamB: teamB || { id: 0, name: "PASE DIRECTO", color: "#666", bye: true },
        time: scheduleMatch?.time || "",
        court: scheduleMatch?.court || "",
        winner: scheduleMatch?.winner || null,
      });

      if (teamB) {
        currentRoundTeams.push({ id: -1, name: "POR DEFINIR", color: "#666", source: "winner" });
      } else {
        currentRoundTeams.push({ ...teamA, source: "auto-advance" });
      }
      matchIdx++;
    }
  } else if (byeCount === 0) {
    // Sin BYEs: todos juegan en la primera ronda
    for (let i = 0; i < teamsWithBye.length; i += 2) {
      const teamA = teamsWithBye[i];
      const teamB = teamsWithBye[i + 1];

      const scheduleMatch = findScheduleMatch(schedule, 0, firstRoundMatches.length);

      firstRoundMatches.push({
        id: `match-r0-${firstRoundMatches.length}`,
        teamA: teamA,
        teamB: teamB || null,
        time: scheduleMatch?.time || "",
        court: scheduleMatch?.court || "",
        winner: scheduleMatch?.winner || null,
      });

      if (teamB) {
        currentRoundTeams.push({ id: -1, name: "POR DEFINIR", color: "#666", source: "winner" });
      } else {
        currentRoundTeams.push({ ...teamA, source: "auto-advance" });
      }
    }
  }

  // Agregar la primera ronda si tiene partidos
  if (firstRoundMatches.length > 0) {
    rounds.push({
      name: roundNames[0] || "Ronda 1",
      matches: firstRoundMatches,
    });
  }

  // --- Rondas siguientes ---
  let roundIdx = 1;
  let previousWinners = currentRoundTeams;

  while (previousWinners.length > 1) {
    const roundMatches = [];
    const nextWinners = [];

    for (let i = 0; i < previousWinners.length; i += 2) {
      const teamA = previousWinners[i];
      const teamB = previousWinners[i + 1];

      const scheduleMatch = findScheduleMatch(schedule, roundIdx, roundMatches.length);

      // Usar nombres del schedule si ya están definidos (propagación de ganadores)
      const schedTeamA = scheduleMatch?.teamA;
      const schedTeamB = scheduleMatch?.teamB;
      const schedWinner = scheduleMatch?.winner || null;

      // Determinar equipos: preferir datos del schedule si no son placeholder
      const colorA = (schedTeamA && colorMap[schedTeamA]) || '#666';
      const colorB = (schedTeamB && colorMap[schedTeamB]) || '#666';

      const resolvedTeamA = (schedTeamA && schedTeamA !== 'POR DEFINIR' && schedTeamA !== 'PASE DIRECTO')
        ? { id: -1, name: schedTeamA, color: colorA }
        : (teamA || { id: -1, name: "POR DEFINIR", color: "#666" });

      const resolvedTeamB = (schedTeamB && schedTeamB !== 'POR DEFINIR' && schedTeamB !== 'PASE DIRECTO')
        ? { id: -1, name: schedTeamB, color: colorB }
        : (teamB || { id: -1, name: "POR DEFINIR", color: "#666" });

      roundMatches.push({
        id: `match-r${roundIdx}-${roundMatches.length}`,
        teamA: resolvedTeamA,
        teamB: resolvedTeamB,
        time: scheduleMatch?.time || "",
        court: scheduleMatch?.court || "",
        winner: schedWinner,
      });

      // Si hay ganador en el schedule, ese equipo avanza; si no, placeholder
      if (schedWinner) {
        const winnerColor = colorMap[schedWinner] || '#666';
        nextWinners.push({ id: -1, name: schedWinner, color: winnerColor, source: "winner" });
      } else {
        nextWinners.push({ id: -1, name: "POR DEFINIR", color: "#666", source: "winner" });
      }
    }

    rounds.push({
      name: roundNames[roundIdx] || `Ronda ${roundIdx + 1}`,
      matches: roundMatches,
    });

    previousWinners = nextWinners;
    roundIdx++;
  }

  // Limpiar: quitar placeholders visuales innecesarios al final
  return {
    rounds,
    totalTeams,
    targetSlots,
    byeCount,
  };
}

/**
 * Busca un partido del schedule para asignar hora y cancha.
 *
 * @param {Array} schedule - Arreglo de rondas con horarios
 * @param {number} roundIndex - Índice de la ronda actual
 * @param {number} matchIndex - Índice del partido dentro de la ronda
 * @returns {Object|null} Datos de horario o null
 */
function findScheduleMatch(schedule, roundIndex, matchIndex) {
  if (!schedule || schedule.length === 0) return null;
  const round = schedule[roundIndex];
  if (!round || !round.matches) return null;
  return round.matches[matchIndex] || null;
}

/**
 * Genera nombres genéricos de ronda cuando no hay nombres predefinidos.
 *
 * @param {number} totalSlots - Tamaño total del cuadro (potencia de 2)
 * @returns {string[]} Nombres de ronda
 */
function generateRoundNames(totalSlots) {
  const totalRounds = Math.log2(totalSlots);
  const names = [];
  for (let i = 0; i < totalRounds; i++) {
    if (i === totalRounds - 1) {
      names.push("Final");
    } else if (i === totalRounds - 2) {
      names.push("Semifinal");
    } else {
      names.push(`Ronda ${i + 1}`);
    }
  }
  return names;
}

/**
 * Calcula el bracket usando los horarios del schedule predefinido.
 * Combina la lógica de buildBracket con los datos reales del torneo.
 *
 * @param {Array} teams - Lista de equipos con { id, name, color, bye }
 * @param {Object} disciplineData - Datos completos de la disciplina desde tournamentData
 * @returns {Object} Estructura del bracket
 */
export function calculateBracket(teams, disciplineData = {}) {
  const schedule = disciplineData.schedule || [];
  return buildBracket(teams, schedule);
}
