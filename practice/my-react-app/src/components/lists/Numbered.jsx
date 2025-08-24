import React from 'react'

function Numbered({items, sourceName, ItemComponent}) {
    return (
        <>
            {items.map((item, i) => (
                <>
                <h3>{i + 1}</h3>
                <ItemComponent
                    key={i}
                    {...{[sourceName]: item}}
                />
                </>
            ))}
        </>
    )
}

export default Numbered
