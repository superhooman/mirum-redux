import React from 'react';
import { Redirect } from 'react-router-dom';
import classes from './Index.module.css';

const Index = () => {
    return (
        <div className={classes.Index}>
            <Redirect to="/login"/>
        </div>
    );
};

export default Index;