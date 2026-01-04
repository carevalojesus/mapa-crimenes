import { useMemo } from "preact/hooks";
import type { CrimeRow } from "../lib/crime";
import { applyFilters } from "../lib/filters";
import { useStore } from "@nanostores/preact";
import { $filters } from "../stores/filters";

type Props = { data: CrimeRow[] };

// Iconos por categoría (debe coincidir con MapView)
const CRIME_ICONS: Record<string, { emoji: string; color: string }> = {
    "ROBO/HURTO": { emoji: "💰", color: "#f59e0b" },
    "VIOLENCIA FAMILIAR": { emoji: "👪", color: "#8b5cf6" },
    "ROBO ARMADO": { emoji: "🔫", color: "#ef4444" },
    "ROBO DE CELULAR": { emoji: "📱", color: "#3b82f6" },
    "ROBO DE VEHICULO": { emoji: "🚗", color: "#10b981" },
    OTROS: { emoji: "⚠️", color: "#6b7280" },
};

export default function StatsPanel({ data }: Props) {
    const filters = useStore($filters);
    const filtered = useMemo(
        () => applyFilters(data, filters),
        [data, filters]
    );

    const counts = useMemo(() => {
        const byCat: Record<string, number> = {};
        for (const r of filtered)
            byCat[r.Categoria_Crimen] = (byCat[r.Categoria_Crimen] || 0) + 1;
        return Object.entries(byCat)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);
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

            {/* Estadísticas por categoría */}
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Por categoria
                </h3>
                <ul className="space-y-2">
                    {counts.map(([k, v]) => {
                        const icon = CRIME_ICONS[k] || CRIME_ICONS["OTROS"];
                        return (
                            <li key={k} className="text-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                        style={{ backgroundColor: icon.color }}
                                    >
                                        {icon.emoji}
                                    </span>
                                    <span className="text-gray-700 truncate flex-1">
                                        {k}
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        {v.toLocaleString()}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 ml-8">
                                    <div
                                        className="h-1.5 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${(v / maxCount) * 100}%`,
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
                    {Object.entries(CRIME_ICONS).map(([cat, icon]) => (
                        <div key={cat} className="flex items-center gap-1.5">
                            <span
                                className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                                style={{ backgroundColor: icon.color }}
                            >
                                {icon.emoji}
                            </span>
                            <span className="text-xs text-gray-600 truncate">
                                {cat}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
