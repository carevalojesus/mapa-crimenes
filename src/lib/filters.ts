import type { CrimeRow } from "./crime";
import { normalizarTipo } from "./crime";
import type { Filters } from "../stores/filters";

// Mapeo de español a inglés para filtrar días
const DIA_ES_TO_EN: Record<string, string> = {
    Lunes: "Monday",
    Martes: "Tuesday",
    Miercoles: "Wednesday",
    Jueves: "Thursday",
    Viernes: "Friday",
    Sabado: "Saturday",
    Domingo: "Sunday",
};

// Mapeo de español a inglés para filtrar meses
const MES_ES_TO_EN: Record<string, string> = {
    Enero: "January",
    Febrero: "February",
    Marzo: "March",
    Abril: "April",
    Mayo: "May",
    Junio: "June",
    Julio: "July",
    Agosto: "August",
    Septiembre: "September",
    Octubre: "October",
    Noviembre: "November",
    Diciembre: "December",
};

export function applyFilters(rows: CrimeRow[], f: Filters): CrimeRow[] {
    return rows.filter((r) => {
        // Filtro por categoría
        if (f.categoria !== "ALL" && r.Categoria_Crimen !== f.categoria)
            return false;

        // Filtro por tipo (normalizado)
        if (f.tipo !== "ALL") {
            const tipoNormalizado = normalizarTipo(r.Tipo_Crimen);
            if (tipoNormalizado !== f.tipo) return false;
        }

        // Filtro por día (convertir español a inglés)
        if (f.dia !== "ALL") {
            const diaEN = DIA_ES_TO_EN[f.dia] || f.dia;
            if (r.Nombre_Dia !== diaEN) return false;
        }

        // Filtro por periodo
        if (f.periodo !== "ALL" && r.Periodo_Dia !== f.periodo) return false;

        // Filtro por año
        if (f.anio !== "ALL") {
            const anioRegistro = r.Fecha?.split("-")[0];
            if (anioRegistro !== f.anio) return false;
        }

        // Filtro por mes (convertir español a inglés)
        if (f.mes !== "ALL") {
            const mesEN = MES_ES_TO_EN[f.mes] || f.mes;
            if (r.Nombre_Mes !== mesEN) return false;
        }

        // Filtro por rango de fechas
        const d = r.Fecha;
        if (f.dateFrom && d < f.dateFrom) return false;
        if (f.dateTo && d > f.dateTo) return false;

        return true;
    });
}
