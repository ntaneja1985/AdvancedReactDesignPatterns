import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const includeUpdatableResource = (Component, resourceUrl, resourceName) => {
    return function IncludeUpdatableResourceWrapper(props) {
        const [initialResource, setInitialResource] = useState(null);
        const [resource, setResource] = useState(null);

        useEffect(() => {
            (async () => {
                const response = await axios.get(resourceUrl);
                setInitialResource(response.data);
                setResource(response.data);
            })();
        }, []);

        const onChange = (updates) => {
            setResource({
                ...resource,
                ...updates
            });
        };

        const onPost = async () => {
            const response = await axios.post(resourceUrl, {[resourceName]: resource});
            setInitialResource(response.data);
            setResource(response.data);
        };

        const onReset = () => {
            setResource(initialResource);
        };

        // Helper function to capitalize first letter
        const toCapital = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        // Build dynamic props object
        const resourceProps = {
            [resourceName]: resource, // user: userData or book: bookData
            [`onChange${toCapital(resourceName)}`]: onChange,     // onChangeUser or onChangeBook
            [`onPost${toCapital(resourceName)}`]: onPost,         // onPostUser or onPostBook
            [`onReset${toCapital(resourceName)}`]: onReset        // onResetUser or onResetBook
        };

        return <Component {...props} {...resourceProps} />;
    };
};
