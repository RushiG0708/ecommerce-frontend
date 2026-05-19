import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating, numReviews, size = "text-sm" }) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (rating >= i + 1) return "full";
    if (rating >= i + 0.5) return "half";
    return "empty";
  });

  return (
    <div className="flex items-center gap-1">
      <div className={`flex text-yellow-400 ${size}`}>
        {stars.map((type, i) =>
          type === "full" ? (
            <FaStar key={i} />
          ) : type === "half" ? (
            <FaStarHalfAlt key={i} />
          ) : (
            <FaRegStar key={i} />
          ),
        )}
      </div>
      {numReviews !== undefined && (
        <span className="text-gray-500 text-xs">({numReviews})</span>
      )}
    </div>
  );
};

export default StarRating;
