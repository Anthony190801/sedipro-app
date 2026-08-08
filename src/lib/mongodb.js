/**
 * ============================================================================
 * CONEXIÓN SINGLETON A MONGODB — SEDICHAMPIONS LEAGUE 2026
 * ============================================================================
 *
 * Patrón estándar para Next.js App Router:
 *   - Reutiliza la conexión entre invocaciones en caliente (hot reload).
 *   - Evita múltiples conexiones durante el desarrollo.
 *   - Usa la variable global para cachear la promesa de conexión.
 *
 * Uso:
 *   import { connectDB } from '@/lib/mongodb';
 *   await connectDB();
 * ============================================================================
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Falta MONGODB_URI en .env.local. Crea el archivo con la URI de conexión a MongoDB Atlas.'
  );
}

/** @type {import('mongoose').Connection | null} */
let cached = global._mongooseCache || null;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

/**
 * Conecta a MongoDB y devuelve la conexión Mongoose.
 * Solo crea una conexión nueva si no existe una activa.
 *
 * @returns {Promise<import('mongoose').Connection>}
 */
export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Desactiva buffering para evitar fugas
      dbName: 'sedichampions', // Nombre fijo de la base de datos
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('[MongoDB] Conectado a sedichampions');
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset para reintentar en la próxima llamada
    console.error('[MongoDB] Error de conexión:', e.message);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
