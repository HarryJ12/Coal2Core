'use client';

import { useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { CoalPlant } from '@/lib/types';
import { coalPlants } from '@/lib/coalPlantData';

interface MapComponentProps {
  onSelectPlant: (plant: CoalPlant | null) => void;
  filteredIds: string[];
}

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

export default function MapComponent({ onSelectPlant, filteredIds }: MapComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const onSelectRef = useRef(onSelectPlant);
  onSelectRef.current = onSelectPlant;

  // Apply Mapbox filter whenever filteredIds changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const f: mapboxgl.FilterSpecification = ['in', ['get', 'id'], ['literal', filteredIds]];
    map.setFilter('plants-layer', f);
    map.setFilter('plants-halo', f);
  }, [filteredIds]);

  const filteredIdsRef = useRef(filteredIds);
  filteredIdsRef.current = filteredIds;

  const initMap = useCallback(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-96, 39],
      zoom: 3.8,
      minZoom: 2,
      maxZoom: 14,
      projection: 'mercator',
    });

    mapRef.current = map;

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'bottom-right'
    );

    map.on('load', () => {
      // Build GeoJSON from plant data
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: coalPlants.map((plant) => ({
          type: 'Feature',
          id: plant.id,
          geometry: {
            type: 'Point',
            coordinates: [plant.lon, plant.lat],
          },
          properties: {
            id: plant.id,
            name: plant.name,
            state: plant.state,
            capacity_mw: plant.capacity_mw,
            suitability_score: plant.suitability_score,
            status: plant.status,
            category: plant.category,
            co2_reduction: plant.co2_reduction,
            npv_b: plant.npv_b,
          },
        })),
      };

      map.addSource('plants', {
        type: 'geojson',
        data: geojson,
      });

      // Shadow / halo layer
      map.addLayer({
        id: 'plants-halo',
        type: 'circle',
        source: 'plants',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'capacity_mw'],
            100, 9,
            1000, 14,
            3000, 20,
            5000, 24,
          ],
          'circle-color': [
            'step',
            ['get', 'suitability_score'],
            '#ef4444',
            75, '#eab308',
            85, '#22c55e',
          ],
          'circle-opacity': 0.12,
          'circle-blur': 1,
        },
      });

      // Main marker layer
      map.addLayer({
        id: 'plants-layer',
        type: 'circle',
        source: 'plants',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'capacity_mw'],
            100, 4,
            1000, 7,
            3000, 11,
            5000, 14,
          ],
          'circle-color': [
            'step',
            ['get', 'suitability_score'],
            '#ef4444',
            75, '#eab308',
            85, '#22c55e',
          ],
          'circle-opacity': 0.9,
          'circle-stroke-width': 1,
          'circle-stroke-color': 'rgba(255,255,255,0.15)',
        },
      });

      // Apply current filter to visible layers
      const initialFilter: mapboxgl.FilterSpecification = ['in', ['get', 'id'], ['literal', filteredIdsRef.current]];
      map.setFilter('plants-layer', initialFilter);
      map.setFilter('plants-halo', initialFilter);

      // Selected highlight ring
      map.addLayer({
        id: 'plants-selected',
        type: 'circle',
        source: 'plants',
        filter: ['==', ['get', 'id'], ''],
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'capacity_mw'],
            100, 8,
            1000, 12,
            3000, 16,
            5000, 20,
          ],
          'circle-color': 'transparent',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0,
          'circle-stroke-opacity': 0.8,
        },
      });

      // Hover popup
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 12,
        className: 'plant-popup',
      });
      popupRef.current = popup;

      map.on('mouseenter', 'plants-layer', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const feat = e.features?.[0];
        if (!feat || feat.geometry.type !== 'Point') return;

        const coords = feat.geometry.coordinates as [number, number];
        const props = feat.properties as {
          name: string;
          state: string;
          suitability_score: number;
          capacity_mw: number;
        };

        const color =
          props.suitability_score >= 85
            ? '#22c55e'
            : props.suitability_score >= 75
              ? '#eab308'
              : '#ef4444';

        popup
          .setLngLat(coords)
          .setHTML(
            `<div style="font-family:ui-monospace,monospace;padding:8px 10px;min-width:160px">
              <div style="font-size:11px;color:#a3a3a3;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">${props.state}</div>
              <div style="font-size:12px;color:#fff;font-weight:600;line-height:1.3;margin-bottom:6px">${props.name}</div>
              <div style="display:flex;align-items:center;gap:6px">
                <div style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0"></div>
                <span style="font-size:12px;color:${color};font-weight:700">${props.suitability_score}</span>
                <span style="font-size:11px;color:#737373">/ 100</span>
                <span style="margin-left:auto;font-size:11px;color:#737373">${props.capacity_mw.toLocaleString()} MW</span>
              </div>
            </div>`
          )
          .addTo(map);

        // Scale up on hover
        map.setPaintProperty('plants-layer', 'circle-radius', [
          'case',
          ['==', ['get', 'id'], props.name],
          [
            'interpolate',
            ['linear'],
            ['get', 'capacity_mw'],
            100, 5.5,
            1000, 9,
            3000, 14,
            5000, 17,
          ],
          [
            'interpolate',
            ['linear'],
            ['get', 'capacity_mw'],
            100, 4,
            1000, 7,
            3000, 11,
            5000, 14,
          ],
        ]);
      });

      map.on('mouseleave', 'plants-layer', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
        map.setPaintProperty('plants-layer', 'circle-radius', [
          'interpolate',
          ['linear'],
          ['get', 'capacity_mw'],
          100, 4,
          1000, 7,
          3000, 11,
          5000, 14,
        ]);
      });

      // Click to select
      map.on('click', 'plants-layer', (e) => {
        const feat = e.features?.[0];
        if (!feat) return;

        const id = feat.properties?.id as string;
        const plant = coalPlants.find((p) => p.id === id) ?? null;

        // Update selection ring
        map.setFilter('plants-selected', ['==', ['get', 'id'], id]);

        onSelectRef.current(plant);
      });

      // Click on empty map to deselect
      map.on('click', (e) => {
        const feats = map.queryRenderedFeatures(e.point, {
          layers: ['plants-layer'],
        });
        if (feats.length === 0) {
          map.setFilter('plants-selected', ['==', ['get', 'id'], '']);
          onSelectRef.current(null);
        }
      });
    });

    return map;
  }, []);

  useEffect(() => {
    if (!TOKEN) return;
    initMap();

    return () => {
      popupRef.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [initMap]);

  if (!TOKEN) {
    return (
      <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <p className="text-[13px] text-neutral-400 mb-2">
            Mapbox token not configured.
          </p>
          <p className="text-[11px] text-neutral-600 font-mono">
            Set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      {/* Attribution override for dark theme */}
      <style>{`
        .mapboxgl-ctrl-attrib {
          background: rgba(0,0,0,0.5) !important;
          color: #525252 !important;
        }
        .mapboxgl-ctrl-attrib a { color: #525252 !important; }
        .mapboxgl-ctrl-bottom-right { bottom: 24px; right: 12px; }
        @media (max-width: 1024px) {
          .mapboxgl-ctrl-bottom-right { bottom: 80px; right: 8px; }
        }
        .plant-popup .mapboxgl-popup-content {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 6px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.6);
          padding: 0;
        }
        .plant-popup .mapboxgl-popup-tip { display: none; }
        .mapboxgl-ctrl-group {
          background: #111111 !important;
          border: 1px solid #2a2a2a !important;
          border-radius: 4px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5) !important;
        }
        .mapboxgl-ctrl-group button {
          background: transparent !important;
          border-bottom: 1px solid #2a2a2a !important;
        }
        .mapboxgl-ctrl-group button:last-child { border-bottom: none !important; }
        .mapboxgl-ctrl-icon { filter: invert(0.7); }
      `}</style>
    </div>
  );
}
