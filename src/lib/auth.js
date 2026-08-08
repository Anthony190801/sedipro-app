/**
 * ============================================================================
 * UTILIDAD DE AUTENTICACIÓN ADMIN — SEDICHAMPIONS LEAGUE 2026
 * ============================================================================
 *
 * Verifica el JWT de sesión admin desde la cookie `sedi_admin_token`.
 * Usado por todas las API routes protegidas.
 *
 * Uso:
 *   import { verifyAdmin } from '@/lib/auth';
 *   const user = await verifyAdmin(request); // null si no está autenticado
 * ============================================================================
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sedichampions2026secretkey';

/**
 * Verifica que el request tenga una cookie de sesión admin válida.
 *
 * @param {Request} request - Request de Next.js
 * @returns {Object|null} Payload del JWT si es válido, null si no
 */
export async function verifyAdmin(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = parseCookies(cookieHeader);
    const token = cookies['sedi_admin_token'];

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // { role: 'admin', iat, exp }
  } catch {
    return null;
  }
}

/**
 * Parsea el header Cookie en un objeto clave-valor.
 *
 * @param {string} cookieHeader - Valor del header Cookie
 * @returns {Object} Cookies parseadas
 */
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

/**
 * Helper: devuelve 401 si no está autenticado.
 * Uso: const auth = await requireAdmin(request); if (auth instanceof Response) return auth;
 */
export async function requireAdmin(request) {
  const user = await verifyAdmin(request);
  if (!user) {
    const { NextResponse } = await import('next/server');
    return NextResponse.json(
      { success: false, error: 'No autorizado' },
      { status: 401 }
    );
  }
  return user;
}
