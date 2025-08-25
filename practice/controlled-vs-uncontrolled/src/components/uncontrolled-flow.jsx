import React, {useState} from "react";

export const UncontrolledFlow = ({children,onDone}) => {

    const [data,setData] = useState({});
    const [currentStepIndex,setCurrentStepIndex] = useState(0);
    const goNext = (dataFromStep) =>{
        const nextStepIndex = currentStepIndex + 1;

        // Collect and merge data from current step
        const newData = {
            ...data,           // Existing data
            ...dataFromStep    // New data from current step
        };

        setData(newData);
        console.log(newData); // Track data collection

        // Check if we're at the final step
        if (nextStepIndex < children.length) {
            setCurrentStepIndex(nextStepIndex); // Go to next step
        } else {
            onDone(newData); // Flow completed
        }
    }
    const currentChild = React.Children.toArray(children)[currentStepIndex];

    // Pass goNext prop to current child
    if (React.isValidElement(currentChild)) {
        return React.cloneElement(currentChild, { goNext });
    }

    return currentChild;

}