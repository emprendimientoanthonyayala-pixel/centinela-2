import React, { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@supabase/supabase-js';
import L from 'leaflet';
import './index.css';

const SUPABASE_URL = 'https://vpbaoampqlzzcrplsfht.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_nNifwa3tsRiY9SHL0F8P-Q_Pg2c7eh5';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Componente de Mapa Interactivo Real estilo Waze / Google Maps para Pana Móvil
function MapaPanaCaracas({ origenCoords, destinoCoords, modoSeleccionMapa, onSeleccionarCoords, conductores, infoVehiculo }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Inicializar mapa centrado en Caracas
      const map = L.map(mapContainerRef.current, {
        center: [origenCoords.lat || 10.4961, origenCoords.lon || -66.8872],
        zoom: 13,
        zoomControl: true,
        attributionControl: false
      });

      // Capa de mosaicos OpenStreetMap estándar (100% libre de API key, muestra todas las calles y avenidas de Caracas con detalle estilo GPS)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      mapInstanceRef.current = map;

      // Evento de clic en mapa para seleccionar Punto A u Origen según el modo
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onSeleccionarCoords({
          lat: Math.round(lat * 10000) / 10000,
          lon: Math.round(lng * 10000) / 10000
        });
      });
    }

    const map = mapInstanceRef.current;

    // Limpiar marcadores y rutas previas
    if (markersRef.current.origen) map.removeLayer(markersRef.current.origen);
    if (markersRef.current.destino) map.removeLayer(markersRef.current.destino);
    if (markersRef.current.ruta) map.removeLayer(markersRef.current.ruta);
    if (markersRef.current.conductores) {
      markersRef.current.conductores.forEach(m => map.removeLayer(m));
    }
    markersRef.current.conductores = [];

    // Ícono personalizado para Punto A (Origen) estilo Waze / Google Maps
    const iconoA = L.divIcon({
      className: 'custom-map-pin pin-a',
      html: `<div style="background:#16a34a;color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;border:3px solid #ffffff;box-shadow:0 3px 10px rgba(0,0,0,0.3);">A</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 34]
    });

    // Ícono personalizado para Punto B (Destino)
    const iconoB = L.divIcon({
      className: 'custom-map-pin pin-b',
      html: `<div style="background:#7c3aed;color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;border:3px solid #ffffff;box-shadow:0 3px 10px rgba(0,0,0,0.3);">B</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 34]
    });

    // Marcador Punto A
    if (origenCoords.lat && origenCoords.lon) {
      markersRef.current.origen = L.marker([origenCoords.lat, origenCoords.lon], { icon: iconoA })
        .addTo(map)
        .bindTooltip('📍 Punto A (Origen)', { permanent: false, direction: 'top' });
    }

    // Marcador Punto B
    if (destinoCoords.lat && destinoCoords.lon) {
      markersRef.current.destino = L.marker([destinoCoords.lat, destinoCoords.lon], { icon: iconoB })
        .addTo(map)
        .bindTooltip('🏁 Punto B (Destino)', { permanent: false, direction: 'top' });
    }

    // Trazar línea de ruta estilo GPS
    if (origenCoords.lat && destinoCoords.lat) {
      const latlngs = [
        [origenCoords.lat, origenCoords.lon],
        [destinoCoords.lat, destinoCoords.lon]
      ];
      markersRef.current.ruta = L.polyline(latlngs, {
        color: '#6366f1',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);

      // Ajustar la vista para mostrar ambos puntos
      map.fitBounds(L.latLngBounds(latlngs), { padding: [45, 45], maxZoom: 15 });
    }

    // Marcadores de transportistas patrullando
    conductores.forEach((c) => {
      if (!c.lat || !c.lon) return;
      const iconoVehiculo = L.divIcon({
        className: 'custom-driver-pin',
        html: `<div style="background:#ffffff;border:2px solid #16a34a;border-radius:20px;padding:2px 6px;box-shadow:0 2px 8px rgba(0,0,0,0.25);font-size:11px;font-weight:bold;white-space:nowrap;display:flex;align-items:center;gap:3px;">
          <span>${infoVehiculo.icono || '🛵'}</span>
          <span style="color:#15803d;font-size:10px;">${c.nombre ? c.nombre.split(' ')[0] : 'Pana'}</span>
        </div>`,
        iconSize: [60, 24],
        iconAnchor: [30, 12]
      });

      const m = L.marker([c.lat, c.lon], { icon: iconoVehiculo })
        .addTo(map)
        .bindPopup(`<b>${c.nombre || 'Conductor'}</b><br/>${c.telefono || ''}<br/>⭐ ${c.calificacion || 5.0}`);
      markersRef.current.conductores.push(m);
    });

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [origenCoords, destinoCoords, conductores, infoVehiculo]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '260px', borderRadius: '16px', overflow: 'hidden', border: '2px solid #e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(4px)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <span>👉 Toca en el mapa para marcar {modoSeleccionMapa === 'A' ? 'Punto A (Origen)' : 'Punto B (Destino)'}</span>
      </div>
      <button
        type="button"
        onClick={() => {
          if (mapInstanceRef.current && origenCoords.lat) {
            mapInstanceRef.current.setView([origenCoords.lat, origenCoords.lon], 14);
          }
        }}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          zIndex: 1000,
          background: 'white',
          border: '1px solid #cbd5e1',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          fontSize: '14px'
        }}
        title="Centrar en mi ubicación"
      >
        🎯
      </button>
    </div>
  );
}

// 5 Vocerías de la Estructura Base (Principal y Suplente)
const voceriasEstructuraDefinicion = [
  { id: 'integracion', nombre: 'Vocería de Integración', icon: '◎', color: 'blue' },
  { id: 'sistematizacion', nombre: 'Vocería de Sistematización', icon: '▤', color: 'purple' },
  { id: 'comunicacion', nombre: 'Vocería de Comunicación Popular', icon: '▣', color: 'green' },
  { id: 'movilizacion', nombre: 'Vocería de Movilización Territorial', icon: '⌖', color: 'orange' },
  { id: 'formacion', nombre: 'Vocería de Formación Integral', icon: '☷', color: 'mint' },
];

// Representaciones / Estructura Política Adicional
const representacionesAdicionalesDefinicion = [
  { id: 'jpsuv', nombre: 'Coordinación de la JPSUV', icon: '✦', color: 'red', descripcion: 'Juventud del Partido Unido de Venezuela' },
  { id: 'estado-mayor', nombre: 'Estado Mayor', icon: '✦', color: 'blue', descripcion: 'Coordinación estratégica y política' },
  { id: 'movimientos', nombre: 'Movimientos Sociales', icon: '✦', color: 'green', descripcion: 'Organizaciones comunitarias y frentes' },
  { id: 'gpp', nombre: 'Gran Polo Patriótico', icon: '✦', color: 'orange', descripcion: 'Alianza política y social' },
];

// 5 Comisiones / Mesas de Trabajo Operativas
const comisionesDefinicion = [
  {
    id: 'produccion-economia',
    nombre: 'Comisión de Producción y Economía',
    icon: '₿',
    color: 'orange',
    descripcion: 'Emprendimientos, comercios, producción local, ferias y catálogo de productos.',
  },
  {
    id: 'trabajo-formacion',
    nombre: 'Comisión de Trabajo y Formación',
    icon: '☷',
    color: 'purple',
    descripcion: 'Cursos, talleres, formación integral, vinculación con universidades y liceos.',
  },
  {
    id: 'accion-socioterritorial',
    nombre: 'Brigada de Acción Socioterritorial',
    icon: '⌖',
    color: 'blue',
    descripcion: 'Caracterización del territorio, visitas comunitarias, registro de necesidades.',
  },
  {
    id: 'cultura-comunicacion',
    nombre: 'Comisión de Cultura, Memoria y Comunicación',
    icon: '▣',
    color: 'green',
    descripcion: 'Comunicación popular, fotos, videos, historia local y difusión de agenda.',
  },
  {
    id: 'solidaridad-proteccion',
    nombre: 'Red de Solidaridad y Protección',
    icon: '◎',
    color: 'mint',
    descripcion: 'Acompañamiento social, atención de vulnerabilidades y canalización de casos.',
  },
];

// Métricas de Cumplimiento por Vocería a nivel Estadal y Parroquial
const parroquiasCaracasInfo = [
  { nombre: '23 de Enero', estadoColor: 'verde', registrados: 312, actividades: 18, emprendimientos: 24, eventos: 5, tareas: 4, cumplimiento: { integracion: 85, sistematizacion: 78, comunicacion: 82, movilizacion: 70, formacion: 80 } },
  { nombre: 'Altagracia', estadoColor: 'azul', registrados: 195, actividades: 12, emprendimientos: 14, eventos: 3, tareas: 6, cumplimiento: { integracion: 75, sistematizacion: 68, comunicacion: 72, movilizacion: 60, formacion: 70 } },
  { nombre: 'Antímano', estadoColor: 'naranja', registrados: 410, actividades: 22, emprendimientos: 38, eventos: 6, tareas: 8, cumplimiento: { integracion: 88, sistematizacion: 75, comunicacion: 80, movilizacion: 72, formacion: 78 } },
  { nombre: 'Candelaria', estadoColor: 'verde', registrados: 180, actividades: 10, emprendimientos: 16, eventos: 2, tareas: 3, cumplimiento: { integracion: 70, sistematizacion: 65, comunicacion: 75, movilizacion: 58, formacion: 68 } },
  { nombre: 'Caricuao', estadoColor: 'verde', registrados: 520, actividades: 31, emprendimientos: 45, eventos: 8, tareas: 5, cumplimiento: { integracion: 92, sistematizacion: 84, comunicacion: 88, movilizacion: 80, formacion: 86 } },
  { nombre: 'Catedral', estadoColor: 'amarillo', registrados: 140, actividades: 8, emprendimientos: 11, eventos: 2, tareas: 9, cumplimiento: { integracion: 68, sistematizacion: 60, comunicacion: 70, movilizacion: 55, formacion: 62 } },
  { nombre: 'Coche', estadoColor: 'naranja', registrados: 280, actividades: 16, emprendimientos: 29, eventos: 4, tareas: 7, cumplimiento: { integracion: 80, sistematizacion: 72, comunicacion: 76, movilizacion: 68, formacion: 74 } },
  { nombre: 'El Junquito', estadoColor: 'azul', registrados: 210, actividades: 14, emprendimientos: 19, eventos: 3, tareas: 4, cumplimiento: { integracion: 74, sistematizacion: 66, comunicacion: 71, movilizacion: 62, formacion: 69 } },
  { nombre: 'El Paraíso', estadoColor: 'verde', registrados: 340, actividades: 19, emprendimientos: 27, eventos: 5, tareas: 2, cumplimiento: { integracion: 83, sistematizacion: 76, comunicacion: 80, movilizacion: 71, formacion: 77 } },
  { nombre: 'El Recreo', estadoColor: 'amarillo', registrados: 220, actividades: 11, emprendimientos: 18, eventos: 3, tareas: 6, cumplimiento: { integracion: 76, sistematizacion: 69, comunicacion: 74, movilizacion: 63, formacion: 71 } },
  { nombre: 'El Valle', estadoColor: 'verde', registrados: 460, actividades: 28, emprendimientos: 42, eventos: 7, tareas: 5, cumplimiento: { integracion: 90, sistematizacion: 82, comunicacion: 85, movilizacion: 78, formacion: 84 } },
  { nombre: 'La Pastora', estadoColor: 'naranja', registrados: 290, actividades: 15, emprendimientos: 22, eventos: 4, tareas: 6, cumplimiento: { integracion: 81, sistematizacion: 73, comunicacion: 77, movilizacion: 67, formacion: 75 } },
  { nombre: 'La Vega', estadoColor: 'rojo', registrados: 380, actividades: 20, emprendimientos: 31, eventos: 5, tareas: 12, cumplimiento: { integracion: 86, sistematizacion: 77, comunicacion: 81, movilizacion: 73, formacion: 79 } },
  { nombre: 'Macarao', estadoColor: 'verde', registrados: 260, actividades: 13, emprendimientos: 20, eventos: 3, tareas: 3, cumplimiento: { integracion: 78, sistematizacion: 70, comunicacion: 74, movilizacion: 65, formacion: 72 } },
  { nombre: 'San Agustín', estadoColor: 'azul', registrados: 310, actividades: 21, emprendimientos: 26, eventos: 6, tareas: 4, cumplimiento: { integracion: 84, sistematizacion: 76, comunicacion: 80, movilizacion: 71, formacion: 78 } },
  { nombre: 'San Bernardino', estadoColor: 'verde', registrados: 165, actividades: 9, emprendimientos: 12, eventos: 2, tareas: 2, cumplimiento: { integracion: 72, sistematizacion: 64, comunicacion: 69, movilizacion: 59, formacion: 66 } },
  { nombre: 'San José', estadoColor: 'amarillo', registrados: 205, actividades: 11, emprendimientos: 15, eventos: 3, tareas: 7, cumplimiento: { integracion: 75, sistematizacion: 67, comunicacion: 72, movilizacion: 61, formacion: 68 } },
  { nombre: 'San Juan', estadoColor: 'naranja', registrados: 330, actividades: 17, emprendimientos: 28, eventos: 4, tareas: 5, cumplimiento: { integracion: 82, sistematizacion: 74, comunicacion: 78, movilizacion: 69, formacion: 76 } },
  { nombre: 'San Pedro', estadoColor: 'verde', registrados: 190, actividades: 12, emprendimientos: 17, eventos: 3, tareas: 3, cumplimiento: { integracion: 74, sistematizacion: 66, comunicacion: 71, movilizacion: 61, formacion: 68 } },
  { nombre: 'Santa Rosalía', estadoColor: 'verde', registrados: 350, actividades: 23, emprendimientos: 33, eventos: 6, tareas: 4, cumplimiento: { integracion: 85, sistematizacion: 77, comunicacion: 81, movilizacion: 72, formacion: 79 } },
  { nombre: 'Santa Teresa', estadoColor: 'amarillo', registrados: 155, actividades: 8, emprendimientos: 13, eventos: 2, tareas: 6, cumplimiento: { integracion: 71, sistematizacion: 63, comunicacion: 68, movilizacion: 57, formacion: 65 } },
  { nombre: 'Sucre', estadoColor: 'naranja', registrados: 680, actividades: 42, emprendimientos: 65, eventos: 12, tareas: 10, cumplimiento: { integracion: 94, sistematizacion: 88, comunicacion: 90, movilizacion: 82, formacion: 89 } },
];

const cumplimientoEstadalGlobal = {
  integracion: 82,
  sistematizacion: 71,
  comunicacion: 78,
  movilizacion: 63,
  formacion: 76,
};

// Configuración de tipos de vehículos y tarifas comunitarias
const TIPOS_VEHICULO_PANA = {
  moto: {
    id: 'moto',
    nombre: 'MotoPana',
    icono: '🛵',
    subtitulo: 'Movilidad rápida en 2 ruedas',
    base: 1.5,
    porKm: 0.5,
    minimo: 2.5,
    velocidadPromedioKmh: 25,
    tiempoBaseMin: 4,
  },
  carro: {
    id: 'carro',
    nombre: 'CarroPana',
    icono: '🚗',
    subtitulo: 'Carro cómodo para personas / familias',
    base: 3.0,
    porKm: 0.85,
    minimo: 4.5,
    velocidadPromedioKmh: 20,
    tiempoBaseMin: 6,
  },
  camion: {
    id: 'camion',
    nombre: 'PanaCarga',
    icono: '🚚',
    subtitulo: 'Camión / Camioneta de flete y carga pesada',
    base: 10.0,
    porKm: 2.0,
    minimo: 15.0,
    velocidadPromedioKmh: 18,
    tiempoBaseMin: 12,
  },
};

// Transportistas registrados de ejemplo inicial con coordenadas GPS válidas en Caracas
const conductoresPanaIniciales = [
  { id: 'c-01', nombre: 'Carlos Mendoza', telefono: '0412-1112233', tipoVehiculo: 'moto', modelo: 'Empire Keeway 150 (Negra)', placa: 'AB1C23D', parroquia: 'El Recreo', estado: 'disponible', calificacion: 4.9, lat: 10.4950, lon: -66.8820 },
  { id: 'c-02', nombre: 'José Gregorio Silva', telefono: '0414-2223344', tipoVehiculo: 'moto', modelo: 'Bera SBR 150 (Azul)', placa: 'AD4E56F', parroquia: 'Sucre (Catia)', estado: 'disponible', calificacion: 4.8, lat: 10.5150, lon: -66.9320 },
  { id: 'c-03', nombre: 'Wilmer Ramírez', telefono: '0424-3334455', tipoVehiculo: 'carro', modelo: 'Chevrolet Aveo (Plata)', placa: 'AC7G89H', parroquia: 'Chacao', estado: 'disponible', calificacion: 5.0, lat: 10.4910, lon: -66.8520 },
  { id: 'c-04', nombre: 'Eudis Paredes', telefono: '0416-4445566', tipoVehiculo: 'camion', modelo: 'Ford 350 Plataforma / Barandas', placa: 'AA9J01K', parroquia: 'Coche', estado: 'disponible', calificacion: 4.9, lat: 10.4520, lon: -66.9150 },
];

// Puntos de referencia de Caracas con coordenadas GPS para MotoPana Express y Pana Móvil
const puntosCaracasGPS = [
  { id: 'plaza-vzla', nombre: 'Plaza Venezuela / La Previsora', lat: 10.4965, lon: -66.8858, parroquia: 'El Recreo' },
  { id: 'chacao', nombre: 'Chacao / Metro Chacao', lat: 10.4925, lon: -66.8533, parroquia: 'Chacao' },
  { id: 'chacaito', nombre: 'Chacaíto / Bulevar', lat: 10.4938, lon: -66.8682, parroquia: 'El Recreo' },
  { id: 'petare', nombre: 'Petare / Redoma de Petare', lat: 10.4795, lon: -66.8062, parroquia: 'Sucre' },
  { id: 'sabana-grande', nombre: 'Sabana Grande / Bulevar', lat: 10.4948, lon: -66.8776, parroquia: 'El Recreo' },
  { id: 'las-mercedes', nombre: 'Las Mercedes / C.C. Tolón', lat: 10.4779, lon: -66.8617, parroquia: 'Baruta' },
  { id: 'catia', nombre: 'Catia / Plaza Sucre', lat: 10.5188, lon: -66.9366, parroquia: 'Sucre' },
  { id: 'el-valle', nombre: 'El Valle / C.C. El Valle', lat: 10.4682, lon: -66.9038, parroquia: 'El Valle' },
  { id: 'coche', nombre: 'Coche / Mercado Mayor de Coche', lat: 10.4503, lon: -66.9189, parroquia: 'Coche' },
  { id: 'caricuao', nombre: 'Caricuao / Ruiz Pineda', lat: 10.4355, lon: -66.9806, parroquia: 'Caricuao' },
  { id: 'antimano', nombre: 'Antímano / Estación Metro', lat: 10.4673, lon: -66.9631, parroquia: 'Antímano' },
  { id: 'el-paraiso', nombre: 'El Paraíso / Plaza Madariaga', lat: 10.4851, lon: -66.9328, parroquia: 'El Paraíso' },
  { id: 'san-martin', nombre: 'San Martín / Maternidad', lat: 10.4968, lon: -66.9312, parroquia: 'San Juan' },
  { id: 'la-candelaria', nombre: 'La Candelaria / Parque Carabobo', lat: 10.5042, lon: -66.9079, parroquia: 'Candelaria' },
  { id: 'capitolio', nombre: 'Capitolio / El Silencio / Centro', lat: 10.5057, lon: -66.9157, parroquia: 'Catedral' },
  { id: '23-enero', nombre: '23 de Enero / Cuartel de la Montaña', lat: 10.5085, lon: -66.9304, parroquia: '23 de Enero' },
  { id: 'la-pastora', nombre: 'La Pastora / Puerta de Caracas', lat: 10.5212, lon: -66.9201, parroquia: 'La Pastora' },
  { id: 'san-agustin', nombre: 'San Agustín / Metrocable', lat: 10.4947, lon: -66.9022, parroquia: 'San Agustín' },
  { id: 'la-california', nombre: 'La California / Unicentro El Marqués', lat: 10.4828, lon: -66.8242, parroquia: 'Petare / Sucre' },
  { id: 'los-dos-caminos', nombre: 'Los Dos Caminos / Parque Cristal', lat: 10.4944, lon: -66.8364, parroquia: 'Sucre' },
  { id: 'altamira', nombre: 'Altamira / Plaza Francia', lat: 10.4981, lon: -66.8488, parroquia: 'Chacao' },
  { id: 'san-bernardino', nombre: 'San Bernardino / Clínicas Caracas', lat: 10.5161, lon: -66.8973, parroquia: 'San Bernardino' },
  { id: 'la-trinidad', nombre: 'La Trinidad / Sorocaima', lat: 10.4428, lon: -66.8576, parroquia: 'Baruta' },
  { id: 'el-hatillo', nombre: 'El Hatillo / Pueblo', lat: 10.4243, lon: -66.8252, parroquia: 'El Hatillo' }
];

// Cálculo de distancia en km con fórmula de Haversine
const calcularDistanciaKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
};

const quickActionsBase = [
  { icon: '▣', label: 'Feed nacional', tab: 'feed' },
  { icon: '⌂', label: 'Mi territorio', tab: 'territorio' },
  { icon: '◎', label: 'Vocerías', tab: 'vocerias' },
  { icon: '☷', label: 'Mesas de trabajo', tab: 'mesas' },
  { icon: '◷', label: 'Eventos', tab: 'eventos' },
  { icon: '✓', label: 'Tareas', tab: 'tareas' },
  { icon: '▤', label: 'Reportes', tab: 'reportes' },
  { icon: '₿', label: 'Emprendimientos', tab: 'emprendimientos' },
  { icon: '💛', label: 'Donaciones', tab: 'donaciones' },
];

const recentActivity = [];

const feedPosts = [];

const parroquiasCaracas = parroquiasCaracasInfo.map((p) => p.nombre);

const municipiosPorEstado = {
  'Distrito Capital': ['Libertador'],
  Miranda: ['Acevedo', 'Baruta', 'Chacao', 'Guaicaipuro', 'Sucre'],
};


const eventosEjemplo = [];

const emprendimientosEjemplo = [];

const tareasEjemplo = [];

const reportesEjemplo = [];

function obtenerFechaActualLocal() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return '';
  const partesFecha = fechaNacimiento.split('-').map(Number);
  if (partesFecha.length !== 3) return '';
  const [añoNacimiento, mesNacimiento, diaNacimiento] = partesFecha;
  if (!añoNacimiento || !mesNacimiento || !diaNacimiento) return '';
  const hoy = new Date();
  let edad = hoy.getFullYear() - añoNacimiento;
  const todavíaNoCumpleAños =
    hoy.getMonth() + 1 < mesNacimiento ||
    (hoy.getMonth() + 1 === mesNacimiento && hoy.getDate() < diaNacimiento);
  if (todavíaNoCumpleAños) edad--;
  return edad < 0 ? '' : edad;
}

function crearIdUnico(prefijo) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefijo}-${crypto.randomUUID()}`;
  }
  return `${prefijo}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function comprimirImagenDataUrl(file, maxWidth = 600, quality = 0.6) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrlCompressed = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrlCompressed);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

function vibrarHaptico() {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
  }
}

function obtenerEtiquetaEstadoEvento(estado) {
  const etiquetas = {
    borrador: 'Borrador',
    convocado: 'Convocado',
    'en-curso': 'En curso',
    culminado: 'Culminado',
    cancelado: 'Cancelado',
  };
  return etiquetas[estado] || estado;
}

function obtenerColorEstadoEvento(estado) {
  const colores = {
    borrador: 'orange',
    convocado: 'blue',
    'en-curso': 'purple',
    culminado: 'green',
    cancelado: 'red',
  };
  return colores[estado] || 'blue';
}

function obtenerValorQR(evento) {
  return `https://t.me/iCentinela_bot?start=asistencia_${evento.id}`;
}

function App() {
  const [esModoOscuro, setEsModoOscuro] = useState(() => {
    return window.Telegram?.WebApp?.colorScheme === 'dark';
  });

  useEffect(() => {
    const tgWebApp = window.Telegram?.WebApp;
    if (tgWebApp) {
      if (tgWebApp.colorScheme === 'dark') {
        document.body.classList.add('dark-mode');
        setEsModoOscuro(true);
      } else {
        document.body.classList.remove('dark-mode');
        setEsModoOscuro(false);
      }

      const handleThemeChange = () => {
        if (tgWebApp.colorScheme === 'dark') {
          document.body.classList.add('dark-mode');
          setEsModoOscuro(true);
        } else {
          document.body.classList.remove('dark-mode');
          setEsModoOscuro(false);
        }
      };

      tgWebApp.onEvent('themeChanged', handleThemeChange);
      return () => {
        tgWebApp.offEvent('themeChanged', handleThemeChange);
      };
    }
  }, []);

  const alternarModoOscuro = () => {
    setEsModoOscuro((prev) => {
      const nuevo = !prev;
      if (nuevo) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      return nuevo;
    });
  };

  const [showAllQuickActions, setShowAllQuickActions] = useState(false);
  const [pinnedQuickActionTabs, setPinnedQuickActionTabs] = useState(() => {
    try {
      const savedPinnedActions = localStorage.getItem('pinnedQuickActionTabs');
      if (savedPinnedActions) {
        const parsedActions = JSON.parse(savedPinnedActions);
        const validActions = parsedActions.filter((tab) =>
          quickActionsBase.some((action) => action.tab === tab)
        );
        if (validActions.length === 3) return validActions;
      }
    } catch {}
    return quickActionsBase.slice(0, 3).map((action) => action.tab);
  });

  const [registroCompletado, setRegistroCompletado] = useState(false);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [telegramUserId, setTelegramUserId] = useState(null);
  const [telegramAutodetectado, setTelegramAutodetectado] = useState(false);
  const [formularioInicial, setFormularioInicial] = useState({
    cedula: '',
    nombresApellidos: '',
    genero: '',
    fechaNacimiento: '',
    estado: '',
    municipio: '',
    parroquia: '',
    comuna: '',
    concejoComunal: '',
    telefono: '',
    correo: '',
    usuarioTelegram: '',
    rol: 'Integrante Comunitario',
  });

  const [activeTab, setActiveTab] = useState('inicio');
  const [territoryType, setTerritoryType] = useState('estadal');
  const [parroquiaSeleccionada, setParroquiaSeleccionada] = useState('Caricuao');
  const [comisionSeleccionada, setComisionSeleccionada] = useState('todas');
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Todo');

  const [fotoLightboxUrl, setFotoLightboxUrl] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [mostrarModalRol, setMostrarModalRol] = useState(false);

  const mostrarToast = (mensaje, tipo = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Indicadores Económicos State
  const [indicadoresEconomicos, setIndicadoresEconomicos] = useState({
    dolarBcv: null,
    euroBcv: null,
    usdt: null,
    cargando: true,
    error: false,
    fecha: null,
  });

  useEffect(() => {
    const obtenerIndicadores = async () => {
      try {
        const [resDolarOficial, resEuroOficial, resDolarParalelo] = await Promise.all([
          fetch('https://ve.dolarapi.com/v1/dolares/oficial').then((r) => (r.ok ? r.json() : null)),
          fetch('https://ve.dolarapi.com/v1/euros/oficial').then((r) => (r.ok ? r.json() : null)),
          fetch('https://ve.dolarapi.com/v1/dolares/paralelo').then((r) => (r.ok ? r.json() : null)),
        ]);

        setIndicadoresEconomicos({
          dolarBcv: resDolarOficial?.promedio ? Number(resDolarOficial.promedio).toFixed(2) : null,
          euroBcv: resEuroOficial?.promedio ? Number(resEuroOficial.promedio).toFixed(2) : null,
          usdt: resDolarParalelo?.promedio ? Number(resDolarParalelo.promedio).toFixed(2) : null,
          cargando: false,
          error: false,
          fecha: resDolarOficial?.fechaActualizacion
            ? new Date(resDolarOficial.fechaActualizacion).toLocaleDateString('es-VE')
            : obtenerFechaActualLocal(),
        });
      } catch (err) {
        console.error('Error al cargar indicadores económicos:', err);
        setIndicadoresEconomicos((prev) => ({ ...prev, cargando: false, error: true }));
      }
    };

    obtenerIndicadores();
  }, []);

  // Comunicados / Mensajes Jerárquicos State
  const [comunicados, setComunicados] = useState(() => {
    try {
      const guardados = localStorage.getItem('comunicadosCentinela');
      if (guardados) {
        const parsed = JSON.parse(guardados);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Eventos state
  const [eventos, setEventos] = useState(() => {
    try {
      const guardados = localStorage.getItem('eventosCentinela');
      if (guardados) {
        const parsed = JSON.parse(guardados);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return eventosEjemplo;
  });

  // Carga y sincronización de datos de Supabase
  const cargarDatosNube = async () => {
    try {
      const { data: dataEvents, error: errEvents } = await supabase
        .from('eventos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!errEvents && dataEvents && dataEvents.length > 0) {
        const eventosRemotos = dataEvents.map((row) => ({
          id: row.id,
          titulo: row.titulo,
          nivel: row.nivel || 'parroquial',
          estado: row.estado || 'convocado',
          parroquia: row.parroquia,
          comision: row.comision || 'accion-socioterritorial',
          estadoTerritorial: row.estado_territorial || 'Distrito Capital',
          municipio: row.municipio || 'Libertador',
          fecha: row.fecha,
          horaInicio: row.hora_inicio || '',
          horaFin: row.hora_fin || '',
          lugar: row.lugar || '',
          descripcion: row.descripcion || '',
          flyerImage: row.flyer_image || null,
          creadoPor: row.creado_por || 'Usuario',
          creadoEn: row.creado_en || row.created_at,
          asistentes: row.asistentes || [],
        }));
        setEventos(eventosRemotos);
      }

      const { data: dataCom, error: errCom } = await supabase
        .from('comunicados')
        .select('*')
        .order('created_at', { ascending: false });

      if (!errCom && dataCom && dataCom.length > 0) {
        setComunicados(dataCom);
      }

      const { data: dataUsers, error: errUsers } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (!errUsers && dataUsers && dataUsers.length > 0) {
        const usuariosRemotos = dataUsers.map((u) => ({
          id: u.id,
          nombresApellidos: u.nombres_apellidos,
          cedula: u.cedula,
          usuarioTelegram: u.usuario_telegram,
          parroquia: u.parroquia,
          rol: u.rol,
          fechaRegistro: u.fecha_registro || (u.created_at ? new Date(u.created_at).toLocaleDateString('es-VE') : 'Hoy'),
        }));
        setUsuariosRegistrados(usuariosRemotos);
      }

      const { data: dataEmp, error: errEmp } = await supabase
        .from('emprendimientos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!errEmp && dataEmp && dataEmp.length > 0) {
        const empRemotos = dataEmp.map((e) => ({
          id: e.id,
          nombre: e.nombre,
          categoria: e.categoria,
          parroquia: e.parroquia,
          comision: e.comision,
          responsable: e.responsable,
          contacto: e.contacto,
          descripcion: e.descripcion,
          imagenes: e.imagenes || [],
        }));
        setEmprendimientos(empRemotos);
      }

      const { data: dataTar, error: errTar } = await supabase
        .from('tareas')
        .select('*')
        .order('created_at', { ascending: false });

      if (!errTar && dataTar && dataTar.length > 0) {
        const tareasRemotas = dataTar.map((t) => ({
          id: t.id,
          titulo: t.titulo,
          parroquia: t.parroquia,
          comision: t.comision,
          estado: t.estado,
          prioridad: t.prioridad,
          responsable: t.responsable,
          fechaLimite: t.fecha_limite || t.fechaLimite,
        }));
        setTareas(tareasRemotas);
      }
    } catch (err) {
      console.warn('Supabase offline o tablas no inicializadas:', err);
    }
  };

  // Supabase Realtime Subscriptions
  useEffect(() => {
    cargarDatosNube();

    const canalRealtime = supabase
      .channel('public:realtime')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        cargarDatosNube();
        if (payload.eventType === 'INSERT') {
          mostrarToast(`✨ Nuevo registro en tiempo real (${payload.table})`, 'éxito');
        } else if (payload.eventType === 'UPDATE') {
          mostrarToast(`🔄 Actualización recibida (${payload.table})`, 'info');
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(canalRealtime);
    };
  }, []);

  const [mostrarFormularioEvento, setMostrarFormularioEvento] = useState(false);
  const [eventoEnEdicion, setEventoEnEdicion] = useState(null);
  const [eventoSeleccionadoId, setEventoSeleccionadoId] = useState(null);
  const [fotosEvidencia, setFotosEvidencia] = useState([]);
  const [eventosFiltroEstado, setEventosFiltroEstado] = useState('activos');

  const [formularioEvento, setFormularioEvento] = useState({
    titulo: '',
    nivel: 'parroquial',
    parroquia: '',
    comision: 'accion-socioterritorial',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    lugar: '',
    descripcion: '',
    flyerImage: null,
  });

  // Emprendimientos State
  const [emprendimientos, setEmprendimientos] = useState(() => {
    try {
      const guardados = localStorage.getItem('emprendimientosCentinela');
      if (guardados) {
        const parsed = JSON.parse(guardados);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return emprendimientosEjemplo;
  });
  const [mostrarFormEmprendimiento, setMostrarFormEmprendimiento] = useState(false);
  const [empEnEdicion, setEmpEnEdicion] = useState(null);
  const [filtroParroquiaEmp, setFiltroParroquiaEmp] = useState('todas');
  const [filtroCategoriaEmp, setFiltroCategoriaEmp] = useState('todas');
  const [fotosEmprendimiento, setFotosEmprendimiento] = useState([]);
  const [formEmprendimiento, setFormEmprendimiento] = useState({
    nombre: '',
    categoria: 'Textil y Calzado',
    parroquia: '',
    comision: 'produccion-economia',
    responsable: '',
    contacto: '',
    descripcion: '',
  });

  const seleccionarFotosEmprendimiento = (event) => {
    const archivos = Array.from(event.target.files || []);
    if (archivos.length === 0) {
      setFotosEmprendimiento([]);
      return;
    }
    const promesas = archivos.map((archivo) =>
      comprimirImagenDataUrl(archivo, 500, 0.5).then((dataUrl) => ({ dataUrl }))
    );

    Promise.all(promesas).then((data) => setFotosEmprendimiento(data));
  };

  // Tareas State
  const [tareas, setTareas] = useState(() => {
    try {
      const guardados = localStorage.getItem('tareasCentinela');
      if (guardados) {
        const parsed = JSON.parse(guardados);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return tareasEjemplo;
  });
  const [mostrarFormTarea, setMostrarFormTarea] = useState(false);
  const [filtroEstadoTarea, setFiltroEstadoTarea] = useState('Todas');
  const [filtroParroquiaTarea, setFiltroParroquiaTarea] = useState('todas');
  const [formTarea, setFormTarea] = useState({
    titulo: '',
    parroquia: 'Caricuao',
    comision: 'accion-socioterritorial',
    prioridad: 'Media',
    responsable: '',
    fechaLimite: obtenerFechaActualLocal(),
  });

  // Pana Móvil (MotoPana, CarroPana, PanaCarga) State
  const [mostrarModalMotoPana, setMostrarModalMotoPana] = useState(false);
  const [panaSubTab, setPanaSubTab] = useState('solicitar'); // 'solicitar', 'muro', 'registro'
  const [panaCategoriaServicio, setPanaCategoriaServicio] = useState('viaje'); // 'viaje', 'mandadito'
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState('moto'); // 'moto', 'carro', 'camion'
  const [motoPanaOrigenId, setMotoPanaOrigenId] = useState('plaza-vzla');
  const [motoPanaOrigenCustom, setMotoPanaOrigenCustom] = useState('');
  const [motoPanaDestinoId, setMotoPanaDestinoId] = useState('petare');
  const [motoPanaDestinoCustom, setMotoPanaDestinoCustom] = useState('');
  const [motoPanaDestinoCoords, setMotoPanaDestinoCoords] = useState(null);
  const [motoPanaNotas, setMotoPanaNotas] = useState('');
  const [motoPanaGpsActivo, setMotoPanaGpsActivo] = useState(false);
  const [motoPanaGpsCoords, setMotoPanaGpsCoords] = useState(null);
  const [motoPanaGpsCargando, setMotoPanaGpsCargando] = useState(false);
  const [modoSeleccionMapa, setModoSeleccionMapa] = useState('A'); // 'A' o 'B' para tocar en el mapa
  const [motoPanaWhatsappDestino, setMotoPanaWhatsappDestino] = useState(
    () => localStorage.getItem('motopana_whatsapp_url') || 'https://chat.whatsapp.com/DR2MAxM98s7JhC76o4Bcja?s=cl&p=i&mlu=4&ilr=4&iam=2'
  );
  const [motoPanaCopiado, setMotoPanaCopiado] = useState(false);

  // Conductores Comunitarios Registrados (Moto, Carro, Camión)
  const [conductoresPana, setConductoresPana] = useState(() => {
    try {
      const guardados = localStorage.getItem('conductoresPanaCentinela');
      if (guardados) {
        const parsed = JSON.parse(guardados);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return conductoresPanaIniciales;
  });

  // Solicitudes Comunitarias de Viajes y Mandaditos
  const [solicitudesPana, setSolicitudesPana] = useState(() => {
    try {
      const guardadas = localStorage.getItem('solicitudesPanaCentinela');
      if (guardadas) {
        const parsed = JSON.parse(guardadas);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'sol-01',
        categoria: 'viaje',
        tipoVehiculo: 'moto',
        pasajero: 'Yelitza Morales',
        contacto: '@yelitzaccs',
        origen: 'Sabana Grande / Bulevar',
        destino: 'La Candelaria / Parque Carabobo',
        distanciaKm: 3.4,
        tiempoMin: 12,
        precioUsd: 3.2,
        precioBs: 1424,
        notas: 'Llevar 1 casco para dama',
        estado: 'en-espera', // 'en-espera', 'aceptado', 'completado'
        conductorAsignado: null,
        fechaHora: 'Hoy 10:15 AM'
      },
      {
        id: 'sol-02',
        categoria: 'mandadito',
        tipoVehiculo: 'moto',
        pasajero: 'Pastelería La Esperanza (Antojos)',
        contacto: '0412-9988776',
        origen: 'Chacao / Metro Chacao',
        destino: 'Altamira / Plaza Francia',
        distanciaKm: 1.8,
        tiempoMin: 8,
        precioUsd: 2.5,
        precioBs: 1112,
        notas: 'Entrega de torta refrigerada en caja frágil',
        estado: 'en-espera',
        conductorAsignado: null,
        fechaHora: 'Hoy 10:30 AM'
      }
    ];
  });

  // Formulario para registro de nuevo conductor
  const [formNuevoConductor, setFormNuevoConductor] = useState({
    nombre: '',
    telefono: '',
    tipoVehiculo: 'moto',
    modelo: '',
    placa: '',
    parroquia: 'El Recreo'
  });

  // Reportes State
  const [reportes, setReportes] = useState(() => {
    try {
      const guardados = localStorage.getItem('reportesCentinela');
      if (guardados) {
        const parsed = JSON.parse(guardados);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return reportesEjemplo;
  });

  // Usuarios para Panel Admin
  const [usuariosRegistrados, setUsuariosRegistrados] = useState(() => {
    try {
      const guardados = localStorage.getItem('usuariosCentinelaSystem');
      if (guardados) {
        const parsed = JSON.parse(guardados);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });
  const [adminFiltroParroquia, setAdminFiltroParroquia] = useState('todas');
  const [adminBusquedaTexto, setAdminBusquedaTexto] = useState('');
  const [mostrarFormReporte, setMostrarFormReporte] = useState(false);
  const [formReporte, setFormReporte] = useState({
    servicio: 'Agua',
    parroquia: 'Caricuao',
    comision: 'accion-socioterritorial',
    estadoServicio: 'Regular',
    observacion: '',
    reportadoPor: '',
  });

  useEffect(() => {
    const detectarUsuarioTelegram = () => {
      const telegramWebApp = window.Telegram?.WebApp;
      if (telegramWebApp) {
        try {
          telegramWebApp.ready();
          telegramWebApp.expand();
        } catch {}
      }

      const usuarioTelegram = telegramWebApp?.initDataUnsafe?.user;
      if (usuarioTelegram) {
        const tgId = usuarioTelegram.id ? String(usuarioTelegram.id) : null;
        if (tgId) setTelegramUserId(tgId);

        const storageKey = tgId ? `perfilUsuario_${tgId}` : 'perfilUsuario';
        const datosGuardados = localStorage.getItem(storageKey);

        const nombresTelegram = [usuarioTelegram.first_name, usuarioTelegram.last_name].filter(Boolean).join(' ');
        let handleDetectado = '';
        if (usuarioTelegram.username) {
          handleDetectado = `@${usuarioTelegram.username}`;
        } else if (usuarioTelegram.first_name) {
          handleDetectado = `@${usuarioTelegram.first_name.toLowerCase().replace(/\s+/g, '_')}`;
        } else {
          handleDetectado = `@user_${tgId || 'telegram'}`;
        }

        setTelegramAutodetectado(true);

        if (datosGuardados) {
          try {
            const datos = JSON.parse(datosGuardados);
            setFormularioInicial((prev) => ({
              ...prev,
              ...datos,
              usuarioTelegram: datos.usuarioTelegram || handleDetectado,
            }));
            if (datos.parroquia) setParroquiaSeleccionada(datos.parroquia);
            setRegistroCompletado(true);
          } catch {
            localStorage.removeItem(storageKey);
          }
        } else {
          setFormularioInicial((prev) => ({
            ...prev,
            nombresApellidos: prev.nombresApellidos || nombresTelegram,
            usuarioTelegram: prev.usuarioTelegram || handleDetectado,
          }));
        }

        // Sincronizar con el registro remoto en Supabase
        supabase
          .from('usuarios')
          .select('*')
          .or(`id.eq.usr-tg-${tgId},usuario_telegram.eq.${handleDetectado}`)
          .then(({ data, error }) => {
            if (!error && data && data.length > 0) {
              const perfilRemoto = data[0];
              setFormularioInicial((prev) => {
                const actualizado = {
                  ...prev,
                  cedula: perfilRemoto.cedula || prev.cedula,
                  nombresApellidos: perfilRemoto.nombres_apellidos || prev.nombresApellidos,
                  usuarioTelegram: perfilRemoto.usuario_telegram || handleDetectado,
                  parroquia: perfilRemoto.parroquia || prev.parroquia,
                  rol: perfilRemoto.rol || prev.rol,
                };
                localStorage.setItem(storageKey, JSON.stringify(actualizado));
                return actualizado;
              });
              if (perfilRemoto.parroquia) setParroquiaSeleccionada(perfilRemoto.parroquia);
              setRegistroCompletado(true);
            }
          });

        return true;
      }
      return false;
    };

    const detectado = detectarUsuarioTelegram();

    if (!detectado) {
      let intentos = 0;
      const intervalo = setInterval(() => {
        intentos++;
        const exito = detectarUsuarioTelegram();
        if (exito || intentos >= 10) {
          clearInterval(intervalo);
        }
      }, 300);
      return () => clearInterval(intervalo);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('pinnedQuickActionTabs', JSON.stringify(pinnedQuickActionTabs));
    } catch {}
  }, [pinnedQuickActionTabs]);

  useEffect(() => {
    try {
      localStorage.setItem('comunicadosCentinela', JSON.stringify(comunicados));
    } catch {}
  }, [comunicados]);

  useEffect(() => {
    try {
      localStorage.setItem('eventosCentinela', JSON.stringify(eventos));
    } catch {}
  }, [eventos]);

  useEffect(() => {
    try {
      localStorage.setItem('emprendimientosCentinela', JSON.stringify(emprendimientos));
    } catch {}
  }, [emprendimientos]);

  useEffect(() => {
    try {
      localStorage.setItem('tareasCentinela', JSON.stringify(tareas));
    } catch {}
  }, [tareas]);

  useEffect(() => {
    try {
      localStorage.setItem('reportesCentinela', JSON.stringify(reportes));
    } catch {}
  }, [reportes]);

  useEffect(() => {
    try {
      localStorage.setItem('usuariosCentinelaSystem', JSON.stringify(usuariosRegistrados));
    } catch {}
  }, [usuariosRegistrados]);

  useEffect(() => {
    const revisarHashYAsistencia = () => {
      const hash = window.location.hash;
      if (hash.includes('asistencia=')) {
        const eventoId = hash.split('asistencia=')[1];
        if (eventoId) {
          const eventoExiste = eventos.some((e) => e.id === eventoId);
          if (eventoExiste) {
            setActiveTab('eventos');
            setEventoSeleccionadoId(eventoId);
          }
        }
      }
    };
    revisarHashYAsistencia();
    window.addEventListener('hashchange', revisarHashYAsistencia);
    return () => window.removeEventListener('hashchange', revisarHashYAsistencia);
  }, [eventos]);

  // Security Helper
  const esSuperUsuario = formularioInicial.rol === 'Super Usuario';
  const esNivelEstadal = ['Super Usuario', 'Administrador Estadal'].includes(formularioInicial.rol);
  const puedeEnviarComunicado = ['Super Usuario', 'Administrador Estadal', 'Coordinador Parroquial'].includes(formularioInicial.rol);
  const puedeCrearEvento = ['Super Usuario', 'Administrador Estadal', 'Coordinador Parroquial', 'Vocero Comunitario'].includes(formularioInicial.rol);
  const puedeAdministrarEvento = ['Super Usuario', 'Administrador Estadal', 'Coordinador Parroquial'].includes(formularioInicial.rol);
  const puedeAsignarTarea = ['Super Usuario', 'Administrador Estadal', 'Coordinador Parroquial', 'Vocero Comunitario'].includes(formularioInicial.rol);
  const puedeCambiarEstadoTarea = ['Super Usuario', 'Administrador Estadal', 'Coordinador Parroquial', 'Vocero Comunitario'].includes(formularioInicial.rol);

  // Restricción de territorio por rol
  useEffect(() => {
    if (!esNivelEstadal && formularioInicial.parroquia) {
      setParroquiaSeleccionada(formularioInicial.parroquia);
      setTerritoryType('parroquial');
    } else if (esNivelEstadal) {
      setTerritoryType('estadal');
    }
  }, [esNivelEstadal, formularioInicial.parroquia]);

  const [mostrarModalComunicado, setMostrarModalComunicado] = useState(false);
  const [formComunicado, setFormComunicado] = useState({
    mensaje: '',
    alcance: formularioInicial.rol === 'Super Usuario' ? 'todos' : formularioInicial.rol === 'Administrador Estadal' ? 'estado' : 'parroquia',
    parroquiaEspecifica: formularioInicial.parroquia || parroquiaSeleccionada || 'Caricuao',
  });

  useEffect(() => {
    if (formularioInicial.parroquia || parroquiaSeleccionada) {
      setFormComunicado((prev) => ({
        ...prev,
        parroquiaEspecifica: formularioInicial.parroquia || parroquiaSeleccionada || 'Caricuao',
      }));
    }
  }, [formularioInicial.parroquia, parroquiaSeleccionada]);

  const enviarComunicadoMensaje = (e) => {
    e.preventDefault();
    vibrarHaptico();

    if (!formComunicado.mensaje.trim()) return;

    const parroquiaDestino = formComunicado.alcance === 'parroquia' ? formComunicado.parroquiaEspecifica : 'Todas';

    const nuevoCom = {
      id: crearIdUnico('com'),
      emisorRol: formularioInicial.rol,
      emisorNombre: formularioInicial.nombresApellidos || 'Autoridad Centinela',
      mensaje: formComunicado.mensaje.trim(),
      alcance: formComunicado.alcance,
      parroquiaTarget: parroquiaDestino,
      fecha: new Date().toISOString(),
    };

    setComunicados((prev) => [nuevoCom, ...prev]);

    supabase
      .from('comunicados')
      .insert({
        id: nuevoCom.id,
        emisor_rol: nuevoCom.emisorRol,
        emisor_nombre: nuevoCom.emisorNombre,
        mensaje: nuevoCom.mensaje,
        alcance: nuevoCom.alcance,
        parroquia_target: nuevoCom.parroquiaTarget,
        fecha: nuevoCom.fecha,
      })
      .then(({ error }) => {
        if (error) console.warn('Supabase comunicado sync warning:', error);
      });

    // Telegram Bot Chat / Share Intent & WebApp sendData
    const textoDifusion = `📢 *COMUNICADO OFICIAL CENTINELA 2.0*\n\n${nuevoCom.mensaje}\n\n📍 *Alcance:* ${
      nuevoCom.alcance === 'todos' ? 'Toda Caracas' : nuevoCom.alcance === 'estado' ? 'Todo el Estado' : `Parroquia ${nuevoCom.parroquiaTarget}`
    }\n👤 *Emitido por:* ${nuevoCom.emisorNombre} (${nuevoCom.emisorRol})`;

    const tgWebApp = window.Telegram?.WebApp;
    if (tgWebApp) {
      try {
        tgWebApp.sendData(
          JSON.stringify({
            tipo: 'comunicado',
            mensaje: nuevoCom.mensaje,
            alcance: nuevoCom.alcance,
            parroquia: nuevoCom.parroquiaTarget,
            emisor: nuevoCom.emisorNombre,
          })
        );
      } catch (err) {
        console.warn('sendData no disponible en este tipo de botón:', err);
      }

      if (typeof tgWebApp.switchInlineQuery === 'function') {
        try {
          tgWebApp.switchInlineQuery(textoDifusion, ['users', 'groups', 'channels']);
        } catch {}
      }
    }

    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/iCentinela_bot')}&text=${encodeURIComponent(textoDifusion)}`;

    if (tgWebApp?.openTelegramLink) {
      tgWebApp.openTelegramLink(shareUrl);
    } else {
      window.open(shareUrl, '_blank');
    }

    setFormComunicado({
      mensaje: '',
      alcance: formularioInicial.rol === 'Super Usuario' ? 'todos' : formularioInicial.rol === 'Administrador Estadal' ? 'estado' : 'parroquia',
      parroquiaEspecifica: formularioInicial.parroquia || parroquiaSeleccionada || 'Caricuao',
    });
    setMostrarModalComunicado(false);
  };

  const quickActions = esSuperUsuario
    ? [...quickActionsBase, { icon: '⚙', label: 'Panel Admin', tab: 'admin' }]
    : quickActionsBase;

  const cambiarRolUsuario = (nuevoRol) => {
    vibrarHaptico();
    setFormularioInicial((prev) => {
      const updated = { ...prev, rol: nuevoRol };
      const storageKey = telegramUserId ? `perfilUsuario_${telegramUserId}` : 'perfilUsuario';
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
    setMostrarModalRol(false);
  };

  const cambiarRolDeUsuarioEnSistema = (usuarioId, nuevoRol) => {
    vibrarHaptico();
    setUsuariosRegistrados((prev) =>
      prev.map((u) => (u.id === usuarioId ? { ...u, rol: nuevoRol } : u))
    );

    supabase
      .from('usuarios')
      .update({ rol: nuevoRol })
      .eq('id', usuarioId)
      .then(({ error }) => {
        if (error) console.warn('Supabase user role update warning:', error);
      });
  };

  const eliminarUsuarioEnSistema = (usuarioId) => {
    vibrarHaptico();
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario del sistema?')) {
      setUsuariosRegistrados((prev) => prev.filter((u) => u.id !== usuarioId));
      supabase
        .from('usuarios')
        .delete()
        .eq('id', usuarioId)
        .then(({ error }) => {
          if (error) console.warn('Supabase user delete warning:', error);
        });
    }
  };

  const cerrarSesionOReiniciarRegistro = () => {
    if (window.confirm('¿Deseas salir del perfil actual y realizar un nuevo registro de prueba?')) {
      vibrarHaptico();
      const storageKey = telegramUserId ? `perfilUsuario_${telegramUserId}` : 'perfilUsuario';
      localStorage.removeItem(storageKey);
      setFormularioInicial({
        cedula: '',
        nombresApellidos: '',
        genero: '',
        fechaNacimiento: '',
        estado: '',
        municipio: '',
        parroquia: '',
        comuna: '',
        concejoComunal: '',
        telefono: '',
        correo: '',
        usuarioTelegram: '',
        rol: 'Integrante Comunitario',
      });
      setRegistroCompletado(false);
      setMostrarModalRol(false);
    }
  };

  const pinnedQuickActions = pinnedQuickActionTabs
    .map((tab) => quickActions.find((action) => action.tab === tab))
    .filter(Boolean);

  const pinQuickAction = (tab) => {
    vibrarHaptico();
    setPinnedQuickActionTabs((currentTabs) => {
      if (currentTabs.includes(tab)) return currentTabs;
      return [tab, ...currentTabs].slice(0, 3);
    });
  };

  const infoParroquiaActual = parroquiasCaracasInfo.find(
    (p) => p.nombre === parroquiaSeleccionada
  ) || parroquiasCaracasInfo[0];

  const eventoSeleccionado = eventos.find((e) => e.id === eventoSeleccionadoId);

  const abrirEvento = (eventoId) => {
    vibrarHaptico();
    const eventoExiste = eventos.some((e) => e.id === eventoId);
    if (!eventoExiste) {
      alert('No se encontró la información de este evento.');
      return;
    }
    setEventoSeleccionadoId(eventoId);
  };

  const eventosCulminados = eventos.filter((e) => e.estado === 'culminado');

  const publicacionesDeEventos = eventosCulminados.map((evento) => {
    const fotosGaleria = [];
    if (evento.flyerImage) fotosGaleria.push(evento.flyerImage);
    evento.asistentes.forEach((asistente) => {
      if (Array.isArray(asistente.evidencias)) {
        asistente.evidencias.forEach((ev) => {
          if (ev.dataUrl) fotosGaleria.push(ev.dataUrl);
        });
      }
    });

    return {
      id: `evento-${evento.id}`,
      eventId: evento.id,
      type: 'Evento culminado',
      title: evento.titulo,
      description: evento.descripcion,
      territory: `Caracas · ${evento.parroquia}`,
      author: evento.creadoPor,
      time: 'Evento culminado',
      color: 'green',
      asistentes: evento.asistentes.length,
      evidencias: fotosGaleria,
      flyerImage: evento.flyerImage,
    };
  });

  const publicacionesFeed = [...publicacionesDeEventos, ...feedPosts];

  const visiblePosts =
    activeFilter === 'Todo'
      ? publicacionesFeed
      : publicacionesFeed.filter((post) => post.type === activeFilter);

  const territoryNames = {
    estadal: 'Consejo Popular Estadal',
    municipal: 'Consejo Popular Municipal',
    parroquial: 'Consejo Popular Parroquial',
  };

  // Configuración del vehículo activo y cálculo de tarifa comunitaria
  const infoVehiculoActivo = TIPOS_VEHICULO_PANA[vehiculoSeleccionado] || TIPOS_VEHICULO_PANA.moto;

  // Cálculo de ruta y tarifa Pana Móvil (Moto, Carro, Carga)
  const origenPunto = puntosCaracasGPS.find((p) => p.id === motoPanaOrigenId) || puntosCaracasGPS[0];
  const destinoPunto = puntosCaracasGPS.find((p) => p.id === motoPanaDestinoId) || puntosCaracasGPS[3];

  const origenCoords = motoPanaGpsActivo && motoPanaGpsCoords
    ? motoPanaGpsCoords
    : { lat: origenPunto.lat, lon: origenPunto.lon };

  const destinoCoords = motoPanaDestinoCoords
    ? motoPanaDestinoCoords
    : { lat: destinoPunto.lat, lon: destinoPunto.lon };

  const origenNombreFinal = motoPanaGpsActivo
    ? (motoPanaOrigenCustom || '📍 Mi Ubicación GPS / Mapa')
    : (motoPanaOrigenCustom ? `${origenPunto.nombre} (${motoPanaOrigenCustom})` : origenPunto.nombre);

  const destinoNombreFinal = motoPanaDestinoCoords
    ? (motoPanaDestinoCustom || '🏁 Punto Marcado en Mapa')
    : (motoPanaDestinoCustom ? `${destinoPunto.nombre} (${motoPanaDestinoCustom})` : destinoPunto.nombre);

  const distanciaCalculadaKm = Math.max(
    1.0,
    calcularDistanciaKm(origenCoords.lat, origenCoords.lon, destinoCoords.lat, destinoCoords.lon)
  );

  // Estimación de tiempo según el vehículo
  const tiempoEstimadoMinutos =
    Math.round((distanciaCalculadaKm / infoVehiculoActivo.velocidadPromedioKmh) * 60) +
    infoVehiculoActivo.tiempoBaseMin;

  // Descuento del 40% por primer uso en Pana Móvil
  const [primerUsoPana, setPrimerUsoPana] = useState(() => {
    return localStorage.getItem('pana_primer_uso_completado') !== 'true';
  });

  // Tarifa Comunitaria según el tipo de vehículo
  const tarifaCalculadaBruta = infoVehiculoActivo.base + distanciaCalculadaKm * infoVehiculoActivo.porKm;
  const tarifaBaseUsd = Math.max(
    infoVehiculoActivo.minimo,
    Math.round(tarifaCalculadaBruta * 10) / 10
  );
  const tarifaUsd = primerUsoPana
    ? Math.max(1.5, Math.round(tarifaBaseUsd * 0.6 * 10) / 10) // 40% de descuento
    : tarifaBaseUsd;

  const tasaReferencialBs = 445.0; // Tasa referencial oficial comunitaria
  const tarifaBs = Math.round(tarifaUsd * tasaReferencialBs);
  const tarifaBaseBs = Math.round(tarifaBaseUsd * tasaReferencialBs);

  // Registro de nuevo conductor
  const registrarConductorPana = (e) => {
    e.preventDefault();
    if (!formNuevoConductor.nombre.trim() || !formNuevoConductor.telefono.trim()) {
      alert('Por favor indica tu nombre completo y número de WhatsApp.');
      return;
    }
    const nuevo = {
      id: `c-${Date.now()}`,
      nombre: formNuevoConductor.nombre.trim(),
      telefono: formNuevoConductor.telefono.trim(),
      tipoVehiculo: formNuevoConductor.tipoVehiculo,
      modelo: formNuevoConductor.modelo.trim() || 'Vehículo particular',
      placa: (formNuevoConductor.placa.trim() || 'En trámite').toUpperCase(),
      parroquia: formNuevoConductor.parroquia,
      estado: 'disponible',
      calificacion: 5.0
    };
    const listaActualizada = [nuevo, ...conductoresPana];
    setConductoresPana(listaActualizada);
    try {
      localStorage.setItem('conductoresPanaCentinela', JSON.stringify(listaActualizada));
    } catch {}
    setFormNuevoConductor({
      nombre: '',
      telefono: '',
      tipoVehiculo: 'moto',
      modelo: '',
      placa: '',
      parroquia: 'El Recreo'
    });
    mostrarToast(`¡Bienvenido ${nuevo.nombre}! Quedaste registrado en la red Pana Móvil.`);
    setPanaSubTab('muro');
  };

  // Validar si el usuario actual es transportista afiliado o administrador
  const esConductorOAdmin = () => {
    const rol = (formularioInicial.rol || '').toLowerCase();
    const esAdmin = rol.includes('administrador') || rol.includes('super usuario') || rol.includes('coordinador');
    const estaAfiliadoTransporte = conductoresPana.some(
      (c) => (c.telefono && formularioInicial.telefono && c.telefono.replace(/\D/g, '') === formularioInicial.telefono.replace(/\D/g, '')) ||
             (c.nombre && formularioInicial.nombresApellidos && c.nombre.toLowerCase().trim() === formularioInicial.nombresApellidos.toLowerCase().trim())
    );
    return esAdmin || estaAfiliadoTransporte;
  };

  // Crear y publicar solicitud en la Bolsa de Solicitudes
  const crearSolicitudTransporte = () => {
    vibrarHaptico();
    if (!registroCompletado) {
      mostrarToast('⚠️ Debes registrarte en Centinela antes de solicitar un viaje o encomienda');
      setMostrarModalRegistro(true);
      return;
    }

    const pasajero = formularioInicial.nombresApellidos || 'Vecino Comunitario';
    const contacto = formularioInicial.telefono || (formularioInicial.usuarioTelegram ? `@${formularioInicial.usuarioTelegram.replace('@', '')}` : 'En la comunidad');

    const nuevaSolicitud = {
      id: `sol-${Date.now()}`,
      categoria: panaCategoriaServicio, // 'viaje' o 'mandadito'
      tipoVehiculo: vehiculoSeleccionado,
      pasajero,
      contacto,
      origen: origenNombreFinal,
      destino: destinoNombreFinal,
      distanciaKm: distanciaCalculadaKm,
      tiempoMin: tiempoEstimadoMinutos,
      precioUsd: tarifaUsd,
      precioBs: tarifaBs,
      notas: motoPanaNotas.trim(),
      estado: 'en-espera',
      conductorAsignado: null,
      fechaHora: 'Hace un momento'
    };

    const lista = [nuevaSolicitud, ...solicitudesPana];
    setSolicitudesPana(lista);
    try {
      localStorage.setItem('solicitudesPanaCentinela', JSON.stringify(lista));
    } catch {}

    mostrarToast('✓ Solicitud creada con éxito para conductores afiliados');
    setPanaSubTab('muro');
  };

  // Aceptar solicitud por un conductor
  const aceptarSolicitudTransporte = (solicitudId) => {
    vibrarHaptico();
    const nombreConductor = formularioInicial.nombresApellidos || 'Conductor Pana';
    const lista = solicitudesPana.map((s) => {
      if (s.id === solicitudId) {
        return {
          ...s,
          estado: 'aceptado',
          conductorAsignado: nombreConductor,
          horaAceptado: 'Ahora mismo'
        };
      }
      return s;
    });
    setSolicitudesPana(lista);
    try {
      localStorage.setItem('solicitudesPanaCentinela', JSON.stringify(lista));
    } catch {}
    mostrarToast(`✓ ¡Aceptaste el servicio! Coordina de inmediato con el solicitante.`);
  };

  const activarGpsMotoPana = () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no está disponible en este navegador o dispositivo.');
      return;
    }
    setMotoPanaGpsCargando(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMotoPanaGpsCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setMotoPanaGpsActivo(true);
        setMotoPanaGpsCargando(false);
      },
      (err) => {
        setMotoPanaGpsCargando(false);
        alert('No se pudo obtener la ubicación GPS. Verifica los permisos de localización.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const generarMensajeDespachoMotoPana = () => {
    const solicitante = formularioInicial.nombresApellidos || 'Vecino Comunitario';
    const telefono = formularioInicial.usuarioTelegram ? `@${formularioInicial.usuarioTelegram.replace('@', '')}` : 'Contacto en Centinela';
    const gpsUrl = motoPanaGpsActivo && motoPanaGpsCoords
      ? `https://maps.google.com/?q=${motoPanaGpsCoords.lat.toFixed(5)},${motoPanaGpsCoords.lon.toFixed(5)}`
      : `https://maps.google.com/?q=${origenCoords.lat},${origenCoords.lon}`;

    const tipoTexto = panaCategoriaServicio === 'mandadito' ? 'MANDADITO / ENCOMIENDA' : 'VIAJE / TRASLADO';
    const iconoVehiculo = infoVehiculoActivo.icono;

    return `🚨 *¡NUEVA SOLICITUD PANA MÓVIL!* ${iconoVehiculo}💨\n\n` +
      `📌 *Servicio:* ${tipoTexto} (${infoVehiculoActivo.nombre})\n` +
      (primerUsoPana ? `🎉 *Beneficio:* ¡40% DE DESCUENTO POR 1ER VIAJE APLICADO! 🎁\n` : '') +
      `👤 *Solicitante:* ${solicitante}\n` +
      `📞 *Contacto:* ${telefono}\n` +
      `🚩 *Origen (Punto A):* ${origenNombreFinal}\n` +
      `🏁 *Destino (Punto B):* ${destinoNombreFinal}\n` +
      `📏 *Distancia estimada:* ${distanciaCalculadaKm} km\n` +
      `⏱️ *Tiempo aprox.:* ${tiempoEstimadoMinutos} min\n` +
      `💵 *Tarifa a pagar:* *$${tarifaUsd.toFixed(2)} USD* (≈ Bs. ${tarifaBs.toLocaleString('es-VE')})` +
      (primerUsoPana ? ` _(Precio regular: $${tarifaBaseUsd.toFixed(2)} USD)_` : '') + `\n` +
      (motoPanaNotas ? `📝 *Detalles:* ${motoPanaNotas}\n` : '') +
      `🗺️ *Ubicación en Mapa:* ${gpsUrl}\n\n` +
      `👉 *¿Quién toma el servicio? Responde con "LO TOMO" indicando tu nombre y placa.* 🇻🇪`;
  };

  const enviarSolicitudWhatsAppMotoPana = () => {
    vibrarHaptico();
    if (!registroCompletado) {
      mostrarToast('⚠️ Debes registrarte en Centinela antes de enviar una solicitud');
      setMostrarModalRegistro(true);
      return;
    }
    const textoMensaje = generarMensajeDespachoMotoPana();

    // Guardar URL en localStorage si el usuario la editó
    if (motoPanaWhatsappDestino) {
      localStorage.setItem('motopana_whatsapp_url', motoPanaWhatsappDestino);
    }

    // Copiar mensaje al portapapeles para facilitar pegado en grupos de WhatsApp
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textoMensaje).then(() => {
        setMotoPanaCopiado(true);
        setTimeout(() => setMotoPanaCopiado(false), 4000);
      }).catch(() => {});
    }

    const destino = (motoPanaWhatsappDestino || '').trim();
    if (destino.startsWith('http://') || destino.startsWith('https://')) {
      // Es un enlace de grupo o enlace directo
      if (destino.includes('chat.whatsapp.com')) {
        // Enlace de invitación de grupo de WhatsApp
        window.open(destino, '_blank');
      } else {
        const urlFinal = `${destino}${destino.includes('?') ? '&' : '?'}text=${encodeURIComponent(textoMensaje)}`;
        window.open(urlFinal, '_blank');
      }
    } else {
      // Es un número telefónico
      const numLimpio = destino.replace(/\D/g, '');
      const urlWa = `https://wa.me/${numLimpio}?text=${encodeURIComponent(textoMensaje)}`;
      window.open(urlWa, '_blank');
    }
  };

  const handleAction = (tab) => {
    vibrarHaptico();
    const publicTabs = ['inicio', 'feed', 'emprendimientos', 'donaciones', 'eventos'];
    if (!registroCompletado && !publicTabs.includes(tab)) {
      setMostrarModalRegistro(true);
      return;
    }
    setActiveTab(tab);
  };

  const seleccionarFlyerEvento = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    comprimirImagenDataUrl(archivo).then((dataUrl) => {
      setFormularioEvento((prev) => ({
        ...prev,
        flyerImage: dataUrl,
      }));
    });
  };

  const actualizarFormularioEvento = (event) => {
    const { name, value } = event.target;
    setFormularioEvento((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const crearEvento = (event) => {
    event.preventDefault();
    vibrarHaptico();

    if (!puedeCrearEvento) {
      alert('Seguridad: Tu rol actual no tiene permisos para crear eventos.');
      return;
    }

    const parroquiaDestino = formularioEvento.parroquia || parroquiaSeleccionada || 'Sucre';

    const nuevoEvento = {
      id: crearIdUnico('evento'),
      titulo: formularioEvento.titulo.trim(),
      nivel: formularioEvento.nivel,
      estado: 'convocado',
      parroquia: parroquiaDestino,
      comision: formularioEvento.comision,
      estadoTerritorial: 'Distrito Capital',
      municipio: 'Libertador',
      fecha: formularioEvento.fecha,
      horaInicio: formularioEvento.horaInicio,
      horaFin: formularioEvento.horaFin,
      lugar: formularioEvento.lugar.trim(),
      descripcion: formularioEvento.descripcion.trim(),
      flyerImage: formularioEvento.flyerImage,
      creadoPor: `${formularioInicial.nombresApellidos || 'Usuario'} (${formularioInicial.rol})`,
      creadoEn: new Date().toISOString(),
      asistentes: [],
    };

    setEventos((prev) => [nuevoEvento, ...prev]);
    setParroquiaSeleccionada(parroquiaDestino);

    // Guardar en Supabase en segundo plano si la tabla está configurada
    supabase
      .from('eventos')
      .insert({
        id: nuevoEvento.id,
        titulo: nuevoEvento.titulo,
        nivel: nuevoEvento.nivel,
        estado: nuevoEvento.estado,
        parroquia: nuevoEvento.parroquia,
        comision: nuevoEvento.comision,
        estado_territorial: nuevoEvento.estadoTerritorial,
        municipio: nuevoEvento.municipio,
        fecha: nuevoEvento.fecha,
        hora_inicio: nuevoEvento.horaInicio,
        hora_fin: nuevoEvento.horaFin,
        lugar: nuevoEvento.lugar,
        descripcion: nuevoEvento.descripcion,
        flyer_image: nuevoEvento.flyerImage,
        creado_por: nuevoEvento.creadoPor,
        creado_en: nuevoEvento.creadoEn,
        asistentes: [],
      })
      .then(({ error }) => {
        if (error) console.warn('Supabase sync warning:', error);
      });

    setFormularioEvento({
      titulo: '',
      nivel: 'parroquial',
      parroquia: '',
      comision: 'accion-socioterritorial',
      fecha: '',
      horaInicio: '',
      horaFin: '',
      lugar: '',
      descripcion: '',
      flyerImage: null,
    });
    setMostrarFormularioEvento(false);
    setEventoSeleccionadoId(nuevoEvento.id);
  };

  const actualizarEstadoEvento = (eventoId, nuevoEstado) => {
    vibrarHaptico();
    if (!puedeAdministrarEvento) {
      alert('Seguridad: Se requiere rol de Coordinador Parroquial o Administrador Estadal.');
      return;
    }
    setEventos((prev) =>
      prev.map((e) => (e.id === eventoId ? { ...e, estado: nuevoEstado } : e))
    );

    supabase
      .from('eventos')
      .update({ estado: nuevoEstado })
      .eq('id', eventoId)
      .then(({ error }) => {
        if (error) console.warn('Supabase status update error:', error);
      });
  };

  const iniciarEvento = (eventoId) => actualizarEstadoEvento(eventoId, 'en-curso');

  const abrirEdicionEvento = (evento) => {
    vibrarHaptico();
    if (!puedeAdministrarEvento) {
      alert('Seguridad: Tu rol no permite editar eventos.');
      return;
    }
    setEventoEnEdicion(evento);
  };

  const eliminarEvento = (eventoId) => {
    vibrarHaptico();
    if (!puedeAdministrarEvento) {
      alert('Seguridad: Solo coordinadores y administradores pueden eliminar eventos.');
      return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.')) {
      return;
    }

    setEventos((prev) => prev.filter((e) => e.id !== eventoId));

    supabase
      .from('eventos')
      .delete()
      .eq('id', eventoId)
      .then(({ error }) => {
        if (error) console.warn('Supabase delete error:', error);
      });

    if (eventoSeleccionadoId === eventoId) {
      setEventoSeleccionadoId(null);
    }

    alert('🗑 Evento eliminado correctamente.');
  };

  const guardarEdicionEvento = (e) => {
    e.preventDefault();
    vibrarHaptico();
    if (!eventoEnEdicion) return;

    setEventos((prev) =>
      prev.map((e) => (e.id === eventoEnEdicion.id ? { ...e, ...eventoEnEdicion } : e))
    );

    supabase
      .from('eventos')
      .update({
        titulo: eventoEnEdicion.titulo,
        parroquia: eventoEnEdicion.parroquia,
        fecha: eventoEnEdicion.fecha,
        hora_inicio: eventoEnEdicion.horaInicio,
        hora_fin: eventoEnEdicion.horaFin,
        lugar: eventoEnEdicion.lugar,
        descripcion: eventoEnEdicion.descripcion,
        flyer_image: eventoEnEdicion.flyerImage,
      })
      .eq('id', eventoEnEdicion.id)
      .then(({ error }) => {
        if (error) console.warn('Supabase update error:', error);
      });

    setEventoEnEdicion(null);
    alert('✏️ Evento actualizado correctamente.');
  };

  const culminarEvento = (eventoId) => {
    const evento = eventos.find((e) => e.id === eventoId);
    if (!evento) return;
    if (evento.asistentes.length === 0) {
      alert('El evento necesita al menos una asistencia registrada antes de culminar.');
      return;
    }
    const asistenciaIncompleta = evento.asistentes.some((a) => a.evidencias.length < 3);
    if (asistenciaIncompleta) {
      alert('Todas las asistencias deben tener mínimo 3 fotos de evidencia.');
      return;
    }
    actualizarEstadoEvento(eventoId, 'culminado');
  };

  const seleccionarFotosEvidencia = (event) => {
    const archivos = Array.from(event.target.files || []);
    if (archivos.length === 0) {
      setFotosEvidencia([]);
      return;
    }
    const promesasLectura = archivos.map((archivo) =>
      comprimirImagenDataUrl(archivo).then((dataUrl) => ({
        nombre: archivo.name,
        tipo: 'image/jpeg',
        tamaño: archivo.size,
        dataUrl,
      }))
    );

    Promise.all(promesasLectura).then((data) => setFotosEvidencia(data));
  };

  const registrarAsistencia = () => {
    if (!eventoSeleccionado) return;
    if (eventoSeleccionado.estado !== 'en-curso') {
      alert('La asistencia solo se puede registrar mientras el evento esté en curso.');
      return;
    }
    if (fotosEvidencia.length < 3) {
      alert('Debes seleccionar mínimo 3 fotografías de evidencia.');
      return;
    }

    const identificadorUsuario =
      formularioInicial.cedula ||
      formularioInicial.usuarioTelegram ||
      formularioInicial.nombresApellidos ||
      'usuario-invitado';

    if (eventoSeleccionado.asistentes.some((a) => a.usuarioId === identificadorUsuario)) {
      alert('Ya tienes una asistencia registrada en este evento.');
      return;
    }

    const nuevaAsistencia = {
      usuarioId: identificadorUsuario,
      nombre: formularioInicial.nombresApellidos || 'Usuario registrado',
      parroquia: formularioInicial.parroquia || 'No especificada',
      registradoEn: new Date().toISOString(),
      evidencias: fotosEvidencia,
    };

    vibrarHaptico();
    const nuevosAsistentes = [...eventoSeleccionado.asistentes, nuevaAsistencia];

    setEventos((prev) =>
      prev.map((e) =>
        e.id === eventoSeleccionado.id
          ? { ...e, asistentes: nuevosAsistentes }
          : e
      )
    );

    supabase
      .from('eventos')
      .update({ asistentes: nuevosAsistentes })
      .eq('id', eventoSeleccionado.id)
      .then(({ error }) => {
        if (error) console.warn('Supabase attendance sync error:', error);
      });

    setFotosEvidencia([]);
    alert('Asistencia registrada correctamente con 3 fotos de evidencia.');
  };

  const crearEmprendimiento = (e) => {
    e.preventDefault();
    vibrarHaptico();

    if (empEnEdicion) {
      // Editar Emprendimiento existente
      const imagenesFinales = fotosEmprendimiento.length > 0
        ? fotosEmprendimiento.map((f) => f.dataUrl)
        : (empEnEdicion.imagenes || []);

      const empActualizado = {
        ...empEnEdicion,
        nombre: formEmprendimiento.nombre.trim(),
        categoria: formEmprendimiento.categoria,
        parroquia: formEmprendimiento.parroquia || empEnEdicion.parroquia,
        comision: formEmprendimiento.comision,
        responsable: formEmprendimiento.responsable.trim() || empEnEdicion.responsable,
        contacto: formEmprendimiento.contacto.trim(),
        descripcion: formEmprendimiento.descripcion.trim(),
        imagenes: imagenesFinales,
      };

      setEmprendimientos((prev) => prev.map((e) => (e.id === empEnEdicion.id ? empActualizado : e)));

      supabase
        .from('emprendimientos')
        .update({
          nombre: empActualizado.nombre,
          categoria: empActualizado.categoria,
          parroquia: empActualizado.parroquia,
          comision: empActualizado.comision,
          responsable: empActualizado.responsable,
          contacto: empActualizado.contacto,
          descripcion: empActualizado.descripcion,
          imagenes: empActualizado.imagenes,
        })
        .eq('id', empEnEdicion.id)
        .then(({ error }) => {
          if (error) console.warn('Supabase emprendimiento update error:', error);
        });

      setEmpEnEdicion(null);
      alert('Emprendimiento actualizado correctamente.');
    } else {
      // Crear nuevo
      if (fotosEmprendimiento.length < 3 || fotosEmprendimiento.length > 5) {
        alert('Debes adjuntar entre 3 y 5 imágenes demostrativas de tu emprendimiento.');
        return;
      }

      const nuevoEmp = {
        id: crearIdUnico('emp'),
        nombre: formEmprendimiento.nombre.trim(),
        categoria: formEmprendimiento.categoria,
        parroquia: formEmprendimiento.parroquia || parroquiaSeleccionada,
        comision: formEmprendimiento.comision,
        responsable: formEmprendimiento.responsable.trim() || formularioInicial.nombresApellidos || 'Emprendedor Local',
        contacto: formEmprendimiento.contacto.trim(),
        descripcion: formEmprendimiento.descripcion.trim(),
        imagenes: fotosEmprendimiento.map((f) => f.dataUrl),
      };

      setEmprendimientos((prev) => [nuevoEmp, ...prev]);

      supabase
        .from('emprendimientos')
        .insert({
          id: nuevoEmp.id,
          nombre: nuevoEmp.nombre,
          categoria: nuevoEmp.categoria,
          parroquia: nuevoEmp.parroquia,
          comision: nuevoEmp.comision,
          responsable: nuevoEmp.responsable,
          contacto: nuevoEmp.contacto,
          descripcion: nuevoEmp.descripcion,
          imagenes: nuevoEmp.imagenes,
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase emprendimiento insert error:', error);
        });

      alert('Emprendimiento e imágenes de encadenamiento productivo cargados exitosamente.');
    }

    setFormEmprendimiento({
      nombre: '',
      categoria: 'Textil y Calzado',
      parroquia: parroquiaSeleccionada,
      comision: 'produccion-economia',
      responsable: '',
      contacto: '',
      descripcion: '',
    });
    setFotosEmprendimiento([]);
    setMostrarFormEmprendimiento(false);
  };

  const iniciarEdicionEmprendimiento = (emp) => {
    vibrarHaptico();
    setEmpEnEdicion(emp);
    setFormEmprendimiento({
      nombre: emp.nombre,
      categoria: emp.categoria,
      parroquia: emp.parroquia,
      comision: emp.comision || 'produccion-economia',
      responsable: emp.responsable,
      contacto: emp.contacto,
      descripcion: emp.descripcion,
    });
    setFotosEmprendimiento([]);
    setMostrarFormEmprendimiento(true);
  };

  const eliminarEmprendimiento = (id) => {
    vibrarHaptico();
    if (!window.confirm('¿Estás seguro de que deseas eliminar este emprendimiento?')) return;

    setEmprendimientos((prev) => prev.filter((e) => e.id !== id));

    supabase
      .from('emprendimientos')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('Supabase emprendimiento delete error:', error);
      });

    alert('Emprendimiento eliminado correctamente.');
  };

  const crearTarea = (e) => {
    e.preventDefault();
    vibrarHaptico();

    if (!puedeAsignarTarea) {
      alert('Seguridad: Solo los Voceros, Coordinadores o Administradores pueden asignar tareas.');
      return;
    }

    const nuevaTarea = {
      id: crearIdUnico('tarea'),
      titulo: formTarea.titulo.trim(),
      parroquia: formTarea.parroquia || parroquiaSeleccionada,
      comision: formTarea.comision,
      estado: 'Pendiente',
      prioridad: formTarea.prioridad,
      responsable: formTarea.responsable.trim() || formularioInicial.nombresApellidos || 'Vocería Asignada',
      fechaLimite: formTarea.fechaLimite,
    };

    setTareas((prev) => [nuevaTarea, ...prev]);

    supabase
      .from('tareas')
      .insert({
        id: nuevaTarea.id,
        titulo: nuevaTarea.titulo,
        parroquia: nuevaTarea.parroquia,
        comision: nuevaTarea.comision,
        estado: nuevaTarea.estado,
        prioridad: nuevaTarea.prioridad,
        responsable: nuevaTarea.responsable,
        fecha_limite: nuevaTarea.fechaLimite,
      })
      .then(({ error }) => {
        if (error) console.warn('Supabase tarea insert error:', error);
      });

    setFormTarea({
      titulo: '',
      parroquia: parroquiaSeleccionada,
      comision: 'accion-socioterritorial',
      prioridad: 'Media',
      responsable: '',
      fechaLimite: obtenerFechaActualLocal(),
    });
    setMostrarFormTarea(false);
    alert('Tarea comunitaria asignada correctamente.');
  };

  const cambiarEstadoTarea = (id, nuevoEstado) => {
    vibrarHaptico();
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t))
    );

    supabase
      .from('tareas')
      .update({ estado: nuevoEstado })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('Supabase tarea status update error:', error);
      });
  };

  const eliminarTarea = (id) => {
    vibrarHaptico();
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea de la lista?')) return;

    setTareas((prev) => prev.filter((t) => t.id !== id));

    supabase
      .from('tareas')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('Supabase tarea delete error:', error);
      });

    alert('Tarea eliminada correctamente.');
  };

  const crearReporte = (e) => {
    e.preventDefault();
    vibrarHaptico();
    const nuevoReporte = {
      id: crearIdUnico('rep'),
      servicio: formReporte.servicio,
      parroquia: formReporte.parroquia || parroquiaSeleccionada,
      comision: formReporte.comision,
      estadoServicio: formReporte.estadoServicio,
      observacion: formReporte.observacion.trim(),
      reportadoPor: formReporte.reportadoPor.trim() || formularioInicial.nombresApellidos || 'Vocería Comunitario',
      fecha: obtenerFechaActualLocal(),
    };

    setReportes((prev) => [nuevoReporte, ...prev]);
    setFormReporte({
      servicio: 'Agua',
      parroquia: parroquiaSeleccionada,
      comision: 'accion-socioterritorial',
      estadoServicio: 'Regular',
      observacion: '',
      reportadoPor: '',
    });
    setMostrarFormReporte(false);
    alert('Reporte de diagnóstico territorial registrado.');
  };

  const actualizarFormulario = (event) => {
    const { name, value } = event.target;
    setFormularioInicial((prev) => {
      let val = value;
      if (name === 'usuarioTelegram' && val && !val.startsWith('@')) {
        val = `@${val}`;
      }
      const updated = { ...prev, [name]: val };
      if (name === 'estado') {
        updated.municipio = '';
        updated.parroquia = '';
        updated.comuna = '';
      }
      if (name === 'municipio') {
        updated.parroquia = '';
        updated.comuna = '';
      }
      return updated;
    });
  };

  const guardarRegistroInicial = (event) => {
    event.preventDefault();
    const edadCalculada = calcularEdad(formularioInicial.fechaNacimiento);
    if (!formularioInicial.fechaNacimiento || edadCalculada === '') {
      alert('Selecciona una fecha de nacimiento válida.');
      return;
    }
    const storageKey = telegramUserId ? `perfilUsuario_${telegramUserId}` : 'perfilUsuario';
    localStorage.setItem(storageKey, JSON.stringify(formularioInicial));

    // Agregar nuevo usuario a la lista del sistema
    const nuevoUsuarioObj = {
      id: telegramUserId ? `usr-tg-${telegramUserId}` : crearIdUnico('usr'),
      nombresApellidos: formularioInicial.nombresApellidos,
      cedula: formularioInicial.cedula,
      usuarioTelegram: formularioInicial.usuarioTelegram || (telegramUserId ? `@id_${telegramUserId}` : '—'),
      parroquia: formularioInicial.parroquia || 'Caricuao',
      rol: formularioInicial.rol || 'Integrante Comunitario',
      fechaRegistro: obtenerFechaActualLocal(),
    };

    setUsuariosRegistrados((prev) => {
      const index = prev.findIndex((u) => u.id === nuevoUsuarioObj.id || u.cedula === nuevoUsuarioObj.cedula);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = { ...copy[index], ...nuevoUsuarioObj };
        return copy;
      }
      return [nuevoUsuarioObj, ...prev];
    });

    supabase
      .from('usuarios')
      .upsert({
        id: nuevoUsuarioObj.id,
        nombres_apellidos: nuevoUsuarioObj.nombresApellidos,
        cedula: nuevoUsuarioObj.cedula,
        usuario_telegram: nuevoUsuarioObj.usuarioTelegram,
        parroquia: nuevoUsuarioObj.parroquia,
        rol: nuevoUsuarioObj.rol,
        fecha_registro: nuevoUsuarioObj.fechaRegistro,
      })
      .then(({ error }) => {
        if (error) console.warn('Supabase user registration warning:', error);
      });

    if (formularioInicial.parroquia) setParroquiaSeleccionada(formularioInicial.parroquia);
    setRegistroCompletado(true);
    setMostrarModalRegistro(false);
    cargarDatosNube();
  };

  const renderModalRegistro = () => {
    if (!mostrarModalRegistro) return null;
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)',
        zIndex: 100002, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', boxSizing: 'border-box'
      }}>
        <div style={{
          background: '#ffffff', borderRadius: '18px', maxWidth: '520px', width: '100%',
          maxHeight: '90vh', overflowY: 'auto', padding: '20px', position: 'relative',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <p className="section-label" style={{ margin: 0 }}>UNIRSE A CENTINELA 2.0</p>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '20px' }}>Registro Comunitario</h2>
            </div>
            <button
              type="button"
              onClick={() => setMostrarModalRegistro(false)}
              style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px' }}
            >
              ×
            </button>
          </div>
          <p style={{ color: '#5f6b7a', fontSize: '12px', lineHeight: 1.4, margin: '0 0 16px 0' }}>
            Regístrate para vincularte a tu Parroquia, registrar asistencias a eventos con QR, postular emprendimientos y participar en las tareas comunitarias.
          </p>
          <form onSubmit={guardarRegistroInicial}>
            <label style={{ display: 'block', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>Cédula</span>
              <input name="cedula" value={formularioInicial.cedula} onChange={actualizarFormulario} required placeholder="Ej. V-12345678" style={{ display: 'block', width: '100%', marginTop: '4px', padding: '10px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>Nombres y apellidos</span>
              <input name="nombresApellidos" value={formularioInicial.nombresApellidos} onChange={actualizarFormulario} required placeholder="Escribe tus nombres y apellidos" style={{ display: 'block', width: '100%', marginTop: '4px', padding: '10px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>Usuario de Telegram</span>
              <input name="usuarioTelegram" value={formularioInicial.usuarioTelegram} onChange={actualizarFormulario} required placeholder="@usuario_telegram" style={{ display: 'block', width: '100%', marginTop: '4px', padding: '10px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#ffffff' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>Género</span>
              <select name="genero" value={formularioInicial.genero} onChange={actualizarFormulario} required style={{ display: 'block', width: '100%', marginTop: '4px', padding: '10px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#ffffff' }}>
                <option value="">Selecciona una opción</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
              </select>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '8px', marginBottom: '12px' }}>
              <div>
                <label htmlFor="fechaNacimiento" style={{ display: 'block', marginBottom: '4px', color: '#263449', fontSize: '12px', fontWeight: '600' }}>Fecha de nacimiento</label>
                <input id="fechaNacimiento" name="fechaNacimiento" type="date" value={formularioInicial.fechaNacimiento} onChange={actualizarFormulario} max={obtenerFechaActualLocal()} required style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <span style={{ display: 'block', marginBottom: '4px', color: '#263449', fontSize: '12px', fontWeight: '600' }}>Edad</span>
                <div style={{ padding: '10px', background: '#f1f7f5', border: '1px solid #d8eee6', borderRadius: '8px', fontWeight: '500', fontSize: '12px' }}>
                  {formularioInicial.fechaNacimiento ? `${calcularEdad(formularioInicial.fechaNacimiento)}` : '—'}
                </div>
              </div>
            </div>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>Estado</span>
              <select name="estado" value={formularioInicial.estado} onChange={actualizarFormulario} required style={{ display: 'block', width: '100%', marginTop: '4px', padding: '10px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#ffffff' }}>
                <option value="">Selecciona estado</option>
                <option value="Distrito Capital">Distrito Capital</option>
                <option value="Miranda">Miranda</option>
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>Municipio</span>
              <select name="municipio" value={formularioInicial.municipio} onChange={actualizarFormulario} required disabled={!formularioInicial.estado} style={{ display: 'block', width: '100%', marginTop: '4px', padding: '10px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#ffffff' }}>
                <option value="">Selecciona municipio</option>
                {(municipiosPorEstado[formularioInicial.estado] || []).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>Parroquia</span>
              <select name="parroquia" value={formularioInicial.parroquia} onChange={actualizarFormulario} required disabled={!formularioInicial.municipio} style={{ display: 'block', width: '100%', marginTop: '4px', padding: '10px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#ffffff' }}>
                <option value="">Selecciona parroquia</option>
                {parroquiasCaracas.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>Comuna (Opcional)</span>
              <input name="comuna" value={formularioInicial.comuna} onChange={actualizarFormulario} placeholder="Nombre de tu comuna (opcional)" style={{ display: 'block', width: '100%', marginTop: '4px', padding: '10px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>Consejo Comunal (Opcional)</span>
              <input name="concejoComunal" value={formularioInicial.concejoComunal} onChange={actualizarFormulario} placeholder="Nombre de tu consejo comunal (opcional)" style={{ display: 'block', width: '100%', marginTop: '4px', padding: '10px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>Teléfono</span>
              <input name="telefono" type="tel" value={formularioInicial.telefono} onChange={actualizarFormulario} required placeholder="Teléfono de contacto" style={{ display: 'block', width: '100%', marginTop: '4px', padding: '10px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
            </label>

            <button type="submit" style={{ width: '100%', padding: '12px', border: 0, borderRadius: '10px', background: '#2563eb', color: '#ffffff', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Ingresar a mi Consejo Popular
            </button>
          </form>
        </div>
      </div>
    );
  };

  const eventosMostrados = eventos.filter((e) => {
    const coincideParroquia =
      parroquiaSeleccionada === 'todas' ||
      e.parroquia === 'Todas' ||
      e.parroquia === 'Caracas General' ||
      e.nivel === 'estadal' ||
      e.parroquia === parroquiaSeleccionada;
    const coincideComision = comisionSeleccionada === 'todas' || e.comision === comisionSeleccionada;
    if (!coincideParroquia || !coincideComision) return false;
    return eventosFiltroEstado === 'historico' ? e.estado === 'culminado' : e.estado !== 'culminado';
  });

  const emprendimientosFiltrados = emprendimientos.filter((e) => {
    const coincideParroquia = filtroParroquiaEmp === 'todas'
      ? true
      : e.parroquia === filtroParroquiaEmp;
    const coincideCategoria = filtroCategoriaEmp === 'todas'
      ? true
      : e.categoria === filtroCategoriaEmp;
    const coincideComision = comisionSeleccionada === 'todas' || e.comision === comisionSeleccionada;
    return coincideParroquia && coincideCategoria && coincideComision;
  });

  const tareasFiltradas = tareas.filter((t) => {
    const pTarget = filtroParroquiaTarea === 'todas' ? parroquiaSeleccionada : filtroParroquiaTarea;
    const coincideParroquia = filtroParroquiaTarea === 'todas'
      ? (!parroquiaSeleccionada || t.parroquia === parroquiaSeleccionada || t.parroquia === 'Caracas General' || t.parroquia === 'Todas')
      : (t.parroquia === pTarget || t.parroquia === 'Caracas General' || t.parroquia === 'Todas');
    const coincideComision = comisionSeleccionada === 'todas' || t.comision === comisionSeleccionada;
    const coincideEstado = filtroEstadoTarea === 'Todas'
      ? true
      : filtroEstadoTarea === 'Pendientes'
      ? t.estado === 'Pendiente'
      : filtroEstadoTarea === 'En Proceso'
      ? t.estado === 'En Proceso'
      : t.estado === 'Cumplida' || t.estado === 'Cumplido';
    return coincideParroquia && coincideComision && coincideEstado;
  });

  const reportesFiltrados = reportes.filter((r) => {
    const coincideParroquia = !parroquiaSeleccionada || r.parroquia === parroquiaSeleccionada;
    const coincideComision = comisionSeleccionada === 'todas' || r.comision === comisionSeleccionada;
    return coincideParroquia && coincideComision;
  });

  const calcularCumplimientoDinamico = () => {
    const tareasParroquia = tareas.filter(
      (t) => parroquiaSeleccionada === 'todas' || t.parroquia === parroquiaSeleccionada || t.parroquia === 'Todas' || t.parroquia === 'Caracas General'
    );
    const eventosParroquia = eventos.filter(
      (e) => parroquiaSeleccionada === 'todas' || e.parroquia === parroquiaSeleccionada || e.parroquia === 'Todas' || e.nivel === 'estadal'
    );

    const totalActividades = tareasParroquia.length + eventosParroquia.length;
    if (totalActividades === 0) {
      return { integracion: 0, sistematizacion: 0, comunicacion: 0, movilizacion: 0, formacion: 0 };
    }

    const tareasCumplidas = tareasParroquia.filter((t) => t.estado === 'Cumplida' || t.estado === 'Cumplido').length;
    const eventosCulminados = eventosParroquia.filter((e) => e.estado === 'culminado').length;
    const porcentajeBase = Math.min(100, Math.round(((tareasCumplidas + eventosCulminados) / totalActividades) * 100));

    return {
      integracion: porcentajeBase,
      sistematizacion: porcentajeBase,
      comunicacion: porcentajeBase,
      movilizacion: porcentajeBase,
      formacion: porcentajeBase,
    };
  };

  const cumplimientoActual = calcularCumplimientoDinamico();

  return (
    <div className="app-shell">
      <main className="app-content">
        <header className="top-header">
          <div>
            <p className="eyebrow">MINI APP DE TELEGRAM</p>
            <h1>Centinela <span>2.0</span></h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!registroCompletado && (
              <button
                type="button"
                onClick={() => setMostrarModalRegistro(true)}
                style={{
                  background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px',
                  padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}
              >
                ✍️ Registrarme
              </button>
            )}
            <span
              onClick={() => {
                vibrarHaptico();
                setMostrarModalRol(true);
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
              title="Haz clic para cambiar de rol"
            >
              👤 {formularioInicial.rol} ▾
            </span>

            <button
              className="notification-button"
              aria-label="Alternar Tema"
              onClick={() => {
                vibrarHaptico();
                alternarModoOscuro();
              }}
              title={esModoOscuro ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              <span>{esModoOscuro ? '☀️' : '🌙'}</span>
            </button>
          </div>
        </header>

        {activeTab === 'inicio' && (
          <>
            {!registroCompletado && (
              <div style={{
                background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px',
                padding: '12px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: '10px'
              }}>
                <div style={{ fontSize: '12px', color: '#1e40af', lineHeight: 1.4 }}>
                  <strong>👋 Modo Público Activo:</strong> Puedes explorar el Feed, Emprendimientos y Donaciones. Para sumarte a las tareas y reportes de tu parroquia, regístrate.
                </div>
                <button
                  type="button"
                  onClick={() => setMostrarModalRegistro(true)}
                  style={{
                    background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px',
                    padding: '8px 12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', flexShrink: 0
                  }}
                >
                  Registrarme
                </button>
              </div>
            )}
            <section className="welcome-section">
              <div>
                <p className="muted-text">Bienvenido de nuevo</p>
                <h2>Hola, {formularioInicial.nombresApellidos || 'usuario'}</h2>
                <p className="welcome-copy">
                  Rol activo: <strong>{formularioInicial.rol}</strong>
                </p>
              </div>

              <div className="avatar">
                {(formularioInicial.nombresApellidos || 'U').charAt(0).toUpperCase()}
              </div>
            </section>

            <section className="territory-card">
              <div className="card-heading">
                <div>
                  <p className="section-label">MI TERRITORIO</p>
                  <h3>{territoryNames[territoryType]}</h3>
                </div>

                <span className="status-badge">
                  <b></b> Activo
                </span>
              </div>

              <div className="territory-location">
                <span className="location-icon">⌖</span>
                <div>
                  <strong>
                    {territoryType === 'parroquial'
                      ? `Parroquia ${formularioInicial.parroquia || parroquiaSeleccionada}`
                      : formularioInicial.estado || 'Distrito Capital'}
                  </strong>
                  <small>
                    {territoryType === 'parroquial'
                      ? `Consejo Popular Parroquial (${formularioInicial.parroquia || parroquiaSeleccionada})`
                      : 'Territorio de trabajo asignado (Estadal)'}
                  </small>
                </div>
              </div>

              <div className="territory-selector">
                <details className="territory-picker">
                  <summary className="territory-trigger">
                    <span className="territory-trigger-text">
                      <span className="territory-trigger-label">
                        {territoryType === 'estadal'
                          ? 'Estadal'
                          : territoryType === 'municipal'
                            ? 'Municipal'
                            : 'Parroquial'}
                      </span>
                      <span className="territory-trigger-description">
                        Vista territorial
                      </span>
                    </span>
                    <span className="territory-chevron">⌄</span>
                  </summary>

                  <div className="territory-menu">
                    {esNivelEstadal && (
                      <button
                        type="button"
                        className={`territory-option ${
                          territoryType === 'estadal'
                            ? 'territory-option-selected'
                            : ''
                        }`}
                        onClick={(event) => {
                          vibrarHaptico();
                          setTerritoryType('estadal');
                          event.currentTarget.closest('details').open = false;
                        }}
                      >
                        <span className="territory-option-icon">
                          {territoryType === 'estadal' ? '✓' : '○'}
                        </span>
                        <span className="territory-option-content">
                          <strong>Estadal</strong>
                          <small>Vista general del estado</small>
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      className={`territory-option ${
                        territoryType === 'parroquial'
                          ? 'territory-option-selected'
                          : ''
                      }`}
                      onClick={(event) => {
                        vibrarHaptico();
                        setTerritoryType('parroquial');
                        event.currentTarget.closest('details').open = false;
                      }}
                    >
                      <span className="territory-option-icon">
                        {territoryType === 'parroquial' ? '✓' : '○'}
                      </span>
                      <span className="territory-option-content">
                        <strong>Parroquial</strong>
                        <small>Trabajo de la parroquia ({formularioInicial.parroquia || parroquiaSeleccionada})</small>
                      </span>
                    </button>
                  </div>
                </details>
              </div>
            </section>

            <section className="section-block quick-actions-section">
              <div className="section-title-row quick-actions-header">
                <div className="quick-actions-heading">
                  <h3>Accesos rápidos</h3>
                  <span className="section-count">
                    {quickActions.length} opciones
                  </span>
                </div>

                <button
                  type="button"
                  className="more-quick-actions-button"
                  onClick={() => {
                    vibrarHaptico();
                    setShowAllQuickActions((currentValue) => !currentValue);
                  }}
                >
                  {showAllQuickActions ? 'Cerrar' : 'Más'}
                </button>
              </div>

              {showAllQuickActions && (
                <div className="quick-actions-more-panel">
                  <div className="quick-actions-more-title">
                    <strong>Personaliza tus accesos</strong>
                    <span>Fija hasta 3 accesos visibles</span>
                  </div>

                  <div className="quick-actions-all">
                    {quickActions.map((action) => {
                      const isPinned = pinnedQuickActionTabs.includes(action.tab);

                      return (
                        <div
                          className={`quick-action-more-item ${
                            isPinned ? 'is-pinned' : ''
                          }`}
                          key={action.tab}
                        >
                          <button
                            type="button"
                            className="quick-action-open-button"
                            onClick={() => {
                              handleAction(action.tab);
                              setShowAllQuickActions(false);
                            }}
                          >
                            <span className="action-icon">{action.icon}</span>
                            <span>{action.label}</span>
                          </button>

                          <button
                            type="button"
                            className="quick-action-pin-button"
                            onClick={() => pinQuickAction(action.tab)}
                            disabled={isPinned}
                          >
                            {isPinned ? 'Fijado' : 'Fijar'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="quick-actions">
                {pinnedQuickActions.map((action) => (
                  <button
                    type="button"
                    className="quick-action"
                    key={action.tab}
                    onClick={() => handleAction(action.tab)}
                  >
                    <span className="action-icon">{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="section-block">
              <div className="section-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Indicadores económicos</h3>
                {indicadoresEconomicos.fecha && (
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Actualizado: {indicadoresEconomicos.fecha}</span>
                )}
              </div>

              <div className="economic-grid">
                <div className="economic-card">
                  <span className="economic-icon dollar">$</span>
                  <small>Dólar BCV</small>
                  <strong>
                    {indicadoresEconomicos.cargando
                      ? 'Cargando...'
                      : indicadoresEconomicos.dolarBcv
                        ? `Bs. ${indicadoresEconomicos.dolarBcv}`
                        : 'Bs. —'}
                  </strong>
                  <em>Tasa Oficial BCV</em>
                </div>

                <div className="economic-card">
                  <span className="economic-icon euro">€</span>
                  <small>Euro BCV</small>
                  <strong>
                    {indicadoresEconomicos.cargando
                      ? 'Cargando...'
                      : indicadoresEconomicos.euroBcv
                        ? `Bs. ${indicadoresEconomicos.euroBcv}`
                        : 'Bs. —'}
                  </strong>
                  <em>Tasa Oficial BCV</em>
                </div>

                <div className="economic-card">
                  <span className="economic-icon usdt">₮</span>
                  <small>USDT / Paralelo</small>
                  <strong>
                    {indicadoresEconomicos.cargando
                      ? 'Cargando...'
                      : indicadoresEconomicos.usdt
                        ? `Bs. ${indicadoresEconomicos.usdt}`
                        : 'Bs. —'}
                  </strong>
                  <em>Valor de referencia</em>
                </div>
              </div>
            </section>

            <section className="organization-card">
              <div className="section-title-row">
                <div>
                  <p className="section-label">ESTRUCTURA OPERATIVA</p>
                  <h3>Orden de organización</h3>
                </div>
                <span className="organization-number">01</span>
              </div>

              <div className="organization-step">
                <span className="step-number">1</span>
                <div>
                  <strong>Consejo Popular</strong>
                  <small>Define el territorio y la organización base.</small>
                </div>
              </div>

              <div className="step-line"></div>

              <div className="organization-step">
                <span className="step-number">2</span>
                <div>
                  <strong>Vocerías y articulación</strong>
                  <small>Integra vocerías, JPSUV, Estado Mayor y movimientos.</small>
                </div>
              </div>

              <div className="step-line"></div>

              <div className="organization-step">
                <span className="step-number">3</span>
                <div>
                  <strong>Cinco mesas de trabajo</strong>
                  <small>Convierte la organización en tareas y actividades.</small>
                </div>
              </div>
            </section>

            <section className="section-block">
              <div className="section-title-row">
                <h3>Eventos recientes culminados</h3>
                <button
                  className="text-button"
                  onClick={() => handleAction('feed')}
                >
                  Ver todo en el Feed
                </button>
              </div>

              <div className="activity-list">
                {eventosCulminados.length === 0 ? (
                  <div style={{ padding: '16px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                    Aún no hay eventos culminados con evidencias cargadas.
                  </div>
                ) : (
                  eventosCulminados.slice(0, 5).map((evento) => (
                    <article
                      className="activity-item"
                      key={evento.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        vibrarHaptico();
                        setActiveTab('eventos');
                        abrirEvento(evento.id);
                      }}
                    >
                      <span className="activity-dot green"></span>
                      <div className="activity-content">
                        <div className="activity-meta">
                          <span>Culminado · {evento.parroquia}</span>
                          <time>{evento.fecha}</time>
                        </div>
                        <h4>{evento.titulo}</h4>
                        <p>⌖ {evento.lugar} · {evento.asistentes.length} asistentes con evidencias</p>
                      </div>
                      <span className="arrow">›</span>
                    </article>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {(activeTab === 'territorio' || activeTab === 'territory') ? (
          <section className="territorio-page">
            <div className="page-heading">
              <div>
                <p className="section-label">ESTRUCTURA SOCIOTERRITORIAL</p>
                <h2>Mi Territorio: Caracas</h2>
                <p className="page-description">
                  Estructura del Consejo Popular Estadal replicada en las 22 Parroquias.
                </p>
              </div>

              <button
                className="back-button"
                onClick={() => handleAction('inicio')}
              >
                Inicio
              </button>
            </div>

            {/* Mapa Socioterritorial de Caracas */}
            <section className="territory-card" style={{ marginBottom: '20px' }}>
              <div className="card-heading">
                <div>
                  <p className="section-label">ESTRUCTURA SOCIOTERRITORIAL</p>
                  <h3>
                    {esNivelEstadal
                      ? '22 Consejos Populares Parroquiales'
                      : `Consejo Popular Parroquial: ${parroquiaSeleccionada}`}
                  </h3>
                </div>
                <span className="status-badge">
                  <b></b> Activo
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0 16px 0' }}>
                <span className="location-icon">⌖</span>
                <div>
                  <strong>Parroquia asignada: {parroquiaSeleccionada}</strong>
                  <small style={{ display: 'block', color: '#64748b' }}>
                    {esNivelEstadal
                      ? 'Selecciona una parroquia para ver su estructura y métricas'
                      : 'Vista de estructura correspondiente a tu territorio de registro'}
                  </small>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                {(esNivelEstadal
                  ? parroquiasCaracasInfo
                  : parroquiasCaracasInfo.filter(
                      (p) =>
                        p.nombre ===
                        (formularioInicial.parroquia || parroquiaSeleccionada)
                    )
                ).map((p) => {
                  const isSelected = p.nombre === parroquiaSeleccionada;
                  return (
                    <button
                      key={p.nombre}
                      type="button"
                      onClick={() => {
                        if (esNivelEstadal) {
                          vibrarHaptico();
                          setParroquiaSeleccionada(p.nombre);
                        }
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        textAlign: 'left',
                        cursor: esNivelEstadal ? 'pointer' : 'default',
                      }}
                    >
                      <strong style={{ display: 'block', fontSize: '13px', color: '#1e293b' }}>{p.nombre}</strong>
                      <small style={{ fontSize: '11px', color: '#64748b' }}>{p.registrados} reg.</small>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Arbol de Estructura Organizativa Completa */}
            <section className="organization-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '16px', margin: '16px 0', border: '1px solid #e2e8f0' }}>
              <div className="section-title-row">
                <div>
                  <p className="section-label">ESTRUCTURA ORGANIZATIVA</p>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '20px' }}>Consejo Popular Parroquial ({infoParroquiaActual.nombre})</h3>
                </div>
                <span className="organization-number">22</span>
              </div>

              {/* Representaciones Adicionales / Estado Mayor */}
              <p className="section-label" style={{ marginTop: '16px' }}>COORDINACIÓN Y REPRESENTACIONES ADICIONALES</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '8px' }}>
                {representacionesAdicionalesDefinicion.map((rep) => (
                  <div key={rep.id} style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                    <small style={{ color: '#2563eb', fontWeight: '600', fontSize: '11px', display: 'block' }}>REPRESENTACIÓN</small>
                    <strong style={{ fontSize: '12px', color: '#1e293b', display: 'block' }}>{rep.nombre}</strong>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>{rep.descripcion}</span>
                  </div>
                ))}
              </div>

              {/* 5 Vocerías Principales y Suplentes */}
              <p className="section-label" style={{ marginTop: '20px' }}>5 VOCERÍAS (PRINCIPAL Y SUPLENTE)</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {voceriasEstructuraDefinicion.map((v) => (
                  <div key={v.id} style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '13px', color: '#1e293b' }}>{v.nombre}</strong>
                      <span style={{ fontSize: '11px', color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>Activa</span>
                    </div>
                    <small style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: '4px' }}>└── Principal & Suplente asignados</small>
                  </div>
                ))}
              </div>

              {/* Gráfica de Cumplimiento por Vocería con Anillos Circulares */}
              <p className="section-label" style={{ marginTop: '20px' }}>GRÁFICA DE CUMPLIMIENTO EN VIVO ({infoParroquiaActual.nombre})</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                {[
                  { label: 'Integración', val: cumplimientoActual.integracion, color: '#2563eb' },
                  { label: 'Sistematización', val: cumplimientoActual.sistematizacion, color: '#9333ea' },
                  { label: 'Comunicación', val: cumplimientoActual.comunicacion, color: '#16a34a' },
                  { label: 'Movilización', val: cumplimientoActual.movilizacion, color: '#ea580c' },
                  { label: 'Formación', val: cumplimientoActual.formacion, color: '#0d9488' },
                ].map((item) => (
                  <AnilloProgresoCircular key={item.label} porcentaje={item.val} color={item.color} label={item.label} />
                ))}
              </div>

              {/* 5 Comisiones / Mesas de Trabajo Operativas */}
              <p className="section-label" style={{ marginTop: '20px' }}>5 COMISIONES / MESAS DE TRABAJO</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {comisionesDefinicion.map((com) => (
                  <div key={com.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '20px' }}>{com.icon}</span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '13px', display: 'block', color: '#1e293b' }}>{com.nombre}</strong>
                      <small style={{ color: '#64748b', fontSize: '12px' }}>{com.descripcion}</small>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </section>
        ) : activeTab === 'reportes' ? (
          <section className="reportes-page">
            <div className="page-heading">
              <div>
                <p className="section-label">DIAGNÓSTICO SOCIOTERRITORIAL: {parroquiaSeleccionada.toUpperCase()}</p>
                <h2>Reportes de Servicios Comunitarios</h2>
                <p className="page-description">
                  Estado y diagnóstico de Agua, Electricidad, Gas, Salud y Vialidad.
                </p>
              </div>

              <button className="back-button" onClick={() => handleAction('inicio')}>Inicio</button>
            </div>

            <button
              type="button"
              className="primary-button"
              style={{ marginBottom: '16px' }}
              onClick={() => {
                vibrarHaptico();
                setMostrarFormReporte((prev) => !prev);
              }}
            >
              {mostrarFormReporte ? 'Cerrar formulario' : '+ Nuevo reporte de servicio'}
            </button>

            {mostrarFormReporte && (
              <form className="evento-form-card" onSubmit={crearReporte}>
                <div className="section-title-row">
                  <div>
                    <p className="section-label">NUEVO DIAGNÓSTICO</p>
                    <h3>Reporte para {parroquiaSeleccionada}</h3>
                  </div>
                </div>

                <label className="evento-form-field">
                  <span>Servicio comunitario</span>
                  <select
                    value={formReporte.servicio}
                    onChange={(e) => setFormReporte((prev) => ({ ...prev, servicio: e.target.value }))}
                  >
                    <option value="Agua">Agua Potable</option>
                    <option value="Electricidad">Electricidad / Alumbrado</option>
                    <option value="Gas">Gas Comunal</option>
                    <option value="Salud">Salud / Barrio Adentro</option>
                    <option value="Vialidad">Vialidad y Transporte</option>
                  </select>
                </label>

                <label className="evento-form-field">
                  <span>Estado del servicio</span>
                  <select
                    value={formReporte.estadoServicio}
                    onChange={(e) => setFormReporte((prev) => ({ ...prev, estadoServicio: e.target.value }))}
                  >
                    <option value="Óptimo">Óptimo (Funcionando bien)</option>
                    <option value="Regular">Regular (Fallas intermitentes)</option>
                    <option value="Crítico">Crítico (Sin servicio / Avería grave)</option>
                  </select>
                </label>

                <label className="evento-form-field">
                  <span>Observaciones y detalles</span>
                  <textarea
                    value={formReporte.observacion}
                    onChange={(e) => setFormReporte((prev) => ({ ...prev, observacion: e.target.value }))}
                    placeholder="Describe la situación actual del servicio"
                    rows="3"
                    required
                  />
                </label>

                <label className="evento-form-field">
                  <span>Parroquia</span>
                  <select
                    value={formReporte.parroquia || parroquiaSeleccionada}
                    onChange={(e) => setFormReporte((prev) => ({ ...prev, parroquia: e.target.value }))}
                    required
                  >
                    {parroquiasCaracas.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="evento-form-field">
                  <span>Reportado por / Vocería</span>
                  <input
                    value={formReporte.reportadoPor}
                    onChange={(e) => setFormReporte((prev) => ({ ...prev, reportadoPor: e.target.value }))}
                    placeholder="Ej. Mesa Técnica de Agua"
                    required
                  />
                </label>

                <button type="submit" className="primary-button">Guardar reporte</button>
              </form>
            )}

            <div className="eventos-list">
              {reportesFiltrados.length === 0 ? (
                <div className="empty-page evento-empty-state">
                  <span className="empty-icon">▤</span>
                  <h3>No hay reportes cargados en {parroquiaSeleccionada}</h3>
                  <p>Registra el primer diagnóstico de servicios comunitarios.</p>
                </div>
              ) : (
                reportesFiltrados.map((rep) => (
                  <article className="evento-card" key={rep.id}>
                    <div className="evento-card-top">
                      <span className={`activity-dot ${rep.estadoServicio === 'Óptimo' ? 'green' : rep.estadoServicio === 'Regular' ? 'orange' : 'red'}`}></span>
                      <span className="evento-level">{rep.parroquia}</span>
                      <span className="evento-status">{rep.estadoServicio}</span>
                    </div>

                    <h3>🛠 Servicio: {rep.servicio}</h3>
                    <p className="feed-description">{rep.observacion}</p>
                    <p className="evento-date">👤 Reportado por: {rep.reportadoPor} · ◷ {rep.fecha}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        ) : activeTab === 'feed' ? (
          <section className="feed-page">
            <div className="page-heading">
              <div>
                <p className="section-label">ACTUALIZACIONES</p>
                <h2>Feed estadal Caracas</h2>
                <p className="page-description">
                  Consulta los eventos culminados de Caracas y sus 22 parroquias.
                </p>
              </div>

              <button
                className="back-button"
                onClick={() => handleAction('inicio')}
              >
                Inicio
              </button>
            </div>

            <div className="feed-filters">
              <button
                className={`filter-button ${
                  activeFilter === 'Todo' ? 'active-filter' : ''
                }`}
                onClick={() => {
                  vibrarHaptico();
                  setActiveFilter('Todo');
                }}
              >
                Todo
              </button>

              <button
                className={`filter-button ${
                  activeFilter === 'Evento culminado' ? 'active-filter' : ''
                }`}
                onClick={() => {
                  vibrarHaptico();
                  setActiveFilter('Evento culminado');
                }}
              >
                Eventos culminados
              </button>

              <button
                className={`filter-button ${
                  activeFilter === 'Convocatoria' ? 'active-filter' : ''
                }`}
                onClick={() => {
                  vibrarHaptico();
                  setActiveFilter('Convocatoria');
                }}
              >
                Convocatorias
              </button>

              <button
                className={`filter-button ${
                  activeFilter === 'Actividad' ? 'active-filter' : ''
                }`}
                onClick={() => {
                  vibrarHaptico();
                  setActiveFilter('Actividad');
                }}
              >
                Actividades
              </button>

              <button
                className={`filter-button ${
                  activeFilter === 'Reporte' ? 'active-filter' : ''
                }`}
                onClick={() => {
                  vibrarHaptico();
                  setActiveFilter('Reporte');
                }}
              >
                Reportes
              </button>
            </div>

            <div className="feed-list">
              {visiblePosts.map((post) => (
                <article className="feed-card" key={post.id}>
                  <div className="feed-card-header">
                    <div className="feed-type">
                      <span className={`activity-dot ${post.color}`}></span>
                      <span>{post.type}</span>
                    </div>

                    <time>{post.time}</time>
                  </div>

                  <h3>{post.title}</h3>

                  <p className="feed-description">
                    {post.description}
                  </p>

                  {Array.isArray(post.evidencias) && post.evidencias.length > 0 && (
                    <div className="feed-gallery-slider">
                      {post.evidencias.map((foto, idx) => (
                        <img
                          key={idx}
                          src={foto}
                          alt={`Evidencia ${idx + 1}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            vibrarHaptico();
                            setFotoLightboxUrl(foto);
                          }}
                          className="feed-gallery-slide-img"
                        />
                      ))}
                    </div>
                  )}

                  <div className="feed-territory">
                    <span>⌖</span>
                    <span>{post.territory}</span>
                  </div>

                  <div className="feed-card-footer">
                    <span className="feed-author">
                      Publicado por {post.author}
                    </span>

                    <button
                      className="detail-button"
                      onClick={() => {
                        vibrarHaptico();
                        if (post.eventId) {
                          setActiveTab('eventos');
                          abrirEvento(post.eventId);
                        } else {
                          setSelectedPost(post);
                        }
                      }}
                    >
                      Ver detalle
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {selectedPost && (
              <div
                className="detail-overlay"
                onClick={() => setSelectedPost(null)}
              >
                <div
                  className="detail-bubble"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="bubble-handle"></div>

                  <div className="detail-panel-header">
                    <div>
                      <p className="section-label">DETALLE DE PUBLICACIÓN</p>
                      <h3>{selectedPost.title}</h3>
                    </div>

                    <button
                      className="close-button"
                      onClick={() => setSelectedPost(null)}
                      aria-label="Cerrar detalle"
                    >
                      ×
                    </button>
                  </div>

                  <p className="bubble-description">
                    {selectedPost.description}
                  </p>

                  <div className="detail-information">
                    <span>
                      <strong>Tipo:</strong> {selectedPost.type}
                    </span>

                    <span>
                      <strong>Territorio:</strong> {selectedPost.territory}
                    </span>

                    <span>
                      <strong>Responsable:</strong> {selectedPost.author}
                    </span>

                    <span>
                      <strong>Publicado:</strong> {selectedPost.time}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>
        ) : activeTab === 'eventos' ? (
          <section className="eventos-page">
            <div className="page-heading">
              <div>
                <p className="section-label">
                  CONSEJO POPULAR PARROQUIAL: {parroquiaSeleccionada.toUpperCase()}
                </p>

                <h2>Eventos y Actividades</h2>

                <p className="page-description">
                  Administra eventos por parroquia y comisión, sube el flyer, registra asistencias con QR y fotos.
                </p>
              </div>

              <button
                className="back-button"
                onClick={() => handleAction('inicio')}
              >
                Inicio
              </button>
            </div>

            {/* Panel de Filtros Parroquiales y Comisiones de Eventos */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', marginBottom: '14px' }}>
              <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                🔍 Filtro de Parroquia y Comisión
              </strong>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '2px' }}>Parroquia activa:</label>
                  <select
                    value={parroquiaSeleccionada}
                    onChange={(e) => {
                      vibrarHaptico();
                      setParroquiaSeleccionada(e.target.value);
                    }}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px' }}
                  >
                    <option value="todas">🌐 Todas las parroquias</option>
                    {parroquiasCaracas.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '2px' }}>Comisión:</label>
                  <select
                    value={comisionSeleccionada}
                    onChange={(e) => setComisionSeleccionada(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px' }}
                  >
                    <option value="todas">Todas las comisiones</option>
                    {comisionesDefinicion.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="eventos-summary">
              <div className="summary-item">
                <strong>{eventos.length}</strong>
                <span>Eventos registrados</span>
              </div>

              <div className="summary-item">
                <strong>{eventosCulminados.length}</strong>
                <span>Eventos culminados</span>
              </div>

              <div className="summary-item">
                <strong>22</strong>
                <span>Parroquias</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: '#e2e8f0', padding: '4px', borderRadius: '12px' }}>
              <button type="button" style={{ flex: 1, padding: '10px', border: 0, borderRadius: '8px', background: eventosFiltroEstado === 'activos' ? '#ffffff' : 'transparent', fontWeight: eventosFiltroEstado === 'activos' ? '600' : 'normal', color: eventosFiltroEstado === 'activos' ? '#1e293b' : '#64748b', cursor: 'pointer' }} onClick={() => { vibrarHaptico(); setEventosFiltroEstado('activos'); }}>
                Próximos / En Curso
              </button>
              <button type="button" style={{ flex: 1, padding: '10px', border: 0, borderRadius: '8px', background: eventosFiltroEstado === 'historico' ? '#ffffff' : 'transparent', fontWeight: eventosFiltroEstado === 'historico' ? '600' : 'normal', color: eventosFiltroEstado === 'historico' ? '#1e293b' : '#64748b', cursor: 'pointer' }} onClick={() => { vibrarHaptico(); setEventosFiltroEstado('historico'); }}>
                Histórico Culminados ({eventosCulminados.length})
              </button>
            </div>

            {eventosFiltroEstado === 'activos' && puedeCrearEvento && (
              <button
                type="button"
                className="primary-button evento-create-button"
                onClick={() => {
                  vibrarHaptico();
                  setMostrarFormularioEvento(
                    (valorActual) => !valorActual
                  );
                }}
              >
                {mostrarFormularioEvento
                  ? 'Cerrar formulario'
                  : `+ Crear evento para ${parroquiaSeleccionada}`}
              </button>
            )}

            {mostrarFormularioEvento && eventosFiltroEstado === 'activos' && (
              <form
                className="evento-form-card"
                onSubmit={crearEvento}
              >
                <div className="section-title-row">
                  <div>
                    <p className="section-label">
                      NUEVA ACTIVIDAD ({formularioInicial.rol})
                    </p>

                    <h3>Crear evento en {parroquiaSeleccionada}</h3>
                  </div>
                </div>

                <label className="evento-form-field">
                  <span>Nombre del evento</span>

                  <input
                    name="titulo"
                    value={formularioEvento.titulo}
                    onChange={actualizarFormularioEvento}
                    placeholder="Ejemplo: Jornada comunitaria"
                    required
                  />
                </label>

                <label className="evento-form-field">
                  <span>Parroquia del evento</span>
                  <select
                    name="parroquia"
                    value={formularioEvento.parroquia || parroquiaSeleccionada}
                    onChange={actualizarFormularioEvento}
                    required
                  >
                    {parroquiasCaracas.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="evento-form-field">
                  <span>Imagen / Flyer del evento (Opcional)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={seleccionarFlyerEvento}
                  />
                  {formularioEvento.flyerImage && (
                    <img src={formularioEvento.flyerImage} alt="Flyer preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }} />
                  )}
                </label>

                <label className="evento-form-field">
                  <span>Comisión organizadora</span>
                  <select name="comision" value={formularioEvento.comision} onChange={actualizarFormularioEvento} required>
                    {comisionesDefinicion.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </label>

                <div className="evento-form-grid">
                  <label className="evento-form-field">
                    <span>Fecha</span>

                    <input
                      name="fecha"
                      type="date"
                      value={formularioEvento.fecha}
                      onChange={actualizarFormularioEvento}
                      required
                    />
                  </label>

                  <label className="evento-form-field">
                    <span>Hora de inicio</span>

                    <input
                      name="horaInicio"
                      type="time"
                      value={formularioEvento.horaInicio}
                      onChange={actualizarFormularioEvento}
                      required
                    />
                  </label>

                  <label className="evento-form-field">
                    <span>Hora de culminación</span>

                    <input
                      name="horaFin"
                      type="time"
                      value={formularioEvento.horaFin}
                      onChange={actualizarFormularioEvento}
                      required
                    />
                  </label>
                </div>

                <label className="evento-form-field">
                  <span>Lugar</span>

                  <input
                    name="lugar"
                    value={formularioEvento.lugar}
                    onChange={actualizarFormularioEvento}
                    placeholder="Ejemplo: Plaza de Caricuao"
                    required
                  />
                </label>

                <label className="evento-form-field">
                  <span>Descripción</span>

                  <textarea
                    name="descripcion"
                    value={formularioEvento.descripcion}
                    onChange={actualizarFormularioEvento}
                    placeholder="Describe el objetivo de la actividad"
                    rows="4"
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Crear evento y generar QR
                </button>
              </form>
            )}

            <div className="eventos-list">
              {eventosMostrados.length === 0 ? (
                <div className="empty-page evento-empty-state">
                  <span className="empty-icon">◷</span>

                  <h3>{eventosFiltroEstado === 'historico' ? 'No hay eventos en el histórico' : `No hay eventos próximos en ${parroquiaSeleccionada}`}</h3>

                  <p>
                    Crea una actividad para esta parroquia o selecciona otra en Mi Territorio.
                  </p>
                </div>
              ) : (
                eventosMostrados.map((evento) => (
                  <article
                    className="evento-card"
                    key={evento.id}
                  >
                    {evento.flyerImage && (
                      <img
                        src={evento.flyerImage}
                        alt={evento.titulo}
                        onClick={(e) => {
                          e.stopPropagation();
                          vibrarHaptico();
                          setFotoLightboxUrl(evento.flyerImage);
                        }}
                        style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px', cursor: 'zoom-in' }}
                      />
                    )}

                    <div className="evento-card-top">
                      <span
                        className={`activity-dot ${
                          obtenerColorEstadoEvento(
                            evento.estado
                          )
                        }`}
                      ></span>

                      <span className="evento-level">
                        {evento.parroquia}
                      </span>

                      <span className="evento-status">
                        {obtenerEtiquetaEstadoEvento(
                          evento.estado
                        )}
                      </span>
                    </div>

                    <h3>{evento.titulo}</h3>

                    <p className="evento-location">
                      ⌖ {evento.lugar}
                    </p>

                    <p className="evento-date">
                      ◷ {evento.fecha} · {evento.horaInicio}
                    </p>

                    <div className="evento-card-footer">
                      <span>
                        {evento.asistentes.length} asistentes
                      </span>

                      <button
                        type="button"
                        className="detail-button"
                        onClick={() => abrirEvento(evento.id)}
                      >
                        Ver evento
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>

            {eventoSeleccionado && (
              <div
                className="detail-overlay"
                onClick={() =>
                  setEventoSeleccionadoId(null)
                }
              >
                <div
                  className="detail-bubble evento-detail-bubble"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <div className="bubble-handle"></div>

                  <div className="detail-panel-header">
                    <div>
                      <p className="section-label">
                        {eventoSeleccionado.parroquia.toUpperCase()}
                      </p>

                      <h3>{eventoSeleccionado.titulo}</h3>
                    </div>

                    <button
                      type="button"
                      className="close-button"
                      onClick={() => setEventoSeleccionadoId(null)}
                      aria-label="Cerrar evento"
                    >
                      ×
                    </button>
                  </div>

                  {eventoSeleccionado.flyerImage && (
                    <img
                      src={eventoSeleccionado.flyerImage}
                      alt="Flyer Evento"
                      onClick={() => {
                        vibrarHaptico();
                        setFotoLightboxUrl(eventoSeleccionado.flyerImage);
                      }}
                      style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px', cursor: 'zoom-in' }}
                    />
                  )}

                  <div className="evento-detail-layout">
                    <div className="evento-detail-information">
                      <p>
                        <strong>Estado:</strong>{' '}
                        {obtenerEtiquetaEstadoEvento(
                          eventoSeleccionado.estado
                        )}
                      </p>

                      <p>
                        <strong>Territorio:</strong>{' '}
                        {eventoSeleccionado.parroquia}
                      </p>

                      <p>
                        <strong>Fecha:</strong>{' '}
                        {eventoSeleccionado.fecha}
                      </p>

                      <p>
                        <strong>Horario:</strong>{' '}
                        {eventoSeleccionado.horaInicio} -{' '}
                        {eventoSeleccionado.horaFin}
                      </p>

                      <p>
                        <strong>Lugar:</strong>{' '}
                        {eventoSeleccionado.lugar}
                      </p>

                      <p>
                        <strong>Descripción:</strong>{' '}
                        {eventoSeleccionado.descripcion}
                      </p>

                      <p>
                        <strong>Organizado por:</strong>{' '}
                        {eventoSeleccionado.creadoPor}
                      </p>
                    </div>

                    <div className="evento-qr-card">
                      <p className="section-label">
                        QR DE ASISTENCIA
                      </p>

                      {eventoSeleccionado.estado === 'en-curso' ? (
                        <>
                          <QRCodeSVG
                            value={obtenerValorQR(
                              eventoSeleccionado
                            )}
                            size={190}
                            includeMargin
                          />

                          <small>
                            Cada usuario registrado debe escanear
                            este código durante el evento.
                          </small>
                        </>
                      ) : (
                        <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                          <span style={{ fontSize: '24px', display: 'block', marginBottom: '6px' }}>🔒</span>
                          <strong style={{ color: '#475569', fontSize: '13px', display: 'block' }}>
                            QR Inactivo
                          </strong>
                          <small style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                            {eventoSeleccionado.estado === 'culminado'
                              ? 'El evento ha culminado. El código QR ya no está disponible.'
                              : 'El código QR solo estará disponible cuando el evento sea marcado En Curso.'}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="evento-actions">
                    {puedeAdministrarEvento && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '8px' }}>
                        <button
                          type="button"
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            color: '#1e293b',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                          onClick={() => abrirEdicionEvento(eventoSeleccionado)}
                        >
                          ✏️ Editar evento
                        </button>
                        <button
                          type="button"
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                          onClick={() => eliminarEvento(eventoSeleccionado.id)}
                        >
                          🗑 Eliminar
                        </button>
                      </div>
                    )}

                    {eventoSeleccionado.estado ===
                      'convocado' && (
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                          iniciarEvento(
                            eventoSeleccionado.id
                          )
                        }
                      >
                        Marcar como en curso
                      </button>
                    )}

                    {eventoSeleccionado.estado === 'en-curso' && (() => {
                      const identificadorUsuario =
                        formularioInicial.cedula ||
                        formularioInicial.usuarioTelegram ||
                        formularioInicial.nombresApellidos ||
                        'usuario-invitado';
                      const yaAsistio = eventoSeleccionado.asistentes.some((a) => a.usuarioId === identificadorUsuario);

                      if (yaAsistio) {
                        return (
                          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '12px', padding: '14px', textAlign: 'center', margin: '10px 0' }}>
                            <strong style={{ color: '#166534', fontSize: '14px', display: 'block' }}>
                              ✓ Asistencia Confirmada
                            </strong>
                            <p style={{ color: '#15803d', fontSize: '12px', margin: '4px 0 0 0' }}>
                              Ya has registrado y verificado tu asistencia a este evento con tus 3 fotografías de evidencia.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="evento-attendance-card">
                          <p className="section-label">
                            REGISTRAR MI ASISTENCIA
                          </p>

                          <p>
                            Debes cargar mínimo 3 fotografías
                            propias de evidencia.
                          </p>

                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={
                              seleccionarFotosEvidencia
                            }
                          />

                          <span className="photo-counter">
                            {fotosEvidencia.length} de 3 fotos
                            seleccionadas
                          </span>

                          {fotosEvidencia.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', margin: '8px 0' }}>
                              {fotosEvidencia.map((ev, index) => (
                                <img key={index} src={ev.dataUrl} alt={ev.nombre} style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                              ))}
                            </div>
                          )}

                          <button
                            type="button"
                            className="primary-button"
                            onClick={registrarAsistencia}
                          >
                            Confirmar asistencia
                          </button>
                        </div>
                      );
                    })()}

                    {eventoSeleccionado.estado ===
                      'en-curso' && (
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          culminarEvento(
                            eventoSeleccionado.id
                          )
                        }
                      >
                        Culminar evento
                      </button>
                    )}
                  </div>

                  <div className="evento-attendees-summary">
                    <div>
                      <strong>
                        {eventoSeleccionado.asistentes.length}
                      </strong>

                      <span>Asistentes registrados</span>
                    </div>

                    <div>
                      <strong>
                        {eventoSeleccionado.asistentes.reduce(
                          (total, asistente) =>
                            total + asistente.evidencias.length,
                          0
                        )}
                      </strong>

                      <span>Fotos de evidencia</span>
                    </div>
                  </div>

                  {eventoSeleccionado.asistentes.length > 0 && (
                    <div className="evento-attendees-list">
                      <p className="section-label">
                        ASISTENTES
                      </p>

                      {eventoSeleccionado.asistentes.map(
                        (asistente) => (
                          <div
                            className="evento-attendee-row"
                            key={asistente.usuarioId}
                          >
                            <span className="avatar-small">
                              {asistente.nombre
                                .charAt(0)
                                .toUpperCase()}
                            </span>

                            <div>
                              <strong>
                                {asistente.nombre}
                              </strong>

                              <small>
                                {asistente.evidencias.length}{' '}
                                fotos de evidencia
                              </small>
                            </div>

                            <span className="validated-badge">
                              Validada
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        ) : activeTab === 'tareas' ? (
          <section className="tareas-page">
            <div className="page-heading">
              <div>
                <p className="section-label">GESTIÓN OPERATIVA: {parroquiaSeleccionada.toUpperCase()}</p>
                <h2>Tareas y Compromisos</h2>
                <p className="page-description">Seguimiento de tareas comunitarias asignadas por líderes estadales y parroquiales.</p>
              </div>
              <button className="back-button" onClick={() => handleAction('inicio')}>Inicio</button>
            </div>

            {/* Filtros de estado de tareas */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {['Todas', 'Pendientes', 'En Proceso', 'Cumplidas'].map((est) => (
                <button
                  key={est}
                  type="button"
                  onClick={() => {
                    vibrarHaptico();
                    setFiltroEstadoTarea(est);
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    background: filtroEstadoTarea === est ? '#2563eb' : '#f1f5f9',
                    color: filtroEstadoTarea === est ? '#ffffff' : '#475569',
                  }}
                >
                  {est}
                </button>
              ))}
            </div>

            {/* Selector de Parroquia para Estadal / SuperUsuario */}
            {esNivelEstadal && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Filtrar parroquia de tarea:
                </label>
                <select
                  value={filtroParroquiaTarea}
                  onChange={(e) => setFiltroParroquiaTarea(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                >
                  <option value="todas">Ver todas las parroquias de Caracas</option>
                  {parroquiasCaracas.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              className="primary-button"
              style={{ marginBottom: '16px' }}
              onClick={() => {
                vibrarHaptico();
                if (!puedeAsignarTarea) {
                  alert('Seguridad: Tu rol actual no permite asignar tareas.');
                  return;
                }
                setMostrarFormTarea((prev) => !prev);
              }}
            >
              {mostrarFormTarea ? 'Cerrar formulario' : '+ Asignar nueva tarea'}
            </button>

            {mostrarFormTarea && (
              <form className="evento-form-card" onSubmit={crearTarea}>
                <div className="section-title-row">
                  <div>
                    <p className="section-label">NUEVA TAREA ({formularioInicial.rol})</p>
                    <h3>Registrar tarea</h3>
                  </div>
                </div>

                <label className="evento-form-field">
                  <span>Alcance / Parroquia Asignada</span>
                  <select
                    value={formTarea.parroquia}
                    onChange={(e) => setFormTarea((prev) => ({ ...prev, parroquia: e.target.value }))}
                    required
                  >
                    <option value="Todas">Toda Caracas (Estadal)</option>
                    {parroquiasCaracas.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </label>

                <label className="evento-form-field">
                  <span>Título de la tarea</span>
                  <input
                    value={formTarea.titulo}
                    onChange={(e) => setFormTarea((prev) => ({ ...prev, titulo: e.target.value }))}
                    placeholder="Ej. Censo de emprendimientos"
                    required
                  />
                </label>

                <label className="evento-form-field">
                  <span>Comisión responsable</span>
                  <select
                    value={formTarea.comision}
                    onChange={(e) => setFormTarea((prev) => ({ ...prev, comision: e.target.value }))}
                    required
                  >
                    {comisionesDefinicion.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </label>

                <div className="evento-form-grid">
                  <label className="evento-form-field">
                    <span>Prioridad</span>
                    <select
                      value={formTarea.prioridad}
                      onChange={(e) => setFormTarea((prev) => ({ ...prev, prioridad: e.target.value }))}
                    >
                      <option value="Baja">Baja</option>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </label>

                  <label className="evento-form-field">
                    <span>Fecha límite</span>
                    <input
                      type="date"
                      value={formTarea.fechaLimite}
                      onChange={(e) => setFormTarea((prev) => ({ ...prev, fechaLimite: e.target.value }))}
                      required
                    />
                  </label>
                </div>

                <label className="evento-form-field">
                  <span>Responsable o Brigada</span>
                  <input
                    value={formTarea.responsable}
                    onChange={(e) => setFormTarea((prev) => ({ ...prev, responsable: e.target.value }))}
                    placeholder="Ej. Vocería de Producción"
                    required
                  />
                </label>

                <button type="submit" className="primary-button">Guardar tarea</button>
              </form>
            )}

            <div className="eventos-list">
              {tareasFiltradas.length === 0 ? (
                <div className="empty-page evento-empty-state">
                  <span className="empty-icon">✓</span>
                  <h3>No hay tareas registradas en {parroquiaSeleccionada}</h3>
                  <p>Asigna una tarea a la comunidad usando el botón superior.</p>
                </div>
              ) : (
                tareasFiltradas.map((tarea) => (
                  <article className="evento-card" key={tarea.id}>
                    <div className="evento-card-top">
                      <span className={`activity-dot ${tarea.estado === 'Cumplida' ? 'green' : tarea.estado === 'En Proceso' ? 'purple' : 'orange'}`}></span>
                      <span className="evento-level">{tarea.parroquia}</span>
                      <span className="evento-status">{tarea.estado}</span>
                    </div>

                    <h3>{tarea.titulo}</h3>
                    <p className="evento-location">👤 Responsable: {tarea.responsable}</p>
                    <p className="evento-date">◷ Límite: {tarea.fechaLimite} · Prioridad: {tarea.prioridad}</p>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                      {(puedeCambiarEstadoTarea || tarea.responsable === formularioInicial.nombresApellidos) && tarea.estado !== 'En Proceso' && tarea.estado !== 'Cumplida' && (
                        <button type="button" className="secondary-button" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => cambiarEstadoTarea(tarea.id, 'En Proceso')}>
                          Marcar En Proceso
                        </button>
                      )}
                      {(puedeCambiarEstadoTarea || tarea.responsable === formularioInicial.nombresApellidos) && tarea.estado !== 'Cumplida' && (
                        <button type="button" className="primary-button" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => cambiarEstadoTarea(tarea.id, 'Cumplida')}>
                          Marcar Cumplida ✓
                        </button>
                      )}
                      {(esSuperUsuario ||
                        ['Administrador Estadal', 'Coordinador Parroquial', 'Vocero Comunitario'].includes(formularioInicial.rol) ||
                        tarea.responsable === formularioInicial.nombresApellidos) && (
                        <button
                          type="button"
                          style={{
                            fontSize: '12px',
                            padding: '6px 12px',
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                          onClick={() => eliminarTarea(tarea.id)}
                        >
                          🗑️ Eliminar
                        </button>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        ) : activeTab === 'vocerias' ? (
          <section className="vocerias-page">
            <div className="page-heading">
              <div>
                <p className="section-label">ESTRUCTURA COMPLETA DE VOCERÍAS</p>
                <h2>Vocerías y Coordinaciones</h2>
                <p className="page-description">
                  5 Vocerías Principales/Suplentes y las 4 Representaciones Adicionales.
                </p>
              </div>

              <button
                className="back-button"
                onClick={() => handleAction('inicio')}
              >
                Inicio
              </button>
            </div>

            {/* Representaciones Adicionales en Vocerías */}
            <p className="section-label" style={{ marginTop: '12px' }}>COORDINACIONES Y REPRESENTACIONES ADICIONALES</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', margin: '10px 0 20px 0' }}>
              {representacionesAdicionalesDefinicion.map((rep) => (
                <div key={rep.id} style={{ background: '#ffffff', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <span style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '4px' }}>{rep.icon} {rep.nombre}</span>
                  <small style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>{rep.descripcion}</small>
                </div>
              ))}
            </div>

            <p className="section-label">5 VOCERÍAS BASE (PRINCIPAL Y SUPLENTE)</p>
            <div className="vocerias-grid" style={{ marginTop: '10px' }}>
              {voceriasEstructuraDefinicion.map((voceria) => (
                <article
                  className={`voceria-card ${voceria.color}`}
                  key={voceria.id}
                >
                  <div className="voceria-card-top">
                    <span className="voceria-icon">{voceria.icon}</span>
                    <span className="voceria-status">Activa</span>
                  </div>

                  <p className="voceria-state">{parroquiaSeleccionada}</p>
                  <h3>{voceria.nombre}</h3>
                  <p className="voceria-description">
                    └── Principal y Suplente coordinando tareas en la parroquia.
                  </p>

                  <div className="voceria-mesa">
                    <span className="mesa-icon">◎</span>
                    <div>
                      <small>Cumplimiento estimado</small>
                      <strong>{cumplimientoActual[voceria.id] || 0}%</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : activeTab === 'mesas' ? (
          <section className="mesas-page">
            <div className="page-heading">
              <div>
                <p className="section-label">ARTICULACIÓN TERRITORIAL</p>
                <h2>5 Comisiones / Mesas de Trabajo</h2>
                <p className="page-description">
                  Planificación y ejecución operativa del Consejo Popular.
                </p>
              </div>

              <button
                className="back-button"
                onClick={() => handleAction('inicio')}
              >
                Inicio
              </button>
            </div>

            <div className="mesas-list">
              {comisionesDefinicion.map((com, index) => (
                <article className="mesa-row" key={com.id}>
                  <div className={`mesa-number ${com.color}`}>
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="mesa-row-content">
                    <p>{parroquiaSeleccionada}</p>
                    <h3>{com.nombre}</h3>
                    <span>{com.descripcion}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : activeTab === 'admin' ? (
          <section className="admin-page">
            <div className="page-heading">
              <div>
                <p className="section-label">ADMINISTRACIÓN Y CONTROL DE ACCESO</p>
                <h2>Panel de Administración Super Usuario</h2>
                <p className="page-description">
                  Gestión centralizada de usuarios registrados y asignación de roles jerárquicos.
                </p>
              </div>

              <button className="back-button" onClick={() => handleAction('inicio')}>Inicio</button>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
              <strong style={{ color: '#1e3a8a', display: 'block', fontSize: '14px', marginBottom: '4px' }}>ℹ️ Nota de seguridad</strong>
              <p style={{ color: '#1e40af', fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
                Los usuarios que se registran de forma independiente entran con el rol predeterminado de <strong>Integrante Comunitario</strong>. Desde este panel, como Super Usuario / Administrador, puedes autorizar o cambiar su rol a <strong>Vocero Comunitario</strong>, <strong>Coordinador Parroquial</strong> o <strong>Administrador Estadal</strong>.
              </p>
            </div>

            <div className="eventos-summary" style={{ marginBottom: '16px' }}>
              <div className="summary-item">
                <strong>{usuariosRegistrados.length}</strong>
                <span>Usuarios registrados</span>
              </div>
              <div className="summary-item">
                <strong>{usuariosRegistrados.filter((u) => u.rol !== 'Integrante Comunitario').length}</strong>
                <span>Roles asignados</span>
              </div>
            </div>

            <button
              type="button"
              className="primary-button"
              style={{ marginBottom: '16px', background: '#475569' }}
              onClick={cerrarSesionOReiniciarRegistro}
            >
              + Probar nuevo registro (Cerrar sesión)
            </button>

            {/* Filtro y Búsqueda en Panel Admin */}
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '14px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '13px', color: '#1e293b' }}>🔍 Filtrar y Buscar Usuarios Registrados</strong>
                <button
                  type="button"
                  style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#2563eb',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    vibrarHaptico();
                    cargarDatosNube();
                  }}
                >
                  🔄 Actualizar desde la nube
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '2px' }}>Parroquia:</label>
                  <select
                    value={adminFiltroParroquia}
                    onChange={(e) => setAdminFiltroParroquia(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#f8fafc' }}
                  >
                    <option value="todas">🌐 Todas las parroquias ({usuariosRegistrados.length})</option>
                    {parroquiasCaracas.map((p) => {
                      const count = usuariosRegistrados.filter((u) => u.parroquia === p).length;
                      return (
                        <option key={p} value={p}>
                          {p} ({count})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '2px' }}>Buscar por nombre/cédula/telegram:</label>
                  <input
                    type="text"
                    placeholder="Ej. V-12345 o @usuario"
                    value={adminBusquedaTexto}
                    onChange={(e) => setAdminBusquedaTexto(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            <div className="eventos-list">
              {(() => {
                const usuariosFiltrados = usuariosRegistrados.filter((usr) => {
                  const cumpleParroquia = adminFiltroParroquia === 'todas' || usr.parroquia === adminFiltroParroquia;
                  const busqueda = adminBusquedaTexto.toLowerCase().trim();
                  const cumpleBusqueda =
                    !busqueda ||
                    (usr.nombresApellidos && usr.nombresApellidos.toLowerCase().includes(busqueda)) ||
                    (usr.cedula && usr.cedula.toLowerCase().includes(busqueda)) ||
                    (usr.usuarioTelegram && usr.usuarioTelegram.toLowerCase().includes(busqueda));
                  return cumpleParroquia && cumpleBusqueda;
                });

                if (usuariosFiltrados.length === 0) {
                  return (
                    <div className="empty-page evento-empty-state">
                      <span className="empty-icon">👤</span>
                      <h3>No se encontraron usuarios</h3>
                      <p>
                        {adminFiltroParroquia !== 'todas'
                          ? `No hay registros comunitarios para la parroquia ${adminFiltroParroquia}.`
                          : 'Prueba realizar un nuevo registro para probar el flujo de ingreso.'}
                      </p>
                    </div>
                  );
                }

                return usuariosFiltrados.map((usr) => (
                  <article key={usr.id} className="evento-card" style={{ background: '#ffffff' }}>
                    <div className="evento-card-top">
                      <span className={`activity-dot ${usr.rol === 'Administrador Estadal' ? 'blue' : usr.rol === 'Coordinador Parroquial' ? 'purple' : usr.rol === 'Vocero Comunitario' ? 'green' : 'orange'}`}></span>
                      <span className="evento-level">{usr.parroquia}</span>
                      <span className="evento-status">{usr.rol}</span>
                    </div>

                    <h3>👤 {usr.nombresApellidos}</h3>
                    <p className="evento-location">🪪 Cédula: {usr.cedula} · Telegram: <strong>{usr.usuarioTelegram}</strong></p>
                    <p className="evento-date">◷ Registrado el: {usr.fechaRegistro}</p>

                    <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569' }}>
                        ASIGNAR / PROMOVER ROL:
                      </label>
                      <select
                        value={usr.rol}
                        onChange={(e) => cambiarRolDeUsuarioEnSistema(usr.id, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid #2563eb',
                          background: '#f8fafc',
                          fontWeight: '600',
                          color: '#1e293b',
                        }}
                      >
                        <option value="Integrante Comunitario">Integrante Comunitario (Básico)</option>
                        <option value="Vocero Comunitario">Vocero Comunitario (Crear eventos y tareas)</option>
                        <option value="Coordinador Parroquial">Coordinador Parroquial (Gestión parroquial)</option>
                        <option value="Administrador Estadal">Administrador Estadal (Control total)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => eliminarUsuarioEnSistema(usr.id)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #fca5a5',
                          background: '#fef2f2',
                          color: '#dc2626',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        🗑 Eliminar usuario del sistema
                      </button>
                    </div>
                  </article>
                ));
              })()}
            </div>
          </section>
        ) : activeTab === 'emprendimientos' ? (
          <section className="emprendimientos-page">
            <div className="page-heading">
              <div>
                <p className="section-label">RED DE PRODUCCIÓN Y ECONOMÍA LOCAL</p>
                <h2>Emprendimientos Caracas</h2>
                <p className="page-description">
                  Iniciativas, proyectos productivos y comercios populares de las 22 parroquias.
                </p>
              </div>

              <button
                className="back-button"
                onClick={() => handleAction('inicio')}
              >
                Inicio
              </button>
            </div>

            {/* Accesos rápidos de Servicios Populares: Antojos, Mandaditos, MotoPana Express */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
              <div
                onClick={() => setFiltroCategoriaEmp(filtroCategoriaEmp === 'Antojos' ? 'todas' : 'Antojos')}
                style={{
                  background: filtroCategoriaEmp === 'Antojos' ? '#fef3c7' : '#ffffff',
                  border: filtroCategoriaEmp === 'Antojos' ? '2px solid #d97706' : '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '10px 6px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>🍩</div>
                <div style={{ fontWeight: '700', fontSize: '12px', color: '#1e293b' }}>Antojos</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Postres & snacks</div>
              </div>

              <div
                onClick={() => {
                  vibrarHaptico();
                  setPanaCategoriaServicio('mandadito');
                  setVehiculoSeleccionado('moto');
                  setPanaSubTab('solicitar');
                  setMostrarModalMotoPana(true);
                }}
                style={{
                  background: '#e0f2fe',
                  border: '2px solid #0284c7',
                  borderRadius: '12px',
                  padding: '10px 6px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>📦</div>
                <div style={{ fontWeight: '700', fontSize: '12px', color: '#1e293b' }}>Mandaditos</div>
                <div style={{ fontSize: '10px', color: '#0369a1', fontWeight: '600' }}>⚡ Cotizar Envío</div>
              </div>

              <div
                onClick={() => {
                  vibrarHaptico();
                  setPanaSubTab('solicitar');
                  setMostrarModalMotoPana(true);
                }}
                style={{
                  background: '#dcfce7',
                  border: '2px solid #16a34a',
                  borderRadius: '12px',
                  padding: '10px 6px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(22, 163, 74, 0.2)'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>🛵🚗🚚</div>
                <div style={{ fontWeight: '800', fontSize: '11px', color: '#15803d' }}>Pana Móvil</div>
                <div style={{ fontSize: '10px', color: '#166534', fontWeight: '600' }}>Moto·Carro·Carga</div>
              </div>
            </div>

            {/* Banner destacado Pana Móvil: Moto, Carro y Camión de Carga */}
            <div
              style={{
                background: 'linear-gradient(135deg, #15803d 0%, #0f172a 100%)',
                borderRadius: '16px',
                padding: '14px 16px',
                marginBottom: '16px',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '20px' }}>🛵🚗🚚</span>
                  <strong style={{ fontSize: '14px' }}>Pana Móvil Caracas</strong>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '11px', opacity: 0.9 }}>
                  MotoPana, CarroPana y Flete/Carga. Cotiza en mapa GPS y pide al WhatsApp grupal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  vibrarHaptico();
                  setPanaSubTab('solicitar');
                  setMostrarModalMotoPana(true);
                }}
                style={{
                  background: '#ffffff',
                  color: '#15803d',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  flexShrink: 0,
                  marginLeft: '8px'
                }}
              >
                Abrir Red
              </button>
            </div>

            {/* Filtros de Parroquia y Categoría para Emprendimientos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Filtrar Parroquia:
                </label>
                <select
                  value={filtroParroquiaEmp}
                  onChange={(e) => setFiltroParroquiaEmp(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                >
                  <option value="todas">Todas las parroquias</option>
                  {parroquiasCaracas.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Filtrar Categoría:
                </label>
                <select
                  value={filtroCategoriaEmp}
                  onChange={(e) => setFiltroCategoriaEmp(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                >
                  <option value="todas">Todas las categorías</option>
                  <option value="Antojos">🍩 Antojos (Postres y Comida rápida)</option>
                  <option value="Mandaditos">📦 Mandaditos (Diligencias y Envíos)</option>
                  <option value="MotoPana Express">🛵 MotoPana Express (Movilidad en 2 ruedas)</option>
                  <option value="Textil y Calzado">Textil y Calzado</option>
                  <option value="Alimentos y Gastronomía">Alimentos y Gastronomía</option>
                  <option value="Servicios y Reparación">Servicios y Reparación</option>
                  <option value="Artesanía y Cultura">Artesanía y Cultura</option>
                  <option value="Tecnología y Comunicación">Tecnología y Comunicación</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              className="primary-button"
              style={{ marginBottom: '16px' }}
              onClick={() => {
                vibrarHaptico();
                setMostrarFormEmprendimiento((prev) => !prev);
              }}
            >
              {mostrarFormEmprendimiento ? 'Cerrar formulario' : '+ Registrar mi emprendimiento'}
            </button>

            {mostrarFormEmprendimiento && (
              <form className="evento-form-card" onSubmit={crearEmprendimiento}>
                <div className="section-title-row">
                  <div>
                    <p className="section-label">{empEnEdicion ? 'EDITAR EMPRENDIMIENTO' : 'NUEVA INICIATIVA'}</p>
                    <h3>{empEnEdicion ? `Editando: ${empEnEdicion.nombre}` : `Registrar emprendimiento en ${parroquiaSeleccionada}`}</h3>
                  </div>
                </div>

                <label className="evento-form-field">
                  <span>Nombre del emprendimiento</span>
                  <input
                    value={formEmprendimiento.nombre}
                    onChange={(e) => setFormEmprendimiento((prev) => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej. Panadería Artesanal Caricuao"
                    required
                  />
                </label>

                <label className="evento-form-field">
                  <span>Categoría</span>
                  <select
                    value={formEmprendimiento.categoria}
                    onChange={(e) => setFormEmprendimiento((prev) => ({ ...prev, categoria: e.target.value }))}
                  >
                    <option value="Antojos">🍩 Antojos (Postres y Comida rápida)</option>
                    <option value="Mandaditos">📦 Mandaditos (Diligencias y Envíos)</option>
                    <option value="MotoPana Express">🛵 MotoPana Express (Movilidad en 2 ruedas)</option>
                    <option value="Textil y Calzado">Textil y Calzado</option>
                    <option value="Alimentos y Bebidas">Alimentos y Bebidas</option>
                    <option value="Artesanía y Cultura">Artesanía y Cultura</option>
                    <option value="Servicios Comunitarios">Servicios Comunitarios</option>
                    <option value="Tecnología e Innovación">Tecnología e Innovación</option>
                  </select>
                </label>

                <label className="evento-form-field">
                  <span>Responsable</span>
                  <input
                    value={formEmprendimiento.responsable}
                    onChange={(e) => setFormEmprendimiento((prev) => ({ ...prev, responsable: e.target.value }))}
                    placeholder="Nombre del emprendedor"
                    required
                  />
                </label>

                <label className="evento-form-field">
                  <span>Teléfono o contacto</span>
                  <input
                    value={formEmprendimiento.contacto}
                    onChange={(e) => setFormEmprendimiento((prev) => ({ ...prev, contacto: e.target.value }))}
                    placeholder="Ej. 0412-1234567"
                    required
                  />
                </label>

                <label className="evento-form-field">
                  <span>Descripción del proyecto</span>
                  <textarea
                    value={formEmprendimiento.descripcion}
                    onChange={(e) => setFormEmprendimiento((prev) => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Describe los productos o servicios que ofreces"
                    rows="3"
                    required
                  />
                </label>

                <label className="evento-form-field">
                  <span>Fotos de encadenamiento productivo (Entre 3 y 5 imágenes)</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={seleccionarFotosEmprendimiento}
                    required={!empEnEdicion}
                  />
                  <span className="photo-counter" style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                    {empEnEdicion ? 'Opcional: Selecciona nuevas fotos para reemplazar las actuales' : `${fotosEmprendimiento.length} de 3 a 5 fotos seleccionadas`}
                  </span>

                  {fotosEmprendimiento.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginTop: '6px' }}>
                      {fotosEmprendimiento.map((f, i) => (
                        <img key={i} src={f.dataUrl} alt={`Preview ${i}`} style={{ width: '100%', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                      ))}
                    </div>
                  )}
                </label>

                <button type="submit" className="primary-button">
                  {empEnEdicion ? 'Guardar Cambios' : 'Guardar e integrar a la Red'}
                </button>
              </form>
            )}

            <div className="emprendimientos-cards">
              {emprendimientosFiltrados.length === 0 ? (
                <div className="empty-page evento-empty-state">
                  <span className="empty-icon">₿</span>
                  <h3>No hay emprendimientos registrados en {parroquiaSeleccionada}</h3>
                  <p>Sé el primero en registrar una iniciativa productiva en esta parroquia.</p>
                </div>
              ) : (
                emprendimientosFiltrados.map((emp, index) => (
                  <article className="emprendimiento-card" key={emp.id}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <h3>{emp.nombre}</h3>
                    <p style={{ color: '#2563eb', fontWeight: '600', fontSize: '13px' }}>🏷 {emp.categoria} · {emp.parroquia}</p>
                    <p>{emp.descripcion}</p>

                    {Array.isArray(emp.imagenes) && emp.imagenes.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: '6px', margin: '10px 0' }}>
                        {emp.imagenes.map((foto, idx) => (
                          <img
                            key={idx}
                            src={foto}
                            alt={`Foto ${idx + 1}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              vibrarHaptico();
                              setFotoLightboxUrl(foto);
                            }}
                            style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'zoom-in' }}
                          />
                        ))}
                      </div>
                    )}

                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>👤 Responsable: {emp.responsable} · 📞 {emp.contacto}</p>

                    {/* Botón de Pedir Delivery / Envío con MotoPana para Antojos o Emprendimientos */}
                    <div style={{ marginTop: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          vibrarHaptico();
                          setPanaCategoriaServicio('mandadito');
                          setVehiculoSeleccionado('moto');
                          setMotoPanaOrigenCustom(`${emp.nombre} (${emp.parroquia}) - Contacto: ${emp.contacto}`);
                          setMotoPanaNotas(`Delivery de pedido para ${emp.nombre}.`);
                          setPanaSubTab('solicitar');
                          setMostrarModalMotoPana(true);
                        }}
                        style={{
                          width: '100%',
                          background: '#ecfdf5',
                          border: '1px solid #6ee7b7',
                          color: '#047857',
                          borderRadius: '8px',
                          padding: '7px 10px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>🛵</span> Pedir delivery / envío con MotoPana
                      </button>
                    </div>

                    {/* Botones de Edición y Eliminación */}
                    {(esSuperUsuario ||
                      ['Administrador Estadal', 'Coordinador Parroquial'].includes(formularioInicial.rol) ||
                      emp.responsable === formularioInicial.nombresApellidos) && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        <button
                          type="button"
                          className="secondary-button"
                          style={{ fontSize: '12px', padding: '6px 12px', flex: 1 }}
                          onClick={() => iniciarEdicionEmprendimiento(emp)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          type="button"
                          style={{
                            fontSize: '12px',
                            padding: '6px 12px',
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                          onClick={() => eliminarEmprendimiento(emp.id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        ) : activeTab === 'donaciones' ? (
          <section className="donaciones-page">
            <div className="page-heading">
              <div>
                <p className="section-label">AUTOGESTIÓN Y SOLIDARIDAD</p>
                <h2>Fondo de Apoyo Comunitario</h2>
                <p className="page-description">
                  Impulsa las actividades socioculturales, brigadas comunitarias y proyectos productivos de Caracas.
                </p>
              </div>

              <button
                className="back-button"
                onClick={() => handleAction('inicio')}
              >
                Inicio
              </button>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '32px' }}>🤝</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>Apoya el Poder Popular</h3>
                  <small style={{ color: '#64748b' }}>Autonomía y fortalecimiento socioterritorial</small>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Las contribuciones voluntarias financian insumos para jornadas comunitarias, recuperación de espacios públicos, logística de eventos populares y apoyo a emprendimientos comunales en las 22 parroquias de Caracas.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                <span style={{ fontSize: '20px' }}>🛠</span>
                <strong style={{ display: 'block', fontSize: '11px', marginTop: '4px' }}>Jornadas y Obras</strong>
                <small style={{ fontSize: '10px', color: '#64748b' }}>Pintura, bombillos, herramientas.</small>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                <span style={{ fontSize: '20px' }}>🥖</span>
                <strong style={{ display: 'block', fontSize: '11px', marginTop: '4px' }}>Encadenamiento</strong>
                <small style={{ fontSize: '10px', color: '#64748b' }}>Impulso a emprendedores locales.</small>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                <span style={{ fontSize: '20px' }}>📚</span>
                <strong style={{ display: 'block', fontSize: '11px', marginTop: '4px' }}>Formación y Cultura</strong>
                <small style={{ fontSize: '10px', color: '#64748b' }}>Talleres populares y juveniles.</small>
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>Canales de Aporte y Colaboración</h3>
                <span style={{ fontSize: '11px', background: registroCompletado ? '#dcfce7' : '#fef3c7', color: registroCompletado ? '#16a34a' : '#d97706', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                  {registroCompletado ? 'Datos habilitados' : 'Registro Requerido'}
                </span>
              </div>

              {registroCompletado ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                    <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block' }}>📲 Pago Móvil Comunitario</strong>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                      <div>• Banco: <strong>Banco de Venezuela (0102)</strong></div>
                      <div>• Cédula / RIF: <strong>J-50123456-7</strong></div>
                      <div>• Teléfono: <strong>0412-5550199</strong></div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                    <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block' }}>🏛 Cuenta Corriente Bancaria</strong>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                      <div>• Banco de Venezuela: <strong>0102-0123-45-0000123456</strong></div>
                      <div>• Titular: <strong>Fondo de Desarrollo Comunal Caracas</strong></div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                    <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block' }}>🪙 USDT (TRC-20) / Criptoactivos</strong>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px', wordBreak: 'break-all' }}>
                      <code>TX7kCommunityCaracasSupportTRC20Vol99</code>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 8px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <span style={{ fontSize: '28px' }}>🔒</span>
                  <h4 style={{ margin: '8px 0 4px 0', fontSize: '15px' }}>Datos protegidos para la comunidad</h4>
                  <p style={{ fontSize: '12px', color: '#64748b', maxWidth: '340px', margin: '0 auto 14px auto' }}>
                    Para visualizar los datos bancarios y cuentas de apoyo de las brigadas comunales, completa tu registro con cédula y parroquia.
                  </p>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => setMostrarModalRegistro(true)}
                    style={{ maxWidth: '220px', margin: '0 auto', padding: '10px 16px', fontSize: '13px' }}
                  >
                    Registrarme para ver datos
                  </button>
                </div>
              )}
            </div>
          </section>
        ) : activeTab === 'menu' ? (
          <section className="menu-page">
            <div className="page-heading">
              <div>
                <p className="section-label">CENTINELA 2.0</p>
                <h2>Menú Principal</h2>
                <p className="page-description">Accede a todos los módulos y opciones del sistema.</p>
              </div>

              <button className="back-button" onClick={() => handleAction('inicio')}>Inicio</button>
            </div>

            {/* Ficha de Perfil del Usuario */}
            <div className="organization-card" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '20px' }}>
                  {(formularioInicial.nombresApellidos || 'U').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '16px', color: '#1e293b' }}>{formularioInicial.nombresApellidos || 'Usuario'}</strong>
                  <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>🪪 {formularioInicial.cedula || 'Sin cédula'} · {formularioInicial.usuarioTelegram || '@usuario'}</span>
                  <span style={{ display: 'block', fontSize: '12px', color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>
                    📍 {formularioInicial.parroquia || 'Caricuao'}, {formularioInicial.estado || 'Caracas'}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>Rol en el sistema:</span>
                <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>
                  {formularioInicial.rol}
                </span>
              </div>
            </div>

            {/* Comunicados Jerárquicos en Sección Menú */}
            {puedeEnviarComunicado && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: '#1e40af' }}>📢 Difusión y Comunicados Oficiales</strong>
                  <span style={{ fontSize: '11px', background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                    {formularioInicial.rol}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#3b82f6', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                  {formularioInicial.rol === 'Super Usuario'
                    ? 'Como Super Usuario puedes emitir comunicados a toda Caracas o seleccionar parroquias específicas.'
                    : formularioInicial.rol === 'Administrador Estadal'
                    ? 'Puedes enviar convocatorias a todo el estado o a parroquias coordinadas.'
                    : 'Puedes emitir avisos a los integrantes registrados en tu parroquia.'}
                </p>
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    vibrarHaptico();
                    setMostrarModalComunicado(true);
                  }}
                >
                  🚀 Redactar y emitir comunicado
                </button>
              </div>
            )}

            {/* Módulos Principales */}
            <p className="section-label" style={{ marginBottom: '10px' }}>MÓDULOS DE TRABAJO</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {[
                { tab: 'feed', icon: '▣', title: 'Feed Stadal', desc: 'Novedades y eventos culminados' },
                { tab: 'territorio', icon: '⌂', title: 'Mi Territorio', desc: 'Mapa y las 22 parroquias' },
                { tab: 'vocerias', icon: '◎', title: 'Vocerías', desc: '5 Vocerías y Representaciones' },
                { tab: 'mesas', icon: '☷', title: 'Comisiones', desc: '5 Mesas de trabajo operativas' },
                { tab: 'eventos', icon: '◷', title: 'Eventos', desc: 'Convocatorias, QR y fotos' },
                { tab: 'tareas', icon: '✓', title: 'Tareas', desc: 'Compromisos comunitarios' },
                { tab: 'reportes', icon: '▤', title: 'Reportes', desc: 'Diagnóstico de servicios' },
                { tab: 'emprendimientos', icon: '₿', title: 'Emprendimientos', desc: 'Red de producción local' },
                ...(esSuperUsuario ? [{ tab: 'admin', icon: '⚙', title: 'Panel Admin', desc: 'Gestión de roles y usuarios' }] : []),
              ].map((item) => (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => handleAction(item.tab)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '14px',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '24px', marginBottom: '6px' }}>{item.icon}</span>
                  <strong style={{ fontSize: '13px', color: '#1e293b' }}>{item.title}</strong>
                  <small style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{item.desc}</small>
                </button>
              ))}
            </div>

            {/* Info del Sistema */}
            <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <strong style={{ fontSize: '12px', color: '#475569', display: 'block' }}>Centinela 2.0 · Telegram Mini App</strong>
              <small style={{ fontSize: '11px', color: '#94a3b8' }}>Plataforma de Organización Popular de Caracas</small>
            </div>
          </section>
        ) : null}
      {renderModalRegistro()}
      </main>

      {toasts.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100005,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '90%',
            maxWidth: '380px',
            pointerEvents: 'none',
          }}
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              style={{
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '600',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                animation: 'aparecerDetalle 0.2s ease-out',
              }}
            >
              <span>{toast.mensaje}</span>
            </div>
          ))}
        </div>
      )}

      {fotoLightboxUrl && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100000,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box',
          }}
          onClick={() => setFotoLightboxUrl(null)}
        >
          <button
            onClick={() => setFotoLightboxUrl(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              color: '#ffffff',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
          <img
            src={fotoLightboxUrl}
            alt="Visor de Fotografía"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      )}

      {mostrarModalRol && (
        <div className="detail-overlay" onClick={() => setMostrarModalRol(false)}>
          <div className="detail-bubble" onClick={(e) => e.stopPropagation()}>
            <div className="bubble-handle"></div>
            <div className="detail-panel-header">
              <div>
                <p className="section-label">INFORMACIÓN DE ROL Y ACCESO</p>
                <h3>{esSuperUsuario ? 'Gestión de Rol (Super Usuario)' : 'Rol del Usuario'}</h3>
              </div>
              <button className="close-button" onClick={() => setMostrarModalRol(false)}>×</button>
            </div>

            {esSuperUsuario ? (
              <>
                <p className="bubble-description">
                  Como <strong>Super Usuario</strong>, puedes cambiar libremente de rol para probar las funciones y accesos de la aplicación.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                  {[
                    { rol: 'Super Usuario', desc: 'Acceso total y Panel Admin de control' },
                    { rol: 'Administrador Estadal', desc: 'Gestión completa del estado' },
                    { rol: 'Coordinador Parroquial', desc: 'Gestión y eventos parroquiales' },
                    { rol: 'Vocero Comunitario', desc: 'Creación de eventos y tareas' },
                    { rol: 'Integrante Comunitario', desc: 'Rol básico para usuarios registrados' },
                  ].map((item) => (
                    <button
                      key={item.rol}
                      type="button"
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: formularioInicial.rol === item.rol ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        background: formularioInicial.rol === item.rol ? '#eff6ff' : '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                      onClick={() => cambiarRolUsuario(item.rol)}
                    >
                      <strong style={{ display: 'block', fontSize: '13px', color: '#1e293b' }}>{item.rol}</strong>
                      <small style={{ fontSize: '11px', color: '#64748b' }}>{item.desc}</small>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ padding: '12px 0' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Tu rol asignado actual:</span>
                  <h4 style={{ margin: '4px 0 0 0', color: '#1d4ed8', fontSize: '16px' }}>👤 {formularioInicial.rol}</h4>
                  <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                    🔒 El cambio de rol está restringido para Integrantes Comunitarios.
                  </p>
                </div>

                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '14px' }}>
                  <strong style={{ fontSize: '12px', color: '#1e40af', display: 'block', marginBottom: '6px' }}>
                    🔑 Acceso Administrador (Super Usuario)
                  </strong>
                  <p style={{ fontSize: '11px', color: '#3b82f6', marginBottom: '10px' }}>
                    Introduce la clave de acceso especial para activar los permisos de Super Usuario en esta sesión:
                  </p>
                  <button
                    type="button"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#2563eb',
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      const clave = prompt('Introduce la clave de Super Usuario:');
                      if (clave === 'centinela2026' || clave === 'admin' || clave === '1234') {
                        cambiarRolUsuario('Super Usuario');
                        alert('¡Acceso concedido como Super Usuario!');
                      } else if (clave !== null) {
                        alert('Clave incorrecta. Acceso denegado.');
                      }
                    }}
                  >
                    🔓 Activar Super Usuario con PIN / Clave
                  </button>
                </div>
              </div>
            )}

            {esSuperUsuario && (
              <button
                type="button"
                style={{
                  marginTop: '12px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#dc2626',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
                onClick={cerrarSesionOReiniciarRegistro}
              >
                🚪 Probar nuevo registro (Cerrar sesión)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal Edición de Evento */}
      {eventoEnEdicion && (
        <div className="detail-overlay" onClick={() => setEventoEnEdicion(null)}>
          <div className="detail-bubble" onClick={(e) => e.stopPropagation()}>
            <div className="bubble-handle"></div>
            <div className="detail-panel-header">
              <div>
                <p className="section-label">MODIFICACIÓN DE EVENTO</p>
                <h3>Editar Evento</h3>
              </div>
              <button className="close-button" onClick={() => setEventoEnEdicion(null)}>×</button>
            </div>

            <form onSubmit={guardarEdicionEvento} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '2px' }}>Nombre del evento:</label>
                <input
                  type="text"
                  value={eventoEnEdicion.titulo}
                  onChange={(e) => setEventoEnEdicion({ ...eventoEnEdicion, titulo: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '2px' }}>Fecha:</label>
                  <input
                    type="date"
                    value={eventoEnEdicion.fecha}
                    onChange={(e) => setEventoEnEdicion({ ...eventoEnEdicion, fecha: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '2px' }}>Hora inicio:</label>
                  <input
                    type="time"
                    value={eventoEnEdicion.horaInicio}
                    onChange={(e) => setEventoEnEdicion({ ...eventoEnEdicion, horaInicio: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '2px' }}>Lugar exacto:</label>
                <input
                  type="text"
                  value={eventoEnEdicion.lugar}
                  onChange={(e) => setEventoEnEdicion({ ...eventoEnEdicion, lugar: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '2px' }}>Descripción:</label>
                <textarea
                  rows="3"
                  value={eventoEnEdicion.descripcion}
                  onChange={(e) => setEventoEnEdicion({ ...eventoEnEdicion, descripcion: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>

              <button type="submit" className="primary-button" style={{ marginTop: '6px' }}>
                💾 Guardar cambios
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Emisión de Comunicados / Mensajes Jerárquicos */}
      {mostrarModalComunicado && (
        <div className="detail-overlay" onClick={() => setMostrarModalComunicado(false)}>
          <div className="detail-bubble" onClick={(e) => e.stopPropagation()}>
            <div className="bubble-handle"></div>
            <div className="detail-panel-header">
              <div>
                <p className="section-label">DIFUSIÓN ESTRATÉGICA</p>
                <h3>Emitir Comunicado Oficial</h3>
              </div>
              <button className="close-button" onClick={() => setMostrarModalComunicado(false)}>×</button>
            </div>

            <form onSubmit={enviarComunicadoMensaje} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Alcance del mensaje:
                </label>
                <select
                  value={formComunicado.alcance}
                  onChange={(e) => setFormComunicado({ ...formComunicado, alcance: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  {formularioInicial.rol === 'Super Usuario' && (
                    <option value="todos">🌐 Toda Caracas (Todos los usuarios)</option>
                  )}
                  {['Super Usuario', 'Administrador Estadal'].includes(formularioInicial.rol) && (
                    <option value="estado">🏛 Todo el Estado / Municipio</option>
                  )}
                  <option value="parroquia">📍 Parroquia Específica</option>
                </select>
              </div>

              {formComunicado.alcance === 'parroquia' && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Parroquia destino:
                  </label>
                  <select
                    value={formComunicado.parroquiaEspecifica}
                    onChange={(e) => setFormComunicado({ ...formComunicado, parroquiaEspecifica: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    {parroquiasCaracas.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Contenido del comunicado:
                </label>
                <textarea
                  rows="4"
                  value={formComunicado.mensaje}
                  onChange={(e) => setFormComunicado({ ...formComunicado, mensaje: e.target.value })}
                  placeholder="Escribe el mensaje o indicación oficial para las bases..."
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <button
                type="submit"
                className="primary-button"
                style={{ marginTop: '8px' }}
              >
                🚀 Publicar comunicado en vivo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Interactivo Pana Móvil: Moto, Carro & PanaCarga (Camión) */}
      {mostrarModalMotoPana && (
        <div className="detail-overlay" onClick={() => setMostrarModalMotoPana(false)}>
          <div className="detail-bubble" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '92vh', overflowY: 'auto' }}>
            <div className="bubble-handle"></div>
            <div className="detail-panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '26px' }}>{infoVehiculoActivo.icono}</span>
                <div>
                  <p className="section-label" style={{ color: '#16a34a' }}>RED COMUNITARIA DE TRANSPORTE</p>
                  <h3>Pana Móvil Caracas</h3>
                </div>
              </div>
              <button className="close-button" onClick={() => setMostrarModalMotoPana(false)}>×</button>
            </div>

            {/* Sub-pestañas: Solicitar Servicio, Muro de Carreras / Pedidos, Registro de Transportistas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', margin: '10px 0 14px 0' }}>
              <button
                type="button"
                onClick={() => { vibrarHaptico(); setPanaSubTab('solicitar'); }}
                style={{
                  padding: '8px 4px',
                  borderRadius: '8px',
                  border: panaSubTab === 'solicitar' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                  background: panaSubTab === 'solicitar' ? '#dcfce7' : '#ffffff',
                  color: panaSubTab === 'solicitar' ? '#15803d' : '#475569',
                  fontWeight: panaSubTab === 'solicitar' ? '700' : '500',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                📍 Pedir Servicio
              </button>

              <button
                type="button"
                onClick={() => { vibrarHaptico(); setPanaSubTab('solicitudes'); }}
                style={{
                  padding: '8px 4px',
                  borderRadius: '8px',
                  border: panaSubTab === 'solicitudes' || panaSubTab === 'muro' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: panaSubTab === 'solicitudes' || panaSubTab === 'muro' ? '#dbeafe' : '#ffffff',
                  color: panaSubTab === 'solicitudes' || panaSubTab === 'muro' ? '#1d4ed8' : '#475569',
                  fontWeight: panaSubTab === 'solicitudes' || panaSubTab === 'muro' ? '700' : '500',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                🚖 Carreras ({solicitudesPana.filter((s) => s.estado === 'en-espera').length})
              </button>

              <button
                type="button"
                onClick={() => { vibrarHaptico(); setPanaSubTab('registro'); }}
                style={{
                  padding: '8px 4px',
                  borderRadius: '8px',
                  border: panaSubTab === 'registro' ? '2px solid #d97706' : '1px solid #cbd5e1',
                  background: panaSubTab === 'registro' ? '#fef3c7' : '#ffffff',
                  color: panaSubTab === 'registro' ? '#b45309' : '#475569',
                  fontWeight: panaSubTab === 'registro' ? '700' : '500',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                🪪 Afiliarse
              </button>
            </div>

            {panaSubTab === 'solicitar' && (
              <div className="motopana-container">
                {/* Selector de tipo de vehículo: MotoPana, CarroPana, PanaCarga */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
                  {Object.values(TIPOS_VEHICULO_PANA).map((veh) => {
                    const seleccionado = vehiculoSeleccionado === veh.id;
                    return (
                      <div
                        key={veh.id}
                        onClick={() => { vibrarHaptico(); setVehiculoSeleccionado(veh.id); }}
                        style={{
                          background: seleccionado ? '#f0fdf4' : '#ffffff',
                          border: seleccionado ? '2px solid #16a34a' : '1px solid #cbd5e1',
                          borderRadius: '10px',
                          padding: '8px 4px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontSize: '22px' }}>{veh.icono}</div>
                        <div style={{ fontWeight: '700', fontSize: '11px', color: seleccionado ? '#15803d' : '#1e293b' }}>
                          {veh.nombre}
                        </div>
                        <div style={{ fontSize: '9px', color: '#64748b' }}>
                          desde ${veh.minimo.toFixed(1)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selector de Categoría de Servicio: Pasajeros / Viaje o Mandadito / Encomienda */}
                <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                  <button
                    type="button"
                    onClick={() => { vibrarHaptico(); setPanaCategoriaServicio('viaje'); }}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '6px',
                      border: 'none',
                      background: panaCategoriaServicio === 'viaje' ? '#ffffff' : 'transparent',
                      color: panaCategoriaServicio === 'viaje' ? '#0f172a' : '#64748b',
                      fontWeight: '700',
                      fontSize: '11px',
                      cursor: 'pointer',
                      boxShadow: panaCategoriaServicio === 'viaje' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    👤 Traslado / Pasajeros
                  </button>
                  <button
                    type="button"
                    onClick={() => { vibrarHaptico(); setPanaCategoriaServicio('mandadito'); }}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '6px',
                      border: 'none',
                      background: panaCategoriaServicio === 'mandadito' ? '#ffffff' : 'transparent',
                      color: panaCategoriaServicio === 'mandadito' ? '#0f172a' : '#64748b',
                      fontWeight: '700',
                      fontSize: '11px',
                      cursor: 'pointer',
                      boxShadow: panaCategoriaServicio === 'mandadito' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    📦 Mandadito / Encomienda
                  </button>
                </div>

                {/* Selector táctil en mapa: Modo para fijar A o fijar B */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}>
                  <span style={{ color: '#475569', fontWeight: '600' }}>
                    👉 Toca en el mapa para ubicar:
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setModoSeleccionMapa('A')}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: modoSeleccionMapa === 'A' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                        background: modoSeleccionMapa === 'A' ? '#dcfce7' : '#ffffff',
                        color: modoSeleccionMapa === 'A' ? '#15803d' : '#475569',
                        fontWeight: '700',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      🟢 Punto A (Origen)
                    </button>
                    <button
                      type="button"
                      onClick={() => setModoSeleccionMapa('B')}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: modoSeleccionMapa === 'B' ? '2px solid #d97706' : '1px solid #cbd5e1',
                        background: modoSeleccionMapa === 'B' ? '#fef3c7' : '#ffffff',
                        color: modoSeleccionMapa === 'B' ? '#b45309' : '#475569',
                        fontWeight: '700',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      🏁 Punto B (Destino)
                    </button>
                  </div>
                </div>

                {/* Mapa Interactivo Leaflet Real estilo Waze / Google Maps */}
                <div style={{ marginTop: '4px', marginBottom: '4px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                    fontSize: '11px',
                    color: '#64748b',
                    fontWeight: '600'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                      {conductoresPana.filter((c) => c.tipoVehiculo === vehiculoSeleccionado).length} {infoVehiculoActivo.nombre} en servicio
                    </span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>🗺️ Calles y avenidas de Caracas</span>
                  </div>

                  <MapaPanaCaracas
                    origenCoords={origenCoords}
                    destinoCoords={destinoCoords}
                    modoSeleccionMapa={modoSeleccionMapa}
                    onSeleccionarCoords={(coords) => {
                      vibrarHaptico();
                      if (modoSeleccionMapa === 'A') {
                        setMotoPanaGpsCoords(coords);
                        setMotoPanaGpsActivo(true);
                        setMotoPanaOrigenCustom(`Coordenadas: ${coords.lat}, ${coords.lon}`);
                        mostrarToast('✓ Punto A fijado en el mapa');
                      } else {
                        setMotoPanaDestinoCoords(coords);
                        setMotoPanaDestinoCustom(`Coordenadas: ${coords.lat}, ${coords.lon}`);
                        mostrarToast('✓ Punto B fijado en el mapa');
                      }
                    }}
                    conductores={conductoresPana.filter((c) => c.tipoVehiculo === vehiculoSeleccionado)}
                    infoVehiculo={infoVehiculoActivo}
                  />
                </div>

              {/* Selector de Origen (Punto A) */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>📍</span> PUNTO A (ORIGEN):
                  </label>
                  <button
                    type="button"
                    onClick={activarGpsMotoPana}
                    disabled={motoPanaGpsCargando}
                    style={{
                      background: motoPanaGpsActivo ? '#dcfce7' : '#ffffff',
                      border: motoPanaGpsActivo ? '1px solid #16a34a' : '1px solid #cbd5e1',
                      color: motoPanaGpsActivo ? '#15803d' : '#475569',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {motoPanaGpsCargando ? '🛰️ Buscando...' : motoPanaGpsActivo ? '✓ GPS Activo' : '🛰️ Usar mi GPS'}
                  </button>
                </div>

                {!motoPanaGpsActivo ? (
                  <select
                    value={motoPanaOrigenId}
                    onChange={(e) => setMotoPanaOrigenId(e.target.value)}
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginBottom: '6px' }}
                  >
                    {puntosCaracasGPS.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre} ({p.parroquia})</option>
                    ))}
                  </select>
                ) : (
                  <div style={{ padding: '8px', background: '#dcfce7', borderRadius: '8px', fontSize: '12px', color: '#166534', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>📍 Coordenadas: {motoPanaGpsCoords?.lat.toFixed(4)}, {motoPanaGpsCoords?.lon.toFixed(4)}</span>
                    <button
                      type="button"
                      onClick={() => setMotoPanaGpsActivo(false)}
                      style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                    >
                      Cambiar a lista
                    </button>
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Referencia exacta (ej. Frente al metro, esquina de la panadería...)"
                  value={motoPanaOrigenCustom}
                  onChange={(e) => setMotoPanaOrigenCustom(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>

              {/* Selector de Destino (Punto B) */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  <span>🏁</span> PUNTO B (DESTINO):
                </label>
                <select
                  value={motoPanaDestinoId}
                  onChange={(e) => setMotoPanaDestinoId(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginBottom: '6px' }}
                >
                  {puntosCaracasGPS.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre} ({p.parroquia})</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Referencia destino (ej. Torre B piso 4, al lado de la farmacia...)"
                  value={motoPanaDestinoCustom}
                  onChange={(e) => setMotoPanaDestinoCustom(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>

              {/* Banner de Promoción 1er Uso 40% OFF */}
              {primerUsoPana && (
                <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '1px solid #f59e0b', borderRadius: '10px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '22px' }}>🎁</span>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '12px', color: '#b45309' }}>
                      ¡40% DE DESCUENTO EN TU PRIMER VIAJE!
                    </div>
                    <div style={{ fontSize: '10px', color: '#78350f' }}>
                      Promoción de bienvenida comunitaria aplicada a tu tarifa.
                    </div>
                  </div>
                </div>
              )}

              {/* Tarjeta de Resumen y Cotización */}
              <div className="motopana-fare-card">
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>
                    Tarifa {primerUsoPana ? 'con 40% OFF' : 'estimada'} {infoVehiculoActivo.nombre}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <div style={{ fontSize: '26px', fontWeight: '800', lineHeight: '1.2' }}>
                      ${tarifaUsd.toFixed(2)} <span style={{ fontSize: '14px', fontWeight: '500' }}>USD</span>
                    </div>
                    {primerUsoPana && (
                      <span style={{ fontSize: '13px', textDecoration: 'line-through', opacity: 0.75 }}>
                        ${tarifaBaseUsd.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.85 }}>
                    ≈ Bs. {tarifaBs.toLocaleString('es-VE')}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700' }}>
                    {infoVehiculoActivo.icono} ~{tiempoEstimadoMinutos} min
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>
                    📏 {distanciaCalculadaKm} km de ruta
                  </div>
                  {primerUsoPana && (
                    <span style={{ display: 'inline-block', background: '#22c55e', color: '#ffffff', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' }}>
                      AHORRAS 40%
                    </span>
                  )}
                </div>
              </div>

              {/* Notas del viaje */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Instrucciones o requerimientos:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Llevar 2 cascos, llevo paquete mediano, no tengo sencillo..."
                  value={motoPanaNotas}
                  onChange={(e) => setMotoPanaNotas(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>

              {/* Configuración de Grupo o WhatsApp de Despacho */}
              <details style={{ background: '#f1f5f9', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#475569' }}>
                <summary style={{ cursor: 'pointer', fontWeight: '600' }}>
                  ⚙️ Configuración del Grupo / Central de Mototaxis
                </summary>
                <div style={{ marginTop: '8px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '2px' }}>
                    Enlace de grupo de WhatsApp o número telefónico:
                  </label>
                  <input
                    type="text"
                    value={motoPanaWhatsappDestino}
                    onChange={(e) => setMotoPanaWhatsappDestino(e.target.value)}
                    placeholder="https://chat.whatsapp.com/... o número con código de país"
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                  />
                </div>
              </details>

              {motoPanaCopiado && (
                <div style={{ background: '#dcfce7', color: '#15803d', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>
                  ✓ ¡Detalles de la carrera copiados al portapapeles! Abriendo WhatsApp...
                </div>
              )}

              {/* Botones de Acción Dinámicos: Iniciar Viaje / Iniciar Pedido y WhatsApp */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={crearSolicitudTransporte}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px',
                    fontWeight: '800',
                    fontSize: '15px',
                    letterSpacing: '0.3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <span>{panaCategoriaServicio === 'mandadito' ? '📦' : '🚀'}</span>
                  <span>{panaCategoriaServicio === 'mandadito' ? 'INICIAR PEDIDO' : 'INICIAR VIAJE'}</span>
                </button>

                <button
                  type="button"
                  onClick={enviarSolicitudWhatsAppMotoPana}
                  style={{
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)'
                  }}
                >
                  <span>📲</span> Despachar al Grupo de WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* Sub-pestaña: Bolsa de Carreras / Pedidos Comunitarios (Acceso para Transportistas Afiliados y Administradores) */}
          {(panaSubTab === 'solicitudes' || panaSubTab === 'muro') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block' }}>Bolsa de Carreras y Encomiendas</strong>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Acceso exclusivo para transportistas afiliados y administradores</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPanaSubTab('solicitar')}
                  style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  + Nueva Solicitud
                </button>
              </div>

              {!registroCompletado || !esConductorOAdmin() ? (
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fef3c7',
                  borderRadius: '12px',
                  padding: '20px 16px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔒</div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#92400e', fontSize: '15px' }}>Acceso Restringido a Transportistas y Administradores</h4>
                  <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#b45309', lineHeight: 1.5 }}>
                    Por seguridad y privacidad de los usuarios, las solicitudes y datos de contacto solo son visibles para los conductores afiliados (Moto, Carro o Carga) y administradores estadales.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setPanaSubTab('registro')}
                      style={{
                        background: '#d97706',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      🪪 Afiliarme como Conductor
                    </button>
                    {!registroCompletado && (
                      <button
                        type="button"
                        onClick={() => setMostrarModalRegistro(true)}
                        style={{
                          background: '#2563eb',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 14px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        ✍️ Registrarme
                      </button>
                    )}
                  </div>
                </div>
              ) : solicitudesPana.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', background: '#ffffff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <span style={{ fontSize: '32px' }}>📭</span>
                  <h4 style={{ margin: '8px 0 4px 0' }}>No hay carreras pendientes</h4>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>Cuando un usuario solicite un traslado o encomienda aparecerá aquí.</p>
                </div>
              ) : (
                solicitudesPana.map((sol) => {
                  const vehiculo = TIPOS_VEHICULO_PANA[sol.tipoVehiculo] || TIPOS_VEHICULO_PANA.moto;
                  const esAceptado = sol.estado === 'aceptado';
                  return (
                    <div
                      key={sol.id}
                      style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        padding: '12px',
                        border: esAceptado ? '2px solid #16a34a' : '1px solid #e2e8f0',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '20px' }}>{vehiculo.icono}</span>
                          <div>
                            <strong style={{ fontSize: '13px', color: '#1e293b' }}>
                              {sol.categoria === 'mandadito' ? '📦 Mandadito / Encomienda' : '👤 Viaje Comunitario'}
                            </strong>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>
                              Solicitado por {sol.pasajero} ({sol.contacto}) · {sol.fechaHora}
                            </div>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: esAceptado ? '#dcfce7' : '#fef3c7',
                            color: esAceptado ? '#15803d' : '#b45309'
                          }}
                        >
                          {esAceptado ? '✓ Aceptado' : '⏳ En espera'}
                        </span>
                      </div>

                      <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', fontSize: '12px', marginBottom: '8px' }}>
                        <div><strong style={{ color: '#16a34a' }}>A (Origen):</strong> {sol.origen}</div>
                        <div style={{ marginTop: '2px' }}><strong style={{ color: '#d97706' }}>B (Destino):</strong> {sol.destino}</div>
                        {sol.notas && (
                          <div style={{ marginTop: '4px', fontStyle: 'italic', color: '#475569' }}>
                            💬 "{sol.notas}"
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                        <div>
                          <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                            ${sol.precioUsd.toFixed(2)} USD
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>
                            ≈ Bs. {sol.precioBs.toLocaleString('es-VE')} ({sol.distanciaKm} km)
                          </span>
                        </div>

                        {!esAceptado ? (
                          <button
                            type="button"
                            onClick={() => aceptarSolicitudTransporte(sol.id)}
                            style={{
                              background: '#16a34a',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '7px 12px',
                              fontSize: '12px',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            🤝 Aceptar Servicio
                          </button>
                        ) : (
                          <div style={{ fontSize: '11px', color: '#15803d', fontWeight: '600' }}>
                            Asignado a: {sol.conductorAsignado}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Sub-pestaña: Registro de Transportistas (Moto, Carro, Camión) */}
          {panaSubTab === 'registro' && (
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>Afiliación de Transportistas Comunitarios</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                  Únete a la red comunitaria con tu moto, vehículo particular o camión de carga en Caracas.
                </p>
              </div>

              <form onSubmit={registrarConductorPana} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '2px' }}>
                    Tipo de Vehículo:
                  </label>
                  <select
                    value={formNuevoConductor.tipoVehiculo}
                    onChange={(e) => setFormNuevoConductor({ ...formNuevoConductor, tipoVehiculo: e.target.value })}
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="moto">🛵 MotoPana (Mototaxi / Delivery)</option>
                    <option value="carro">🚗 CarroPana (Vehículo particular / Traslado)</option>
                    <option value="camion">🚚 PanaCarga (Camión / Camioneta de Flete)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '2px' }}>
                    Nombre y Apellidos:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={formNuevoConductor.nombre}
                    onChange={(e) => setFormNuevoConductor({ ...formNuevoConductor, nombre: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '2px' }}>
                      Teléfono WhatsApp:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="0412-1234567"
                      value={formNuevoConductor.telefono}
                      onChange={(e) => setFormNuevoConductor({ ...formNuevoConductor, telefono: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '2px' }}>
                      Parroquia base:
                    </label>
                    <select
                      value={formNuevoConductor.parroquia}
                      onChange={(e) => setFormNuevoConductor({ ...formNuevoConductor, parroquia: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    >
                      {parroquiasCaracas.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '2px' }}>
                      Modelo y Color:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Empire Horse Rojo"
                      value={formNuevoConductor.modelo}
                      onChange={(e) => setFormNuevoConductor({ ...formNuevoConductor, modelo: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '2px' }}>
                      Placa del Vehículo:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. AB1C23D"
                      value={formNuevoConductor.placa}
                      onChange={(e) => setFormNuevoConductor({ ...formNuevoConductor, placa: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    background: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginTop: '6px'
                  }}
                >
                  ✓ Registrarme como Transportista Comunitario
                </button>
              </form>

              {/* Lista de Transportistas Registrados */}
              <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <strong style={{ fontSize: '12px', color: '#334155', display: 'block', marginBottom: '8px' }}>
                  Transportistas Activos en la Red ({conductoresPana.length}):
                </strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                  {conductoresPana.map((c) => {
                    const veh = TIPOS_VEHICULO_PANA[c.tipoVehiculo] || TIPOS_VEHICULO_PANA.moto;
                    return (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#f8fafc', borderRadius: '8px', fontSize: '11px' }}>
                        <div>
                          <strong>{veh.icono} {c.nombre}</strong> · {c.modelo} ({c.placa})
                          <div style={{ color: '#64748b' }}>📍 {c.parroquia} · 📞 {c.telefono}</div>
                        </div>
                        <span style={{ color: '#16a34a', fontWeight: 'bold' }}>⭐ {c.calificacion}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      )}

      <nav className="bottom-navigation">
        <NavButton
          icon="⌂"
          label="Inicio"
          active={activeTab === 'inicio'}
          onClick={() => handleAction('inicio')}
        />
        <NavButton
          icon="▣"
          label="Feed"
          active={activeTab === 'feed'}
          onClick={() => handleAction('feed')}
        />
        <NavButton
          icon="🛍️"
          label="Emprendimientos"
          active={activeTab === 'emprendimientos'}
          onClick={() => handleAction('emprendimientos')}
        />
        <NavButton
          icon="📅"
          label="Eventos"
          active={activeTab === 'eventos'}
          onClick={() => handleAction('eventos')}
        />
        <NavButton
          icon="☰"
          label="Menú"
          active={activeTab === 'menu'}
          onClick={() => handleAction('menu')}
        />
      </nav>
    </div>
  );
}

function AnilloProgresoCircular({ porcentaje, color, label }) {
  const radio = 18;
  const circunferencia = 2 * Math.PI * radio;
  const offset = circunferencia - (porcentaje / 100) * circunferencia;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <svg width="50" height="50" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={radio} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle
          cx="24"
          cy="24"
          r={radio}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circunferencia}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">
          {porcentaje}%
        </text>
      </svg>
      <span style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', fontWeight: '600' }}>{label}</span>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      className={`nav-button ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <span>{icon}</span>
      <small>{label}</small>
    </button>
  );
}


export default App;
