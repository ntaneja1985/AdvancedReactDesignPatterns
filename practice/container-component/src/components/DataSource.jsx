import React, { useState, useEffect } from 'react';

export const DataSource = ({ getData = () => {}, resourceName, children }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        ( () => {
            const result =  getData();
            setData(result);
        })();
    }, [getData]);

    return (
        <>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        [resourceName]: data
                    });
                }
                return child;
            })}
        </>
    );
};