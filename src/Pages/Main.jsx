import classes from "./Main.module.css";
import React from "react";
import { connect } from "react-redux";
import User from "../Components/User";
import Card from "../Components/Card";
import { Link } from "react-router-dom";
import Loader from "../Components/Loader";

const test = { "name": "Килимова Аделя", "email": "kalimova_a@mirum.kz", "type": "student", "avatar": null, "last_login": "2020-10-05T17:20:28.155595+06:00" }

const Main = ({ user, courses }) => {
    return user ? (
        <div className={classes.Main}>
            <div className={classes.user}>
                <User user={user} big />
                <div className={classes.userInfo}>
                    <div className={classes.boxesWrap}>
                        <div className={classes.infoBox}>
                            <div className={classes.infoBoxLabel}>
                                Курсы
                            </div>
                            <div className={classes.infoBoxValue}>
                                {courses.items.length}
                            </div>
                        </div>
                        <div className={classes.infoBox}>
                            <div className={classes.infoBoxLabel}>
                                EdCoins
                        </div>
                            <div className={classes.infoBoxValue}>
                                {user.edcoin}
                            </div>
                        </div>
                        <div className={classes.infoBox}>
                            <div className={classes.infoBoxLabel}>
                                Пакет
                        </div>
                            <div className={classes.infoBoxValue}>
                                {user.package}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.label}>Мои курсы</div>
            <div className={classes.cards}>
                {courses.items.map((el) => (
                    <Card key={el.id} course={el} />
                ))}
            </div>
        </div>
    ) : <Loader/>
}

export default connect(state => state)(Main)