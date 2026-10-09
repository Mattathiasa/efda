export interface Stat {
  num: string;
  label: string;
}

/* Four number + label pairs under a thin rule. Plain text, deliberately no
   counting animation. */
export function StatRow({stats}: {stats: Stat[]}) {
  return (
    <div className="stats">
      {stats.map((s, i) => (
        <div className="stat" key={i}>
          <div className="stat__num">{s.num}</div>
          <p className="stat__label">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
