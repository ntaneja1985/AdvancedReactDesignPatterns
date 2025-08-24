import React, {useState} from 'react'
import styled from 'styled-components';

// Styled Components
const ModalBackground = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  overflow: auto;
  background-color: #00000067;
  width: 100%;
  height: 100%;
`;

const ModalContent = styled.div`
  margin: 12% auto;
  padding: 20px;
  background-color: wheat;
  width: 50%;
`;
function Modal({children}) {
    const [show, setShow] = useState(false);
    return (
        <>
            <button onClick={() => setShow(true)}>Show Modal</button>

            {show && (
                <ModalBackground onClick={() => setShow(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        {children}
                        <button onClick={() => setShow(false)}>Hide Modal</button>
                    </ModalContent>
                </ModalBackground>
            )}
        </>
    )
}

export default Modal
