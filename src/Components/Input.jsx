import React from "react";
import InputMask from "react-input-mask"
import classes from "./Input.module.css";

const Input = ({label, value, onChange, placeholder, type = "text", onClick, name, mask}) => (
    <div onClick={() => onClick && onClick()} className={classes.Input}>
        <label htmlFor={name}>{label}</label>
        {mask ? <InputMask id={name} value={value} mask={mask} placeholder={placeholder} onChange={onChange} /> : <input id={name} type={type} placeholder={placeholder} value={value} onChange={onChange} />}
    </div>
)

export default Input