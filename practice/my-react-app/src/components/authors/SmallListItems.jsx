import React from 'react'

function SmallAuthorListItems({author}) {
    const {name,age} = author;

    return (
        <p>Name: {name}, Age: {age}</p>
    )
}

export default SmallAuthorListItems
