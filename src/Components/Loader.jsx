import React from "react";
import classes from "./Loader.module.css"

const Loader = ({height = 240}) => (
    <div style={{
        minHeight: height
    }} className={classes.Loader}>
        <div className={classes.element}/>
    </div>
)

export default Loader;