import { useState, useEffect } from "react";
import client from './client';

function Data(date, city) {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    client.get(`data/city?date=${date}&city=${city}`)
      .then((response) => {
        setPost(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    post
  )
}

export default Data;
