import { useState } from 'react';

// ============================================================================
// [CLAVE EXPOSICIÓN 1] REGLAS SINTÁCTICAS FUNDAMENTALES DE JSX
// ----------------------------------------------------------------------------
// 1. UN SOLO ELEMENTO RAÍZ: Un componente debe devolver un único nodo padre.
//    Para evitar <div> innecesarios en el DOM, usamos Fragmentos: <> ... </>
// 2. CIERRE OBLIGATORIO: Etiquetas vacías como <input />, <br />, <hr />
//    SIEMPRE deben cerrarse con `/`.
// 3. PALABRAS RESERVADAS DE JS:
//    - En HTML: class="..."   -> En JSX: className="..."
//    - En HTML: for="..."     -> En JSX: htmlFor="..."
// 4. MAYÚSCULAS VS MINÚSCULAS:
//    - <button> (minúscula)   -> Etiqueta HTML nativa
//    - <EtiquetaInfo /> (May) -> Componente personalizado de React
// ============================================================================

const LONGITUD_MINIMA = 3;

// Pequeño componente auxiliar (obligatoriamente empieza en MAYÚSCULA)
function EtiquetaInfo({ texto }) {
  return <span className="pill">{texto}</span>;
}

export default function SintaxisYFragmentos() {
  // [Ticket 02] Input controlado: el valor vive en el estado de React
  const [nombreAlumno, setNombreAlumno] = useState('');

  const nombreLimpio = nombreAlumno.trim();
  const esDemasiadoCorto = nombreLimpio.length > 0 && nombreLimpio.length < LONGITUD_MINIMA;
  const esValido = nombreLimpio.length >= LONGITUD_MINIMA;

  // Este bloque demuestra el uso de Fragment (<>...</>):
  // Si inspeccionas el DOM en el navegador (F12), verás que el Fragment
  // NO crea ningún <div> extra envolviendo las tarjetas.
  return (
    <>
      <section className="card">
        <h2>1. Reglas Sintácticas y Fragmentos (&lt;&gt;...&lt;/&gt;)</h2>
        <p className="subtitle">
          JSX parece HTML, pero se compila a llamadas de JavaScript (<code className="code-inline">_jsx()</code>).
          Por eso es más estricto que HTML5.
        </p>

        <div className="grid-2">
          <div className="box box-success">
            <h3>Atributos adaptados a JavaScript</h3>
            {/* Comentario en JSX: siempre entre llaves y sintaxis de bloque JS */}
            <label htmlFor="campo-alumno">
              Nombre del alumno (<code className="code-inline">htmlFor</code> en lugar de <code className="code-inline">for</code>):
            </label>
            {/* Etiqueta autocerrada obligatoria con "/" al final */}
            <input
              id="campo-alumno"
              type="text"
              className={`input ${esDemasiadoCorto ? 'input-error' : ''}`}
              placeholder="Ej.: Elena Martínez"
              value={nombreAlumno}
              onChange={(e) => setNombreAlumno(e.target.value)}
              aria-invalid={esDemasiadoCorto}
              aria-describedby="campo-alumno-ayuda"
            />

            {/* [Ticket 02] Validación inmediata en cada pulsación */}
            <div id="campo-alumno-ayuda">
              {esDemasiadoCorto && (
                <p role="alert" className="msg-error" style={{ color: 'var(--red-text)' }}>
                  El nombre debe tener al menos {LONGITUD_MINIMA} caracteres.
                </p>
              )}
              {esValido && <p className="msg-ok">Bienvenido/a al portal, {nombreLimpio}</p>}
            </div>
          </div>

          <div className="box box-warn">
            <h3>Componentes en Mayúscula vs. HTML</h3>
            <p className="text-soft" style={{ marginBottom: '0.75rem' }}>
              Abajo renderizamos un componente propio <code className="code-inline">&lt;EtiquetaInfo /&gt;</code>:
            </p>
            <EtiquetaInfo texto="Componente con inicial Mayúscula" />
            <br />
            <br />
            <small style={{ color: 'var(--muted)' }}>
              Nota: los saltos de línea anteriores usan <code className="code-inline">&lt;br /&gt;</code> cerrado.
            </small>
          </div>
        </div>

        <p className="file-hint">
          Archivo para mostrar en VS Code: <code className="code-inline">src/components/01_SintaxisYFragmentos.jsx</code>
        </p>
      </section>
    </>
  );
}
