# SEDICHAMPIONS LEAGUE 2026 — Guía de Desarrollo

## Arquitectura del Módulo

```
src/app/sedichampions/
├── page.js                          ← Página principal (router App Router)
├── data/
│   └── tournamentData.js            ← Datos editables (evento, reglas, equipos, horarios)
├── utils/
│   └── bracketLogic.js              ← Lógica pura: BYEs, potencia de 2, estructura de rondas
├── components/                      ← Componentes React (todos 'use client')
│   ├── Header.jsx                   ← Logo + navbar (FÚTBOL | VOLEY | GYMKANA | LUGAR)
│   ├── Article.jsx                  ← Modal con pósteres e info (gymkana, lugar)
│   ├── Footer.jsx                   ← Footer con copyright
│   ├── Shuffle.jsx                  ← Efecto de texto shuffling para el título
│   ├── Bracket.jsx                  ← Contenedor del árbol del torneo (scroll horizontal)
│   ├── RoundColumn.jsx              ← Columna por ronda, posiciona MatchCards
│   ├── MatchCard.jsx                ← Tarjeta pill individual (equipo A VS equipo B)
│   ├── BracketConnector.jsx         ← Líneas SVG conectoras entre rondas
│   ├── TeamList.jsx                 ← Grid de tarjetas de equipos inscritos
│   └── Tabs.jsx                     ← Selector Fútbol 7 / Vóley Mixto (no usado actualmente)
└── styles/                          ← Hojas de estilo CSS por componente
    ├── Header.css
    ├── Bracket.css
    ├── RoundColumn.css
    ├── MatchCard.css
    ├── BracketConnector.css
    ├── TeamList.css
    └── Tabs.css
```

### Datos (`tournamentData.js`)
Archivo altamente comentado en español. 4 secciones:
1. `eventInfo` — nombre, fecha, hora, lugar
2. `quickRules` — reglas rápidas por disciplina
3. `disciplines` — equipos inscritos en `futbol7` y `voleyMixto`
4. `schedules` — horarios y canchas por ronda y disciplina

### Utilidades (`bracketLogic.js`)
Funciones puras exportadas:
- `nextPowerOfTwo(n)` — siguiente potencia de 2
- `calculateByes(teamCount)` — cuántos BYEs necesarios
- `assignByes(teams, seed)` — asigna PASE DIRECTO con PRNG determinista (mulberry32)
- `buildBracket(teams, schedule)` — estructura el árbol de rondas
- `calculateBracket(teams, disciplineData)` — wrapper que une lógica con datos

### Constantes del Bracket (`Bracket.jsx`)
- `SLOT_HEIGHT = 88` — altura en px por partido de 1ª ronda
- `MATCH_CARD_H = 70` — altura estimada de una MatchCard
- `CONNECTOR_WIDTH = 48` — ancho del SVG conector
- `matchCenterY(roundIdx, matchIdx, slotHeight)` — calcula centro Y de un partido

---

## Reglas de Negocio y Estado Actual

### Navegación (`page.js`)

Estado central `activeTab`: `null | 'futbol' | 'voley' | 'gymkana' | 'lugar'`

| `activeTab` | Qué renderiza | Qué NO renderiza |
|---|---|---|
| `null` (HOME) | Header completo + video + info evento (📍📅🕗) + Footer | Bracket, TeamList, Tabs |
| `'futbol'` | Header + Bracket(futbol7) + TeamList(futbol7) + Footer | Tabs, EventInfo, video, modal |
| `'voley'` | Header + Bracket(voleyMixto) + TeamList(voleyMixto) + Footer | Tabs, EventInfo, video, modal |
| `'gymkana'` | Header + fondo limpio + **modal Article** con póster gymkana | Bracket, TeamList, Tabs, EventInfo |
| `'lugar'` | Header + fondo limpio + **modal Article** con mapa/ubicación | Bracket, TeamList, Tabs, EventInfo |

### Reglas críticas de renderizado condicional
1. **Fondo limpio en Gymkana/Lugar:** `handleOpenArticle()` setea `activeTab` al ID del artículo. `handleCloseArticle()` lo resetea a `null`. Esto evita que el bracket/teamlist se filtre detrás del modal.
2. **Sin cruce de contenidos:** Cada vista es mutuamente excluyente. Un solo `if/else if` por valor de `activeTab`.
3. **Navbar del Header:** FÚTBOL/VOLEY → `onTabChange()` (cambia vista). GYMKANA/LUGAR → `onOpenArticle()` (abre modal).
4. **Video promocional:** Solo visible cuando `!activeTab` (home).
5. **`overflow-x-hidden`:** Solo en modo NO torneo. En modo torneo se retira para permitir scroll del bracket.

### Colores del Tema (`globals.css` — Tailwind v4)
| Variable | Hex | Uso |
|---|---|---|
| `--color-background` | `#0b1326` | Fondo general |
| `--color-foreground` | `#dae2fd` | Texto principal |
| `--color-primary` | `#672577` | Acento principal (morado) |
| `--color-secondary` | `#3454A1` | Acento secundario (azul) |
| `--color-accent` | `#2B2D67` | Acento terciario |
| `--color-warning` | `#F59E0B` | Color para la ronda Final |

### Estilo de tarjetas (vidrio esmerilado)
- **MatchCard / TeamCard:** `background: rgba(11,19,38,0.55)` + `backdrop-filter: blur(10px)`
- **Borde:** `1.5px solid rgba(103,37,119,0.45)` (morado semitransparente)
- **Sombra:** `0 4px 16px rgba(0,0,0,0.35)` + brillo interior sutil
- **Conectores SVG:** `stroke: rgba(103,37,119,0.5)`

### Imágenes de fondo
Mapeo en `page.js` → `BG_IMAGES`. Por ahora todas apuntan a `bg.webp`. Pendiente añadir fondos específicos por disciplina en `public/sedichampions/`.

---

## Puntos Pendientes y Mejoras Planeadas

### Scroll del Bracket
- El bracket de Fútbol 7 tiene 4 rondas (Preliminar → Cuartos → Semis → Final)
- Scroll horizontal funcionando con `overflow-x: auto` en `.bracket-scroll`
- `flex-shrink: 0` en columnas + `min-width: 280px`
- Padding derecho extra en última columna (`.bracket-round-wrapper:last-child`)
- **Pendiente:** Posible mejora de zoom/scaling automático para que el bracket completo sea visible sin scroll en pantallas grandes

### Alineación vertical de rondas
- Sistema de posicionamiento absoluto con coordenadas calculadas por `matchCenterY()`
- Fórmula: `(matchIdx × 2^roundIdx + 2^(roundIdx-1)) × 88px`
- Esto garantiza que cada ronda posterior quede centrada entre sus dos partidos de origen
- **Pendiente:** Explorar alternativa de posicionamiento porcentual para eliminar scroll vertical en viewports pequeños

### Fondos por disciplina
- Se necesitan imágenes en `public/sedichampions/`: `bg-futbol.webp`, `bg-voley.webp`, `bg-gymkana.webp`, `bg-lugar.webp`
- Las rutas están comentadas con TODO en `page.js`

### Datos del torneo
- Los equipos y horarios en `tournamentData.js` deben actualizarse el 06 de agosto
- El archivo está diseñado para que una persona no técnica lo edite
