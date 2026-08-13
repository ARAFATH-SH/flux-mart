import { Star } from "lucide-react";

export default function Stars({ rating, size = 13 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} fill={i <= Math.round(rating) ? "#F0A020" : "none"} color={i <= Math.round(rating) ? "#F0A020" : "#D3D4DE"} />
      ))}
    </div>
  );
}
