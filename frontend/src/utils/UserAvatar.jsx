import { useState } from "react";
import PropTypes from "prop-types";
import "./UserAvatar.css";

const UserAvatar = ({ src, username, size = 50, className = "" }) => {
  const [hasError, setHasError] = useState(false);

  const getInitial = () => {
    return username?.[0]?.toUpperCase() || "U";
  };

  return src && !hasError ? (
    <img
      src={src}
      alt={getInitial()}
      onError={() => setHasError(true)}
      className={`user-avatar-img ${className}`}
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className={`user-avatar-fallback ${className}`}
      style={{ width: size, height: size }}
    >
      {getInitial()}
    </div>
  );
};

UserAvatar.propTypes = {
  src: PropTypes.string,
  username: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
};

export default UserAvatar;

