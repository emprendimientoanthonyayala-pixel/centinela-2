import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './index.css';

const quickAccessItems = [
  {
    id: "feed",
    label: "Feed nacional",
    description: "Noticias y actividad nacional",
    icon: "▣",
  },
  {
    id: "territory",
    label: "Mi territorio",
    description: "Información territorial",
    icon: "⌂",
  },
  {
    id: "vocerias",
    label: "Vocerías",
    description: "Gestión de vocerías",
    icon: "◎",
  },
  {
    id: "mesas",
    label: "Mesas de trabajo",
    description: "Organización y seguimiento",
    icon: "☷",
  },
  {
    id: "eventos",
    label: "Eventos",
    description: "Agenda de actividades",
    icon: "◷",
  },
  {
    id: "reportes",
    label: "Reportes",
    description: "Informes y resultados",
    icon: "▤",
  },
];

const economicIndicators = [
  {
    id: "bcv",
    label: "Dólar BCV",
    symbol: "$",
    value: null,
    change: null,
    series: [],
  },
  {
    id: "euro",
    label: "Euro",
    symbol: "€",
    value: null,
    change: null,
    series: [],
  },
  {
    id: "usdt",
    label: "USDT",
    symbol: "₮",
    value: null,
    change: null,
    series: [],
  },
];

const quickActions = [
  { icon: '▣', label: 'Feed nacional', tab: 'feed' },
  { icon: '⌂', label: 'Mi territorio', tab: 'territorio' },
  { icon: '◎', label: 'Vocerías', tab: 'vocerias' },
  { icon: '☷', label: 'Mesas de trabajo', tab: 'mesas' },
  { icon: '◷', label: 'Eventos', tab: 'eventos' },
  { icon: '▤', label: 'Reportes', tab: 'reportes' },
  {
    icon: '₿',
    label: 'Emprendimientos',
    tab: 'emprendimientos',
  },
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
    description:
      'Espacio de encuentro para revisar las actividades de organización y los próximos compromisos del territorio.',
    territory: 'Caracas · Consejo Popular Estadal',
    author: 'Coordinación territorial',
    time: 'Hace 25 min',
    color: 'blue',
  },
  {
    id: 2,
    type: 'Actividad',
    title: 'Jornada de organización comunitaria',
    description:
      'Actividad de articulación con vocerías comunitarias para identificar necesidades y construir una agenda de trabajo.',
    territory: 'Miranda · Consejo Popular Municipal',
    author: 'Vocerías comunitarias',
    time: 'Hace 1 h',
    color: 'green',
  },
  {
    id: 3,
    type: 'Reporte',
    title: 'Actualización de mesa de trabajo',
    description:
      'Se actualizó el estado de los compromisos registrados durante la última reunión de seguimiento.',
    territory: 'Zulia · Consejo Popular Parroquial',
    author: 'Mesa de organización',
    time: 'Ayer',
    color: 'orange',
  },
];

const voceriasData = [
  {
    id: 'voceria-1',
    estado: 'Estado 1',
    nombre: 'Vocería estadal 1',
    mesa: 'Mesa de trabajo 1',
    area: 'Organización territorial',
    descripcion:
      'Espacio de representación y seguimiento de las necesidades del estado.',
    responsable: 'Por asignar',
    color: 'mint',
  },
  {
    id: 'voceria-2',
    estado: 'Estado 2',
    nombre: 'Vocería estadal 2',
    mesa: 'Mesa de trabajo 2',
    area: 'Participación comunitaria',
    descripcion:
      'Articulación de propuestas, actividades y acuerdos con las comunidades.',
    responsable: 'Por asignar',
    color: 'blue',
  },
  {
    id: 'voceria-3',
    estado: 'Estado 3',
    nombre: 'Vocería estadal 3',
    mesa: 'Mesa de trabajo 3',
    area: 'Producción y emprendimiento',
    descripcion:
      'Seguimiento a iniciativas productivas y oportunidades para el territorio.',
    responsable: 'Por asignar',
    color: 'orange',
  },
  {
    id: 'voceria-4',
    estado: 'Estado 4',
    nombre: 'Vocería estadal 4',
    mesa: 'Mesa de trabajo 4',
    area: 'Formación y desarrollo',
    descripcion:
      'Impulso de actividades formativas, encuentros y procesos de capacitación.',
    responsable: 'Por asignar',
    color: 'purple',
  },
  {
    id: 'voceria-5',
    estado: 'Estado 5',
    nombre: 'Vocería estadal 5',
    mesa: 'Mesa de trabajo 5',
    area: 'Atención territorial',
    descripcion:
      'Canal de enlace para reportar necesidades y coordinar respuestas.',
    responsable: 'Por asignar',
    color: 'green',
  },
];

const parroquiasCaracas = [
  '23 de Enero',
  'Altagracia',
  'Antímano',
  'Candelaria',
  'Caricuao',
  'Catedral',
  'Coche',
  'El Junquito',
  'El Paraíso',
  'El Recreo',
  'El Valle',
  'La Pastora',
  'La Vega',
  'Macarao',
  'San Agustín',
  'San Bernardino',
  'San José',
  'San Juan',
  'San Pedro',
  'Santa Rosalía',
  'Santa Teresa',
  'Sucre',
];

const municipiosPorEstado = {
  Amazonas: [
    'Alto Orinoco',
    'Atabapo',
    'Atures',
    'Autana',
    'Maroa',
    'Manapiare',
    'Río Negro',
  ],

  Anzoátegui: [
    'Anaco',
    'Aragua',
    'Diego Bautista Urbaneja',
    'Fernando de Peñalver',
    'Francisco de Miranda',
    'Guanta',
    'Independencia',
    'Juan Antonio Sotillo',
    'Libertad',
    'McGregor',
    'Pedro María Freites',
    'Píritu',
    'Simón Bolívar',
    'Simón Rodríguez',
  ],

  Apure: [
    'Achaguas',
    'Biruaca',
    'Muñoz',
    'Páez',
    'Pedro Camejo',
    'Rómulo Gallegos',
    'San Fernando',
  ],

  Aragua: [
    'Bolívar',
    'Camatagua',
    'Francisco Linares Alcántara',
    'Girardot',
    'José Ángel Lamas',
    'José Félix Ribas',
    'Libertador',
    'Mario Briceño Iragorry',
    'Ocumare de la Costa de Oro',
    'San Casimiro',
    'San Sebastián',
    'Santiago Mariño',
    'Santos Michelena',
    'Sucre',
    'Tovar',
    'Urdaneta',
    'Zamora',
  ],

  Barinas: [
    'Alberto Arvelo Torrealba',
    'Andrés Eloy Blanco',
    'Antonio José de Sucre',
    'Arismendi',
    'Barinas',
    'Bolívar',
    'Cruz Paredes',
    'Ezequiel Zamora',
    'Obispos',
    'Pedraza',
    'Rojas',
    'Sosa',
  ],

  Carabobo: [
    'Bejuma',
    'Carlos Arvelo',
    'Diego Ibarra',
    'Guacara',
    'Juan José Mora',
    'Libertador',
    'Los Guayos',
    'Miranda',
    'Montalbán',
    'Naguanagua',
    'Puerto Cabello',
    'San Diego',
    'San Joaquín',
    'Valencia',
  ],

  'Distrito Capital': [
    'Libertador',
  ],

  Falcón: [
    'Acosta',
    'Bolívar',
    'Buchivacoa',
    'Carirubana',
    'Colina',
    'Dabajuro',
    'Democracia',
    'Falcón',
    'Federación',
    'Jacura',
    'Los Taques',
    'Mauroa',
    'Miranda',
    'Monseñor Iturriza',
    'Palmasola',
    'Petit',
    'Píritu',
    'San Francisco',
    'Sucre',
    'Tocópero',
    'Unión',
    'Urumaco',
    'Zamora',
  ],

  Lara: [
    'Andrés Eloy Blanco',
    'Crespo',
    'Iribarren',
    'Jiménez',
    'Morán',
    'Palavecino',
    'Simón Planas',
    'Torres',
    'Urdaneta',
  ],

  Mérida: [
    'Alberto Adriani',
    'Andrés Bello',
    'Antonio Pinto Salinas',
    'Aricagua',
    'Arzobispo Chacón',
    'Campo Elías',
    'Caracciolo Parra Olmedo',
    'Cardenal Quintero',
    'Guaraque',
    'Julio César Salas',
    'Justo Briceño',
    'Libertador',
    'Miranda',
    'Obispo Ramos de Lora',
    'Padre Noguera',
    'Pueblo Llano',
    'Rangel',
    'Rivas Dávila',
    'Santos Marquina',
    'Sucre',
    'Tovar',
    'Tulio Febres Cordero',
    'Zea',
  ],

  Miranda: [
    'Acevedo',
    'Andrés Bello',
    'Baruta',
    'Brión',
    'Buroz',
    'Carrizal',
    'Chacao',
    'Cristóbal Rojas',
    'El Hatillo',
    'Guaicaipuro',
    'Independencia',
    'Los Salias',
    'Páez',
    'Paz Castillo',
    'Pedro Gual',
    'Plaza',
    'Simón Bolívar',
    'Sucre',
    'Urdaneta',
    'Zamora',
  ],

  Monagas: [
    'Acosta',
    'Aguasay',
    'Bolívar',
    'Caripe',
    'Cedeño',
    'Ezequiel Zamora',
    'Libertador',
    'Maturín',
    'Piar',
    'Punceres',
    'Santa Bárbara',
    'Sotillo',
    'Uracoa',
  ],

  Sucre: [
    'Andrés Eloy Blanco',
    'Andrés Mata',
    'Arismendi',
    'Benítez',
    'Bermúdez',
    'Bolívar',
    'Cajigal',
    'Cruz Salmerón Acosta',
    'Libertador',
    'Mariño',
    'Mejía',
    'Montes',
    'Ribero',
    'Sucre',
    'Valdez',
  ],

  Táchira: [
    'Andrés Bello',
    'Antonio Rómulo Costa',
    'Ayacucho',
    'Bolívar',
    'Cárdenas',
    'Córdoba',
    'Fernández Feo',
    'Francisco de Miranda',
    'García de Hevia',
    'Guásimos',
    'Independencia',
    'Jáuregui',
    'José María Vargas',
    'Junín',
    'Libertad',
    'Libertador',
    'Lobatera',
    'Michelena',
    'Panamericano',
    'Pedro María Ureña',
    'Rafael Urdaneta',
    'Samuel Darío Maldonado',
    'San Cristóbal',
    'Seboruco',
    'Simón Rodríguez',
    'Sucre',
    'Torbes',
    'Uribante',
  ],

  Trujillo: [
    'Andrés Bello',
    'Boconó',
    'Bolívar',
    'Candelaria',
    'Carache',
    'Escuque',
    'José Felipe Márquez Cañizales',
    'Juan Vicente Campo Elías',
    'La Ceiba',
    'Miranda',
    'Monte Carmelo',
    'Motatán',
    'Pampán',
    'Pampanito',
    'Rafael Rangel',
    'San Rafael de Carvajal',
    'Sucre',
    'Trujillo',
    'Urdaneta',
    'Valera',
  ],

  Yaracuy: [
    'Arístides Bastidas',
    'Bolívar',
    'Bruzual',
    'Cocorote',
    'Independencia',
    'José Antonio Páez',
    'La Trinidad',
    'Manuel Monge',
    'Nirgua',
    'Peña',
    'San Felipe',
    'Sucre',
    'Urachiche',
    'Veroes',
  ],

  Zulia: [
    'Almirante Padilla',
    'Baralt',
    'Cabimas',
    'Catatumbo',
    'Colón',
    'Francisco Javier Pulgar',
    'Jesús Enrique Lossada',
    'Jesús María Semprún',
    'La Cañada de Urdaneta',
    'Lagunillas',
    'Machiques de Perijá',
    'Mara',
    'Maracaibo',
    'Miranda',
    'Rosario de Perijá',
    'San Francisco',
    'Santa Rita',
    'Simón Bolívar',
    'Sucre',
    'Valmore Rodríguez',
  ],
};

const parroquiasPorMunicipio = {
  'Miranda|Acevedo': [
    'Caucagua',
    'Aragüita',
    'Arévalo González',
    'Capaya',
    'El Café',
    'Panaquire',
    'Ribas',
    'Tapipa',
  ],

  'Miranda|Andrés Bello': [
    'Cumbo',
    'San José de Barlovento',
  ],

  'Miranda|Baruta': [
    'Baruta',
    'El Cafetal',
    'Las Minas de Baruta',
  ],

  'Miranda|Brión': [
    'Curiepe',
    'Higuerote',
    'Tacarigua de Brión',
  ],

  'Miranda|Buroz': [
    'Mamporal',
  ],

  'Miranda|Carrizal': [
    'Carrizal',
  ],

  'Miranda|Chacao': [
    'Chacao',
  ],

  'Miranda|Cristóbal Rojas': [
    'Charallave',
    'Las Brisas',
  ],

  'Miranda|El Hatillo': [
    'El Hatillo',
  ],

  'Miranda|Guaicaipuro': [
    'Altagracia de la Montaña',
    'Cecilio Acosta',
    'El Jarillo',
    'Los Teques',
    'Paracotos',
    'San Pedro',
    'Tácata',
  ],

  'Miranda|Independencia': [
    'Cartanal',
    'Santa Teresa del Tuy',
  ],

  'Miranda|Los Salias': [
    'San Antonio de los Altos',
  ],

  'Miranda|Páez': [
    'El Guapo',
    'Paparo',
    'Río Chico',
    'San Fernando del Guapo',
    'Tacarigua de la Laguna',
  ],

  'Miranda|Paz Castillo': [
    'Santa Lucía',
  ],

  'Miranda|Pedro Gual': [
    'Cúpira',
    'Machurucuto',
  ],

  'Miranda|Plaza': [
    'Guarenas',
  ],

  'Miranda|Simón Bolívar': [
    'San Antonio de Yare',
    'San Francisco de Yare',
  ],

  'Miranda|Sucre': [
    'Caucagüita',
    'Filas de Mariche',
    'La Dolorita',
    'Leoncio Martínez',
    'Petare',
  ],

  'Miranda|Urdaneta': [
    'Cúa',
    'Nueva Cúa',
  ],

   'Miranda|Zamora': [
    'Araira',
    'Guatire',
  ],

  'Distrito Capital|Libertador': [
    '23 de Enero',
    'Altagracia',
    'Antímano',
    'Candelaria',
    'Caricuao',
    'Catedral',
    'Coche',
    'El Junquito',
    'El Paraíso',
    'El Recreo',
    'El Valle',
    'La Pastora',
    'La Vega',
    'Macarao',
    'San Agustín',
    'San Bernardino',
    'San José',
    'San Juan',
    'San Pedro',
    'Santa Rosalía',
    'Santa Teresa',
    'Sucre',
  ],
};

const eventosEjemplo = [
  {
    id: 'evento-ejemplo-1',
    titulo: 'Asamblea Popular Estadal',
    nivel: 'estadal',
    estado: 'en-curso',
    parroquia: 'Todas las parroquias de Caracas',
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
    titulo: 'Jornada Comunal de Caricuao',
    nivel: 'parroquial',
    estado: 'convocado',
    parroquia: 'Caricuao',
    estadoTerritorial: 'Distrito Capital',
    municipio: 'Libertador',
    fecha: obtenerFechaActualLocal(),
    horaInicio: '14:00',
    horaFin: '17:00',
    lugar: 'Bulevar de Caricuao',
    descripcion: 'Jornada de organización comunitaria y recepción de propuestas.',
    creadoPor: 'Mesa de Trabajo Caricuao',
    creadoEn: new Date().toISOString(),
    asistentes: [],
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
  if (!fechaNacimiento) {
    return '';
  }

  const partesFecha = fechaNacimiento.split('-').map(Number);
  if (partesFecha.length !== 3) {
    return '';
  }

  const [añoNacimiento, mesNacimiento, diaNacimiento] = partesFecha;
  if (!añoNacimiento || !mesNacimiento || !diaNacimiento) {
    return '';
  }

  const hoy = new Date();
  let edad = hoy.getFullYear() - añoNacimiento;

  const todavíaNoCumpleAños =
    hoy.getMonth() + 1 < mesNacimiento ||
    (hoy.getMonth() + 1 === mesNacimiento &&
      hoy.getDate() < diaNacimiento);

  if (todavíaNoCumpleAños) {
    edad--;
  }

  if (edad < 0) {
    return '';
  }

  return edad;
}

function crearIdEvento() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `evento-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
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

        if (validActions.length === 3) {
          return validActions;
        }
      }
    } catch {
      // Si no existe una configuración válida, se usan los primeros tres.
    }

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
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Todo');

  const [eventos, setEventos] = useState(() => {
    try {
      const eventosGuardados = localStorage.getItem('eventosCentinela');
      if (eventosGuardados) {
        const parsed = JSON.parse(eventosGuardados);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return eventosEjemplo;
  });

  const [mostrarFormularioEvento, setMostrarFormularioEvento] = useState(false);
  const [eventoSeleccionadoId, setEventoSeleccionadoId] = useState(null);
  const [fotosEvidencia, setFotosEvidencia] = useState([]);

  const [formularioEvento, setFormularioEvento] = useState({
    titulo: '',
    nivel: 'parroquial',
    parroquia: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    lugar: '',
    descripcion: '',
  });

  useEffect(() => {
    const telegramWebApp = window.Telegram?.WebApp;
    if (telegramWebApp) {
      telegramWebApp.ready();
    }

    const usuarioTelegram = telegramWebApp?.initDataUnsafe?.user;
    const datosGuardados = localStorage.getItem('perfilUsuario');

    if (datosGuardados) {
      try {
        const datos = JSON.parse(datosGuardados);
        setFormularioInicial((datosAnteriores) => ({
          ...datosAnteriores,
          ...datos,
        }));
        setRegistroCompletado(true);
      } catch {
        localStorage.removeItem('perfilUsuario');
      }
    }

    if (usuarioTelegram) {
      const nombresTelegram = [
        usuarioTelegram.first_name,
        usuarioTelegram.last_name,
      ]
        .filter(Boolean)
        .join(' ');

      const usuarioTelegramTexto = usuarioTelegram.username
        ? `@${usuarioTelegram.username}`
        : String(usuarioTelegram.id || '');

      setFormularioInicial((datosAnteriores) => ({
        ...datosAnteriores,
        nombresApellidos: datosAnteriores.nombresApellidos || nombresTelegram,
        usuarioTelegram: datosAnteriores.usuarioTelegram || usuarioTelegramTexto,
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'pinnedQuickActionTabs',
      JSON.stringify(pinnedQuickActionTabs)
    );
  }, [pinnedQuickActionTabs]);

  useEffect(() => {
    localStorage.setItem('eventosCentinela', JSON.stringify(eventos));
  }, [eventos]);

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
      const alreadyPinned = currentTabs.includes(tab);
      if (alreadyPinned) {
        return currentTabs;
      }
      return [tab, ...currentTabs].slice(0, 3);
    });
  };

  const eventoSeleccionado = eventos.find(
    (evento) => evento.id === eventoSeleccionadoId
  );

  const abrirEvento = (eventoId) => {
    const eventoExiste = eventos.some((evento) => evento.id === eventoId);
    if (!eventoExiste) {
      alert('No se encontró la información de este evento.');
      return;
    }
    setEventoSeleccionadoId(eventoId);
  };

  const eventosCulminados = eventos.filter(
    (evento) => evento.estado === 'culminado'
  );

  const publicacionesDeEventos = eventosCulminados.map((evento) => ({
    id: `evento-${evento.id}`,
    eventId: evento.id,
    type: 'Evento culminado',
    title: evento.titulo,
    description: evento.descripcion,
    territory:
      evento.nivel === 'estadal'
        ? 'Caracas · Evento estadal'
        : `Caracas · ${evento.parroquia}`,
    author: evento.creadoPor,
    time: 'Evento culminado',
    color: 'green',
    asistentes: evento.asistentes.length,
    evidencias: evento.asistentes.reduce(
      (total, asistente) => total + asistente.evidencias.length,
      0
    ),
  }));

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

  const actualizarFormularioEvento = (event) => {
    const { name, value } = event.target;
    setFormularioEvento((datosAnteriores) => ({
      ...datosAnteriores,
      [name]: value,
      ...(name === 'nivel' && value === 'estadal' ? { parroquia: '' } : {}),
    }));
  };

  const crearEvento = (event) => {
    event.preventDefault();

    if (
      formularioEvento.nivel === 'parroquial' &&
      !formularioEvento.parroquia
    ) {
      alert('Selecciona la parroquia del evento.');
      return;
    }

    const nuevoEvento = {
      id: crearIdEvento(),
      titulo: formularioEvento.titulo.trim(),
      nivel: formularioEvento.nivel,
      estado: 'convocado',
      parroquia:
        formularioEvento.nivel === 'parroquial'
          ? formularioEvento.parroquia
          : 'Todas las parroquias de Caracas',
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
        'Coordinación estadal',
      creadoEn: new Date().toISOString(),
      asistentes: [],
    };

    setEventos((eventosAnteriores) => [nuevoEvento, ...eventosAnteriores]);

    setFormularioEvento({
      titulo: '',
      nivel: 'parroquial',
      parroquia: '',
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
    setEventos((eventosAnteriores) =>
      eventosAnteriores.map((evento) =>
        evento.id === eventoId
          ? {
              ...evento,
              estado: nuevoEstado,
            }
          : evento
      )
    );
  };

  const iniciarEvento = (eventoId) => {
    actualizarEstadoEvento(eventoId, 'en-curso');
  };

  const culminarEvento = (eventoId) => {
    const evento = eventos.find((eventoActual) => eventoActual.id === eventoId);
    if (!evento) {
      return;
    }

    if (evento.asistentes.length === 0) {
      alert(
        'El evento necesita al menos una asistencia registrada antes de culminar.'
      );
      return;
    }

    const asistenciaIncompleta = evento.asistentes.some(
      (asistente) => asistente.evidencias.length < 3
    );

    if (asistenciaIncompleta) {
      alert('Todas las asistencias deben tener mínimo 3 fotos de evidencia.');
      return;
    }

    actualizarEstadoEvento(eventoId, 'culminado');
  };

  const seleccionarFotosEvidencia = (event) => {
    const archivos = Array.from(event.target.files || []);
    setFotosEvidencia(archivos);
  };

  const registrarAsistencia = () => {
    if (!eventoSeleccionado) {
      return;
    }

    if (eventoSeleccionado.estado !== 'en-curso') {
      alert(
        'La asistencia solo se puede registrar mientras el evento esté en curso.'
      );
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

    const asistenciaExistente = eventoSeleccionado.asistentes.some(
      (asistente) => asistente.usuarioId === identificadorUsuario
    );

    if (asistenciaExistente) {
      alert('Ya tienes una asistencia registrada en este evento.');
      return;
    }

    const nuevaAsistencia = {
      usuarioId: identificadorUsuario,
      nombre:
        formularioInicial.nombresApellidos || 'Usuario registrado',
      parroquia: formularioInicial.parroquia || 'No especificada',
      registradoEn: new Date().toISOString(),
      evidencias: fotosEvidencia.map((foto) => ({
        nombre: foto.name,
        tipo: foto.type,
        tamaño: foto.size,
      })),
    };

    setEventos((eventosAnteriores) =>
      eventosAnteriores.map((evento) =>
        evento.id === eventoSeleccionado.id
          ? {
              ...evento,
              asistentes: [...evento.asistentes, nuevaAsistencia],
            }
          : evento
      )
    );

    setFotosEvidencia([]);
    alert('Asistencia registrada correctamente con 3 fotos de evidencia.');
  };

  const actualizarFormulario = (event) => {
    const { name, value } = event.target;

    setFormularioInicial((datosAnteriores) => {
      const datosActualizados = {
        ...datosAnteriores,
        [name]: value,
      };

      if (name === 'estado') {
        datosActualizados.municipio = '';
        datosActualizados.parroquia = '';
        datosActualizados.comuna = '';
      }

      if (name === 'municipio') {
        datosActualizados.parroquia = '';
        datosActualizados.comuna = '';
      }

      if (name === 'parroquia') {
        datosActualizados.comuna = '';
      }

      return datosActualizados;
    });
  };

  const claveMunicipio = `${formularioInicial.estado}|${formularioInicial.municipio}`;
  const parroquiasDisponibles = parroquiasPorMunicipio[claveMunicipio] || [];

  const guardarRegistroInicial = (event) => {
    event.preventDefault();

    const edadCalculada = calcularEdad(formularioInicial.fechaNacimiento);

    if (!formularioInicial.fechaNacimiento || edadCalculada === '') {
      alert('Selecciona una fecha de nacimiento válida. La fecha no puede ser futura.');
      return;
    }

    localStorage.setItem('perfilUsuario', JSON.stringify(formularioInicial));
    setRegistroCompletado(true);
  };

  if (!registroCompletado) {
    return (
      <div
        style={{
          minHeight: '100vh',
          padding: '24px',
          background: '#f4f7fb',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: '620px',
            margin: '0 auto',
            padding: '24px',
            background: '#ffffff',
            borderRadius: '18px',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.08)',
          }}
        >
          <h1 style={{ marginTop: 0 }}>Completa tu registro</h1>
          <p style={{ color: '#5f6b7a', lineHeight: 1.5 }}>
            Antes de entrar a la aplicación necesitamos algunos datos.
          </p>

          <form onSubmit={guardarRegistroInicial}>
            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Cédula</span>
              <input
                name="cedula"
                type="text"
                value={formularioInicial.cedula}
                onChange={actualizarFormulario}
                required
                placeholder="Escribe tu cédula"
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '6px',
                  padding: '12px',
                  boxSizing: 'border-box',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Nombres y apellidos</span>
              <input
                name="nombresApellidos"
                type="text"
                value={formularioInicial.nombresApellidos}
                onChange={actualizarFormulario}
                required
                placeholder="Escribe tus nombres y apellidos"
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '6px',
                  padding: '12px',
                  boxSizing: 'border-box',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Género</span>
              <select
                name="genero"
                value={formularioInicial.genero}
                onChange={actualizarFormulario}
                required
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '6px',
                  padding: '12px',
                  boxSizing: 'border-box',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  background: '#ffffff',
                }}
              >
                <option value="">Selecciona una opción</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
              </select>
            </label>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 0.8fr',
                gap: '12px',
                marginBottom: '14px',
              }}
            >
              <div>
                <label
                  htmlFor="fechaNacimiento"
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    color: '#263449',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Fecha de nacimiento
                </label>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: '50px',
                    boxSizing: 'border-box',
                    border: '1px solid #dbe4ef',
                    borderRadius: '14px',
                    background: '#f8fafc',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      marginLeft: '8px',
                      borderRadius: '9px',
                      background: '#e8f0ff',
                      color: '#2563eb',
                      fontSize: '17px',
                    }}
                  >
                    ◷
                  </span>

                  <input
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    type="date"
                    value={formularioInicial.fechaNacimiento}
                    onChange={actualizarFormulario}
                    max={obtenerFechaActualLocal()}
                    required
                    style={{
                      width: '100%',
                      minWidth: 0,
                      padding: '14px 6px',
                      border: 0,
                      outline: 'none',
                      background: 'transparent',
                      color: '#263449',
                      fontFamily: 'inherit',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <div>
                <span
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    color: '#263449',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Edad
                </span>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: '50px',
                    boxSizing: 'border-box',
                    border: '1px solid #d8eee6',
                    borderRadius: '14px',
                    background: '#f1f7f5',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      marginLeft: '8px',
                      borderRadius: '9px',
                      background: '#e8f7f1',
                      color: '#159570',
                      fontSize: '16px',
                    }}
                  >
                    ✦
                  </span>

                  <span
                    style={{
                      padding: '14px 8px',
                      color: '#475569',
                      fontSize: '14px',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formularioInicial.fechaNacimiento
                      ? `${calcularEdad(
                          formularioInicial.fechaNacimiento
                        )} años`
                      : '—'}
                  </span>
                </div>
              </div>
            </div>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Estado</span>
              <select
                name="estado"
                value={formularioInicial.estado}
                onChange={actualizarFormulario}
                required
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '6px',
                  padding: '12px',
                  boxSizing: 'border-box',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  background: '#ffffff',
                }}
              >
                <option value="">Selecciona tu estado</option>
                <option value="Amazonas">Amazonas</option>
                <option value="Anzoátegui">Anzoátegui</option>
                <option value="Apure">Apure</option>
                <option value="Aragua">Aragua</option>
                <option value="Barinas">Barinas</option>
                <option value="Bolívar">Bolívar</option>
                <option value="Carabobo">Carabobo</option>
                <option value="Cojedes">Cojedes</option>
                <option value="Delta Amacuro">Delta Amacuro</option>
                <option value="Distrito Capital">Distrito Capital</option>
                <option value="Falcón">Falcón</option>
                <option value="Guárico">Guárico</option>
                <option value="La Guaira">La Guaira</option>
                <option value="Lara">Lara</option>
                <option value="Mérida">Mérida</option>
                <option value="Miranda">Miranda</option>
                <option value="Monagas">Monagas</option>
                <option value="Nueva Esparta">Nueva Esparta</option>
                <option value="Portuguesa">Portuguesa</option>
                <option value="Sucre">Sucre</option>
                <option value="Táchira">Táchira</option>
                <option value="Trujillo">Trujillo</option>
                <option value="Yaracuy">Yaracuy</option>
                <option value="Zulia">Zulia</option>
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Municipio</span>
              <select
                name="municipio"
                value={formularioInicial.municipio}
                onChange={actualizarFormulario}
                required
                disabled={!formularioInicial.estado}
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '6px',
                  padding: '12px',
                  boxSizing: 'border-box',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  background: '#ffffff',
                }}
              >
                <option value="">
                  {formularioInicial.estado
                    ? 'Selecciona tu municipio'
                    : 'Primero selecciona un estado'}
                </option>
                {(municipiosPorEstado[formularioInicial.estado] || []).map(
                  (municipio) => (
                    <option key={municipio} value={municipio}>
                      {municipio}
                    </option>
                  )
                )}
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Parroquia</span>
              <select
                name="parroquia"
                value={formularioInicial.parroquia}
                onChange={actualizarFormulario}
                required={parroquiasDisponibles.length > 0}
                disabled={!formularioInicial.municipio}
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '6px',
                  padding: '12px',
                  boxSizing: 'border-box',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  background: '#ffffff',
                }}
              >
                <option value="">
                  {!formularioInicial.municipio
                    ? 'Primero selecciona un municipio'
                    : parroquiasDisponibles.length > 0
                      ? 'Selecciona tu parroquia'
                      : 'No hay parroquias cargadas para este municipio'}
                </option>
                {parroquiasDisponibles.map((parroquia) => (
                  <option key={parroquia} value={parroquia}>
                    {parroquia}
                  </option>
                ))}
              </select>
              {formularioInicial.municipio &&
                parroquiasDisponibles.length === 0 && (
                  <small
                    style={{
                      display: 'block',
                      marginTop: '6px',
                      color: '#b45309',
                    }}
                  >
                    Este municipio todavía no tiene su catálogo de parroquias agregado.
                  </small>
                )}
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Comuna</span>
              <input
                name="comuna"
                type="text"
                value={formularioInicial.comuna}
                onChange={actualizarFormulario}
                required
                placeholder="Escribe tu comuna"
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '6px',
                  padding: '12px',
                  boxSizing: 'border-box',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Concejo comunal</span>
              <input
                name="concejoComunal"
                type="text"
                value={formularioInicial.concejoComunal}
                onChange={actualizarFormulario}
                required
                placeholder="Escribe el concejo comunal"
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '6px',
                  padding: '12px',
                  boxSizing: 'border-box',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Teléfono</span>
              <input
                name="telefono"
                type="tel"
                value={formularioInicial.telefono}
                onChange={actualizarFormulario}
                required
                placeholder="Escribe tu teléfono"
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '6px',
                  padding: '12px',
                  boxSizing: 'border-box',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span>Correo</span>
              <input
                name="correo"
                type="email"
                value={formularioInicial.correo}
                onChange={actualizarFormulario}
                required
                placeholder="Escribe tu correo"
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '6px',
                  padding: '12px',
                  boxSizing: 'border-box',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '18px' }}>
              <span>Usuario de Telegram</span>
              <input
                name="usuarioTelegram"
                type="text"
                value={formularioInicial.usuarioTelegram}
                readOnly
                placeholder="Se completará automáticamente en Telegram"
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '6px',
                  padding: '12px',
                  boxSizing: 'border-box',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  background: '#eef2f7',
                }}
              />
            </label>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                border: 0,
                borderRadius: '10px',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Guardar y continuar
            </button>
          </form>
        </div>
      </div>
    );
  }

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

        {activeTab === 'feed' ? (
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
                  ORGANIZACIÓN TERRITORIAL
                </p>

                <h2>Eventos de Caracas</h2>

                <p className="page-description">
                  Administra eventos estadales y parroquiales,
                  registra asistencias y reúne evidencias.
                </p>
              </div>

              <button
                className="back-button"
                onClick={() => setActiveTab('inicio')}
              >
                Inicio
              </button>
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
                <span>Parroquias disponibles</span>
              </div>
            </div>

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
                : '+ Crear evento'}
            </button>

            {mostrarFormularioEvento && (
              <form
                className="evento-form-card"
                onSubmit={crearEvento}
              >
                <div className="section-title-row">
                  <div>
                    <p className="section-label">
                      NUEVA ACTIVIDAD
                    </p>

                    <h3>Crear evento</h3>
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
                  <span>Nivel del evento</span>

                  <select
                    name="nivel"
                    value={formularioEvento.nivel}
                    onChange={actualizarFormularioEvento}
                    required
                  >
                    <option value="estadal">
                      Evento estadal
                    </option>

                    <option value="parroquial">
                      Evento parroquial
                    </option>
                  </select>
                </label>

                {formularioEvento.nivel === 'parroquial' && (
                  <label className="evento-form-field">
                    <span>Parroquia</span>

                    <select
                      name="parroquia"
                      value={formularioEvento.parroquia}
                      onChange={actualizarFormularioEvento}
                      required
                    >
                      <option value="">
                        Selecciona una parroquia
                      </option>

                      {parroquiasCaracas.map((parroquia) => (
                        <option
                          key={parroquia}
                          value={parroquia}
                        >
                          {parroquia}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

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
              {eventos.length === 0 ? (
                <div className="empty-page evento-empty-state">
                  <span className="empty-icon">◷</span>

                  <h3>Aún no hay eventos registrados</h3>

                  <p>
                    Crea el primer evento estadal o parroquial
                    para generar su QR de asistencia.
                  </p>
                </div>
              ) : (
                eventos.map((evento) => (
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
                        {evento.nivel === 'estadal'
                          ? 'ESTADAL'
                          : 'PARROQUIAL'}
                      </span>

                      <span className="evento-status">
                        {obtenerEtiquetaEstadoEvento(
                          evento.estado
                        )}
                      </span>
                    </div>

                    <h3>{evento.titulo}</h3>

                    <p className="evento-location">
                      ⌖ {evento.parroquia}
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
                        {eventoSeleccionado.nivel ===
                        'estadal'
                          ? 'EVENTO ESTADAL'
                          : 'EVENTO PARROQUIAL'}
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
                          <ul className="photo-name-list">
                            {fotosEvidencia.map(
                              (foto, index) => (
                                <li key={`${foto.name}-${index}`}>
                                  {foto.name}
                                </li>
                              )
                            )}
                          </ul>
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
                <p className="section-label">IMPULSO PRODUCTIVO</p>
                <h2>Emprendimientos</h2>
                <p className="page-description">
                  Espacio para visibilizar iniciativas, proyectos y oportunidades
                  productivas del territorio.
                </p>
              </div>

              <button
                className="back-button"
                onClick={() => setActiveTab('inicio')}
              >
                Inicio
              </button>
            </div>

            <div className="emprendimientos-highlight">
              <span className="emprendimiento-highlight-icon">✦</span>

              <div>
                <p className="section-label">NUEVO MÓDULO</p>
                <h3>Impulsa tu iniciativa</h3>
                <p>
                  Registra, consulta y comparte información sobre emprendimientos
                  vinculados con las comunidades y los territorios.
                </p>
              </div>
            </div>

            <div className="emprendimientos-cards">
              <article className="emprendimiento-card">
                <span>01</span>
                <h3>Registrar iniciativa</h3>
                <p>
                  Agrega información básica de un emprendimiento o proyecto
                  productivo.
                </p>
                <button className="secondary-button">
                  Próximamente
                </button>
              </article>

              <article className="emprendimiento-card">
                <span>02</span>
                <h3>Explorar proyectos</h3>
                <p>
                  Consulta las iniciativas organizadas por territorio y área.
                </p>
                <button className="secondary-button">
                  Próximamente
                </button>
              </article>

              <article className="emprendimiento-card">
                <span>03</span>
                <h3>Conectar oportunidades</h3>
                <p>
                  Encuentra espacios de colaboración, apoyo y crecimiento.
                </p>
                <button className="secondary-button">
                  Próximamente
                </button>
              </article>
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
          active={activeTab === 'territorio'}
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
