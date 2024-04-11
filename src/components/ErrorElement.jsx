import React from 'react';

const ErrorElement = ({ message }) => {
    return (
        <div className="error-element">
            <p>{message}</p>
        </div>
    );
};

export default ErrorElement;