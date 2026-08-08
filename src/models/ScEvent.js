/**
 * ============================================================================
 * MODELO ScEvent — SEDICHAMPIONS LEAGUE 2026
 * ============================================================================
 *
 * Guarda la información general del evento (nombre, fecha, lugar, etc.).
 * SOLO DEBE EXISTIR UN DOCUMENTO en esta colección.
 *
 * Campos:
 *   - name:     Nombre del torneo (ej: "SEDICHAMPIONS LEAGUE 2026")
 *   - date:     Fecha del evento en texto libre (ej: "Sábado 08 de Agosto")
 *   - time:     Hora de inicio (ej: "08:00 AM")
 *   - venue:    Lugar del evento (ej: "Golden Club")
 *   - address:  Dirección o referencia adicional (opcional)
 *   - isActive: Si el evento está activo (para possible future use)
 *   - drawSeed:   Semilla del sorteo (number, null = no sorteado)
 *   - drawCompleted: Si ya se realizó el sorteo (boolean)
 * ============================================================================
 */

import mongoose from 'mongoose';

const ScEventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del evento es obligatorio'],
      default: 'SEDICHAMPIONS LEAGUE 2026',
    },
    date: {
      type: String,
      default: '',
    },
    time: {
      type: String,
      default: '',
    },
    venue: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    drawSeed: {
      type: Number,
      default: null,
    },
    drawCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    collection: 'sc_events',
  }
);

/**
 * Obtiene el evento activo (siempre hay uno solo).
 * Si no existe, lo crea con valores por defecto.
 */
ScEventSchema.statics.getEvent = async function () {
  let event = await this.findOne({ isActive: true });
  if (!event) {
    event = await this.create({});
  }
  return event;
};

const ScEvent = mongoose.models.ScEvent || mongoose.model('ScEvent', ScEventSchema);

export default ScEvent;
