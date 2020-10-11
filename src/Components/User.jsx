import classes from "./User.module.css";
import React from "react";
import clsx from "clsx";
import { server } from "../config";

const getUrl = (url) => {
    return url.indexOf("http") > -1 ? url : `${server}${url}`
}

const getInitials = (name) => {
    const words = name.split(" ");
    return words.length < 2 ? words[0][0] : (words[1] === "" ? `${words[0][0]}${words[2][0]}` : `${words[0][0]}${words[1][0]}`);
};

const User = ({ user, big, small }) => {
    return user ? (
        <div className={clsx(classes.user, {
            [classes.big]: big,
            [classes.small]: small,
        })}>
            <div style={{
                backgroundImage: user.avatar ? `url(${getUrl(user.avatar)})` : null
            }} className={classes.avatar}>
                {!user.avatar ? (user.name ? <span>{getInitials(user.name)}</span> : null) : null}
            </div>
            <div className={classes.userInfo}>
                <div className={classes.userName}>
                    {user.name}
                </div>
                <div className={classes.userEmail}>
                    {user.email}
                </div>
            </div>
        </div>
    ) : <div className={clsx(classes.user, classes.skeleton, { [classes.big]: big })}>
            <div className={classes.avatar} />
            <div className={classes.userInfo}>
                <div className={classes.userName}>
                </div>
                <div className={classes.userEmail}>
                </div>
            </div>
        </div>
}

export default User;