import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, Redirect } from "react-router-dom";
import logo from "../Assets/logoNoText.svg";
import glyph from "../Assets/glyph.svg";
import classes from "./Login.module.css";
import Input from "../Components/Input";
import Button from "../Components/Button";
import Checkbox from "../Components/Checkbox";
import { login } from "../Redux/actions"
import Axios from "axios";
import { server } from "../config";
import { useToasts } from "react-toast-notifications"

const Login = ({ login, token, user }) => {
  const { addToast } = useToasts()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const submit = () => {
    if (loading) return;
    if (!email || !password) {
      return addToast("Заполните все поля", { appearance: 'error' })
    }
    setLoading(true);
    Axios({
      url: server + "api/v1/authenticate/",
      method: "POST",
      data: {
        username: email,
        password
      }
    }).then((res) => {
      if (res.data.token) {
        setLoading(false)
        return login(res.data.user, res.data.token, remember)
      } else {
        setLoading(false)
        return addToast(res.data.detail || "Ошибка", { appearance: 'error' })
      }
    }).catch(err => {
      if (err.response) {
        setLoading(false)
        return addToast(err.response.data.detail || "Ошибка", { appearance: 'error' })
      } else {
        setLoading(false)
        return addToast("Ошибка", { appearance: 'error' })
      }
    })
  }
  return (
    <div className={classes.Login}>
      {token && user ? <Redirect to="/dashboard" /> : null}
      <div className={classes.plate}>
        <div className={classes.main}>
          <Link to="/"><div className={classes.brand}>
            <img height={36} className={classes.logo} src={logo} alt="Mirum logo" />
            <span>Mirum</span>
          </div></Link>
          <form onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}>
            <h1>Войти в аккаунт</h1>
            <div className={classes.field}>
              <Input
                name="login"
                label="Логин"
                placeholder="login@smg.kz"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={classes.field}>
              <Input
                name="password"
                label="Пароль"
                placeholder="••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={classes.field}>
              <Checkbox label="Запомнить?" value={remember} onChange={setRemember} />
            </div>
            <Button disabled={loading}>{loading ? "Загрузка..." : "Войти"}</Button>
            <Link className={classes.link} to="/pay">Онлайн оплата</Link>
          </form>
          <footer>Education as a game</footer>
        </div>
      </div>
      <div className={classes.picture}>
        <div className={classes.pattern} />
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  login: bindActionCreators(login, dispatch)
})

export default connect(state => state, mapDispatchToProps)(Login);
