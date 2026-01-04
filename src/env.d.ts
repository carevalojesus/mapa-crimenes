/// <reference types="astro/client" />

import "leaflet";

declare module "leaflet" {
    interface HeatLayer extends L.Layer {
        setLatLngs(latlngs: Array<[number, number, number?]>): this;
        addLatLng(latlng: [number, number, number?]): this;
        redraw(): this;
    }

    function heatLayer(
        latlngs: Array<[number, number, number?]>,
        options?: {
            minOpacity?: number;
            maxZoom?: number;
            max?: number;
            radius?: number;
            blur?: number;
            gradient?: Record<number, string>;
        }
    ): HeatLayer;
}

