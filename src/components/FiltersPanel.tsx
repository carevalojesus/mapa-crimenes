import { useMemo } from "preact/hooks";
import type { CrimeRow } from "../lib/crime";
import {
    DIAS_SEMANA,
    PERIODOS_DIA,
    MESES,
    ANIOS,
    CATEGORIAS,
    TIPOS_POR_CATEGORIA,
} from "../lib/crime";
import { useStore } from "@nanostores/preact";
import { $filters } from "../stores/filters";

type Props = { data: CrimeRow[] };

export default function FiltersPanel({ data }: Props) {
    const filters = useStore($filters);

    // Obtener tipos disponibles según categoría seleccionada
    const tiposDisponibles = useMemo(() => {
        if (filters.categoria === "ALL") {
            // Si no hay categoría, mostrar todos los tipos únicos
            const allTipos = Object.values(TIPOS_POR_CATEGORIA).flat();
            return [...new Set(allTipos)].sort();
        }
        return TIPOS_POR_CATEGORIA[filters.categoria] || [];
    }, [filters.categoria]);

    function set(k: string, v: string) {
        const newFilters = { ...filters, [k]: v };
        // Si cambia la categoría, resetear el tipo
        if (k === "categoria" && v !== filters.categoria) {
            newFilters.tipo = "ALL";
        }
        $filters.set(newFilters);
    }

    function resetFilters() {
        $filters.set({
            categoria: "ALL",
            tipo: "ALL",
            dia: "ALL",
            periodo: "ALL",
            anio: "ALL",
            mes: "ALL",
            dateFrom: "",
            dateTo: "",
        });
    }

    // Contar registros con filtros actuales
    const totalRegistros = data.length;

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>

            {/* Sección: Tiempo */}
            <div className="bg-blue-50 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-blue-800 mb-3">
                    Periodo de Tiempo
                </h3>

                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Año
                            </label>
                            <select
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.anio}
                                onChange={(e) =>
                                    set(
                                        "anio",
                                        (e.target as HTMLSelectElement).value
                                    )
                                }
                            >
                                <option value="ALL">Todos</option>
                                {ANIOS.map((anio) => (
                                    <option key={anio} value={anio}>
                                        {anio}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Mes
                            </label>
                            <select
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.mes}
                                onChange={(e) =>
                                    set(
                                        "mes",
                                        (e.target as HTMLSelectElement).value
                                    )
                                }
                            >
                                <option value="ALL">Todos</option>
                                {MESES.map((mes) => (
                                    <option key={mes} value={mes}>
                                        {mes}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Dia
                            </label>
                            <select
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.dia}
                                onChange={(e) =>
                                    set(
                                        "dia",
                                        (e.target as HTMLSelectElement).value
                                    )
                                }
                            >
                                <option value="ALL">Todos</option>
                                {DIAS_SEMANA.map((dia) => (
                                    <option key={dia} value={dia}>
                                        {dia}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Periodo
                            </label>
                            <select
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.periodo}
                                onChange={(e) =>
                                    set(
                                        "periodo",
                                        (e.target as HTMLSelectElement).value
                                    )
                                }
                            >
                                <option value="ALL">Todos</option>
                                {PERIODOS_DIA.map((periodo) => (
                                    <option key={periodo} value={periodo}>
                                        {periodo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Desde
                            </label>
                            <input
                                type="date"
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.dateFrom}
                                onChange={(e) =>
                                    set(
                                        "dateFrom",
                                        (e.target as HTMLInputElement).value
                                    )
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Hasta
                            </label>
                            <input
                                type="date"
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.dateTo}
                                onChange={(e) =>
                                    set(
                                        "dateTo",
                                        (e.target as HTMLInputElement).value
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección: Tipo de Crimen */}
            <div className="bg-amber-50 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-amber-800 mb-3">
                    Tipo de Crimen
                </h3>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Categoria
                        </label>
                        <select
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            value={filters.categoria}
                            onChange={(e) =>
                                set(
                                    "categoria",
                                    (e.target as HTMLSelectElement).value
                                )
                            }
                        >
                            <option value="ALL">Todas las categorias</option>
                            {CATEGORIAS.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Tipo especifico
                        </label>
                        <select
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            value={filters.tipo}
                            onChange={(e) =>
                                set(
                                    "tipo",
                                    (e.target as HTMLSelectElement).value
                                )
                            }
                        >
                            <option value="ALL">Todos los tipos</option>
                            {tiposDisponibles.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Botón limpiar */}
            <button
                className="w-full px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                onClick={resetFilters}
            >
                Limpiar filtros
            </button>

            {/* Info de registros */}
            <div className="text-xs text-gray-500 text-center">
                Total en base de datos: {totalRegistros.toLocaleString()} registros
            </div>
        </div>
    );
}
