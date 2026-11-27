import { useState } from 'react';

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

export default function DemoIntegradora() {
  const [soloAprobados, setSoloAprobados] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('nota-desc');

  // [Ticket 07] Búsqueda por nombre + filtro de aprobados + ordenación
  const termino = normalizar(busqueda);
  const listaFiltrada = EXPEDIENTES
    .filter((a) => !soloAprobados || a.nota >= 5)
    .filter((a) => normalizar(a.nombre).includes(termino))
    .sort(ORDENACIONES[orden].comparar);

  return (
    <>
      <section className="card">
        <h2>6. Ejemplo Integrador: Panel de Expedientes DAM2</h2>
        <p className="subtitle">
          Composición de componentes reutilizables aplicando todas las reglas de JSX.
        </p>

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
    </>
  );
}
