import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@supabase/supabase-js';
import './index.css';

const SUPABASE_URL = 'https://vpbaoampqlzzcrplsfht.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_nNifwa3tsRiY9SHL0F8P-Q_Pg2c7eh5';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

const quickActionsBase = [
  { icon: '▣', label: 'Feed nacional', tab: 'feed' },
  { icon: '⌂', label: 'Mi territorio', tab: 'territorio' },
  { icon: '◎', label: 'Vocerías', tab: 'vocerias' },
  { icon: '☷', label: 'Mesas de trabajo', tab: 'mesas' },
  { icon: '◷', label: 'Eventos', tab: 'eventos' },
  { icon: '✓', label: 'Tareas', tab: 'tareas' },
  { icon: '▤', label: 'Reportes', tab: 'reportes' },
  { icon: '₿', label: 'Emprendimientos', tab: 'emprendimientos' },
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

  const handleAction = (tab) => {
    vibrarHaptico();
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
    cargarDatosNube();
  };

  if (!registroCompletado) {
    return (
      <div style={{ minHeight: '100vh', padding: '24px', background: '#f4f7fb', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto', padding: '24px', background: '#ffffff', borderRadius: '18px', boxShadow: '0 4px 18px rgba(0, 0, 0, 0.08)' }}>
          <h1 style={{ marginTop: 0 }}>Completa tu registro</h1>
          <p style={{ color: '#5f6b7a', lineHeight: 1.5 }}>
            Antes de entrar a Centinela 2.0 necesitamos tus datos y asignación de rol.
          </p>
          <form onSubmit={guardarRegistroInicial}>
            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Cédula</span>
              <input name="cedula" value={formularioInicial.cedula} onChange={actualizarFormulario} required placeholder="Ej. V-12345678" style={{ display: 'block', width: '100%', marginTop: '6px', padding: '12px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '10px' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Nombres y apellidos</span>
              <input name="nombresApellidos" value={formularioInicial.nombresApellidos} onChange={actualizarFormulario} required placeholder="Escribe tus nombres y apellidos" style={{ display: 'block', width: '100%', marginTop: '6px', padding: '12px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '10px' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Usuario de Telegram</span>
              <input name="usuarioTelegram" value={formularioInicial.usuarioTelegram} onChange={actualizarFormulario} required placeholder="@usuario_telegram" style={{ display: 'block', width: '100%', marginTop: '6px', padding: '12px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '10px', background: '#ffffff' }} />
              {telegramAutodetectado && (
                <small style={{ color: '#2563eb', fontSize: '11px', marginTop: '2px', display: 'block' }}>
                  ✓ Usuario de Telegram autodetectado. Puedes editarlo si lo deseas.
                </small>
              )}
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Género</span>
              <select name="genero" value={formularioInicial.genero} onChange={actualizarFormulario} required style={{ display: 'block', width: '100%', marginTop: '6px', padding: '12px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '10px', background: '#ffffff' }}>
                <option value="">Selecciona una opción</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
              </select>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label htmlFor="fechaNacimiento" style={{ display: 'block', marginBottom: '6px', color: '#263449', fontSize: '14px', fontWeight: '600' }}>Fecha de nacimiento</label>
                <input id="fechaNacimiento" name="fechaNacimiento" type="date" value={formularioInicial.fechaNacimiento} onChange={actualizarFormulario} max={obtenerFechaActualLocal()} required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px' }} />
              </div>
              <div>
                <span style={{ display: 'block', marginBottom: '6px', color: '#263449', fontSize: '14px', fontWeight: '600' }}>Edad</span>
                <div style={{ padding: '12px', background: '#f1f7f5', border: '1px solid #d8eee6', borderRadius: '10px', fontWeight: '500' }}>
                  {formularioInicial.fechaNacimiento ? `${calcularEdad(formularioInicial.fechaNacimiento)} años` : '—'}
                </div>
              </div>
            </div>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Estado</span>
              <select name="estado" value={formularioInicial.estado} onChange={actualizarFormulario} required style={{ display: 'block', width: '100%', marginTop: '6px', padding: '12px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '10px', background: '#ffffff' }}>
                <option value="">Selecciona estado</option>
                <option value="Distrito Capital">Distrito Capital</option>
                <option value="Miranda">Miranda</option>
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Municipio</span>
              <select name="municipio" value={formularioInicial.municipio} onChange={actualizarFormulario} required disabled={!formularioInicial.estado} style={{ display: 'block', width: '100%', marginTop: '6px', padding: '12px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '10px', background: '#ffffff' }}>
                <option value="">Selecciona municipio</option>
                {(municipiosPorEstado[formularioInicial.estado] || []).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Parroquia (Consejo Popular Parroquial)</span>
              <select name="parroquia" value={formularioInicial.parroquia} onChange={actualizarFormulario} required disabled={!formularioInicial.municipio} style={{ display: 'block', width: '100%', marginTop: '6px', padding: '12px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '10px', background: '#ffffff' }}>
                <option value="">Selecciona parroquia</option>
                {parroquiasCaracas.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Comuna</span>
              <input name="comuna" value={formularioInicial.comuna} onChange={actualizarFormulario} required placeholder="Nombre de tu comuna" style={{ display: 'block', width: '100%', marginTop: '6px', padding: '12px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '10px' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Concejo comunal</span>
              <input name="concejoComunal" value={formularioInicial.concejoComunal} onChange={actualizarFormulario} required placeholder="Nombre de tu concejo comunal" style={{ display: 'block', width: '100%', marginTop: '6px', padding: '12px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '10px' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Teléfono</span>
              <input name="telefono" type="tel" value={formularioInicial.telefono} onChange={actualizarFormulario} required placeholder="Teléfono de contacto" style={{ display: 'block', width: '100%', marginTop: '6px', padding: '12px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '10px' }} />
            </label>

            <button type="submit" style={{ width: '100%', padding: '14px', border: 0, borderRadius: '10px', background: '#2563eb', color: '#ffffff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
              Ingresar a mi Consejo Popular
            </button>
          </form>
        </div>
      </div>
    );
  }

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

  const cumplimientoActual = infoParroquiaActual.cumplimiento || cumplimientoEstadalGlobal;

  return (
    <div className="app-shell">
      <main className="app-content">
        <header className="top-header">
          <div>
            <p className="eyebrow">MINI APP DE TELEGRAM</p>
            <h1>Centinela <span>2.0</span></h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px', margin: '12px 0' }}>
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
                          style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'zoom-in' }}
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
                      {tarea.estado !== 'En Proceso' && tarea.estado !== 'Cumplida' && (
                        <button type="button" className="secondary-button" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => cambiarEstadoTarea(tarea.id, 'En Proceso')}>
                          Marcar En Proceso
                        </button>
                      )}
                      {tarea.estado !== 'Cumplida' && (
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
                      <strong>{cumplimientoActual[voceria.id] || 75}%</strong>
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
          icon="◎"
          label="Territorio"
          active={activeTab === 'territorio' || activeTab === 'territory'}
          onClick={() => handleAction('territorio')}
        />
        <NavButton
          icon="✓"
          label="Tareas"
          active={activeTab === 'tareas'}
          onClick={() => handleAction('tareas')}
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
