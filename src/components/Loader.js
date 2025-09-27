import React from 'react';
import './Loader.css';

const Loader = ({ 
  size = 'large', 
  text = 'Loading...',
  className = ''
}) => {
  const sizeMap = {
    small: '3rem',
    medium: '4.5rem',
    large: '6rem',
    xlarge: '8rem'
  };

  return (
    <div className={`loader-container ${className}`}>
      <div 
        className="loader-spinner" 
        style={{
          '--size': sizeMap[size] || sizeMap.large,
        }}
      >
        <div className="loader-spinner-inner">
          <div className="loader-dot dot-1"></div>
          <div className="loader-dot dot-2"></div>
          <div className="loader-dot dot-3"></div>
          <div className="loader-dot dot-4"></div>
        </div>
      </div>
      {text && <div className="loader-text">{text}</div>}
    </div>
  );
};

export default Loader;
