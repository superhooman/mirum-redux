import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import Plx from "react-plx";
import Button from "../Components/Button";
import logoNoText from "../Assets/logoNoText.svg";
import logo from "../Assets/logo.svg";
import classes from "./Index.module.css";
import image1 from "../Assets/window.jpg";
import frame from "../Assets/frame.jpg";
import smg from "../Assets/smg.svg";
import Input from "../Components/Input";

const ArrowIn = ({ size = 24, color = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
  </svg>
);

const items = [
  {
    title: "NIS Preparation Training",
    subtitle:
      "Полный курс подготовки к поступлению в Назарбаев Интеллектуальные школы для 6 классов",
    text:
      "Мы собрали самый крутой тренерский состав и разработали мегапродуктивную программу подготовки в НИШ, которая включает в себя целый комплекс направлений",
    link: "https://nis.mirum.kz",
  },
  {
    title: "Mirum English",
    subtitle:
      " Персонализированный курс английского языка для взрослых (от 16 лет)",
    text:
      "Постройте для себя персональную программу английского и обучайтесь без стресса! Прогрессируйте без стресса, скучных заданий, неинтересных тем и возможностью возврата до 30% от оплаты курса.",
    link: "https://english.mirum.kz",
  },
  {
    title: "Qadam Online",
    subtitle: "Проект подросткового развития для детей 13-15 лет",
    text:
      "Овладейте навыками и знаниями, необходимыми для каждого подростка в XXI веке. Программа направлена на раскрытие потенциала, формирование правильных привычек и реализацию способностей.",
    link: "https://qadampro.kz",
    warning: "Проект находится в разработке",
  },
];

const frameData = [
  {
    start: 0,
    duration: "100vh",
    properties: [
      {
        startValue: 0,
        endValue: -200,
        property: "translateY",
      },
    ],
  },
];

const Index = () => {
  useEffect(() => {
    document.body.classList.remove("dark");
  }, []);
  return (
    <div className={classes.main}>
      <nav>
        <div className={classes.container}>
          <div className={classes.navLeft}>
            <img
              className={classes.logoNoText}
              height={36}
              src={logoNoText}
              alt="Mirum logo"
            />
            <img
              className={classes.logo}
              height={36}
              src={logo}
              alt="Mirum logo"
            />
            <div className={classes.links}>
              <a href="https://english.mirum.kz/">Mirum English</a>
              <a href="https://nis.mirum.kz/">Подготовка в НИШ</a>
              <a href="https://qadampro.kz/">Проект Qadam</a>
            </div>
          </div>
          <Link to="/login">
            <Button
              size="small"
              icon={<ArrowIn size={16} />}
              style={{ width: "fit-content", borderRadius: 32 }}
            >
              Войти
            </Button>
          </Link>
        </div>
      </nav>
      <div className={classes.hero}>
        <div className={classes.container}>
          <div className={classes.wallpaper} />
          <div className={classes.intro}>
            <div className={classes.block}>
              <h1>Добро пожаловать в Mirum!</h1>
              <p>
                Выберите нужный Вам курс и сделайте уверенный шаг к достижению
                образовательных целей!
              </p>
              <div className={classes.buttons}>
                <Link to="/login">
                  <Button
                    icon={<ArrowIn />}
                    style={{
                      width: "fit-content",
                      borderRadius: 32,
                      paddingLeft: 16,
                      paddingRight: 16,
                    }}
                  >
                    Войти
                  </Button>
                </Link>
                <a href="#enroll">
                  <Button
                    type="outline"
                    style={{
                      width: "fit-content",
                      borderRadius: 32,
                      paddingLeft: 16,
                      paddingRight: 16,
                      borderColor: "var(--back)",
                      backgroundColor: `var(--back)`,
                    }}
                  >
                    Зарегистрироваться
                  </Button>
                </a>
              </div>
            </div>
            <div className={classes.visualCont}>
              <div className={classes.visual}>
                <div
                  style={{
                    transform: `translateY(0px) translateZ(-40px)`,
                  }}
                  className={classes.windowCont}
                >
                  <div
                    style={{
                      transform: `translateX(-30%) translateY(-5%) scale(0.9) rotateX(2deg) rotateY(-1deg) translateZ(0px)`,
                      opacity: 0.75,
                    }}
                    className={classes.window}
                  >
                    <img src={image1} alt="Ученики Mirum" />
                  </div>
                </div>
                <div
                  style={{
                    transform: `scale(1) rotate(3deg) rotateX(1deg) rotateY(-1deg) translateZ(0px)`,
                  }}
                  className={classes.frame}
                >
                  <Plx
                    style={{
                      boxShadow: "rgba(45, 21, 71, 0.25) 20px 90px 40px 0px",
                    }}
                    parallaxData={frameData}
                    className={classes.frameImage}
                  >
                    <img src={frame} alt="Платформа Mirum" />
                  </Plx>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.section}>
        <div className={classes.container}>
          <h2 className={classes.title}>Программы платформы Mirum:</h2>
          <div className={classes.items}>
            {items.map((item, i) => (
              <div key={i} className={classes.item}>
                <p className={classes.itemSubtitle}>{item.subtitle}</p>
                <h3 className={classes.itemTitle}>{item.title}</h3>
                <p className={classes.itemText}>{item.text}</p>
                {item.warning ? (
                  <Button
                    style={{
                      width: "fit-content",
                      borderRadius: 32,
                      padding: `4px 8px`,
                      fontSize: 14,
                    }}
                    disabled
                  >
                    {item.warning}
                  </Button>
                ) : (
                  <a className={classes.itemLink} href={item.link}>
                    <div className={classes.more}>
                      <span>Подробнее</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h13M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div id="enroll" className={`${classes.section} ${classes.contacts}`}>
        <div className={classes.container}>
          <Form />
        </div>
      </div>
      <footer className={classes.footer}>
        <div className={classes.container}>
          <img src={smg} alt="SMG Education" />
          <div>Центр образовательных проектов «SMG Education»</div>
          <div>
            По дополнительным вопросам:{" "}
            <a href="tel:+77078019119">+7 707 801 91 19</a>,{" "}
            <a href="tel:+77754676153">+7 775 467 61 53</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Form = () => {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    city: "",
    tel: "",
    program: "-1",
  });
  const { addToast } = useToasts();
  const handleChange = (field) => (e) => {
    setState({
      ...state,
      [field]: e.target.value,
    });
  };
  const submit = (e) => {
    e.preventDefault();
    if (!state.firstName || !state.lastName || !state.city || !state.tel) {
      return addToast("Заполните все поля", { appearance: "error" });
    }
    if (state.program === "-1") {
      return addToast("Выберите программу", { appearance: "error" });
    }
    const fd = new FormData();
    Object.keys(state).forEach((key) => {
      fd.append(key, state[key]);
    });
    fetch("/req.php", {
      method: "POST",
      body: fd,
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setState({
            firstName: "",
            lastName: "",
            city: "",
            tel: "",
            program: "-1",
          });
          return addToast("Ваша заявка отправлена", { appearance: "success" });
        } else {
          return addToast("Произошла ошибка", { appearance: "error" });
        }
      })
      .catch((err) => {
        console.log(err);
        return addToast("Произошла ошибка", { appearance: "error" });
      });
  };
  return (
    <form onSubmit={submit} className={classes.card}>
      <div>
        <h2 className={classes.title}>Готовы к достижению целей?</h2>
        <p className={classes.subtitle}>
          Заполните форму заявки и узнайте подробнее о наших программах!
        </p>
      </div>
      <Input
        placeholder="Имя"
        value={state.firstName}
        onChange={handleChange("firstName")}
      />
      <Input
        placeholder="Фамилия"
        value={state.lastName}
        onChange={handleChange("lastName")}
      />
      <Input
        placeholder="Город"
        value={state.city}
        onChange={handleChange("city")}
      />
      <Input
        value={state.tel}
        placeholder="Телефон"
        mask="+7 (999) 999-99-99"
        onChange={handleChange("tel")}
      />
      <div className={classes.select}>
        <select onChange={handleChange("program")} value={state.program}>
          <option value="-1" disabled>
            Выберите программу
          </option>
          {items.map((item, i) => (
            <option key={i} value={item.title}>
              {item.title}
            </option>
          ))}
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      <Button>Отправить заявку</Button>
    </form>
  );
};

export default Index;
