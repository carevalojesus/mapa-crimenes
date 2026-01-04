# Mapa de Criminalidad - Iquitos

Aplicacion web interactiva para visualizar datos de criminalidad en la ciudad de Iquitos, Peru. Permite explorar incidentes por ubicacion, tipo de crimen, fecha y periodo del dia.

## Caracteristicas

- **Mapa interactivo** con marcadores agrupados (clusters) y mapa de calor
- **Iconos por categoria** de crimen para identificacion visual rapida
- **Filtros avanzados**: por año, mes, dia, periodo, categoria y tipo de crimen
- **Estadisticas en tiempo real** que se actualizan segun los filtros
- **Distritos de Iquitos** con GeoJSON (Iquitos, Punchana, Belen, San Juan Bautista)

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| [Astro](https://astro.build) | Framework web |
| [Preact](https://preactjs.com) | Componentes reactivos |
| [TailwindCSS](https://tailwindcss.com) | Estilos |
| [Leaflet](https://leafletjs.com) | Mapas interactivos |
| [Nanostores](https://github.com/nanostores/nanostores) | Estado global |

## Estructura del Proyecto

```
src/
├── components/
│   ├── FiltersPanel.tsx    # Panel de filtros
│   ├── MapView.tsx         # Mapa con Leaflet
│   └── StatsPanel.tsx      # Estadisticas y leyenda
├── data/
│   ├── datos_crimenes_limpios.json  # Datos de crimenes
│   └── iquitos-distritos.json       # GeoJSON de distritos
├── lib/
│   ├── crime.ts            # Tipos y utilidades
│   └── filters.ts          # Logica de filtrado
├── stores/
│   └── filters.ts          # Estado de filtros
├── styles/
│   └── global.css          # Estilos globales
└── pages/
    └── index.astro         # Pagina principal
```

## Tipos de Crimen (Iconos)

| Icono | Tipo | Color | Detecta |
|-------|------|-------|---------|
| 🚗 | Robo de Vehiculo | Verde | Tipos con "vehiculo" o "vehículo" |
| 📱 | Robo de Celular | Azul | Tipos con "celular" |
| 🔫 | Robo Armado | Rojo | Tipos con "arma" o "asalto" |
| 👪 | Violencia Familiar | Violeta | Tipos con "violencia" o "familiar" |
| 💰 | Robo de Dinero | Amarillo | Tipos con "dinero" |
| ⚠️ | Otros | Gris | Todo lo demas |

## Instalacion

```bash
# Clonar repositorio
git clone <repo-url>
cd crimen-mapa

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

## Comandos

| Comando | Accion |
|---------|--------|
| `pnpm dev` | Inicia servidor en `localhost:4321` |
| `pnpm build` | Genera build de produccion en `./dist/` |
| `pnpm preview` | Previsualiza el build localmente |

## Datos

Los datos incluyen registros de crimenes desde 2019 hasta 2025, con la siguiente informacion:

- Ubicacion (latitud, longitud)
- Fecha y hora del incidente
- Tipo y categoria de crimen
- Periodo del dia (Madrugada, Mañana, Tarde, Noche)

## Licencia

MIT
