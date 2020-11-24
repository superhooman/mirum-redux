import Axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Loader from '../../Components/Loader';
import Item from '../../Components/Store/Item';
import Navbar from '../../Components/Store/Navbar';
import { server } from '../../config';
import { login } from '../../Redux/actions';

import classes from './Index.module.css'

const Store = ({ token, user, login }) => {
    const [items, setItems] = useState({
        isFetching: true,
        items: []
    });
    const getItems = () => {
        Axios({
            url: server + `api/v1/shop/`
        }).then((res) => {
            if (res.data && typeof res.data === "object") {
                setItems({
                    isFetching: false,
                    items: res.data
                })
            }
        })
    }
    useEffect(() => {
        if (token && !user) {
            Axios({
                url: server + `api/v1/user_info/`,
                headers: {
                    Authorization: `Token ${token}`
                }
            }).then((res) => {
                if (res.data) {
                    login(res.data, token)
                }
            })
        }
    }, [])
    useEffect(getItems, [])
    return (
        <div className={classes.Store}>
            <Navbar />
            <div className={classes.hero}>
                <div className="container">
                    {user ? <Link className={classes.back} to="/dashboard">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H6M12 5l-7 7 7 7" /></svg>
                        <span>Назад</span>
                    </Link> : null}
                    <h1>Добро пожаловать в Mirum Store!</h1>
                    <p>Вы долго и упорно (и, конечно же, заслуженно) зарабатывали свои эдкоины и теперь настало время заслуженных покупок!</p>
                </div>
            </div>
            <div className={classes.itemsWrap}>
                <div className="container">
                    <p>Выберите понравившийся Вам товар</p>
                    {items.isFetching ? <Loader /> : (
                        <div className={classes.items}>
                            {items.items.map((el) => (
                                <Item item={el} key={el.id} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => ({
    login: bindActionCreators(login, dispatch)
})

export default connect(state => state, mapDispatchToProps)(Store);