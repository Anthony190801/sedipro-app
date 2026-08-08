/**
 * ============================================================================
 * API de Partido Individual — /api/sedichampions/matches/[id]
 * ============================================================================
 *
 * PUT → Marca ganador, actualiza hora/cancha de un partido.
 *
 * Body:
 *   - winner: Nombre del equipo ganador (string | null para desmarcar)
 *   - time:   Hora programada (string)
 *   - court:  Cancha asignada (string)
 *   - teamA:  Nombre del equipo A
 *   - teamB:  Nombre del equipo B
 * ============================================================================
 */

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import ScMatch from '@/models/ScMatch';

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const auth = await requireAdmin(request);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const body = await request.json();

    const update = {};
    if (body.winner !== undefined) update.winner = body.winner || null;
    if (body.time !== undefined) update.time = body.time;
    if (body.court !== undefined) update.court = body.court;
    if (body.teamA !== undefined) update.teamA = body.teamA;
    if (body.teamB !== undefined) update.teamB = body.teamB;

    const match = await ScMatch.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!match) {
      return NextResponse.json(
        { success: false, error: 'Partido no encontrado' },
        { status: 404 }
      );
    }

    // Propagar ganador a la siguiente ronda (siempre, incluso al desmarcar)
    if (body.winner !== undefined) {
      await propagateWinner(match);
    }

    return NextResponse.json({ success: true, match });
  } catch (error) {
    console.error('[Matches API PUT] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar partido' },
      { status: 500 }
    );
  }
}

/**
 * Propaga el ganador de UN partido hacia todas las rondas siguientes EN CASCADA.
 *
 * Reglas:
 *   1. Si matchIdx es par → actualiza teamA del partido hijo.
 *   2. Si matchIdx es impar → actualiza teamB del partido hijo.
 *   3. Si el slot cambia, limpia el winner del partido hijo (equipos distintos).
 *   4. Repite recursivamente hacia abajo hasta la final.
 *
 * Estados cubiertos:
 *   - Marcar ganador:   winner = "Equipo A" → propaga nombre y cascada.
 *   - Desmarcar ganador: winner = null       → resetea slot a "POR DEFINIR" y cascada.
 *   - Sin cambios:       slot ya tenía ese nombre → no limpia winner, no cascada.
 */
async function propagateWinner(match) {
  const nextRoundIdx = match.roundIdx + 1;
  const nextMatchIdx = Math.floor(match.matchIdx / 2);

  const nextMatch = await ScMatch.findOne({
    discipline: match.discipline,
    roundIdx: nextRoundIdx,
    matchIdx: nextMatchIdx,
  });

  if (!nextMatch) return; // No hay siguiente ronda (final del cuadro)

  const isTeamA = match.matchIdx % 2 === 0;
  const slotField = isTeamA ? 'teamA' : 'teamB';
  const newSlotValue = match.winner || 'POR DEFINIR';

  // ¿Cambió el slot?
  const slotChanged = nextMatch[slotField] !== newSlotValue;

  // Aplicar el cambio al slot del hijo
  const update = { [slotField]: newSlotValue };

  // Si el equipo que entra es diferente, el resultado anterior queda invalidado
  if (slotChanged) {
    update.winner = null;
  }

  await ScMatch.findByIdAndUpdate(nextMatch._id, update);

  // Cascada: el cambio en este hijo afecta a su propio hijo (nieto)
  const refreshedChild = await ScMatch.findById(nextMatch._id);
  await propagateWinner(refreshedChild);
}
