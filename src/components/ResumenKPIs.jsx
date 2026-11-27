// ============================================================================
// [Ticket 09] Cuadro de mando reutilizable
// Recibe la lista de alumnos por props y calcula los indicadores en cada
// render, así que se actualiza solo al añadir alumnos o cambiar los filtros.
// ============================================================================

const NOTA_APROBADO = 5;

function TarjetaKPI({ etiqueta, valor }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{etiqueta}</div>
      <div className="kpi-value">{valor}</div>
    </div>
  );
}

export default function ResumenKPIs({ alumnos }) {
  const total = alumnos.length;
  const media = total > 0 ? alumnos.reduce((suma, a) => suma + a.nota, 0) / total : 0;
  const aprobados = alumnos.filter((a) => a.nota >= NOTA_APROBADO).length;
  const porcentajeAprobados = total > 0 ? (aprobados / total) * 100 : 0;

  return (
    <div className="grid-3" aria-label="Resumen de indicadores">
      <TarjetaKPI etiqueta="Total de alumnos" valor={total} />
      <TarjetaKPI etiqueta="Nota media del grupo" valor={total > 0 ? media.toFixed(2) : '—'} />
      <TarjetaKPI
        etiqueta="Porcentaje de aprobados"
        valor={total > 0 ? `${porcentajeAprobados.toFixed(1)} %` : '—'}
      />
    </div>
  );
}
