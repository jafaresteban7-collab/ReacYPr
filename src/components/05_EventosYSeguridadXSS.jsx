import { useRef, useState } from 'react';

// ============================================================================
// [CLAVE EXPOSICIÓN 5] EVENTOS EN JSX Y SEGURIDAD AUTOMÁTICA CONTRA XSS
// ----------------------------------------------------------------------------
// 1. EVENTOS:
//    - En HTML: onclick="saludar()" (cadena de texto).
//    - En JSX:  onClick={saludar}   (referencia a función en camelCase).
//    - Si necesita argumentos: onClick={() => saludar('DAM2')}.
//      ¡ERROR TÍPICO!: escribir onClick={saludar('DAM2')} ejecuta la función
//      inmediatamente al renderizar, no al hacer clic.
// 2. PREVENCIÓN DE XSS (Cross-Site Scripting):
//    - JSX escapa automáticamente cualquier cadena insertada dentro de { }.
//    - Si un atacante introduce `<script>` o `<img onerror=...>`, React lo
//      pinta como texto plano seguro sin ejecutar código JavaScript.
// ============================================================================

const MAX_EVENTOS = 5;

// [Ticket 06] Vectores de prueba: JSX debe mostrarlos como texto sin ejecutarlos
const PAYLOADS_XSS = [
  { id: 'img', etiqueta: '<img onerror>', valor: `<img src=x onerror="alert('XSS img')" />` },
  { id: 'script', etiqueta: '<script>', valor: `<script>alert(document.cookie)</script>` },
  {
    id: 'svg',
    etiqueta: '<svg onload> + javascript:',
    valor: `<svg onload="alert('XSS svg')"></svg><a href="javascript:alert('XSS link')">clic</a>`
  }
];

export default function EventosYSeguridadXSS() {
  const [historial, setHistorial] = useState([]);
  const [entradaUsuario, setEntradaUsuario] = useState(PAYLOADS_XSS[0].valor);
  const contadorId = useRef(0);

  // Añade un evento al principio y conserva solo los 5 más recientes
  const registrarEvento = (descripcion) => {
    contadorId.current += 1;
    const evento = {
      id: contadorId.current,
      hora: new Date().toLocaleTimeString(),
      descripcion
    };
    setHistorial((prev) => [evento, ...prev].slice(0, MAX_EVENTOS));
  };

  // Manejador sin parámetros (se pasa como referencia: onClick={manejarClickSimple})
  const manejarClickSimple = () => {
    registrarEvento('Clic simple registrado');
  };

  // Manejador con parámetros (requiere función flecha: onClick={() => manejarConParametro(...)})
  const manejarConParametro = (accion) => {
    registrarEvento(`Acción ejecutada con parámetro: "${accion}"`);
  };

  const cargarPayload = (payload) => {
    setEntradaUsuario(payload.valor);
    registrarEvento(`Payload XSS de prueba cargado: ${payload.etiqueta}`);
  };

  return (
    <section className="card">
      <h2>5. Manejo de Eventos y Protección Nativa contra XSS</h2>
      <p className="subtitle">
        Prueba los botones de eventos y comprueba cómo JSX neutraliza automáticamente código HTML/JS malicioso.
      </p>

      <div className="grid-2">
        <div className="box box-success">
          <h3>Sintaxis de Eventos (Synthetic Events)</h3>
          <div className="btn-row">
            {/* Referencia directa a la función */}
            <button type="button" className="btn" onClick={manejarClickSimple}>
              onClick=&#123;fn&#125;
            </button>
            {/* Función flecha para pasar argumentos sin ejecutar en el render */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => manejarConParametro('Exportar PDF')}
            >
              onClick=&#123;() =&gt; fn(arg)&#125;
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setHistorial([])}
              disabled={historial.length === 0}
            >
              Limpiar historial
            </button>
          </div>

          {/* [Ticket 06] Historial de los últimos 5 eventos */}
          <h3>Historial de eventos (últimos {MAX_EVENTOS})</h3>
          {historial.length === 0 ? (
            <p className="empty-state">Ningún evento registrado todavía.</p>
          ) : (
            <ol className="list" aria-live="polite">
              {historial.map((evento) => (
                <li key={evento.id} className="list-item" style={{ fontSize: '0.88rem' }}>
                  <span>{evento.descripcion}</span>
                  <code className="code-inline">{evento.hora}</code>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="box box-warn">
          <h3>Escapado automático contra XSS</h3>
          <label htmlFor="xss-input">Introduce HTML o un payload XSS:</label>
          <input
            id="xss-input"
            type="text"
            className="input"
            value={entradaUsuario}
            onChange={(e) => setEntradaUsuario(e.target.value)}
          />

          {/* [Ticket 06] Banco de pruebas: rellena el input con vectores maliciosos */}
          <div className="btn-row">
            {PAYLOADS_XSS.map((payload, i) => (
              <button
                key={payload.id}
                type="button"
                className="btn btn-secondary"
                onClick={() => cargarPayload(payload)}
                title={payload.valor}
              >
                Cargar payload XSS de prueba {i + 1}: {payload.etiqueta}
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.65rem',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontFamily: 'Consolas, monospace',
              fontSize: '0.85rem',
              wordBreak: 'break-all'
            }}
          >
            {/* JSX escapa automáticamente esta cadena: NO se ejecuta el script */}
            Salida renderizada segura: {entradaUsuario}
          </div>
        </div>
      </div>

      <p className="file-hint">
        Archivo para mostrar en VS Code: <code className="code-inline">src/components/05_EventosYSeguridadXSS.jsx</code>
      </p>
    </section>
  );
}
