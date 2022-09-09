import React from 'react';

const Button = (props) => {
    return (
        <div>
        <button 
            className="btn btn-primary" 
            onClick={props.onClick}>
            {props.label}
        </button>
        </div>
    );
}

export default Button;
