import React from 'react';
import './Loader.css'; // You'll need to create this CSS file

interface LoaderProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  overlay?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  message = "Loading...", 
  size = 'medium',
  overlay = false 
}) => {
  const loaderClass = `loader ${size}`;
  
  if (overlay) {
    return (
      <div className="loading-container">
        <div className={loaderClass}></div>
        {message && <p className="loading-message">{message}</p>}
      </div>
    );
  }

  return (
    <div className={loaderClass}>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Loader;