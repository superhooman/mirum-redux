import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { bindActionCreators } from "redux";
import { logout } from "../Redux/actions";

const Logout = ({logout}) => {
    useEffect(() => {
        logout()
    }, [])
    return <Redirect to="/login"/>
}

const mapDispatchToProps = (dispatch) => ({
    logout: bindActionCreators(logout, dispatch)
})

export default connect(state => state, mapDispatchToProps)(Logout)