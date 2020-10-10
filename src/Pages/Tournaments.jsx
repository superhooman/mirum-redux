import classes from "./Tournaments.module.css";
import React from "react";

const Tournaments = () => (
    <div className={classes.Tournaments}>
        <svg style={{
            marginBottom: 12
        }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" /></svg>
        <span>В разработке</span>
    </div>
)

export default Tournaments;