import React from 'react';

export const LoadingScreen = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>Cargando página...</p>
    </div>
  );
};