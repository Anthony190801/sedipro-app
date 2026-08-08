/**
 * ============================================================================
 * MODELO ScTeam — SEDICHAMPIONS LEAGUE 2026
 * ============================================================================
 *
 * Guarda los equipos inscritos por disciplina.
 *
 * Campos:
 *   - teamId:      Número de equipo dentro de la disciplina (1, 2, 3…)
 *   - name:        Nombre del equipo (ej: "Los Galácticos")
 *   - color:       Color representativo en hex (ej: "#672577")
 *   - discipline:  'futbol7' | 'voleyMixto'
 *   - bye:         Si el equipo tiene PASE DIRECTO en la 1ª ronda
 *   - drawOrder:   Posición tras el sorteo (determina emparejamientos)
 * ============================================================================
 */

import mongoose from 'mongoose';

const ScTeamSchema = new mongoose.Schema(
  {
    teamId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'El nombre del equipo es obligatorio'],
      trim: true,
    },
    color: {
      type: String,
      default: '#672577',
    },
    discipline: {
      type: String,
      required: true,
      enum: ['futbol7', 'voleyMixto'],
    },
    bye: {
      type: Boolean,
      default: false,
    },
    drawOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'sc_teams',
  }
);

// Índice compuesto para búsqueda rápida por disciplina + teamId
ScTeamSchema.index({ discipline: 1, teamId: 1 }, { unique: true });

const ScTeam = mongoose.models.ScTeam || mongoose.model('ScTeam', ScTeamSchema);

export default ScTeam;
