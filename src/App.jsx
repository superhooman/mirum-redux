import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { ToastProvider } from 'react-toast-notifications'
import Index from "./Pages/Index";
import Login from "./Pages/Login";
import { connect } from "react-redux"
import Axios from "axios";
import { server } from "./config";
import "./App.css";
import Dashboard from "./Pages/Dashboard";
import { bindActionCreators } from "redux";
import { login } from "./Redux/actions";
import Logout from "./Pages/Logout";
import Pay from "./Pages/Pay";
import ScrollToTop from "./ScrollToTop";
import Store from "./Pages/Store/Index";
import Cart from "./Pages/Store/Cart";

const App = ({ token, user, login }) => {
  const [logged, setLogged] = useState(token);
  useEffect(() => {
    if (token && !user) {
      Axios({
        url: server + `api/v1/user_info/`,
        headers: {
          Authorization: `Token ${token}`
        }
      }).then((res) => {
        if (res.data) {
          login(res.data, token, true)
          setLogged(true);
        }
      })
    }
  }, [])
  return (
    <Router>
      <ToastProvider
        autoDismiss
        autoDismissTimeout={6000}
        placement="bottom-right"
      >
        <ScrollToTop>
          <Switch>
            <Route
              exact
              path="/"
              component={Index}
            />
            <Route exact path="/login" component={Login} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/logout" exact component={Logout} />
            <Route path="/pay" exact component={Pay} />
            <Route path="/store" exact component={Store} />
            <Route path="/store/cart" exact component={Cart} />
          </Switch>
        </ScrollToTop>
      </ToastProvider>
    </Router>
  );
};

const mapDispatchToProps = (dispatch) => ({
  login: bindActionCreators(login, dispatch)
})

export default connect(state => state, mapDispatchToProps)(App);
