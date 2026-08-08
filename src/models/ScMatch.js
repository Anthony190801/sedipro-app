/**
 * ============================================================================
 * MODELO ScMatch — SEDICHAMPIONS LEAGUE 2026
 * ============================================================================
 *
 * Guarda cada partido individual del torneo con su resultado.
 *
 * Campos:
 *   - discipline: 'futbol7' | 'voleyMixto'
 *   - roundIdx:   Índice de la ronda (0 = primera ronda, 1 = cuartos, etc.)
 *   - matchIdx:   Posición del partido dentro de la ronda (0, 1, 2…)
 *   - teamA:      Nombre del equipo A (o "POR DEFINIR" / "PASE DIRECTO")
 *   - teamB:      Nombre del equipo B (o "POR DEFINIR" / "PASE DIRECTO")
 *   - winner:     Nombre del equipo ganador (null = sin definir)
 *   - time:       Hora programada (ej: "08:00 AM")
 *   - court:      Cancha asignada (ej: "Cancha 1")
 * ============================================================================
 */

import mongoose from 'mongoose';

const ScMatchSchema = new mongoose.Schema(
  {
    discipline: {
      type: String,
      required: true,
      enum: ['futbol7', 'voleyMixto'],
    },
    roundIdx: {
      type: Number,
      required: true,
      min: 0,
    },
    matchIdx: {
      type: Number,
      required: true,
      min: 0,
    },
    roundName: {
      type: String,
      default: '',
    },
    teamA: {
      type: String,
      default: 'POR DEFINIR',
    },
    teamB: {
      type: String,
      default: 'POR DEFINIR',
    },
    winner: {
      type: String,
      default: null,
    },
    time: {
      type: String,
      default: '',
    },
    court: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'sc_matches',
  }
);

// Índice compuesto para búsqueda rápida por disciplina + ronda + posición
ScMatchSchema.index(
  { discipline: 1, roundIdx: 1, matchIdx: 1 },
  { unique: true }
);

const ScMatch = mongoose.models.ScMatch || mongoose.model('ScMatch', ScMatchSchema);

export default ScMatch;
