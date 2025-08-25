import React from "react";

export const ControlledFlow = ({children,onDone, currentIndex, onNext}) => {

    const currentChild = React.Children.toArray(children)[currentIndex];

    // Pass goNext prop to current child
    if (React.isValidElement(currentChild)) {
        return React.cloneElement(currentChild, {onNext});
    }

    return currentChild;

}