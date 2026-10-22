import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './index.css';

const comisionesDefinicion = [
  {
    id: 'produccion-economia',
    nombre: 'Red de Producción y Economía',
    icon: '₿',
    color: 'orange',
    descripcion: 'Emprendimientos, comercios, producción local, ferias y catálogo de productos.',
  },
  {
    id: 'trabajo-formacion',
    nombre: 'Aulas de Trabajo y Formación',
    icon: '☷',
    color: 'purple',
    descripcion: 'Cursos, talleres, formación integral, vinculación con universidades y liceos.',
  },
  {
    id: 'accion-socioterritorial',
    nombre: 'Brigadas de Acción Socioterritorial',
    icon: '⌖',
    color: 'blue',
    descripcion: 'Caracterización del territorio, visitas comunitarias, registro de necesidades.',
  },
  {
    id: 'cultura-comunicacion',
    nombre: 'Cultura, Memoria y Comunicación',
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

const parroquiasCaracasInfo = [
  { nombre: '23 de Enero', estadoColor: 'verde', registrados: 312, actividades: 18, emprendimientos: 24, eventos: 5, tareas: 4 },
  { nombre: 'Altagracia', estadoColor: 'azul', registrados: 195, actividades: 12, emprendimientos: 14, eventos: 3, tareas: 6 },
  { nombre: 'Antímano', estadoColor: 'naranja', registrados: 410, actividades: 22, emprendimientos: 38, eventos: 6, tareas: 8 },
  { nombre: 'Candelaria', estadoColor: 'verde', registrados: 180, actividades: 10, emprendimientos: 16, eventos: 2, tareas: 3 },
  { nombre: 'Caricuao', estadoColor: 'verde', registrados: 520, actividades: 31, emprendimientos: 45, eventos: 8, tareas: 5 },
  { nombre: 'Catedral', estadoColor: 'amarillo', registrados: 140, actividades: 8, emprendimientos: 11, eventos: 2, tareas: 9 },
  { nombre: 'Coche', estadoColor: 'naranja', registrados: 280, actividades: 16, emprendimientos: 29, eventos: 4, tareas: 7 },
  { nombre: 'El Junquito', estadoColor: 'azul', registrados: 210, actividades: 14, emprendimientos: 19, eventos: 3, tareas: 4 },
  { nombre: 'El Paraíso', estadoColor: 'verde', registrados: 340, actividades: 19, emprendimientos: 27, eventos: 5, tareas: 2 },
  { nombre: 'El Recreo', estadoColor: 'amarillo', registrados: 220, actividades: 11, emprendimientos: 18, eventos: 3, tareas: 6 },
  { nombre: 'El Valle', estadoColor: 'verde', registrados: 460, actividades: 28, emprendimientos: 42, eventos: 7, tareas: 5 },
  { nombre: 'La Pastora', estadoColor: 'naranja', registrados: 290, actividades: 15, emprendimientos: 22, eventos: 4, tareas: 6 },
  { nombre: 'La Vega', estadoColor: 'rojo', registrados: 380, actividades: 20, emprendimientos: 31, eventos: 5, tareas: 12 },
  { nombre: 'Macarao', estadoColor: 'verde', registrados: 260, actividades: 13, emprendimientos: 20, eventos: 3, tareas: 3 },
  { nombre: 'San Agustín', estadoColor: 'azul', registrados: 310, actividades: 21, emprendimientos: 26, eventos: 6, tareas: 4 },
  { nombre: 'San Bernardino', estadoColor: 'verde', registrados: 165, actividades: 9, emprendimientos: 12, eventos: 2, tareas: 2 },
  { nombre: 'San José', estadoColor: 'amarillo', registrados: 205, actividades: 11, emprendimientos: 15, eventos: 3, tareas: 7 },
  { nombre: 'San Juan', estadoColor: 'naranja', registrados: 330, actividades: 17, emprendimientos: 28, eventos: 4, tareas: 5 },
  { nombre: 'San Pedro', estadoColor: 'verde', registrados: 190, actividades: 12, emprendimientos: 17, eventos: 3, tareas: 3 },
  { nombre: 'Santa Rosalía', estadoColor: 'verde', registrados: 350, actividades: 23, emprendimientos: 33, eventos: 6, tareas: 4 },
  { nombre: 'Santa Teresa', estadoColor: 'amarillo', registrados: 155, actividades: 8, emprendimientos: 13, eventos: 2, tareas: 6 },
  { nombre: 'Sucre', estadoColor: 'naranja', registrados: 680, actividades: 42, emprendimientos: 65, eventos: 12, tareas: 10 },
];

const quickActions = [
  { icon: '▣', label: 'Feed nacional', tab: 'feed' },
  { icon: '⌂', label: 'Mi territorio', tab: 'territorio' },
  { icon: '◎', label: 'Vocerías', tab: 'vocerias' },
  { icon: '☷', label: 'Mesas de trabajo', tab: 'mesas' },
  { icon: '◷', label: 'Eventos', tab: 'eventos' },
  { icon: '✓', label: 'Tareas', tab: 'tareas' },
  { icon: '₿', label: 'Emprendimientos', tab: 'emprendimientos' },
];

const recentActivity = [
  {
    type: 'Convocatoria',
    title: 'Reunión de coordinación territorial',
    location: 'Caracas · Consejo Popular Estadal',
    time: 'Hace 25 min',
    color: 'blue',
  },
  {
    type: 'Actividad',
    title: 'Jornada de organización comunitaria',
    location: 'Miranda · Consejo Popular Municipal',
    time: 'Hace 1 h',
    color: 'green',
  },
  {
    type: 'Reporte',
    title: 'Actualización de mesa de trabajo',
    location: 'Zulia · Consejo Popular Parroquial',
    time: 'Ayer',
    color: 'orange',
  },
];

const feedPosts = [
  {
    id: 1,
    type: 'Convocatoria',
    title: 'Reunión de coordinación territorial',
    description: 'Espacio de encuentro para revisar las actividades de organización y los próximos compromisos del territorio.',
    territory: 'Caracas · Consejo Popular Estadal',
    author: 'Coordinación territorial',
    time: 'Hace 25 min',
    color: 'blue',
  },
  {
    id: 2,
    type: 'Actividad',
    title: 'Jornada de organización comunitaria',
    description: 'Actividad de articulación con vocerías comunitarias para identificar necesidades y construir una agenda de trabajo.',
    territory: 'Miranda · Consejo Popular Municipal',
    author: 'Vocerías comunitarias',
    time: 'Hace 1 h',
    color: 'green',
  },
];

const voceriasData = [
  {
    id: 'voceria-1',
    estado: 'Caracas',
    nombre: 'Vocería Estadal de Organización',
    mesa: 'Mesa de Articulación Comunitaria',
    area: 'Organización territorial',
    descripcion: 'Espacio de representación y seguimiento de las necesidades del Distrito Capital.',
    responsable: 'Coordinación Estadal',
    color: 'mint',
  },
];

const parroquiasCaracas = parroquiasCaracasInfo.map((p) => p.nombre);

const municipiosPorEstado = {
  'Distrito Capital': ['Libertador'],
  Miranda: ['Acevedo', 'Baruta', 'Chacao', 'Guaicaipuro', 'Sucre'],
};

const parroquiasPorMunicipio = {
  'Distrito Capital|Libertador': parroquiasCaracas,
};

const eventosEjemplo = [
  {
    id: 'evento-ejemplo-1',
    titulo: 'Asamblea Popular Estadal',
    nivel: 'estadal',
    estado: 'en-curso',
    parroquia: 'Caricuao',
    comision: 'accion-socioterritorial',
    estadoTerritorial: 'Distrito Capital',
    municipio: 'Libertador',
    fecha: obtenerFechaActualLocal(),
    horaInicio: '09:00',
    horaFin: '12:00',
    lugar: 'Plaza Bolívar, Caracas',
    descripcion: 'Encuentro estadal para la revisión de metas y mesas de trabajo.',
    creadoPor: 'Coordinación Estadal',
    creadoEn: new Date().toISOString(),
    asistentes: [],
  },
  {
    id: 'evento-ejemplo-2',
    titulo: 'Feria de Emprendimiento Comunal',
    nivel: 'parroquial',
    estado: 'convocado',
    parroquia: 'Caricuao',
    comision: 'produccion-economia',
    estadoTerritorial: 'Distrito Capital',
    municipio: 'Libertador',
    fecha: obtenerFechaActualLocal(),
    horaInicio: '14:00',
    horaFin: '17:00',
    lugar: 'Bulevar de Caricuao',
    descripcion: 'Jornada de exhibición productiva e impulso a la economía comunal.',
    creadoPor: 'Red de Producción Caricuao',
    creadoEn: new Date().toISOString(),
    asistentes: [],
  },
];

const emprendimientosEjemplo = [
  {
    id: 'emp-1',
    nombre: 'Textiles Comunitarios Caricuao',
    categoria: 'Textil y Calzado',
    parroquia: 'Caricuao',
    comision: 'produccion-economia',
    responsable: 'María Rodríguez',
    contacto: '0412-1112233',
    descripcion: 'Unidad de producción familiar dedicada a la confección de prendas y uniformes escolares.',
  },
  {
    id: 'emp-2',
    nombre: 'Panadería Artesanal El Valle',
    categoria: 'Alimentos y Bebidas',
    parroquia: 'El Valle',
    comision: 'produccion-economia',
    responsable: 'Carlos Gómez',
    contacto: '0414-3334455',
    descripcion: 'Producción de pan artesanal y repostería comunitaria para abastecer la localidad.',
  },
];

const tareasEjemplo = [
  {
    id: 'tarea-1',
    titulo: 'Censo de productores locales en Caricuao',
    parroquia: 'Caricuao',
    comision: 'produccion-economia',
    estado: 'En Proceso',
    prioridad: 'Alta',
    responsable: 'Brigada Productiva',
    fechaLimite: obtenerFechaActualLocal(),
  },
  {
    id: 'tarea-2',
    titulo: 'Jornada de saneamiento y caracterización comunitaria',
    parroquia: '23 de Enero',
    comision: 'accion-socioterritorial',
    estado: 'Pendiente',
    prioridad: 'Media',
    responsable: 'Vocería de Hábitat',
    fechaLimite: obtenerFechaActualLocal(),
  },
];

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
  if (typeof window === 'undefined') {
    return `centinela://asistencia/${evento.id}`;
  }
  return `${window.location.origin}${window.location.pathname}#asistencia=${evento.id}`;
}

function App() {
  const [showAllQuickActions, setShowAllQuickActions] = useState(false);
  const [pinnedQuickActionTabs, setPinnedQuickActionTabs] = useState(() => {
    try {
      const savedPinnedActions = localStorage.getItem('pinnedQuickActionTabs');
      if (savedPinnedActions) {
        const parsedActions = JSON.parse(savedPinnedActions);
        const validActions = parsedActions.filter((tab) =>
          quickActions.some((action) => action.tab === tab)
        );
        if (validActions.length === 3) return validActions;
      }
    } catch {}
    return quickActions.slice(0, 3).map((action) => action.tab);
  });

  const [registroCompletado, setRegistroCompletado] = useState(false);
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
  });

  const [activeTab, setActiveTab] = useState('inicio');
  const [selectedVoceria, setSelectedVoceria] = useState(null);
  const [territoryType, setTerritoryType] = useState('estadal');
  const [parroquiaSeleccionada, setParroquiaSeleccionada] = useState('Caricuao');
  const [comisionSeleccionada, setComisionSeleccionada] = useState('todas');
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Todo');

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

  const [mostrarFormularioEvento, setMostrarFormularioEvento] = useState(false);
  const [eventoSeleccionadoId, setEventoSeleccionadoId] = useState(null);
  const [fotosEvidencia, setFotosEvidencia] = useState([]);
  const [eventosFiltroEstado, setEventosFiltroEstado] = useState('activos');

  const [formularioEvento, setFormularioEvento] = useState({
    titulo: '',
    nivel: 'parroquial',
    parroquia: 'Caricuao',
    comision: 'accion-socioterritorial',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    lugar: '',
    descripcion: '',
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
  const [formEmprendimiento, setFormEmprendimiento] = useState({
    nombre: '',
    categoria: 'Textil y Calzado',
    parroquia: 'Caricuao',
    comision: 'produccion-economia',
    responsable: '',
    contacto: '',
    descripcion: '',
  });

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
  const [formTarea, setFormTarea] = useState({
    titulo: '',
    parroquia: 'Caricuao',
    comision: 'accion-socioterritorial',
    prioridad: 'Media',
    responsable: '',
    fechaLimite: obtenerFechaActualLocal(),
  });

  useEffect(() => {
    const telegramWebApp = window.Telegram?.WebApp;
    if (telegramWebApp) telegramWebApp.ready();

    const usuarioTelegram = telegramWebApp?.initDataUnsafe?.user;
    const datosGuardados = localStorage.getItem('perfilUsuario');

    if (datosGuardados) {
      try {
        const datos = JSON.parse(datosGuardados);
        setFormularioInicial((prev) => ({ ...prev, ...datos }));
        if (datos.parroquia) setParroquiaSeleccionada(datos.parroquia);
        setRegistroCompletado(true);
      } catch {
        localStorage.removeItem('perfilUsuario');
      }
    }

    if (usuarioTelegram) {
      const nombresTelegram = [usuarioTelegram.first_name, usuarioTelegram.last_name].filter(Boolean).join(' ');
      const usuarioTelegramTexto = usuarioTelegram.username ? `@${usuarioTelegram.username}` : String(usuarioTelegram.id || '');
      setFormularioInicial((prev) => ({
        ...prev,
        nombresApellidos: prev.nombresApellidos || nombresTelegram,
        usuarioTelegram: prev.usuarioTelegram || usuarioTelegramTexto,
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pinnedQuickActionTabs', JSON.stringify(pinnedQuickActionTabs));
  }, [pinnedQuickActionTabs]);

  useEffect(() => {
    localStorage.setItem('eventosCentinela', JSON.stringify(eventos));
  }, [eventos]);

  useEffect(() => {
    localStorage.setItem('emprendimientosCentinela', JSON.stringify(emprendimientos));
  }, [emprendimientos]);

  useEffect(() => {
    localStorage.setItem('tareasCentinela', JSON.stringify(tareas));
  }, [tareas]);

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

  const pinnedQuickActions = pinnedQuickActionTabs
    .map((tab) => quickActions.find((action) => action.tab === tab))
    .filter(Boolean);

  const pinQuickAction = (tab) => {
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
    setActiveTab(tab);
  };

  // Eventos Handlers
  const actualizarFormularioEvento = (event) => {
    const { name, value } = event.target;
    setFormularioEvento((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const crearEvento = (event) => {
    event.preventDefault();

    const nuevoEvento = {
      id: crearIdUnico('evento'),
      titulo: formularioEvento.titulo.trim(),
      nivel: formularioEvento.nivel,
      estado: 'convocado',
      parroquia: formularioEvento.parroquia || parroquiaSeleccionada,
      comision: formularioEvento.comision,
      estadoTerritorial: 'Distrito Capital',
      municipio: 'Libertador',
      fecha: formularioEvento.fecha,
      horaInicio: formularioEvento.horaInicio,
      horaFin: formularioEvento.horaFin,
      lugar: formularioEvento.lugar.trim(),
      descripcion: formularioEvento.descripcion.trim(),
      creadoPor:
        formularioInicial.nombresApellidos ||
        formularioInicial.usuarioTelegram ||
        'Consejo Popular Parroquial',
      creadoEn: new Date().toISOString(),
      asistentes: [],
    };

    setEventos((prev) => [nuevoEvento, ...prev]);
    setFormularioEvento({
      titulo: '',
      nivel: 'parroquial',
      parroquia: parroquiaSeleccionada,
      comision: 'accion-socioterritorial',
      fecha: '',
      horaInicio: '',
      horaFin: '',
      lugar: '',
      descripcion: '',
    });
    setMostrarFormularioEvento(false);
    setEventoSeleccionadoId(nuevoEvento.id);
  };

  const actualizarEstadoEvento = (eventoId, nuevoEstado) => {
    setEventos((prev) =>
      prev.map((e) => (e.id === eventoId ? { ...e, estado: nuevoEstado } : e))
    );
  };

  const iniciarEvento = (eventoId) => actualizarEstadoEvento(eventoId, 'en-curso');

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
    const promesasLectura = archivos.map((archivo) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            nombre: archivo.name,
            tipo: archivo.type,
            tamaño: archivo.size,
            dataUrl: e.target.result,
          });
        };
        reader.readAsDataURL(archivo);
      });
    });

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

    setEventos((prev) =>
      prev.map((e) =>
        e.id === eventoSeleccionado.id
          ? { ...e, asistentes: [...e.asistentes, nuevaAsistencia] }
          : e
      )
    );
    setFotosEvidencia([]);
    alert('Asistencia registrada correctamente con 3 fotos de evidencia.');
  };

  // Emprendimientos Handlers
  const crearEmprendimiento = (e) => {
    e.preventDefault();
    const nuevoEmp = {
      id: crearIdUnico('emp'),
      nombre: formEmprendimiento.nombre.trim(),
      categoria: formEmprendimiento.categoria,
      parroquia: formEmprendimiento.parroquia || parroquiaSeleccionada,
      comision: formEmprendimiento.comision,
      responsable: formEmprendimiento.responsable.trim() || formularioInicial.nombresApellidos || 'Emprendedor Local',
      contacto: formEmprendimiento.contacto.trim(),
      descripcion: formEmprendimiento.descripcion.trim(),
    };

    setEmprendimientos((prev) => [nuevoEmp, ...prev]);
    setFormEmprendimiento({
      nombre: '',
      categoria: 'Textil y Calzado',
      parroquia: parroquiaSeleccionada,
      comision: 'produccion-economia',
      responsable: '',
      contacto: '',
      descripcion: '',
    });
    setMostrarFormEmprendimiento(false);
    alert('Emprendimiento registrado exitosamente.');
  };

  // Tareas Handlers
  const crearTarea = (e) => {
    e.preventDefault();
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
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t))
    );
  };

  const actualizarFormulario = (event) => {
    const { name, value } = event.target;
    setFormularioInicial((prev) => {
      const updated = { ...prev, [name]: value };
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
    localStorage.setItem('perfilUsuario', JSON.stringify(formularioInicial));
    if (formularioInicial.parroquia) setParroquiaSeleccionada(formularioInicial.parroquia);
    setRegistroCompletado(true);
  };

  if (!registroCompletado) {
    return (
      <div style={{ minHeight: '100vh', padding: '24px', background: '#f4f7fb', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto', padding: '24px', background: '#ffffff', borderRadius: '18px', boxShadow: '0 4px 18px rgba(0, 0, 0, 0.08)' }}>
          <h1 style={{ marginTop: 0 }}>Completa tu registro</h1>
          <p style={{ color: '#5f6b7a', lineHeight: 1.5 }}>
            Antes de entrar a Centinela 2.0 necesitamos tus datos territoriales.
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
    const coincideParroquia = e.parroquia === parroquiaSeleccionada || e.nivel === 'estadal';
    const coincideComision = comisionSeleccionada === 'todas' || e.comision === comisionSeleccionada;
    if (!coincideParroquia || !coincideComision) return false;
    return eventosFiltroEstado === 'historico' ? e.estado === 'culminado' : e.estado !== 'culminado';
  });

  const emprendimientosFiltrados = emprendimientos.filter((e) => {
    const coincideParroquia = !parroquiaSeleccionada || e.parroquia === parroquiaSeleccionada;
    const coincideComision = comisionSeleccionada === 'todas' || e.comision === comisionSeleccionada;
    return coincideParroquia && coincideComision;
  });

  const tareasFiltradas = tareas.filter((t) => {
    const coincideParroquia = !parroquiaSeleccionada || t.parroquia === parroquiaSeleccionada;
    const coincideComision = comisionSeleccionada === 'todas' || t.comision === comisionSeleccionada;
    return coincideParroquia && coincideComision;
  });

  return (
    <div className="app-shell">
      <main className="app-content">
        <header className="top-header">
          <div>
            <p className="eyebrow">MINI APP DE TELEGRAM</p>
            <h1>Centinela <span>2.0</span></h1>
          </div>

          <button className="notification-button" aria-label="Notificaciones">
            <span>♢</span>
            <i></i>
          </button>
        </header>

        {activeTab === 'inicio' && (
          <>
            <section className="welcome-section">
              <div>
                <p className="muted-text">Bienvenido de nuevo</p>
                <h2>Hola, {formularioInicial.nombresApellidos || 'usuario'}</h2>
                <p className="welcome-copy">
                  Aquí tienes la actividad de tu organización.
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
                  <strong>{formularioInicial.estado || 'Caracas'}</strong>
                  <small>Territorio de trabajo asignado</small>
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
                    <button
                      type="button"
                      className={`territory-option ${
                        territoryType === 'estadal'
                          ? 'territory-option-selected'
                          : ''
                      }`}
                      onClick={(event) => {
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

                    <button
                      type="button"
                      className={`territory-option ${
                        territoryType === 'municipal'
                          ? 'territory-option-selected'
                          : ''
                      }`}
                      onClick={(event) => {
                        setTerritoryType('municipal');
                        event.currentTarget.closest('details').open = false;
                      }}
                    >
                      <span className="territory-option-icon">
                        {territoryType === 'municipal' ? '✓' : '○'}
                      </span>
                      <span className="territory-option-content">
                        <strong>Municipal</strong>
                        <small>Organización municipal</small>
                      </span>
                    </button>

                    <button
                      type="button"
                      className={`territory-option ${
                        territoryType === 'parroquial'
                          ? 'territory-option-selected'
                          : ''
                      }`}
                      onClick={(event) => {
                        setTerritoryType('parroquial');
                        event.currentTarget.closest('details').open = false;
                      }}
                    >
                      <span className="territory-option-icon">
                        {territoryType === 'parroquial' ? '✓' : '○'}
                      </span>
                      <span className="territory-option-content">
                        <strong>Parroquial</strong>
                        <small>Trabajo de la parroquia</small>
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
                  onClick={() =>
                    setShowAllQuickActions((currentValue) => !currentValue)
                  }
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
              <div className="section-title-row">
                <h3>Indicadores económicos</h3>
              </div>

              <div className="economic-grid">
                <div className="economic-card">
                  <span className="economic-icon dollar">$</span>
                  <small>Dólar BCV</small>
                  <strong>—</strong>
                  <em>Pendiente de conexión</em>
                </div>

                <div className="economic-card">
                  <span className="economic-icon euro">€</span>
                  <small>Euro</small>
                  <strong>—</strong>
                  <em>Pendiente de conexión</em>
                </div>

                <div className="economic-card">
                  <span className="economic-icon usdt">₮</span>
                  <small>USDT</small>
                  <strong>—</strong>
                  <em>Valor referencial</em>
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
                <h3>Actividad reciente</h3>
                <button
                  className="text-button"
                  onClick={() => setActiveTab('feed')}
                >
                  Ver todo
                </button>
              </div>

              <div className="activity-list">
                {recentActivity.map((activity) => (
                  <article className="activity-item" key={activity.title}>
                    <span className={`activity-dot ${activity.color}`}></span>
                    <div className="activity-content">
                      <div className="activity-meta">
                        <span>{activity.type}</span>
                        <time>{activity.time}</time>
                      </div>
                      <h4>{activity.title}</h4>
                      <p>{activity.location}</p>
                    </div>
                    <span className="arrow">›</span>
                  </article>
                ))}
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
                  Explora las 22 Parroquias de Caracas y los Consejos Populares Parroquiales.
                </p>
              </div>

              <button
                className="back-button"
                onClick={() => setActiveTab('inicio')}
              >
                Inicio
              </button>
            </div>

            {/* Mapa Socioterritorial de Caracas */}
            <section className="territory-card" style={{ marginBottom: '20px' }}>
              <div className="card-heading">
                <div>
                  <p className="section-label">MAPA SOCIOTERRITORIAL DE CARACAS</p>
                  <h3>22 Consejos Populares Parroquiales</h3>
                </div>
                <span className="status-badge">
                  <b></b> Activos
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0 16px 0' }}>
                <span className="location-icon">⌖</span>
                <div>
                  <strong>Parroquia activa: {parroquiaSeleccionada}</strong>
                  <small style={{ display: 'block', color: '#64748b' }}>Selecciona una parroquia para ver su panel</small>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
                {parroquiasCaracasInfo.map((p) => {
                  const isSelected = p.nombre === parroquiaSeleccionada;
                  return (
                    <button
                      key={p.nombre}
                      type="button"
                      onClick={() => setParroquiaSeleccionada(p.nombre)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <strong style={{ display: 'block', fontSize: '13px', color: '#1e293b' }}>{p.nombre}</strong>
                      <small style={{ fontSize: '11px', color: '#64748b' }}>{p.registrados} reg.</small>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Dashboard del Consejo Popular Parroquial Seleccionado */}
            <section className="organization-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '16px', margin: '16px 0', border: '1px solid #e2e8f0' }}>
              <div className="section-title-row">
                <div>
                  <p className="section-label">CONSEJO POPULAR PARROQUIAL</p>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '20px' }}>Parroquia {infoParroquiaActual.nombre}</h3>
                </div>
                <span className="organization-number">22</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '16px 0' }}>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                  <strong style={{ fontSize: '18px', color: '#2563eb', display: 'block' }}>{infoParroquiaActual.registrados}</strong>
                  <small style={{ color: '#64748b', fontSize: '11px' }}>Registrados</small>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                  <strong style={{ fontSize: '18px', color: '#16a34a', display: 'block' }}>{infoParroquiaActual.actividades}</strong>
                  <small style={{ color: '#64748b', fontSize: '11px' }}>Actividades</small>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                  <strong style={{ fontSize: '18px', color: '#d97706', display: 'block' }}>{infoParroquiaActual.emprendimientos}</strong>
                  <small style={{ color: '#64748b', fontSize: '11px' }}>Emprendimientos</small>
                </div>
              </div>

              {/* Lista de las 5 Comisiones Operativas */}
              <p className="section-label" style={{ marginTop: '16px' }}>5 COMISIONES DE ACCIÓN SOCIOTERRITORIAL</p>
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
                onClick={() => setActiveTab('inicio')}
              >
                Inicio
              </button>
            </div>

            <div className="feed-filters">
              <button
                className={`filter-button ${
                  activeFilter === 'Todo' ? 'active-filter' : ''
                }`}
                onClick={() => setActiveFilter('Todo')}
              >
                Todo
              </button>

              <button
                className={`filter-button ${
                  activeFilter === 'Evento culminado' ? 'active-filter' : ''
                }`}
                onClick={() => setActiveFilter('Evento culminado')}
              >
                Eventos culminados
              </button>

              <button
                className={`filter-button ${
                  activeFilter === 'Convocatoria' ? 'active-filter' : ''
                }`}
                onClick={() => setActiveFilter('Convocatoria')}
              >
                Convocatorias
              </button>

              <button
                className={`filter-button ${
                  activeFilter === 'Actividad' ? 'active-filter' : ''
                }`}
                onClick={() => setActiveFilter('Actividad')}
              >
                Actividades
              </button>

              <button
                className={`filter-button ${
                  activeFilter === 'Reporte' ? 'active-filter' : ''
                }`}
                onClick={() => setActiveFilter('Reporte')}
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
                        <img key={idx} src={foto} alt={`Evidencia ${idx + 1}`} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
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
                  Administra eventos por parroquia y comisión, registra asistencias con QR y fotos.
                </p>
              </div>

              <button
                className="back-button"
                onClick={() => setActiveTab('inicio')}
              >
                Inicio
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>FILTRAR POR COMISIÓN:</label>
              <select value={comisionSeleccionada} onChange={(e) => setComisionSeleccionada(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff' }}>
                <option value="todas">Todas las comisiones</option>
                {comisionesDefinicion.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
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
              <button type="button" style={{ flex: 1, padding: '10px', border: 0, borderRadius: '8px', background: eventosFiltroEstado === 'activos' ? '#ffffff' : 'transparent', fontWeight: eventosFiltroEstado === 'activos' ? '600' : 'normal', color: eventosFiltroEstado === 'activos' ? '#1e293b' : '#64748b', cursor: 'pointer' }} onClick={() => setEventosFiltroEstado('activos')}>
                Próximos / En Curso
              </button>
              <button type="button" style={{ flex: 1, padding: '10px', border: 0, borderRadius: '8px', background: eventosFiltroEstado === 'historico' ? '#ffffff' : 'transparent', fontWeight: eventosFiltroEstado === 'historico' ? '600' : 'normal', color: eventosFiltroEstado === 'historico' ? '#1e293b' : '#64748b', cursor: 'pointer' }} onClick={() => setEventosFiltroEstado('historico')}>
                Histórico Culminados ({eventosCulminados.length})
              </button>
            </div>

            {eventosFiltroEstado === 'activos' && (
              <button
                type="button"
                className="primary-button evento-create-button"
                onClick={() =>
                  setMostrarFormularioEvento(
                    (valorActual) => !valorActual
                  )
                }
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
                      NUEVA ACTIVIDAD
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
                    </div>

                    <div className="evento-qr-card">
                      <p className="section-label">
                        QR DE ASISTENCIA
                      </p>

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
                    </div>
                  </div>

                  <div className="evento-actions">
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

                    {eventoSeleccionado.estado ===
                      'en-curso' && (
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
                    )}

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
                <p className="page-description">Seguimiento de tareas comunitarias asignadas a las comisiones.</p>
              </div>
              <button className="back-button" onClick={() => setActiveTab('inicio')}>Inicio</button>
            </div>

            <button
              type="button"
              className="primary-button"
              style={{ marginBottom: '16px' }}
              onClick={() => setMostrarFormTarea((prev) => !prev)}
            >
              {mostrarFormTarea ? 'Cerrar formulario' : '+ Asignar nueva tarea'}
            </button>

            {mostrarFormTarea && (
              <form className="evento-form-card" onSubmit={crearTarea}>
                <div className="section-title-row">
                  <div>
                    <p className="section-label">NUEVA TAREA</p>
                    <h3>Registrar tarea para {parroquiaSeleccionada}</h3>
                  </div>
                </div>

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

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
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
                <p className="section-label">REPRESENTACIÓN TERRITORIAL</p>
                <h2>Vocerías estadales</h2>
                <p className="page-description">
                  Conoce las vocerías y las mesas de trabajo vinculadas a cada estado.
                </p>
              </div>

              <button
                className="back-button"
                onClick={() => setActiveTab('inicio')}
              >
                Inicio
              </button>
            </div>

            <div className="vocerias-summary">
              <div className="summary-item">
                <strong>{voceriasData.length}</strong>
                <span>Vocerías activas</span>
              </div>

              <div className="summary-item">
                <strong>{voceriasData.length}</strong>
                <span>Mesas vinculadas</span>
              </div>

              <div className="summary-item">
                <strong>Estadal</strong>
                <span>Ámbito de representación</span>
              </div>
            </div>

            <div className="vocerias-grid">
              {voceriasData.map((voceria) => (
                <article
                  className={`voceria-card ${voceria.color}`}
                  key={voceria.id}
                >
                  <div className="voceria-card-top">
                    <span className="voceria-icon">✦</span>

                    <span className="voceria-status">
                      Activa
                    </span>
                  </div>

                  <p className="voceria-state">
                    {voceria.estado}
                  </p>

                  <h3>{voceria.nombre}</h3>

                  <p className="voceria-description">
                    {voceria.descripcion}
                  </p>

                  <div className="voceria-mesa">
                    <span className="mesa-icon">◎</span>

                    <div>
                      <small>Mesa vinculada</small>
                      <strong>{voceria.mesa}</strong>
                    </div>
                  </div>

                  <button
                    className="voceria-detail-button"
                    onClick={() => setSelectedVoceria(voceria)}
                  >
                    Ver detalles
                    <span>→</span>
                  </button>
                </article>
              ))}
            </div>

            {selectedVoceria && (
              <div
                className="detail-overlay"
                onClick={() => setSelectedVoceria(null)}
              >
                <div
                  className="detail-bubble"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="bubble-handle"></div>

                  <div className="detail-panel-header">
                    <div>
                      <p className="section-label">
                        VOCERÍA ESTADAL
                      </p>

                      <h3>{selectedVoceria.nombre}</h3>
                    </div>

                    <button
                      className="close-button"
                      onClick={() => setSelectedVoceria(null)}
                      aria-label="Cerrar detalle"
                    >
                      ×
                    </button>
                  </div>

                  <p className="bubble-description">
                    {selectedVoceria.descripcion}
                  </p>

                  <div className="detail-information">
                    <span>
                      <strong>Estado:</strong>{' '}
                      {selectedVoceria.estado}
                    </span>

                    <span>
                      <strong>Área:</strong>{' '}
                      {selectedVoceria.area}
                    </span>

                    <span>
                      <strong>Mesa de trabajo:</strong>{' '}
                      {selectedVoceria.mesa}
                    </span>

                    <span>
                      <strong>Responsable:</strong>{' '}
                      {selectedVoceria.responsable}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>
        ) : activeTab === 'mesas' ? (
          <section className="mesas-page">
            <div className="page-heading">
              <div>
                <p className="section-label">ARTICULACIÓN TERRITORIAL</p>
                <h2>Mesas de trabajo</h2>
                <p className="page-description">
                  Consulta las mesas asociadas a cada vocería estadal.
                </p>
              </div>

              <button
                className="back-button"
                onClick={() => setActiveTab('inicio')}
              >
                Inicio
              </button>
            </div>

            <div className="mesas-list">
              {voceriasData.map((voceria, index) => (
                <article className="mesa-row" key={voceria.id}>
                  <div className={`mesa-number ${voceria.color}`}>
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="mesa-row-content">
                    <p>{voceria.estado}</p>
                    <h3>{voceria.mesa}</h3>
                    <span>{voceria.area}</span>
                  </div>

                  <button
                    className="mesa-open-button"
                    onClick={() => setSelectedVoceria(voceria)}
                    aria-label={`Ver ${voceria.mesa}`}
                  >
                    →
                  </button>
                </article>
              ))}
            </div>

            {selectedVoceria && (
              <div
                className="detail-overlay"
                onClick={() => setSelectedVoceria(null)}
              >
                <div
                  className="detail-bubble"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="bubble-handle"></div>

                  <div className="detail-panel-header">
                    <div>
                      <p className="section-label">
                        MESA DE TRABAJO
                      </p>

                      <h3>{selectedVoceria.mesa}</h3>
                    </div>

                    <button
                      className="close-button"
                      onClick={() => setSelectedVoceria(null)}
                      aria-label="Cerrar detalle"
                    >
                      ×
                    </button>
                  </div>

                  <p className="bubble-description">
                    Mesa vinculada a la {selectedVoceria.nombre}
                    de {selectedVoceria.estado}.
                  </p>

                  <div className="detail-information">
                    <span>
                      <strong>Estado:</strong>{' '}
                      {selectedVoceria.estado}
                    </span>

                    <span>
                      <strong>Vocería:</strong>{' '}
                      {selectedVoceria.nombre}
                    </span>

                    <span>
                      <strong>Área:</strong>{' '}
                      {selectedVoceria.area}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>
        ) : activeTab === 'emprendimientos' ? (
          <section className="emprendimientos-page">
            <div className="page-heading">
              <div>
                <p className="section-label">RED DE PRODUCCIÓN Y ECONOMÍA: {parroquiaSeleccionada.toUpperCase()}</p>
                <h2>Emprendimientos Locales</h2>
                <p className="page-description">
                  Iniciativas, proyectos productivos y comercios populares comunitarios.
                </p>
              </div>

              <button
                className="back-button"
                onClick={() => setActiveTab('inicio')}
              >
                Inicio
              </button>
            </div>

            <button
              type="button"
              className="primary-button"
              style={{ marginBottom: '16px' }}
              onClick={() => setMostrarFormEmprendimiento((prev) => !prev)}
            >
              {mostrarFormEmprendimiento ? 'Cerrar formulario' : '+ Registrar mi emprendimiento'}
            </button>

            {mostrarFormEmprendimiento && (
              <form className="evento-form-card" onSubmit={crearEmprendimiento}>
                <div className="section-title-row">
                  <div>
                    <p className="section-label">NUEVA INICIATIVA</p>
                    <h3>Registrar emprendimiento en {parroquiaSeleccionada}</h3>
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

                <button type="submit" className="primary-button">Guardar e integrar a la Red</button>
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
                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>👤 Responsable: {emp.responsable} · 📞 {emp.contacto}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        ) : activeTab !== 'inicio' ? (
          <section className="empty-page">
            <span className="empty-icon">✦</span>

            <p className="section-label">
              MÓDULO DE DEMOSTRACIÓN
            </p>

            <h2>{getTabTitle(activeTab)}</h2>

            <p>
              Esta pantalla se construirá en la siguiente etapa. Ya dejamos
              preparado el sistema de navegación para conectar este módulo.
            </p>

            <button
              className="primary-button"
              onClick={() => setActiveTab('inicio')}
            >
              Volver al inicio
            </button>
          </section>
        ) : null}
      </main>

      <nav className="bottom-navigation">
        <NavButton
          icon="⌂"
          label="Inicio"
          active={activeTab === 'inicio'}
          onClick={() => setActiveTab('inicio')}
        />
        <NavButton
          icon="▣"
          label="Feed"
          active={activeTab === 'feed'}
          onClick={() => setActiveTab('feed')}
        />
        <NavButton
          icon="◎"
          label="Territorio"
          active={activeTab === 'territorio' || activeTab === 'territory'}
          onClick={() => setActiveTab('territorio')}
        />
        <NavButton
          icon="✓"
          label="Tareas"
          active={activeTab === 'tareas'}
          onClick={() => setActiveTab('tareas')}
        />
        <NavButton
          icon="☰"
          label="Menú"
          active={activeTab === 'menu'}
          onClick={() => setActiveTab('menu')}
        />
      </nav>
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

function getTabTitle(tab) {
  const titles = {
    feed: 'Feed nacional',
    territorio: 'Mi territorio',
    territory: 'Mi territorio',
    vocerias: 'Vocerías',
    mesas: 'Mesas de trabajo',
    eventos: 'Eventos',
    reportes: 'Reportes',
    emprendimientos: 'Emprendimientos',
    tareas: 'Tareas',
    menu: 'Menú principal',
  };

  return titles[tab] || 'Módulo';
}

export default App;
