import React from 'react'

function LargeBookListItems({book}) {

    const {name,price,title,pages} = book;

    return (
        <>
            <h2>{name}</h2>
            <p>{price}</p>
            <h2>Title:</h2>
                <p>{title}</p>
            <p>Number of pages: {pages}</p>

        </>
    )
}

export default LargeBookListItems
