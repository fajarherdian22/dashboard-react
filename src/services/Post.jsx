import { useState, useEffect } from 'react';
import client from "./client";

const PostReq = (url,payload) => {
    const [token, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () =>{
            try {
                const res = await client.post(url, payload);
                if (isMounted) {
                    setData(res.data.data.Token)
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
    return {token, loading, error};
};

export default PostReq;