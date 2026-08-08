/**
 * ============================================================================
 * API de Equipo Individual — /api/sedichampions/teams/[id]
 * ============================================================================
 *
 * PUT    → Edita nombre, color, o bye de un equipo
 * DELETE → Elimina un equipo
 * ============================================================================
 */

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import ScTeam from '@/models/ScTeam';

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const auth = await requireAdmin(request);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const body = await request.json();
    const { name, color, bye } = body;

    const update = {};
    if (name !== undefined) update.name = name.trim();
    if (color !== undefined) update.color = color;
    if (bye !== undefined) update.bye = Boolean(bye);

    const team = await ScTeam.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Equipo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, team });
  } catch (error) {
    console.error('[Teams API PUT] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar equipo' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const auth = await requireAdmin(request);
    if (auth instanceof Response) return auth;

    const { id } = await params;

    const team = await ScTeam.findByIdAndDelete(id);

    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Equipo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Equipo eliminado' });
  } catch (error) {
    console.error('[Teams API DELETE] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar equipo' },
      { status: 500 }
    );
  }
}
