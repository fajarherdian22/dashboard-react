import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import client from '../../services/client';
import './style.css';
import Select from 'react-select';

const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});

function MapComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [centralPos, setCentralPos] = useState([0, 0]);
  const [cityFilter, setCityFilter] = useState(null);


  const filterData = useFilterData();


  const options = filterData.map((item) => ({
    value: item.ran_site_city,
    label: item.ran_site_city
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mainResponse = await client.get(`data/city?date=2024-08-22&city=CIAMIS`);
        const fetchedData = mainResponse.data.data;
        setData(fetchedData);

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
    <div>
      <MapContainer
        className="Map-container"
        center={centralPos}
        zoom={10}
        scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <DotMarkers data={data} />
      </MapContainer>
      <Select
        options={options}
        value={cityFilter}
        isSearchable={true}
        onChange={(option) => setCityFilter(option)}
      />
    </div>
  );
}



// function getData(params) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [centralPos, setCentralPos] = useState([0, 0]);
//   const [cityFilter, setCityFilter] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const filteredResponse = await client.get(`data/city?date=2024-08-22&city=${cityFilter.value}`);
//         const filtered = filteredResponse.data.data;
//         setFilteredData(filtered);
//       } catch (err) {
//         console.log(err.message);
//       }
//     };
//     fetchData();
//   }, []);
//   return filteredData;
// }

function useFilterData() {
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const filteredResponse = await client.get('data/filter');
        const filtered = filteredResponse.data.data;
        setFilteredData(filtered);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);
  return filteredData;
}

function DotMarkers({ data }) {
  return data.map((coord, index) => (
    <Marker key={index} position={[coord.ran_site_latitude, coord.ran_site_longitude]} icon={icon}>
      <Popup>
        <div className="DotMarkers">
          <h4>Moentity: {coord.moentity}</h4>
          <h4>Traffic: {parseFloat(coord.traffic).toFixed(2)}</h4>
        </div>
      </Popup>
    </Marker>
  ));
}

export default MapComponent;
