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
import React, { useEffect, useState } from 'react';
import './index.css'

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
    tab: 'economia',
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
]
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
]
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
]
function App() {
const [showAllQuickActions, setShowAllQuickActions] = useState(false);

  const [pinnedQuickActionTabs, setPinnedQuickActionTabs] = useState(() => {
    try {
      const savedPinnedActions = localStorage.getItem(
        'pinnedQuickActionTabs'
      );

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

  useEffect(() => {
    localStorage.setItem(
      'pinnedQuickActionTabs',
      JSON.stringify(pinnedQuickActionTabs)
    );
  }, [pinnedQuickActionTabs]);

  const pinnedQuickActions = pinnedQuickActionTabs
    .map((tab) =>
      quickActions.find((action) => action.tab === tab)
    )
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
  const [activeTab, setActiveTab] = useState('inicio')
  const [selectedVoceria, setSelectedVoceria] = useState(null)
  const [territoryType, setTerritoryType] = useState('estadal')
  const [territoryMenuOpen, setTerritoryMenuOpen] = useState(false)
const [selectedPost, setSelectedPost] = useState(null)
const [activeFilter, setActiveFilter] = useState('Todo')
  const visiblePosts =
  activeFilter === 'Todo'
    ? feedPosts
    : feedPosts.filter((post) => post.type === activeFilter)
const territoryNames = {
    estadal: 'Consejo Popular Estadal',
    municipal: 'Consejo Popular Municipal',
    parroquial: 'Consejo Popular Parroquial',
  }

  const handleAction = (tab) => {
    setActiveTab(tab)
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
                <h2>Hola, usuario</h2>
                <p className="welcome-copy">
                  Aquí tienes la actividad de tu organización.
                </p>
              </div>

              <div className="avatar">U</div>
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
                  <strong>Caracas</strong>
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
          setTerritoryType('estadal')
          event.currentTarget.closest('details').open = false
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
          setTerritoryType('municipal')
          event.currentTarget.closest('details').open = false
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
          setTerritoryType('parroquial')
          event.currentTarget.closest('details').open = false
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
        <h2>Feed nacional</h2>
        <p className="page-description">
          Revisa las actividades y novedades de la organización.
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
              onClick={() => setSelectedPost(post)}
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
  )
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
  )
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
  }

  return titles[tab] || 'Módulo'
}

export default App
