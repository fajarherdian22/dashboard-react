import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import client from '../../services/client';
import Select from 'react-select'

const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});

// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' }
// ]

function MapComponent() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [centralPos, setCentralPos] = useState([0, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch main data
        const mainResponse = await client.get('data/city?date=2024-08-22&city=CIAMIS');
        const fetchedData = mainResponse.data.data;
        setData(fetchedData);

        // Fetch filtered data
        const filterResponse = await client.get('data/filter');
        const filtered = filterResponse.data.data;
        setFilteredData(filtered);

        // Calculate central position
        let sumLat = 0, sumLon = 0;
        fetchedData.forEach(coord => {
          sumLat += coord.ran_site_latitude;
          sumLon += coord.ran_site_longitude;
        });
        const avgLat = sumLat / fetchedData.length;
        const avgLon = sumLon / fetchedData.length;
        setCentralPos([avgLat, avgLon]);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading map...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <MapContainer
      center={centralPos}
      zoom={10}
      scrollWheelZoom={false}
      style={{ height: "650px", width: "1600px" }}
    >
      <TileLayer
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MultipleMarkers data={data} />

    </MapContainer>
  );

}

function MultipleMarkers({ data }) {
  return data.map((coord, index) => (
    <Marker key={index} position={[coord.ran_site_latitude, coord.ran_site_longitude]} icon={icon}>
      <Popup>
        <div style={{ textAlign: 'left' }}>
          <h4 style={{ fontSize: '20px', color: "blue", margin: "0.5em 0" }}>Moentity: {coord.moentity}</h4>
          <h4 style={{ fontSize: '20px', color: "blue", margin: "0.5em 0" }}>Traffic: {parseFloat(coord.traffic).toFixed(2)}</h4>
        </div>
      </Popup>
    </Marker >

  ));
}

export default MapComponent;
