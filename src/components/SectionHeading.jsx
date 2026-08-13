export default function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between mb-5 gap-4">
      <div>
        <div className="ff-mono uppercase mb-1" style={{ fontSize: 11, letterSpacing: ".1em", color: "var(--flux)" }}>{eyebrow}</div>
        <h2 className="ff-display font-bold" style={{ fontSize: 26, color: "var(--ink)" }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}
