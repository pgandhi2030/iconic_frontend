import React from "react";

const CircularProgress = ({ className }) => <div className={`loader ${className}`}>
  <img src="/images/iconic icon.png" alt="loader"/>
</div>;
export default CircularProgress;
CircularProgress.defaultProps = {
  className: ''
}
