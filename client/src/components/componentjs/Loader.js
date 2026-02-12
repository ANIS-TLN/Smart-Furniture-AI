import React, { useState, useEffect } from "react";
import "../componentcss/Loader.css";

export default function Loader({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <div className={`loader-overlay ${!isLoading ? 'hidden' : ''}`}>
        <div className="loader-content">
          <div className="loader-container">
            {/* Spinner ring */}
            <div className="loader-spinner"></div>
            
            {/* Centered image with error handling */}
            <img 
              src="/images/loader.gif" 
              alt="Loading..." 
              className="loader-image"
              onError={(e) => {
                e.target.style.display = 'none';
                // If image fails, we can enhance the spinner
                document.querySelector('.loader-spinner').style.borderWidth = '8px';
                document.querySelector('.loader-spinner').style.borderTopColor = '#4a6bff';
              }}
            />
          </div>
          <p className="loader-text">chargement...</p>
        </div>
      </div>
      
      <div className={`content ${!isLoading ? 'visible' : ''}`}>
        {children}
      </div>
    </>
  );
}