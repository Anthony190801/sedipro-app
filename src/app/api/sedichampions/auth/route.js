/**
 * ============================================================================
 * POST /api/sedichampions/auth
 * GET  /api/sedichampions/auth — verifica si la sesión admin es válida
 * ============================================================================
 *
 * POST: Verifica la contraseña admin y devuelve un JWT en una cookie httpOnly.
 * GET:  Verifica la cookie de sesión admin (usado por el dashboard).
 *
 * POST Body: { password: string }
 *
 * Response 200: { success: true, message: "..." }
 * Response 401: { success: false, error: "..." }
 * ============================================================================
 */

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sedichampions2026secretkey';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sediadmin';

/** GET — Verifica si hay una sesión admin activa */
export async function GET(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = parseCookies(cookieHeader);
    const token = cookies['sedi_admin_token'];

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({
      success: true,
      message: 'Sesión válida',
      role: decoded.role,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Sesión expirada o inválida' },
      { status: 401 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Contraseña requerida' },
        { status: 400 }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Generar JWT válido por 12 horas
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });

    // Establecer cookie httpOnly
    const response = NextResponse.json({
      success: true,
      message: 'Autenticado correctamente',
    });

    response.cookies.set('sedi_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12, // 12 horas
    });

    return response;
  } catch (error) {
    console.error('[Auth API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}

/** Parsea el header Cookie en un objeto clave-valor */
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach((pair) => {
    const [name, ...rest] = pair.trim().split('=');
    if (name) {
      cookies[name] = decodeURIComponent(rest.join('='));
    }
  });
  return cookies;
}
