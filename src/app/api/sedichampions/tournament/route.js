/**
 * ============================================================================
 * GET /api/sedichampions/tournament
 * ============================================================================
 *
 * Devuelve TODOS los datos del torneo para la página pública:
 *   - event:    Información general (nombre, fecha, lugar)
 *   - teams:    Equipos agrupados por disciplina (con bye calculado)
 *   - matches:  Partidos agrupados por disciplina y ronda (como "schedule")
 *
 * La página pública llama a este endpoint en lugar de leer tournamentData.js.
 * Polling cada 30s para actualizaciones en tiempo real durante el evento.
 * ============================================================================
 */

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { seedDatabase } from '@/lib/seed';
import ScEvent from '@/models/ScEvent';
import ScTeam from '@/models/ScTeam';
import ScMatch from '@/models/ScMatch';

export async function GET() {
  try {
    await connectDB();

    // Poblar datos iniciales si la BD está vacía
    const teamCount = await ScTeam.countDocuments();
    if (teamCount === 0) {
      console.log('[Tournament API] BD vacía, ejecutando seed...');
      await seedDatabase();
    }

    // Obtener evento
    const event = await ScEvent.getEvent();

    // Obtener equipos: si hay sorteo, ordenar por drawOrder; si no, por teamId
    const sortField = event.drawCompleted ? 'drawOrder' : 'teamId';
    const teamsRaw = await ScTeam.find({}).sort({ discipline: 1, [sortField]: 1 }).lean();

    const teamsByDiscipline = {};
    for (const team of teamsRaw) {
      if (!teamsByDiscipline[team.discipline]) {
        teamsByDiscipline[team.discipline] = [];
      }
      teamsByDiscipline[team.discipline].push({
        id: team.teamId,
        name: team.name,
        color: team.color,
        bye: team.bye,
      });
    }

    // Obtener partidos agrupados por disciplina → ronda
    const matchesRaw = await ScMatch.find({}).sort({ discipline: 1, roundIdx: 1, matchIdx: 1 }).lean();

    const matchesByDiscipline = {};
    for (const match of matchesRaw) {
      if (!matchesByDiscipline[match.discipline]) {
        matchesByDiscipline[match.discipline] = [];
      }
      // Encontrar o crear la ronda
      let round = matchesByDiscipline[match.discipline].find(
        (r) => r.roundIdx === match.roundIdx
      );
      if (!round) {
        round = {
          round: match.roundName || `Ronda ${match.roundIdx + 1}`,
          roundIdx: match.roundIdx,
          matches: [],
        };
        matchesByDiscipline[match.discipline].push(round);
      }
      round.matches.push({
        id: match._id.toString(),
        time: match.time,
        court: match.court,
        teamA: match.teamA,
        teamB: match.teamB,
        winner: match.winner,
      });
    }

    // Ordenar rondas por roundIdx para cada disciplina
    for (const discipline of Object.keys(matchesByDiscipline)) {
      matchesByDiscipline[discipline].sort((a, b) => a.roundIdx - b.roundIdx);
    }

    // Construir nombres de disciplina (hardcodeados, igual que tournamentData.js)
    const disciplineMeta = {
      futbol7: {
        name: 'Fútbol 7',
        prize: 'S/ 500',
        matchDuration: '30 min',
        maxPlayers: 10,
        tiebreaker: 'Definición por 3 penales',
      },
      voleyMixto: {
        name: 'Vóley Mixto',
        prize: 'S/ 250',
        sets: 'Al mejor de 3 sets (15 pts)',
        maxPlayers: 8,
        maxMenOnCourt: 3,
      },
    };

    // Armar el response compatible con el formato esperado por page.js
    const disciplinesResponse = {};
    for (const [key, meta] of Object.entries(disciplineMeta)) {
      disciplinesResponse[key] = {
        ...meta,
        teams: teamsByDiscipline[key] || [],
      };
    }

    return NextResponse.json({
      event: {
        name: event.name,
        date: event.date,
        time: event.time,
        venue: event.venue,
        address: event.address,
        drawCompleted: event.drawCompleted || false,
        drawSeed: event.drawSeed || null,
      },
      disciplines: disciplinesResponse,
      schedules: matchesByDiscipline,
    });
  } catch (error) {
    console.error('[Tournament API] Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del torneo' },
      { status: 500 }
    );
  }
}
