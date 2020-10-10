import React from "react";
import classes from "./Button.module.css";
import clsx from "clsx";

const Button = ({children, disabled, style, onClick = () => {}, type = "primary", size = "normal", icon}) => (
    <button style={style} className={clsx({
        [classes.Button]: true,
        [classes.primary]: type === "primary",
        [classes.disabled]: disabled,
        [classes.small]: size === "small",
        [classes.withIcon]: Boolean(icon)
    })} disabled={disabled} onClick={onClick}>
        {icon ? icon : null}
        <span>{children}</span>
    </button>
)

export default Button