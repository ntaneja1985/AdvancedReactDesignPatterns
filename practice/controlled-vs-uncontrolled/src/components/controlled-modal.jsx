import React from 'react';

export const ControlledModal = ({ shouldDisplay, onClose, children }) => {
    if (!shouldDisplay) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};