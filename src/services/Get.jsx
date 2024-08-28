import { useState, useEffect } from 'react';
import client from './client';

const GetReq = (url, payload) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const res = await client.get(url, payload);
                // console.log(payload);
                if (isMounted) {
                    setData(res.data.data)
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false)
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [url, payload]);

    return { data, loading, error };
};

export default GetReq;