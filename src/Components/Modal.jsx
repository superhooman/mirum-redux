import React, { useEffect } from "react";
import classes from "./Modal.module.css"
import clsx from "clsx";

const Modal = ({ children, open, close, title, className = "", width }) => {
    useEffect(() => {
        open ? document.body.classList.add("scrollDisabled") : document.body.classList.remove("scrollDisabled")
    }, [open])
    return(
    <div className={clsx({
        [classes.modal]: true,
        [classes.active]: open
    }, className)}>
        <div onClick={close} className={classes.modalBackdrop} />
        <div style={{
            maxWidth: width
        }} className={classes.modalWrap}>
            <div className={classes.modalHeader}>
                <div className={classes.modalTitle}>{title}</div>
                <div onClick={close} className={classes.close}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
            </div>
            <div className={classes.modalContent}>
                {children}
            </div>
        </div>
    </div>
)}

export default Modal