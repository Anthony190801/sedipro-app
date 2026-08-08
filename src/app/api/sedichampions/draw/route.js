/**
 * ============================================================================
 * POST /api/sedichampions/draw
 * ============================================================================
 *
 * Ejecuta el sorteo de equipos para una disciplina:
 *   1. Baraja los equipos con PRNG determinista (mulberry32).
 *   2. Asigna PASE DIRECTO (BYE) a los primeros `byeCount` equipos.
 *   3. Guarda `drawOrder`, `bye` en ScTeam y reconstruye partidos en ScMatch.
 *
 * Body: { discipline: 'futbol7' | 'voleyMixto' }
 *
 * Response 200: { success: true, drawSeed, byeCount, byeTeams, pairings }
 * ============================================================================
 */

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import ScTeam from '@/models/ScTeam';
import ScMatch from '@/models/ScMatch';
import ScEvent from '@/models/ScEvent';

// ============================================================================
// PRNG mulberry32 (misma lógica que bracketLogic.js)
// ============================================================================

function createSeededRandom(seed) {
  let state = seed | 0;
  return function () {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed(array, seed) {
  const shuffled = [...array];
  const random = createSeededRandom(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function nextPowerOfTwo(n) {
  if (n <= 0) return 0;
  return Math.pow(2, Math.ceil(Math.log2(n)));
}

/** Nombres de ronda según tamaño del cuadro */
const ROUND_NAMES = {
  2: ['Final'],
  4: ['Semifinal', 'Final'],
  8: ['Cuartos de Final', 'Semifinal', 'Final'],
  16: ['Ronda Preliminar', 'Cuartos de Final', 'Semifinal', 'Final'],
  32: ['Dieciseisavos', 'Octavos de Final', 'Cuartos de Final', 'Semifinal', 'Final'],
};

// ============================================================================
// POST
// ============================================================================

export async function POST(request) {
  try {
    await connectDB();

    const auth = await requireAdmin(request);
    if (auth instanceof Response) return auth;

    const body = await request.json();
    const { discipline } = body;

    if (!discipline || !['futbol7', 'voleyMixto'].includes(discipline)) {
      return NextResponse.json(
        { success: false, error: 'Disciplina inválida (futbol7 o voleyMixto)' },
        { status: 400 }
      );
    }

    // 1. Obtener equipos
    const teams = await ScTeam.find({ discipline }).sort({ teamId: 1 }).lean();
    if (teams.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Se necesitan al menos 2 equipos para sortear' },
        { status: 400 }
      );
    }

    const teamCount = teams.length;
    const targetSlots = nextPowerOfTwo(teamCount);
    const byeCount = targetSlots - teamCount;

    // 2. Generar semilla y barajar
    const drawSeed = Date.now();
    const shuffled = shuffleWithSeed(teams, drawSeed);

    // 3. Asignar drawOrder y bye
    const byeTeams = [];
    const playingTeams = [];

    for (let i = 0; i < shuffled.length; i++) {
      const team = shuffled[i];
      const isBye = i < byeCount;

      await ScTeam.findByIdAndUpdate(team._id, {
        drawOrder: i,
        bye: isBye,
      });

      if (isBye) {
        byeTeams.push(team);
      } else {
        playingTeams.push(team);
      }
    }

    // 4. Reconstruir partidos en sc_matches
    const roundNames = ROUND_NAMES[targetSlots] || ['Ronda 1', 'Ronda 2', 'Final'];
    const totalFirstRoundMatches = targetSlots / 2;

    // Eliminar partidos existentes de esta disciplina
    await ScMatch.deleteMany({ discipline });

    // Crear partidos de primera ronda
    const firstRoundMatches = [];
    let matchIdx = 0;

    // BYE matches: "Equipo vs PASE DIRECTO"
    for (const team of byeTeams) {
      firstRoundMatches.push({
        discipline,
        roundIdx: 0,
        matchIdx,
        roundName: roundNames[0] || 'Ronda 1',
        teamA: team.name,
        teamB: 'PASE DIRECTO',
        winner: team.name, // El equipo con BYE avanza automáticamente
        time: '',
        court: '',
      });
      matchIdx++;
    }

    // Partidos reales: emparejar consecutivamente
    for (let i = 0; i < playingTeams.length; i += 2) {
      const teamA = playingTeams[i];
      const teamB = playingTeams[i + 1] || null;
      firstRoundMatches.push({
        discipline,
        roundIdx: 0,
        matchIdx,
        roundName: roundNames[0] || 'Ronda 1',
        teamA: teamA.name,
        teamB: teamB ? teamB.name : 'PASE DIRECTO',
        winner: teamB ? null : teamA.name, // Si no hay rival, avanza automático
        time: '',
        court: '',
      });
      matchIdx++;
    }

    await ScMatch.insertMany(firstRoundMatches);

    // Construir rondas siguientes con propagación de ganadores BYE
    // Los ganadores de R0 determinan quién avanza a R1, etc.
    let currentWinners = firstRoundMatches.map((m) => m.winner); // BYE teams ya tienen winner

    for (let roundIdx = 1; roundIdx < roundNames.length; roundIdx++) {
      const roundMatches = [];
      const matchCount = currentWinners.length / 2;

      for (let m = 0; m < matchCount; m++) {
        const winnerA = currentWinners[m * 2] || null;     // Ganador del match par
        const winnerB = currentWinners[m * 2 + 1] || null; // Ganador del match impar

        roundMatches.push({
          discipline,
          roundIdx,
          matchIdx: m,
          roundName: roundNames[roundIdx],
          teamA: winnerA || 'POR DEFINIR',
          teamB: winnerB || 'POR DEFINIR',
          winner: null, // Se define durante el evento
          time: '',
          court: '',
        });
      }

      await ScMatch.insertMany(roundMatches);

      // Los ganadores de ESTA ronda alimentan la siguiente
      currentWinners = roundMatches.map((m) => m.winner); // todos null por ahora
    }

    // 5. Guardar drawSeed y drawCompleted en el evento
    await ScEvent.findOneAndUpdate(
      { isActive: true },
      { drawSeed, drawCompleted: true }
    );

    // Construir respuesta con resultados del sorteo
    const pairings = [];
    for (let i = 0; i < playingTeams.length; i += 2) {
      if (playingTeams[i + 1]) {
        pairings.push(`${playingTeams[i].name} ⚔️ ${playingTeams[i + 1].name}`);
      } else {
        pairings.push(`${playingTeams[i].name} (avance automático)`);
      }
    }

    return NextResponse.json({
      success: true,
      drawSeed,
      totalTeams: teamCount,
      targetSlots,
      byeCount,
      byeTeams: byeTeams.map((t) => t.name),
      pairings,
    });
  } catch (error) {
    console.error('[Draw API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al realizar el sorteo' },
      { status: 500 }
    );
  }
}
