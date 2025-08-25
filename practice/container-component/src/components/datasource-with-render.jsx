import  { useState, useEffect } from 'react';

export const DatasourceWithRender = ({ getData = () => {}, render }) => {
    const [resource, setResource] = useState(null);

    useEffect(() => {
        (async () => {
            const data = await getData();
            setResource(data);
        })();
    }, [getData]);

    return render(resource)
    ;
};