/**
 * ============================================================================
 * API de Evento — /api/sedichampions/event
 * ============================================================================
 *
 * GET → Obtiene la info general del evento
 * PUT → Actualiza la info general del evento (admin)
 * ============================================================================
 */

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import ScEvent from '@/models/ScEvent';

export async function GET() {
  try {
    await connectDB();
    const event = await ScEvent.getEvent();

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('[Event API GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener evento' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const auth = await requireAdmin(request);
    if (auth instanceof Response) return auth;

    const body = await request.json();
    const allowed = ['name', 'date', 'time', 'venue', 'address'];
    const update = {};

    for (const key of allowed) {
      if (body[key] !== undefined) {
        update[key] = body[key];
      }
    }

    let event = await ScEvent.findOne({ isActive: true });
    if (!event) {
      event = await ScEvent.create(update);
    } else {
      Object.assign(event, update);
      await event.save();
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('[Event API PUT] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar evento' },
      { status: 500 }
    );
  }
}
