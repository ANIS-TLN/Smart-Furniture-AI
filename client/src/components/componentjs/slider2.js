import React, { useEffect, useRef } from "react";
import "../componentcss/slider2.css";

const images = [
  { image: "/images/salon.jpg", titre: "Salons élégants", description: "Espaces modernes et chaleureux." },
  { image: "/images/chambre.jpg", titre: "Chambres apaisantes", description: "Design épuré et confort optimal." },
  { image: "/images/cuisine.jpg", titre: "Cuisines fonctionnelles", description: "Esthétiques et pratiques." },
  { image: "/images/exterieur.jpg", titre: "Extérieurs accueillants", description: "Mobilier pour vos moments de détente." },
  { image: "/images/bureau.jpg", titre: "Bureaux inspirants", description: "Boostez votre productivité." },
  { image: "/images/rangement.jpg", titre: "Rangements malins", description: "Optimisez chaque recoin." },
  { image: "/images/salledebain.jpg", titre: "Salles de bains design", description: "Élégance et fonctionnalité." },
];

const Slider2 = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-modern-container">
      <div className="slider-modern" ref={sliderRef}>
        {images.map((item, index) => (
          <div key={index} className="slider-modern-card">
            <img src={item.image} alt={item.titre} />
            <div className="slider-modern-overlay">
              <h3>{item.titre}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider2;
