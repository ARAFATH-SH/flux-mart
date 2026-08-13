export default function KineticHeadline() {
  const words = [
    { t: "instant.", c: "var(--flux)" },
    { t: "loud.", c: "var(--coral)" },
    { t: "bold.", c: "var(--home)" },
    { t: "yours.", c: "var(--grocery)" },
  ];
  return (
    <h1 className="ff-display font-bold tracking-tight" style={{ fontSize: "clamp(2.4rem, 5.6vw, 4.2rem)", lineHeight: 0.98, color: "var(--ink)" }}>
      Deals that move
      <br />
      <span className="relative inline-grid" style={{ height: "1.1em" }}>
        {words.map((w, i) => (
          <span
            key={i}
            className="row-start-1 col-start-1"
            style={{ color: w.c, animation: `ff-cycle 8s ease-in-out infinite`, animationDelay: `${i * 2}s`, opacity: i === 0 ? 1 : 0 }}
          >
            {w.t}
          </span>
        ))}
      </span>
    </h1>
  );
}
