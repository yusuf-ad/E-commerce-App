import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function Rating({ value, text }) {
  return (
    <div className="rating">
      {Array.from({ length: 5 }, (_, index) => index + 1).map((star) => (
        <span key={star}>
          {value >= star ? (
            <FaStar />
          ) : value >= star - 0.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
        </span>
      ))}

      {text && <span className="rating-text">{text}</span>}
    </div>
  );
}

export default Rating;
