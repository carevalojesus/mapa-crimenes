import { atom } from "nanostores";

export type Filters = {
    categoria: string;
    tipo: string;
    dia: string;
    periodo: string;
    anio: string;
    mes: string;
    dateFrom: string;
    dateTo: string;
};

export const $filters = atom<Filters>({
    categoria: "ALL",
    tipo: "ALL",
    dia: "ALL",
    periodo: "ALL",
    anio: "ALL",
    mes: "ALL",
    dateFrom: "",
    dateTo: "",
});
