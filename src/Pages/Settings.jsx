import classes from "./Settings.module.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import Button from "../Components/Button";
import Input from "../Components/Input";
import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import Axios from "axios";
import { server } from "../config";
import { bindActionCreators } from "redux";
import { login } from "../Redux/actions";

const Settings = ({ user, token, login }) => {
    const { addToast } = useToasts()
    const [pass, setPass] = useState({
        oldPassword: "",
        newPassword: "",
        repeat: ""
    })
    const [state, changeState] = useState({
        name: "",
        date_of_birth: "",
        phone: "",
        region: "",
        city: "",
        village: "",
        year_class: "",
        interests: "",
        about: ""
    })
    const setState = (field) => (e) => {
        changeState({
            ...state,
            [field]: e.target.value
        })
    }
    useEffect(() => {
        if (user) {
            changeState({
                name: user.name,
                date_of_birth: user.date_of_birth,
                phone: user.phone,
                region: user.region,
                city: user.city,
                village: "",
                year_class: user.year_class,
                interests: user.interests,
                about: user.about
            })
        }
    }, [user]);
    const updatePassword = () => {
        if (!pass.oldPassword || !pass.newPassword) {
            return addToast("Заполните все поля", { appearance: 'error' })
        }
        if (pass.newPassword !== pass.repeat) {
            return addToast("Пароли не совпадают", { appearance: 'error' })
        }
        Axios({
            url: `${server}api/v1/update_password/`,
            headers: {
                Authorization: `Token ${token}`
            },
            method: "POST",
            data: {
                new_password: pass.newPassword,
                old_password: pass.oldPassword
            }
        }).then((res) => {
            if (res.data) {
                addToast("Пароль изменен", { appearance: 'success' })
                setPass({
                    oldPassword: "",
                    newPassword: "",
                    repeat: ""
                })
            }
        }).catch((err) => {
            if (err.response && err.response.data && (typeof err.response.data === "string")) {
                addToast(err.response.data, { appearance: 'error' })
            } else if (err.response && err.response.data && err.response.data.old_password) {
                addToast("Неверный пароль", { appearance: 'error' })
            }
        })
    }
    const updateProfile = () => {
        if (!state.name) {
            return addToast("Поле имя не может быть пустым", { appearance: 'error' })
        }
        Axios({
            url: `${server}api/v1/update_profile/`,
            headers: {
                Authorization: `Token ${token}`
            },
            method: "POST",
            data: state
        }).then((res) => {
            if (res.data) {
                login(res.data.user, token);
                addToast("Профиль обновлен", { appearance: 'success' })
            }
        })
    }
    return (
        <div className={classes.Settings}>
            <h1>Настройки</h1>
            <div className={classes.card}>
                <h2 className={classes.cardTitle}>Смена пароля</h2>
                <form onSubmit={e => {
                    e.preventDefault()
                    updatePassword()
                }}>
                    <div className={classes.field}>
                        <Input
                            name="password"
                            label="Старый пароль"
                            placeholder="••••••"
                            type="password"
                            value={pass.oldPassword}
                            onChange={(e) => setPass({
                                ...pass,
                                oldPassword: e.target.value
                            })}
                        />
                    </div>
                    <div className={classes.field}>
                        <Input
                            name="password1"
                            label="Новый пароль"
                            placeholder="••••••"
                            type="password"
                            value={pass.newPassword}
                            onChange={(e) => setPass({
                                ...pass,
                                newPassword: e.target.value
                            })}
                        />
                    </div>
                    <div className={classes.field}>
                        <Input
                            name="password2"
                            label="Повтор пароля"
                            placeholder="••••••"
                            type="password"
                            value={pass.repeat}
                            onChange={(e) => setPass({
                                ...pass,
                                repeat: e.target.value
                            })}
                        />
                    </div>
                    <Button>Сменить пароль</Button>
                </form>
            </div>
            <div className={classes.card}>
                <h2 className={classes.cardTitle}>Изменить профиль</h2>
                <form onSubmit={e => {
                    e.preventDefault()
                    updateProfile()
                }}>
                    <div className={classes.field}>
                        <Input
                            name="name"
                            label="Имя"
                            placeholder="Иван Иванов"
                            type="text"
                            value={state.name}
                            onChange={setState("name")}
                        />
                    </div>
                    <div className={classes.field}>
                        <Input
                            name="date_of_birth"
                            label="Дата рождения"
                            placeholder="____-__-__"
                            type="text"
                            mask="9999-99-99"
                            value={state.date_of_birth}
                            onChange={setState("date_of_birth")}
                        />
                    </div>
                    <div className={classes.field}>
                        <Input
                            name="phone"
                            label="Телефон"
                            placeholder="+7 (___) ___-__-__"
                            type="text"
                            mask="+7 (999) 999-99-99"
                            value={state.phone}
                            onChange={setState("phone")}
                        />
                    </div>
                    <div className={classes.field}>
                        <Input
                            name="region"
                            label="Регион"
                            placeholder="Ваш регион"
                            type="text"
                            value={state.region}
                            onChange={setState("region")}
                        />
                    </div>
                    <div className={classes.field}>
                        <Input
                            name="city"
                            label="Город"
                            placeholder="Ваш город"
                            type="text"
                            value={state.city}
                            onChange={setState("city")}
                        />
                    </div>
                    <div className={classes.field}>
                        <Input
                            name="year_class"
                            label="Класс"
                            placeholder="Год обучения"
                            type="text"
                            value={state.year_class}
                            onChange={setState("year_class")}
                        />
                    </div>
                    <Button>Сохранить</Button>
                </form>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => ({
    login: bindActionCreators(login, dispatch)
})

export default connect(state => state, mapDispatchToProps)(Settings)