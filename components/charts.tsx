export function BarChart() {
  return (
    <div className="chart-bars">
      {[42, 70, 58, 82, 46, 94, 68, 76].map((height) => (
        <span key={height} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

export function DonutChart() {
  return (
    <>
      <div className="donut">
        <span>86%</span>
      </div>
      <p className="muted">AI score blends schedule, cost, quality, safety, procurement, and cashflow.</p>
    </>
  );
}

export function TimelineChart() {
  const rows = [
    ["Planning", "88%"],
    ["Procure", "64%"],
    ["Execute", "76%"],
    ["Bill", "52%"]
  ];

  return (
    <div className="timeline">
      {rows.map(([label, width]) => (
        <span key={label}>
          {label} <i style={{ width }} />
        </span>
      ))}
    </div>
  );
}
