import React, { useState, useEffect } from 'react';

export const ControlledForm = () => {
    // State for each input
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState('');

    // Real-time validation with useEffect
    useEffect(() => {
        if (name.length < 1) {
            setError('Name cannot be empty');
        } else {
            setError('');
        }
    }, [name]); // Runs whenever name changes

    return (
        <form>
            <input
                value={name}                           // Controlled by state
                onChange={(e) => setName(e.target.value)}  // Updates state
                name="name"
                type="text"
                placeholder="Enter your name"
            />

            <input
                value={age}                            // Controlled by state
                onChange={(e) => setAge(e.target.value)}   // Updates state
                name="age"
                type="number"
                placeholder="Enter your age"
            />

            <button type="submit">Submit</button>

            {/* Real-time error display */}
            {error && <p>{error}</p>}
        </form>
    );
};