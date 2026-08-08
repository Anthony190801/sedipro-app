/**
 * ============================================================================
 * SEED — Población inicial de MongoDB desde tournamentData.js
 * ============================================================================
 *
 * Lee los datos hardcodeados y los inserta en MongoDB.
 * Solo inserta si la colección está vacía (no pisa datos existentes).
 *
 * Uso:
 *   node src/lib/seed.js
 *
 * O desde una API route:
 *   import { seedDatabase } from '@/lib/seed';
 *   await seedDatabase();
 * ============================================================================
 */

import { connectDB } from './mongodb.js';
import ScEvent from '../models/ScEvent.js';
import ScTeam from '../models/ScTeam.js';
import ScMatch from '../models/ScMatch.js';
import { eventInfo, disciplines, schedules } from '../app/sedichampions/data/tournamentData.js';

const ROUND_NAMES_BY_SIZE = {
  2: ['Final'],
  4: ['Semifinal', 'Final'],
  8: ['Cuartos de Final', 'Semifinal', 'Final'],
  16: ['Ronda Preliminar', 'Cuartos de Final', 'Semifinal', 'Final'],
};

async function seedEvent() {
  const exists = await ScEvent.findOne({ isActive: true });
  if (exists) {
    console.log('[Seed] Evento ya existe, omitiendo...');
    return exists;
  }
  const event = await ScEvent.create({
    name: eventInfo.name,
    date: eventInfo.date,
    time: eventInfo.time,
    venue: eventInfo.venue,
    address: eventInfo.address || '',
  });
  console.log('[Seed] Evento creado:', event.name);
  return event;
}

async function seedTeams() {
  const count = await ScTeam.countDocuments();
  if (count > 0) {
    console.log(`[Seed] Ya hay ${count} equipos, omitiendo...`);
    return;
  }

  const teamsToInsert = [];

  for (const [discipline, data] of Object.entries(disciplines)) {
    for (const team of data.teams) {
      teamsToInsert.push({
        teamId: team.id,
        name: team.name,
        color: team.color || '#672577',
        discipline,
        bye: false,
        drawOrder: team.id, // Orden inicial = teamId (el sorteo lo actualizará)
      });
    }
  }

  await ScTeam.insertMany(teamsToInsert);
  console.log(`[Seed] ${teamsToInsert.length} equipos insertados`);
}

async function seedMatches() {
  const count = await ScMatch.countDocuments();
  if (count > 0) {
    console.log(`[Seed] Ya hay ${count} partidos, omitiendo...`);
    return;
  }

  const matchesToInsert = [];

  for (const [discipline, rounds] of Object.entries(schedules)) {
    for (let roundIdx = 0; roundIdx < rounds.length; roundIdx++) {
      const round = rounds[roundIdx];
      for (let matchIdx = 0; matchIdx < round.matches.length; matchIdx++) {
        const m = round.matches[matchIdx];
        matchesToInsert.push({
          discipline,
          roundIdx,
          matchIdx,
          roundName: round.round || '',
          teamA: m.teamA || 'POR DEFINIR',
          teamB: m.teamB || 'POR DEFINIR',
          winner: null,
          time: m.time || '',
          court: m.court || '',
        });
      }
    }
  }

  await ScMatch.insertMany(matchesToInsert);
  console.log(`[Seed] ${matchesToInsert.length} partidos insertados`);
}

/**
 * Ejecuta el seed completo. Seguro para llamar múltiples veces
 * (solo inserta datos si las colecciones están vacías).
 */
export async function seedDatabase() {
  try {
    await connectDB();
    console.log('[Seed] Iniciando población de datos...');
    await seedEvent();
    await seedTeams();
    await seedMatches();
    console.log('[Seed] ✅ Población completada');
  } catch (error) {
    console.error('[Seed] ❌ Error:', error.message);
    throw error;
  }
}

// La ejecución directa no está soportada (se llama desde la API route).
// Para sembrar manualmente, importa y ejecuta seedDatabase() desde una API route.

export default seedDatabase;
