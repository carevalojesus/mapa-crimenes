export type CrimeRow = {
    Latitud: number | string;
    Longitud: number | string;
    Fecha: string;
    Hora: string;
    Tipo_Crimen: string;
    Categoria_Crimen: string;
    Periodo_Dia: string;
    Nombre_Dia: string;
    Nombre_Mes: string;
    Minutos_Dia: number | string;
};

export function parseNum(x: unknown): number | null {
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
}

// Normalizar errores ortográficos en tipos de crimen
const TIPO_NORMALIZACION: Record<string, string> = {
    "HURTO DE VHÍCULO": "HURTO DE VEHICULO",
    "HURTO DE VEHÍCULO": "HURTO DE VEHICULO",
    "ROBO CON ARMAR DE FUEGO": "ROBO CON ARMA DE FUEGO",
    "ROBO DE DINRERO": "ROBO DE DINERO",
    "ROBO CELULAR": "ROBO DE CELULAR",
};

export function normalizarTipo(tipo: string): string {
    return TIPO_NORMALIZACION[tipo] || tipo;
}

// Mapeos de traducción
const DIAS_ES: Record<string, string> = {
    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miercoles",
    Thursday: "Jueves",
    Friday: "Viernes",
    Saturday: "Sabado",
    Sunday: "Domingo",
};

const MESES_ES: Record<string, string> = {
    January: "Enero",
    February: "Febrero",
    March: "Marzo",
    April: "Abril",
    May: "Mayo",
    June: "Junio",
    July: "Julio",
    August: "Agosto",
    September: "Septiembre",
    October: "Octubre",
    November: "Noviembre",
    December: "Diciembre",
};

export function traducirDia(dia: string): string {
    return DIAS_ES[dia] || dia;
}

export function traducirMes(mes: string): string {
    return MESES_ES[mes] || mes;
}

export const DIAS_SEMANA = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
];

export const PERIODOS_DIA = ["Madrugada", "Mañana", "Tarde", "Noche"];

export const MESES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

export const ANIOS = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"];

// Categorías ordenadas por importancia
export const CATEGORIAS = [
    "ROBO/HURTO",
    "VIOLENCIA FAMILIAR",
    "ROBO ARMADO",
    "ROBO DE CELULAR",
    "ROBO DE VEHICULO",
    "OTROS",
];

// Relación categoría -> tipos
export const TIPOS_POR_CATEGORIA: Record<string, string[]> = {
    "ROBO/HURTO": [
        "HURTO DE VEHICULO",
        "HURTO DE DINERO",
        "ROBO DE VEHICULO",
        "ROBO DE DINERO",
        "HURTO AGRAVADO",
    ],
    "VIOLENCIA FAMILIAR": ["VIOLENCIA FAMILIAR"],
    "ROBO ARMADO": ["ROBO CON ARMA DE FUEGO", "ASALTO CON ARMA DE FUEGO"],
    "ROBO DE CELULAR": ["HURTO DE CELULAR", "ROBO DE CELULAR"],
    "ROBO DE VEHICULO": ["HURTO DE VEHICULO"],
    OTROS: ["ASALTO CON ARMA DE FUEGO"],
};
