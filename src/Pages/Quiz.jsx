import classes from "./Quiz.module.css";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { server } from "../config";
import { useToasts } from "react-toast-notifications";
import Button from "../Components/Button";
import Loader from "../Components/Loader";
import clsx from "clsx";
import Modal from "../Components/Modal";

const Quiz = ({ type = "quiz", match, token, history }) => {
    const { addToast } = useToasts()
    const [quiz, setQuiz] = useState(null);
    const [state, setState] = useState("ready");
    const [step, setStep] = useState(0);
    const [showStatic, setShowStatic] = useState(false);
    const startQuiz = () => {
        setState("loading");
        Axios({
            url: server + (type === "quiz" ? `api/v1/quiz/${match.params.quiz}/start/` : `api/v1/stage/${match.params.stage}/start/`),
            method: "POST",
            headers: {
                Authorization: "Token " + token
            },
            data: (type === "stage" ? {team_name: match.params.team} : {})
        }).then((res) => {
            if (res.data) {
                if(res.data.questions.length < 1){
                    history.goBack()
                    return addToast(`В ${type === "quiz" ? "тесте" : "этапе"} нет вопросов`, { appearance: 'error' })
                }
                setQuiz(res.data);
                setState("started");
            }
        }).catch((err) => {
            if (err.response && err.response.data && (typeof err.response.data === "string")) {
                addToast(err.response.data, { appearance: 'error' })
            }
            history.goBack()
        })
    }
    const setAnswered = (step, value) => {
        const nquiz = { ...quiz };
        nquiz.questions[step].answered = true;
        nquiz.questions[step].user_answer = value
        setQuiz(nquiz)
    }
    const setDone = () => {
        setState("done")
    }
    console.log(type)
    return (
        <div className={classes.Quiz}>
            {type === "quiz" && state === "started" && quiz.quiz.static_text ? 
                <button onClick={() => setShowStatic(true)} className={classes.fab}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>
                    <span>Текст</span>
                </button> : null}
            {state === "started" ? <Question type={type} setDone={setDone} setAnswered={setAnswered} quizId={match.params.quiz} stage={match.params.stage} team={match.params.team} token={token} step={step} length={quiz.questions.length} setStep={setStep} question={quiz.questions[step]} /> : null}
            {state === "ready" ? (
                <div className={classes.ready}>
                    <div className={classes.card}>
                        <h2>Начать {type === "quiz" ? "тест" : "этап"}</h2>
                        <p>Внимание, после того, как вы начнете {type === "quiz" ? "тест" : "этап"}, у Вас будет ограниченное время на его выполнение. Вы не сможете сдать {type === "quiz" ? "тест" : "этап"} повторно.</p>
                        <Button onClick={startQuiz} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>} size="small">Начать</Button>
                    </div>
                </div>
            ) : null}
            {state === "done" ? (
                <div className={classes.ready}>
                    <div className={classes.card}>
                        <h2>Завершить {type === "quiz" ? "тест" : "этап"}</h2>
                        <p>После завершения вы больше не сможете отвечать на вопросы.</p>
                        <Button onClick={() => {
                            history.goBack()
                        }} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>} size="small">Завершить</Button>
                    </div>
                </div>
            ) : null}
            {state === "loading" ? (
                <div className={classes.ready}>
                    <Loader/>
                </div>
            ) : null}
            <Modal open={showStatic} close={() => setShowStatic(false)} title="Текст">
                {type === "quiz" && quiz && quiz.quiz.static_text ? <div dangerouslySetInnerHTML={{__html: quiz.quiz.static_text}} /> : null}
            </Modal>
        </div>
    )
}

const Question = ({ stage, team, type, question, step, setStep, length, token, quizId, setAnswered, setDone }) => {
    const { addToast } = useToasts()
    const [q, sQ] = useState(question);
    const [a, sA] = useState(null);
    useEffect(() => {
        sQ(question)
        sA(question.user_answer)
    }, [question]);
    const sendAnswer = () => {
        Axios({
            url: type === "quiz" ? `${server}api/v1/quiz/${quizId}/submit/` : `${server}api/v1/stage/${stage}/submit/`,
            method: "POST",
            data: {
                id: q.id,
                answer: a,
                team_name: type === "stage" ? team : undefined
            },
            headers: {
                Authorization: "Token " + token
            }
        }).then((res) => {
            if (res.data && res.data.user_answer || res.data && res.data.team_answer) {
                setAnswered(step, type === "quiz" ? res.data.user_answer : res.data.team_answer)
                (step < (length - 1)) ? setStep(step + 1) : setDone()
            }
        }).catch((err) => {
            if (err.response && err.response.data && (typeof err.response.data === "string")) {
                addToast(err.response.data, { appearance: 'error' })
            }
        })
    }
    return (
        <div className={classes.Question}>
            <div className={classes.content}>
                <div className={classes.contentTitle}>Вопрос {step + 1} из {length}</div>
                <div dangerouslySetInnerHTML={{__html: q.description.replaceAll("\n", "<br/>")}} className={classes.contentDescription}/>
                {q.image ? <img src={server + q.image} alt={q.description} /> : null}
                {q.audio ? <audio controls controlsList="nodownload">
                                    <source src={server + q.audio} type="audio/mpeg" />
                                </audio> : null}
                <div className={classes.variants}>
                    {q.a ? <Variant answered={q.answered} text={q.a} selected={a === "a"} setAnswer={() => sA("a")} /> : null}
                    {q.b ? <Variant answered={q.answered} text={q.b} selected={a === "b"} setAnswer={() => sA("b")} /> : null}
                    {q.c ? <Variant answered={q.answered} text={q.c} selected={a === "c"} setAnswer={() => sA("c")} /> : null}
                    {q.d ? <Variant answered={q.answered} text={q.d} selected={a === "d"} setAnswer={() => sA("d")} /> : null}
                </div>
            </div>
            <div className={classes.Toolbar}>
                <button disabled={step === 0} onClick={() => {
                    step !== 0 && setStep(step - 1);
                }} className={classes.arrowButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <Button onClick={sendAnswer} disabled={question.answered}>{question.answered ? "Вы уже ответили" : "Ответить"}</Button>
                <button onClick={() => {
                    (step < (length - 1)) ? setStep(step + 1) : setDone()
                }} className={classes.arrowButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
            </div>
        </div>
    )
}

const Variant = ({ answered, text, selected, setAnswer }) => (
    <div className={classes.Variant} onClick={!answered ? setAnswer : () => { }}>
        <div className={clsx(classes.dot, {
            [classes.selected]: selected
        })} />
        <span>{text}</span>
    </div>
)


export default connect(state => state)(Quiz)