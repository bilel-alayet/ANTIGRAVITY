import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }} onClick={onClose}>
            <div style={{
                position: 'relative',
                background: '#1a1a1a',
                padding: '0',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '900px',
                boxShadow: '0 0 30px rgba(0,0,0,0.5)',
                overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>

                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(0,0,0,0.5)',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: '5px 12px',
                        borderRadius: '50%',
                        zIndex: 10,
                        transition: 'background 0.2s',
                        lineHeight: '1'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,0,0,0.7)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.5)'}
                >
                    &times;
                </button>

                {children}
            </div>
        </div>
    );
};

export default Modal;
