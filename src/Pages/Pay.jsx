import React from "react";
import classes from "./Pay.module.css";
import logo from "../Assets/logoNoText.svg";
import Input from "../Components/Input";
import { Link } from "react-router-dom";
import { useState } from "react";
import Button from "../Components/Button";
import Axios from "axios";
import { server } from "../config";
import User from "../Components/User";
import { useToasts } from "react-toast-notifications";

const post = (data, url) => {
    const mapForm = document.createElement("form");
    mapForm.method = "POST";
    mapForm.action = url;
    mapForm.target = "_blank"
    Object.keys(data).forEach(function (param) {
        const mapInput = document.createElement("input");
        mapInput.type = "hidden";
        mapInput.name = param;
        mapInput.setAttribute("value", data[param]);
        mapForm.appendChild(mapInput);
    });
    document.body.appendChild(mapForm);
    mapForm.submit();
}

const Pay = () => {
    const { addToast } = useToasts();
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [sum, setSum] = useState(0)
    const [result, setResult] = useState(null);
    const find = () => {
        if (!email) {
            return addToast("Введите логин", { appearance: 'error' })
        }
        setLoading(true)
        Axios({
            url: `${server}api/v1/search_purchaser/`,
            params: {
                email
            }
        }).then((res) => {
            if (res.data) {
                setLoading(false)
                setResult(res.data)
            }
        }).catch((err) => {
            if (err.response && err.response.data && (typeof err.response.data === "string")) {
                setLoading(false)
                addToast(err.response.data, { appearance: 'error' })
            }
        })
    }
    const doPay = () => {
        let data = {
            "WMI_MERCHANT_ID": "197388390676",
            "WMI_CURRENCY_ID": "398",
            "WMI_DESCRIPTION": "Mirum payment",
            "WMI_SUCCESS_URL": "https://mirum.kz/#/auth/login",
            "WMI_FAIL_URL": "https://mirum.kz/#/auth/login",
            "WMI_PAYMENT_AMOUNT": sum,
            "user": result.email
        }
        Axios({
            url: `${server}api/v1/md/`,
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }).then((res) => {
            data["WMI_SIGNATURE"] = res.data.m;
            post(data, "https://wl.walletone.com/checkout/checkout/Index")
        })
    }
    return (
        <div className={classes.Pay}>
            <div className={classes.container}>
                <Link className={classes.back} to="/login">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H6M12 5l-7 7 7 7" /></svg>
                    <span>Назад</span>
                </Link>
                <div className={classes.brand}>
                    <img height={36} className={classes.logo} src={logo} alt="Mirum logo" />
                    <span>Mirum PAY</span>
                </div>
                <p>Введите логин пользователя</p>
                <form onSubmit={e => {
                    e.preventDefault();
                    find()
                }}>
                    <Input
                        name="login"
                        label="Логин"
                        placeholder="login@smg.kz"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button disabled={loading} style={{ marginTop: 16 }}>{loading ? "Загрузка..." : "Найти пользователя"}</Button>
                </form>
                {result ? (
                    <div className={classes.result}>
                        <User user={result} />
                        <div className={classes.debt}>
                            Ваш долг составляет: <b>{result.debt} ₸</b>.
                        </div>
                        <div className={classes.sum}>
                            <form onSubmit={e => {
                                e.preventDefault();
                                doPay()
                            }}>
                                <Input type="number" name="Sum" label="Сумма" value={sum} onChange={(e) => setSum(e.target.value)} />
                                <p>Введите минимальную сумму оплаты (сумма не может быть меньше 100тг или меньше долга)</p>
                                <Button disabled={Number(sum) < 100 || Number(sum) < result.debt} style={{ marginTop: 16 }}>Оплатить{sum ? ` ${sum} ₸` : ""}</Button>
                                <p>Нажимая кнопку "Оплатить", вы соглашаетесь с условиями договора <a target="_blank" rel="noopener noreferrer" href="https://mirum.kz/assets/%D0%9E%D1%84%D0%B5%D1%80%D1%82%D0%B0_%D0%9C%D0%B8%D1%80%D1%83%D0%BC.docx">Публичной оферты</a></p>
                            </form>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default Pay;