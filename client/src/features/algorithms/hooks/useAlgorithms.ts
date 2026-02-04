import { useState, useEffect } from 'react';
import axios from 'axios';
import { type Algorithm } from '../types';

export const useAlgorithms = (category: string) => {
  const [data, setData] = useState<Algorithm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5050/api/${category}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category]);

  return { data, loading };
};