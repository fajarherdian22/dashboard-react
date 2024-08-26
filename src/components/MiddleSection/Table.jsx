import React, { useEffect, useRef } from 'react';
import './style.css';

const MapComponent = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new maplibre.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json', 
      center: [0, 0], 
      zoom: 2,
    });

    return () => {
      map.remove(); 
    };
  }, []);

  return <div className="MapContainer" ref={mapContainer} style={{ width: '100%', height: '500px' }} />;
};

export default MapComponent;
