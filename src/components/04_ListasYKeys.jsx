import { useState } from 'react';

// ============================================================================
// [CLAVE EXPOSICIÓN 4] RENDERIZADO DE LISTAS CON .map() Y LA PROP `key`
// ----------------------------------------------------------------------------
// 1. En JSX no se usan bucles `for`; se transforman arrays con `.map()`.
// 2. Cada elemento raíz devuelto dentro de `.map()` DEBE llevar una prop `key`
//    única y estable entre renderizados (normalmente un `id` de BD o UUID).
// 3. ¿POR QUÉ NO USAR EL ÍNDICE DEL ARRAY (`index`) COMO `key`?
//    Si reordenas, filtras o eliminas el primer elemento, todos los índices
//    cambian y React confunde el estado interno de cada fila (por ejemplo,
//    el texto escrito en un <input> o un checkbox marcado).
// ============================================================================

const MODULOS_INICIALES = [
  { id: 'di-01', codigo: 'DI', nombre: 'Desarrollo de Interfaces', horas: 120 },
  { id: 'psp-02', codigo: 'PSP', nombre: 'Programación de Servicios y Procesos', horas: 90 },
  { id: 'ad-03', codigo: 'AD', nombre: 'Acceso a Datos', horas: 120 }
];

// Normaliza un texto para comparar sin distinguir mayúsculas ni espacios extra
const normalizar = (texto) => texto.trim().toLocaleLowerCase('es');

export default function ListasYKeys() {
  const [modulos, setModulos] = useState(MODULOS_INICIALES);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const agregarModulo = (e) => {
    e.preventDefault();
    const nombre = nuevoNombre.trim();
    if (!nombre) return;

    // [Ticket 05] Control de duplicados sin distinguir mayúsculas/minúsculas
    const yaExiste = modulos.some((m) => normalizar(m.nombre) === normalizar(nombre));
    if (yaExiste) {
      setError(`El módulo "${nombre}" ya existe en la lista.`);
      return;
    }

    const nuevo = {
      id: `mod-${Date.now()}`, // ID único estable (mejor que usar el índice del array)
      codigo: 'OPT',
      nombre,
      horas: 60
    };
    // Insertamos al principio para demostrar que React conserva la identidad de cada fila
    setModulos([nuevo, ...modulos]);
    setNuevoNombre('');
    setError('');
  };

  const eliminarModulo = (idAEliminar) => {
    setModulos(modulos.filter((m) => m.id !== idAEliminar));
  };

  const invertirOrden = () => {
    setModulos([...modulos].reverse());
  };

  // [Ticket 05] Filtrado en tiempo real por nombre o código
  const termino = normalizar(busqueda);
  const modulosVisibles = termino
    ? modulos.filter(
        (m) => normalizar(m.nombre).includes(termino) || normalizar(m.codigo).includes(termino)
      )
    : modulos;

  return (
    <section className="card">
      <h2>4. Listas Dinámicas con .map() y la prop key</h2>
      <p className="subtitle">
        Cada elemento de la lista utiliza <code className="code-inline">key=&#123;modulo.id&#125;</code> para
        que el algoritmo de reconciliación (Virtual DOM) identifique cambios con precisión.
      </p>

      <form onSubmit={agregarModulo} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          className={`input ${error ? 'input-error' : ''}`}
          style={{ flex: '1 1 260px', marginTop: 0 }}
          placeholder="Añadir nuevo módulo al principio de la lista..."
          aria-label="Nombre del nuevo módulo"
          aria-invalid={Boolean(error)}
          value={nuevoNombre}
          onChange={(e) => {
            setNuevoNombre(e.target.value);
            if (error) setError('');
          }}
        />
        <button type="submit" className="btn">Añadir módulo</button>
        <button type="button" className="btn btn-secondary" onClick={invertirOrden}>
          Invertir orden
        </button>
      </form>

      {error && (
        <p role="alert" className="msg-error">
          {error}
        </p>
      )}

      <div className="field" style={{ marginTop: '1rem' }}>
        <label htmlFor="buscar-modulo">Buscar por nombre o código:</label>
        <input
          id="buscar-modulo"
          type="search"
          className="input"
          placeholder="Ej.: DI, datos, procesos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* [Ticket 05] Contador dinámico */}
      <p className="subtitle" style={{ marginBottom: 0 }} aria-live="polite">
        Mostrando {modulosVisibles.length} de {modulos.length} módulos
      </p>

      <ul className="list">
        {modulosVisibles.map((modulo) => (
          // [CLAVE EXPOSICIÓN] La `key` va siempre en el elemento raíz del `.map()`
          <li key={modulo.id} className="list-item">
            <div>
              <span className="pill" style={{ marginRight: '0.6rem' }}>{modulo.codigo}</span>
              <strong>{modulo.nombre}</strong>
              <span style={{ color: 'var(--muted)', marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                ({modulo.horas} h · key: <code className="code-inline">{modulo.id}</code>)
              </span>
            </div>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => eliminarModulo(modulo.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {modulos.length === 0 && (
        <p className="empty-state">No quedan módulos en la lista. Añade uno nuevo arriba.</p>
      )}
      {modulos.length > 0 && modulosVisibles.length === 0 && (
        <p className="empty-state">Ningún módulo coincide con «{busqueda.trim()}».</p>
      )}

      <p className="file-hint">
        Archivo para mostrar en VS Code: <code className="code-inline">src/components/04_ListasYKeys.jsx</code>
      </p>
    </section>
  );
}
