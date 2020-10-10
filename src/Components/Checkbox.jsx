import React from 'react';
import clsx from 'clsx';
import classes from './Checkbox.module.css';

const Checkbox = ({value, onChange, label}) => {
    return (
        <div onClick={() => onChange(!value)} className={clsx({
            [classes.Checkbox]: true,
            [classes.selected]: value
        })}>
            <div className={classes.box}/>
            <span>{label}</span>
        </div>
    );
};

export default Checkbox;