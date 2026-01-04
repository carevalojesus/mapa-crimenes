import { useMemo } from "preact/hooks";
import type { CrimeRow } from "../lib/crime";
import { applyFilters } from "../lib/filters";
import { useStore } from "@nanostores/preact";
import { $filters } from "../stores/filters";

type Props = { data: CrimeRow[] };

// Iconos de crimen (debe coincidir con MapView)
const CRIME_ICONS = {
    VEHICULO: { emoji: "🚗", color: "#10b981", label: "Robo de Vehiculo" },
    CELULAR: { emoji: "📱", color: "#3b82f6", label: "Robo de Celular" },
    ARMA: { emoji: "🔫", color: "#ef4444", label: "Robo Armado" },
    VIOLENCIA: { emoji: "👪", color: "#8b5cf6", label: "Violencia Familiar" },
    DINERO: { emoji: "💰", color: "#f59e0b", label: "Robo de Dinero" },
    OTROS: { emoji: "⚠️", color: "#6b7280", label: "Otros" },
};

// Detectar tipo de icono basado en el tipo de crimen
function detectarTipoIcono(tipo: string, categoria: string): keyof typeof CRIME_ICONS {
    const tipoUpper = tipo.toUpperCase();
    const catUpper = categoria.toUpperCase();

    if (tipoUpper.includes("VEHICULO") || tipoUpper.includes("VEHÍCULO")) {
        return "VEHICULO";
    }
    if (tipoUpper.includes("CELULAR")) {
        return "CELULAR";
    }
    if (tipoUpper.includes("ARMA") || tipoUpper.includes("ASALTO")) {
        return "ARMA";
    }
    if (tipoUpper.includes("VIOLENCIA") || tipoUpper.includes("FAMILIAR")) {
        return "VIOLENCIA";
    }
    if (tipoUpper.includes("DINERO")) {
        return "DINERO";
    }

    if (catUpper.includes("VEHICULO") || catUpper.includes("VEHÍCULO")) {
        return "VEHICULO";
    }
    if (catUpper.includes("CELULAR")) {
        return "CELULAR";
    }
    if (catUpper.includes("ARMADO")) {
        return "ARMA";
    }
    if (catUpper.includes("VIOLENCIA")) {
        return "VIOLENCIA";
    }

    return "OTROS";
}

export default function StatsPanel({ data }: Props) {
    const filters = useStore($filters);
    const filtered = useMemo(
        () => applyFilters(data, filters),
        [data, filters]
    );

    // Contar por tipo de icono (no por categoría)
    const counts = useMemo(() => {
        const byIcon: Record<string, number> = {};
        for (const r of filtered) {
            const iconType = detectarTipoIcono(r.Tipo_Crimen, r.Categoria_Crimen);
            byIcon[iconType] = (byIcon[iconType] || 0) + 1;
        }
        return Object.entries(byIcon)
            .sort((a, b) => b[1] - a[1]);
    }, [filtered]);

    const total = filtered.length;
    const maxCount = counts.length > 0 ? counts[0][1] : 1;

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Resumen</h2>

            {/* Contador de casos */}
            <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium">
                    Casos filtrados
                </p>
                <p className="text-3xl font-bold text-blue-700">
                    {total.toLocaleString()}
                </p>
            </div>

            {/* Estadísticas por tipo */}
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Por tipo de crimen
                </h3>
                <ul className="space-y-2">
                    {counts.map(([iconType, count]) => {
                        const icon = CRIME_ICONS[iconType as keyof typeof CRIME_ICONS];
                        return (
                            <li key={iconType} className="text-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                        style={{ backgroundColor: icon.color }}
                                    >
                                        {icon.emoji}
                                    </span>
                                    <span className="text-gray-700 truncate flex-1">
                                        {icon.label}
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        {count.toLocaleString()}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 ml-8">
                                    <div
                                        className="h-1.5 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${(count / maxCount) * 100}%`,
                                            backgroundColor: icon.color,
                                        }}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Leyenda de iconos */}
            <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Leyenda
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(CRIME_ICONS).map(([key, icon]) => (
                        <div key={key} className="flex items-center gap-1.5">
                            <span
                                className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                                style={{ backgroundColor: icon.color }}
                            >
                                {icon.emoji}
                            </span>
                            <span className="text-xs text-gray-600 truncate">
                                {icon.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
