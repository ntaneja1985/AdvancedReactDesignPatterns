import {useState} from "react";

const UncontrolledModal = ({ children }) => {
    const [show, setShow] = useState(false); // Internal state

    return (
        <>
            <button onClick={() => setShow(!show)}>
                {show ? 'Hide Modal' : 'Show Modal'}
            </button>
            {show && (
                <div className="modal-backdrop" onClick={() => setShow(false)}>
                    <div className="modal">{children}</div>
                </div>
            )}
        </>
    );
};
