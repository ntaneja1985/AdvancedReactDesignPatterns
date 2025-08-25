import { useState, useEffect } from 'react';

export const useDataSource = (getData) => {
    const [resource, setResource] = useState(null);

    useEffect(() => {
        (async () => {
            const data = await getData();
            setResource(data);
        })();
    }, [getData]); // Re-run when getData function changes

    return resource;
};