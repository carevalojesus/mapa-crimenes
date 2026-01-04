import { useEffect, useMemo, useRef } from "preact/hooks";
import L from "leaflet";
import "leaflet.heat";
import "leaflet.markercluster";

import type { CrimeRow } from "../lib/crime";
import { parseNum, traducirDia } from "../lib/crime";
import { applyFilters } from "../lib/filters";
import { useStore } from "@nanostores/preact";
import { $filters } from "../stores/filters";
import distritosData from "../data/iquitos-distritos.json";

type Props = { data: CrimeRow[] };

// Centro de Iquitos, Peru
const IQUITOS_CENTER: [number, number] = [-3.7491, -73.2538];
const INITIAL_ZOOM = 13;

// Iconos por categoría de crimen
const CRIME_ICONS: Record<string, { emoji: string; color: string }> = {
    "ROBO/HURTO": { emoji: "💰", color: "#f59e0b" },
    "VIOLENCIA FAMILIAR": { emoji: "👪", color: "#8b5cf6" },
    "ROBO ARMADO": { emoji: "🔫", color: "#ef4444" },
    "ROBO DE CELULAR": { emoji: "📱", color: "#3b82f6" },
    "ROBO DE VEHICULO": { emoji: "🚗", color: "#10b981" },
    OTROS: { emoji: "⚠️", color: "#6b7280" },
};

function createCrimeIcon(categoria: string): L.DivIcon {
    const config = CRIME_ICONS[categoria] || CRIME_ICONS["OTROS"];

    return L.divIcon({
        className: "crime-marker",
        html: `
            <div style="
                background-color: ${config.color};
                width: 32px;
                height: 32px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                border: 2px solid white;
            ">
                <span style="
                    transform: rotate(45deg);
                    font-size: 14px;
                    line-height: 1;
                ">${config.emoji}</span>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
}

export default function MapView({ data }: Props) {
    const filters = useStore($filters);

    const mapRef = useRef<L.Map | null>(null);
    const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
    const heatRef = useRef<L.HeatLayer | null>(null);
    const geojsonRef = useRef<L.GeoJSON | null>(null);

    const filtered = useMemo(
        () => applyFilters(data, filters),
        [data, filters]
    );

    useEffect(() => {
        if (mapRef.current) return;

        const map = L.map("map", {
            zoomControl: true,
            center: IQUITOS_CENTER,
            zoom: INITIAL_ZOOM,
        });

        // Capa base de OpenStreetMap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;

        // Agregar GeoJSON de distritos
        geojsonRef.current = L.geoJSON(
            distritosData as GeoJSON.FeatureCollection,
            {
                style: (feature) => ({
                    color: feature?.properties?.color || "#3b82f6",
                    weight: 2,
                    opacity: 0.8,
                    fillOpacity: 0.15,
                }),
                onEachFeature: (feature, layer) => {
                    if (feature.properties?.nombre) {
                        layer.bindTooltip(feature.properties.nombre, {
                            permanent: false,
                            direction: "center",
                            className: "district-tooltip",
                        });
                    }
                },
            }
        ).addTo(map);

        // Cluster de marcadores con iconos personalizados
        const clusterGroup = (L as any).markerClusterGroup({
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            iconCreateFunction: (cluster: any) => {
                const count = cluster.getChildCount();
                let size = "small";
                let dimensions = 40;

                if (count > 100) {
                    size = "large";
                    dimensions = 56;
                } else if (count > 10) {
                    size = "medium";
                    dimensions = 48;
                }

                return L.divIcon({
                    html: `<div class="cluster-icon cluster-${size}">
                        <span>${count}</span>
                    </div>`,
                    className: "custom-cluster",
                    iconSize: [dimensions, dimensions],
                });
            },
        });
        clusterRef.current = clusterGroup;
        map.addLayer(clusterGroup);

        // Capa de calor
        heatRef.current = (L as any).heatLayer([], {
            radius: 20,
            blur: 15,
            maxZoom: 17,
            gradient: {
                0.2: "#ffffb2",
                0.4: "#fecc5c",
                0.6: "#fd8d3c",
                0.8: "#f03b20",
                1.0: "#bd0026",
            },
        });
        heatRef.current?.addTo(map);
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        clusterRef.current?.clearLayers();
        heatRef.current?.setLatLngs([]);

        const heatPts: [number, number, number][] = [];

        for (const r of filtered) {
            const lat = parseNum(r.Latitud);
            const lng = parseNum(r.Longitud);
            if (lat == null || lng == null) continue;

            const diaES = traducirDia(r.Nombre_Dia);
            const icon = createCrimeIcon(r.Categoria_Crimen);
            const iconConfig = CRIME_ICONS[r.Categoria_Crimen] || CRIME_ICONS["OTROS"];

            const m = L.marker([lat, lng], { icon });
            m.bindPopup(`
                <div class="crime-popup">
                    <div class="popup-header" style="background-color: ${iconConfig.color}">
                        <span class="popup-emoji">${iconConfig.emoji}</span>
                        <span class="popup-category">${r.Categoria_Crimen}</span>
                    </div>
                    <div class="popup-body">
                        <p class="popup-type">${r.Tipo_Crimen}</p>
                        <div class="popup-details">
                            <p><strong>Fecha:</strong> ${r.Fecha}</p>
                            <p><strong>Hora:</strong> ${r.Hora}</p>
                            <p><strong>Dia:</strong> ${diaES}</p>
                            <p><strong>Periodo:</strong> ${r.Periodo_Dia}</p>
                        </div>
                    </div>
                </div>
            `);

            clusterRef.current?.addLayer(m);
            heatPts.push([lat, lng, 0.6]);
        }

        heatRef.current?.setLatLngs(heatPts);
    }, [filtered]);

    return <div id="map" class="h-full w-full" />;
}
