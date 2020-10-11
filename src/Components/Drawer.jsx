import React, {useEffect} from "react";
import classes from "./Drawer.module.css";
import clsx from "clsx";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import logo from "../Assets/logoNoText.svg";

import {toggleDrawer} from "../Redux/actions";

const Drawer = ({ children, width = 400, drawer, toggleDrawer }) => {
    useEffect(() => {
        drawer ? document.body.classList.add("scrollDisabledMobile") : document.body.classList.remove("scrollDisabledMobile")
        return () => {
            document.body.classList.remove("scrollDisabledMobile") 
        }
    }, [drawer])
    return (
        <>
            <div style={{ width }} className={clsx({
                [classes.Drawer]: true,
                [classes.open]: drawer
            })}>
                <div className={classes.brand}>
                    <img height={36} className={classes.logo} src={logo} alt="Mirum logo" />
                    <span>Mirum</span>
                </div>
                <div className={classes.menu}>
                    {children}
                </div>
                <div className={classes.copyright}>
                    <span>© SMG Education 2020</span>
                    <svg style={{
                        cursor: "pointer"
                    }} onClick={() => document.body.classList.toggle("dark")} fill="currentColor" xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 512 512'><path d='M264,480A232,232,0,0,1,32,248C32,154,86,69.72,169.61,33.33a16,16,0,0,1,21.06,21.06C181.07,76.43,176,104.66,176,136c0,110.28,89.72,200,200,200,31.34,0,59.57-5.07,81.61-14.67a16,16,0,0,1,21.06,21.06C442.28,426,358,480,264,480Z'/></svg>
            </div>
            </div>
            <div onClick={() => toggleDrawer(false)} className={clsx({
                [classes.backdrop]: true,
                [classes.open]: drawer
            })}/>
            <div onClick={() => toggleDrawer(!drawer)} className={clsx({
                [classes.burger]: true,
                [classes.open]: drawer
            })}>
                <div />
                <div />
                <div />
            </div>
        </>
    )
};

const mapDispatchToProps = (dispatch) => ({
    toggleDrawer: bindActionCreators(toggleDrawer, dispatch)
})

export default connect(state => state, mapDispatchToProps)(Drawer);