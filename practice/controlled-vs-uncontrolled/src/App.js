import { UncontrolledForm } from "./components/uncontrolled-form";
import {ControlledForm} from "./components/controlled-form";
import {useState} from "react";
import {ControlledModal} from "./components/controlled-modal";
import {UncontrolledFlow} from "./components/uncontrolled-flow";
import {ControlledFlow} from "./components/controlled-flow";

function App() {

    const [shouldDisplay, setShouldDisplay] = useState(false);
    const [data,setData] = useState({});
    const [currentStepIndex,setCurrentStepIndex] = useState(0);

    const StepOne = ({onNext}) => {

        return (<>
                <h1>Hey, I am step number one - Enter your name</h1>
                <button onClick={() => onNext({ name: "My Name" })}>
                    Next
                </button>
            </>
        )
    };

    const StepTwo = ({onNext}) => {
        return (<>
                <h1>Hey, I am step number two - Enter your age</h1>
                <button onClick={() => onNext({age: 23})}>
                    Next
                </button>
            </>
        )
    }

    const StepThree = ({onNext}) => {
        return (<>
                <h1>Hey, I am step number three - Enter your country</h1>
                <button onClick={() => onNext({country: "Mars"})}>
                    Next
                </button>
            </>
        )
    };

    const StepFour = ({onNext}) => {
        return (<>
                <h1>Hey, I am step number four - Enter your pincode</h1>
                <button onClick={() => onNext({pincode: "160018"})}>
                    Next
                </button>
            </>
        )
    };

    const onDone = (data) => {
        console.log(data);
        alert(JSON.stringify(data));
    };


    const onNext = (dataFromStep) => {
        // Update collected data
        const newData = {
            ...data,
            ...dataFromStep
        };
        setData(newData);

        // Move to next step
        setCurrentStepIndex(currentStepIndex + 1);
    };
    return (
        <>
            {/*/!*<UncontrolledForm />*!/*/}
            {/*/!*  <ControlledForm/>*!/*/}
            {/*<button onClick={() => setShouldDisplay(!shouldDisplay)}>*/}
          {/*    {shouldDisplay ? 'Hide Modal' : 'Display Modal'}*/}
          {/*</button>*/}

          {/*<ControlledModal*/}
          {/*    shouldDisplay={shouldDisplay}*/}
          {/*    onClose={() => setShouldDisplay(false)}*/}
          {/*>*/}
          {/*    <h3>I am the body of the modal</h3>*/}
          {/*</ControlledModal>*/}

          {/*<UncontrolledFlow onDone={onDone}>*/}
          {/*    <StepOne/>*/}
          {/*    <StepTwo/>*/}
          {/*    <StepThree/>*/}
          {/*</UncontrolledFlow>*/}

            <ControlledFlow
                currentIndex={currentStepIndex}
                onNext={onNext}
            >
                <StepOne />
                <StepTwo />

                {/* Conditional Step - Only show if age >= 25 */}
                {data.age >= 25 ? (
                    <StepThree />
                ) : null}

                <StepFour />
            </ControlledFlow>
      </>
  );
}

export default App;
