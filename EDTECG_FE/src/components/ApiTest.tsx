import React, { useEffect, useState } from 'react';
import api from '../config/api';

interface ApiTestProps {
  endpoint?: string;
}

const ApiTest: React.FC<ApiTestProps> = ({ endpoint = '/test' }) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(endpoint);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div>
      <h2>API Test Component</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ApiTest; 