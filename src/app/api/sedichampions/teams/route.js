/**
 * ============================================================================
 * API de Equipos — /api/sedichampions/teams
 * ============================================================================
 *
 * GET   → Lista todos los equipos (o filtra por ?discipline=futbol7)
 * POST  → Agrega un nuevo equipo a una disciplina
 * ============================================================================
 */

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import ScTeam from '@/models/ScTeam';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const discipline = searchParams.get('discipline');

    const filter = {};
    if (discipline && ['futbol7', 'voleyMixto'].includes(discipline)) {
      filter.discipline = discipline;
    }

    const teams = await ScTeam.find(filter).sort({ discipline: 1, teamId: 1 }).lean();

    return NextResponse.json({ success: true, teams });
  } catch (error) {
    console.error('[Teams API GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener equipos' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    // Verificar autenticación admin
    const auth = await requireAdmin(request);
    if (auth instanceof Response) return auth;

    const body = await request.json();
    const { name, discipline, color } = body;

    if (!name || !discipline) {
      return NextResponse.json(
        { success: false, error: 'Nombre y disciplina son obligatorios' },
        { status: 400 }
      );
    }

    if (!['futbol7', 'voleyMixto'].includes(discipline)) {
      return NextResponse.json(
        { success: false, error: 'Disciplina inválida (use futbol7 o voleyMixto)' },
        { status: 400 }
      );
    }

    // Calcular el siguiente teamId disponible
    const lastTeam = await ScTeam.findOne({ discipline }).sort({ teamId: -1 });
    const nextId = lastTeam ? lastTeam.teamId + 1 : 1;

    const team = await ScTeam.create({
      teamId: nextId,
      name: name.trim(),
      discipline,
      color: color || '#672577',
    });

    return NextResponse.json({ success: true, team }, { status: 201 });
  } catch (error) {
    console.error('[Teams API POST] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear equipo' },
      { status: 500 }
    );
  }
}
