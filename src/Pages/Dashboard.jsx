import classes from "./Dashboard.module.css";
import React, { useState, useEffect } from "react";
import Drawer from "../Components/Drawer";
import MenuItem from "../Components/MenuItem";
import { connect } from "react-redux";
import Loader from "../Components/Loader"
import Axios from "axios";
import { server } from "../config";
import { Switch, Route, Redirect } from "react-router-dom";
import Main from "./Main";
import { bindActionCreators } from "redux";
import { setCourses } from "../Redux/actions";
import Course from "./Course";
import Lesson from "./Lesson";
import Quiz from "./Quiz"
import Settings from "./Settings";
import Tournaments from "./Tournaments";
import Calendar from "./Calendar";
import Dictionary from "./Dictionary";

const TournamentIcon = () => (
    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 512 512'>
        <line x1='176' y1='464' x2='336' y2='464' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="40px" />
        <line x1='256' y1='464' x2='256' y2='336' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="40px" />
        <path d='M384,224c0-50.64-.08-134.63-.12-160a16,16,0,0,0-16-16l-223.79.26a16,16,0,0,0-16,15.95c0,30.58-.13,129.17-.13,159.79,0,64.28,83,112,128,112S384,288.28,384,224Z' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="40px" />
        <path d='M128,96H48v16c0,55.22,33.55,112,80,112' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="40px" /><path fill="none" d='M384,96h80v16c0,55.22-33.55,112-80,112' stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="40px" />
    </svg>
)

const Dashboard = ({ token, courses, setCourses }) => {
    useEffect(() => {
        Axios({
            url: server + "api/v1/courses/",
            headers: {
                Authorization: `Token ${token}`
            }
        }).then((res) => {
            setCourses({
                isFetching: false,
                items: res.data
            })
        })
    }, [])
    return (
        <div className={classes.Dashboard}>
            <Drawer width={320}>
                <MenuItem exact icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>} to="/dashboard">Главная</MenuItem>
                <MenuItem icon={<TournamentIcon />} to="/dashboard/tournaments">Турниры</MenuItem>
                <MenuItem icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>} to="/dashboard/calendar/">Календарь</MenuItem>
                <MenuItem icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>} to="/dashboard/dictionary">Словарь</MenuItem>
                <div className="divider"></div>
                <div className={classes.label}>Курсы</div>
                {!courses.isFetching ? courses.items.map((el) => (
                    <MenuItem noIcon to={`/dashboard/course/${el.id}/`} key={el.id}>{el.name}</MenuItem>
                )) : <Loader />}
                <div className="divider"></div>
                <MenuItem icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3.8 6h16.4M16 10a4 4 0 1 1-8 0" /></svg>} to="/store">Store</MenuItem>
                <MenuItem icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>} to="/dashboard/settings">Настройки</MenuItem>
                <MenuItem icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9" /></svg>} to="/logout">Выйти</MenuItem>
            </Drawer>
            {!token ? <Redirect to="/login" /> : null}
            <div className={classes.Main}>
                <div className="container">
                    <Switch>
                        <Route path="/dashboard/" exact component={Main} />
                        <Route path="/dashboard/tournaments" exact component={Tournaments} />
                        <Route path="/dashboard/settings" exact component={Settings} />
                        <Route path="/dashboard/course/:id/" exact component={Course} />
                        <Route path="/dashboard/course/:id/lesson/:lesson" exact component={Lesson} />
                        <Route path="/dashboard/course/:id/quiz/:quiz" exact component={Quiz} />
                        <Route path="/dashboard/calendar/" exact component={Calendar} />
                        <Route path="/dashboard/dictionary/" exact component={Dictionary} />
                        <Route path="/dashboard/stage/:stage/:team/" exact render={({ match, history }) => <Quiz match={match} history={history} type="stage" />} />
                    </Switch>
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    setCourses: bindActionCreators(setCourses, dispatch)
})

export default connect(state => state, mapDispatchToProps)(Dashboard)