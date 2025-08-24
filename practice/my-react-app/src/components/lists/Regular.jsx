import React from 'react'

function Regular({items, sourceName, ItemComponent}) {
    return (
        <>
            {items.map((item, i) => (
                <ItemComponent
                    key={i}
                    {...{[sourceName]: item}}
                />
            ))}
            </>
    )
}

export default Regular
