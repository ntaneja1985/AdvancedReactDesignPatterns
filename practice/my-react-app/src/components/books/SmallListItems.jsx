import React from 'react'

function SmallBookListItems({book}) {
    const {name,price} = book;

    return (
        <h2>Name: {name} / {price}</h2>
    )
}

export default SmallBookListItems
