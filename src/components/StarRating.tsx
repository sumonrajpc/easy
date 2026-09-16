import { Star } from "lucide-react";

export default function StarRating({
  rating,
  size = 16,
  showValue = true,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
}) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={
              i <= rounded
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-200 text-slate-200"
            }
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-slate-700">
          {rating > 0 ? rating.toFixed(1) : "New"}
        </span>
      )}
    </div>
  );
}
