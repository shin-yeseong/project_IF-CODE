import { useState, useEffect } from 'react';
import { PAGINATION } from '../constants';

export const usePagination = (fetchData) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadData();
    }, [page]);

    const loadData = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await fetchData(page, PAGINATION.DEFAULT_SIZE);
            const newData = response.data.content;

            if (page === 0) {
                setData(newData);
            } else {
                setData(prev => [...prev, ...newData]);
            }

            setHasMore(newData.length === PAGINATION.DEFAULT_SIZE);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const refresh = () => {
        setPage(0);
        setData([]);
        setHasMore(true);
        setError(null);
    };

    return {
        data,
        loading,
        error,
        hasMore,
        loadMore,
        refresh
    };
}; 