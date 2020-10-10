import React from "react";
import { NavLink } from "react-router-dom"
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { toggleDrawer } from "../Redux/actions";

import classes from "./MenuItem.module.css";
import clsx from "clsx";

const MenuItem = ({ exact, icon, children, to, color, toggleDrawer, noIcon }) => (
    <NavLink onClick={() => toggleDrawer(false)} exact={exact} activeClassName={classes.active} to={to}>
        <div style={color ? {
            "--color": color,
            "--colorTransparent": color + "26"
        } : null} className={clsx({
            [classes.item]: true,
            [classes.customColor]: Boolean(color),
            [classes.noIcon]: noIcon
        })}>
            {noIcon ? null : <div className={classes.icon}>
                {icon}
            </div>}
            <span>{children}</span>
        </div>
    </NavLink>
)

const mapDispatchToProps = (dispatch) => ({
    toggleDrawer: bindActionCreators(toggleDrawer, dispatch)
})

export default connect(state => state, mapDispatchToProps)(MenuItem)