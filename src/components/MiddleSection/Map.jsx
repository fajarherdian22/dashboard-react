import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import client from '../../services/client';
import './style.css';
import Select from 'react-select';

// Define the icon for markers
const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});

function MapComponent() {
  const [centralPos, setCentralPos] = useState([-6.2563, 106.8145]);
  const filteredData = useFilterData();
  const [cityFilter, setCityFilter] = useState(null);
  const data = useGetData(cityFilter);

  // const DefaultFilt = filteredData[0]


  // Update central position based on fetched data
  useEffect(() => {
    if (filteredData.length > 0 && !cityFilter) {
      setCityFilter({ value: filteredData[0].ran_site_city, label: filteredData[0].ran_site_city });
    }
  }, [filteredData, cityFilter]);

  useEffect(() => {
    if (data.length > 0) {
      const sumLat = data.reduce((sum, coord) => sum + coord.ran_site_latitude, 0);
      const sumLon = data.reduce((sum, coord) => sum + coord.ran_site_longitude, 0);
      const avgLat = sumLat / data.length;
      const avgLon = sumLon / data.length;
      setCentralPos([avgLat, avgLon]);
    }
  }, [data]);


  const options = filteredData.map((item) => ({
    value: item.ran_site_city,
    label: item.ran_site_city,
  }));

  console.log(centralPos);


  return (
    <div>
      <MapContainer
        className="Map-container"
        center={centralPos}
        zoom={10}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <DotMarkers data={data} />
      </MapContainer>
      <Select
        className="Selectbox"
        options={options}
        value={cityFilter}
        isSearchable={true}
        onChange={(options) => setCityFilter(options)}
      />
    </div>
  );
}

function useGetData(city) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (city) {
          const response = await client.get(`data/city?date=2024-08-22&city=${city.value}`);
          setData(response.data.data);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [city]);

  return data;
}

// Custom hook for fetching filter data
function useFilterData() {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get('data/filter');
        setFilteredData(response.data.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  return filteredData;
}

// Component to render map markers
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
