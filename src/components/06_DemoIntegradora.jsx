import { useEffect, useState } from 'react';
import ResumenKPIs from './ResumenKPIs.jsx';

// ============================================================================
// [CLAVE EXPOSICIÓN 6] DEMO INTEGRADORA DE TODAS LAS CARACTERÍSTICAS DE JSX
// ----------------------------------------------------------------------------
// Este componente reúne en un caso real de aula:
// - Fragmentos (<>...</>) y atributos camelCase (className, onClick, onChange)
// - Expresiones JS { } y estilos en línea dinámicos style={{ }}
// - Renderizado condicional (ternario + && booleano seguro)
// - Listas con .map() y key única estable
// - Comunicación mediante props y composición de componentes
// ============================================================================

const EXPEDIENTES = [
  { id: 101, nombre: 'Lucía Serrano', nota: 8.7, modulos: ['DI', 'PSP', 'AD'] },
  { id: 102, nombre: 'Marcos Vega', nota: 4.3, modulos: ['DI', 'SGE'] },
  { id: 103, nombre: 'Sofía Navarro', nota: 9.5, modulos: ['DI', 'PSP', 'AD', 'PMDM'] }
];

// [Ticket 07] Criterios de ordenación disponibles
const ORDENACIONES = {
  'nota-desc': { etiqueta: 'Nota (mayor a menor)', comparar: (a, b) => b.nota - a.nota },
  'nota-asc': { etiqueta: 'Nota (menor a mayor)', comparar: (a, b) => a.nota - b.nota },
  'nombre-asc': {
    etiqueta: 'Nombre (A–Z)',
    comparar: (a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
  }
};

const normalizar = (texto) =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

function TarjetaExpediente({ alumno, seleccionado, onSeleccionar }) {
  const aprobado = alumno.nota >= 5;

  return (
    <article
      className="box"
      style={{
        borderColor: seleccionado ? 'var(--primary)' : 'var(--border)',
        borderWidth: seleccionado ? '2px' : '1px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <h3 style={{ margin: 0 }}>{alumno.nombre}</h3>
        <span className={`badge ${aprobado ? 'badge-ok' : 'badge-fail'}`}>
          {aprobado ? `Aprobado (${alumno.nota})` : `Pendiente (${alumno.nota})`}
        </span>
      </div>

      {alumno.modulos.length > 0 && (
        <div className="btn-row" style={{ marginTop: '0.6rem' }}>
          {alumno.modulos.map((mod) => (
            <span key={`${alumno.id}-${mod}`} className="code-inline">
              {mod}
            </span>
          ))}
        </div>
      )}

      <div className="btn-row">
        <button type="button" className="btn" onClick={() => onSeleccionar(alumno)}>
          {seleccionado ? 'Expediente seleccionado' : 'Seleccionar expediente'}
        </button>
      </div>
    </article>
  );
}

const FORMULARIO_VACIO = { nombre: '', nota: '', modulos: '' };

// Valida el formulario de alta y devuelve un objeto { campo: mensaje }
const validarExpediente = ({ nombre, nota }) => {
  const errores = {};
  if (!nombre.trim()) errores.nombre = 'El nombre completo es obligatorio.';
  const valorNota = Number(nota);
  if (nota === '' || Number.isNaN(valorNota) || valorNota < 0 || valorNota > 10) {
    errores.nota = 'La nota debe ser un número entre 0 y 10.';
  }
  return errores;
};

// [Ticket 10] Persistencia en localStorage
const CLAVE_STORAGE = 'm10-2-expedientes';

const esExpedienteValido = (a) =>
  a &&
  typeof a.id === 'number' &&
  typeof a.nombre === 'string' &&
  typeof a.nota === 'number' &&
  Array.isArray(a.modulos);

// Carga la lista guardada; si no hay datos o están corruptos, usa los iniciales
const cargarExpedientes = () => {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_STORAGE));
    if (Array.isArray(guardado) && guardado.every(esExpedienteValido)) return guardado;
  } catch {
    // JSON inválido o localStorage bloqueado: seguimos con los datos iniciales
  }
  return EXPEDIENTES;
};

// Siguiente id libre: uno más que el mayor existente (nunca se repite)
const siguienteId = (lista) => lista.reduce((max, a) => Math.max(max, a.id), 0) + 1;

export default function DemoIntegradora() {
  // [Ticket 08] Los expedientes pasan a ser estado gestionado por React
  // [Ticket 10] Inicialización perezosa desde localStorage
  const [expedientes, setExpedientes] = useState(cargarExpedientes);
  const [datosRestablecidos, setDatosRestablecidos] = useState(false);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [errores, setErrores] = useState({});
  const [soloAprobados, setSoloAprobados] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('nota-desc');

  // [Ticket 10] Guardado automático en cada cambio. Tras restablecer no se
  // vuelve a escribir la clave hasta que el usuario modifique los datos.
  useEffect(() => {
    if (datosRestablecidos) return;
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(expedientes));
    } catch {
      // Cuota llena o almacenamiento bloqueado: los datos siguen en memoria
    }
  }, [expedientes, datosRestablecidos]);

  const restablecerDatos = () => {
    try {
      localStorage.removeItem(CLAVE_STORAGE);
    } catch {
      // Nada que borrar si localStorage no está disponible
    }
    setDatosRestablecidos(true);
    setExpedientes(EXPEDIENTES);
    setSeleccionado(null);
    setFormulario(FORMULARIO_VACIO);
    setErrores({});
  };

  // [Ticket 07] Búsqueda por nombre + filtro de aprobados + ordenación
  const termino = normalizar(busqueda);
  const listaFiltrada = expedientes
    .filter((a) => !soloAprobados || a.nota >= 5)
    .filter((a) => normalizar(a.nombre).includes(termino))
    .sort(ORDENACIONES[orden].comparar);

  const actualizarCampo = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  // [Ticket 08] Alta de un nuevo expediente
  const darDeAlta = (e) => {
    e.preventDefault();
    const nuevosErrores = validarExpediente(formulario);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const modulos = [
      ...new Set(
        formulario.modulos
          .split(',')
          .map((m) => m.trim().toUpperCase())
          .filter(Boolean)
      )
    ];

    const nuevo = {
      id: siguienteId(expedientes),
      nombre: formulario.nombre.trim(),
      nota: Math.round(Number(formulario.nota) * 100) / 100,
      modulos
    };

    setDatosRestablecidos(false);
    setExpedientes((prev) => [...prev, nuevo]);
    setFormulario(FORMULARIO_VACIO);
    setErrores({});
  };

  return (
    <>
      <section className="card">
        <h2>6. Ejemplo Integrador: Panel de Expedientes DAM2</h2>
        <p className="subtitle">
          Composición de componentes reutilizables aplicando todas las reglas de JSX.
        </p>

        {/* [Ticket 09] Indicadores sobre la lista visible (respeta filtros y búsqueda) */}
        <ResumenKPIs alumnos={listaFiltrada} />

        <div className="grid-2" style={{ marginBottom: '0.5rem' }}>
          <div className="field">
            <label htmlFor="buscar-expediente">Buscar alumno por nombre:</label>
            <input
              id="buscar-expediente"
              type="search"
              className="input"
              placeholder="Ej.: Lucía"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="orden-expedientes">Ordenar por:</label>
            <select
              id="orden-expedientes"
              className="input"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              {Object.entries(ORDENACIONES).map(([clave, { etiqueta }]) => (
                <option key={clave} value={clave}>
                  {etiqueta}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="btn-row" style={{ marginBottom: '1rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setSoloAprobados((prev) => !prev)}
          >
            {soloAprobados ? 'Mostrar todos los alumnos' : 'Filtrar solo aprobados (>= 5)'}
          </button>
          <button type="button" className="btn btn-danger" onClick={restablecerDatos}>
            Restablecer datos iniciales
          </button>

          {seleccionado && (
            <span className="pill">
              Seleccionado: {seleccionado.nombre} (ID #{seleccionado.id})
            </span>
          )}
        </div>

        {listaFiltrada.length === 0 ? (
          <p className="empty-state" role="status">
            No se encontraron expedientes con esos criterios
          </p>
        ) : (
          <div className="grid-2">
            {listaFiltrada.map((alumno) => (
              <TarjetaExpediente
                key={alumno.id}
                alumno={alumno}
                seleccionado={seleccionado?.id === alumno.id}
                onSeleccionar={setSeleccionado}
              />
            ))}
          </div>
        )}

        <p className="file-hint">
          Archivo para mostrar en VS Code: <code className="code-inline">src/components/06_DemoIntegradora.jsx</code>
        </p>
      </section>

      {/* [Ticket 08] Formulario controlado de alta */}
      <section className="card">
        <h2>Alta de nuevo expediente</h2>
        <form onSubmit={darDeAlta} noValidate>
          <div className="grid-3" style={{ marginBottom: 0 }}>
            <div className="field">
              <label htmlFor="alta-nombre">Nombre completo *</label>
              <input
                id="alta-nombre"
                name="nombre"
                type="text"
                className={`input ${errores.nombre ? 'input-error' : ''}`}
                placeholder="Ej.: Elena Martínez"
                value={formulario.nombre}
                onChange={actualizarCampo}
                aria-invalid={Boolean(errores.nombre)}
                required
              />
              {errores.nombre && <span role="alert" className="msg-error">{errores.nombre}</span>}
            </div>
            <div className="field">
              <label htmlFor="alta-nota">Nota (0 – 10) *</label>
              <input
                id="alta-nota"
                name="nota"
                type="number"
                min="0"
                max="10"
                step="0.1"
                className={`input ${errores.nota ? 'input-error' : ''}`}
                placeholder="Ej.: 7.5"
                value={formulario.nota}
                onChange={actualizarCampo}
                aria-invalid={Boolean(errores.nota)}
                required
              />
              {errores.nota && <span role="alert" className="msg-error">{errores.nota}</span>}
            </div>
            <div className="field">
              <label htmlFor="alta-modulos">Módulos (separados por comas)</label>
              <input
                id="alta-modulos"
                name="modulos"
                type="text"
                className="input"
                placeholder="Ej.: DI, PSP, AD"
                value={formulario.modulos}
                onChange={actualizarCampo}
              />
            </div>
          </div>
          <div className="btn-row">
            <button type="submit" className="btn">Dar de alta</button>
          </div>
        </form>
      </section>
    </>
  );
}
