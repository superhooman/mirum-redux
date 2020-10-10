import classes from "./Results.module.css";
import React from "react";
import { useState } from "react";
import clsx from "clsx";
import Loader from "./Loader";
import { useEffect } from "react";
import Axios from "axios";
import { server } from "../config";
import { connect } from "react-redux";

const Results = ({ quiz, token, open }) => {
    const [tab, setTab] = useState(0);
    const [result, setResult] = useState(null);
    const [answers, setAnswers] = useState(null);
    useEffect(() => {
        if (!quiz) {
            return
        }
        if (!open) {
            return
        }
        setResult(null);
        setAnswers(null);
        setTab(0)
        Axios({
            url: `${server}api/v1/quiz/${quiz.id}/result/`,
            headers: {
                Authorization: `Token ${token}`
            }
        }).then((res) => {
            if (res.data) {
                setResult(res.data)
            }
        })
        Axios({
            url: `${server}api/v1/quiz/${quiz.id}/answers/`,
            headers: {
                Authorization: `Token ${token}`
            }
        }).then((res) => {
            if (res.data) {
                setAnswers(res.data)
            }
        })
    }, [quiz, open])
    return (
        <div className={classes.results}>
            <div className={classes.header}>
                <div className={classes.tabs}>
                    <div className={clsx(classes.tab, {
                        [classes.active]: tab === 0
                    })} onClick={() => setTab(0)}>Результаты</div>
                    {answers ? <div className={clsx(classes.tab, {
                        [classes.active]: tab === 1
                    })} onClick={() => setTab(1)}>Ответы</div> : null}
                </div>
            </div>
            {
                tab === 0 ? (
                    result ? (
                        <>
                            <div className={classes.field}>
                                <div className={classes.fieldLabel}>Правильные ответы</div>
                                <div className={classes.fieldValue}>
                                    <b>{result.score}</b>/{result.score + result.wrong_score}
                                </div>
                            </div>
                            <div className={classes.field}>
                                <div className={classes.fieldLabel}>Неправильные ответы</div>
                                <div className={classes.fieldValue}>
                                    <b>{result.wrong_score}</b>/{result.score + result.wrong_score}
                                </div>
                            </div>
                        </>
                    ) : <Loader />
                ) : null
            }
            {
                tab === 1 ? <Answers qA={answers.questions_with_answers} /> : null
            }
        </div>
    )
}

const Answers = ({ qA }) => {
    const [step, setStep] = useState(0);
    const q = qA[step]
    return (
        <>
            <div className={classes.answerHeader}>
                <div>
                    <div className={classes.stepWrap}>
                        {qA.map((el, i) => (
                            <React.Fragment key={i}>
                                {i > 0 ? <div className={classes.divider} /> : null}
                                <div tabIndex="-1" onClick={() => setStep(i)} className={clsx(classes.answerHeaderItem, {
                                    [classes.selected]: i === step,
                                    [classes.answered]: el.answered
                                })}>
                                    {el.answered ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> : <span>{i + 1}</span>}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
            <div className={classes.anwerContent}>
                <div className={classes.contentDescription}>{q.description}</div>
                <div className={classes.variants}>
                    {q.a ? <Variant answered={q.answered} text={q.a} selected={q.user_answer === "a"} /> : null}
                    {q.b ? <Variant answered={q.answered} text={q.b} selected={q.user_answer === "b"} /> : null}
                    {q.c ? <Variant answered={q.answered} text={q.c} selected={q.user_answer === "c"} /> : null}
                    {q.d ? <Variant answered={q.answered} text={q.d} selected={q.user_answer === "d"} /> : null}
                </div>
                <div className={classes.answerRight}>
                    Правильный ответ: <b>{q.right_answer}</b>
                </div>
            </div>
            <div className={classes.Toolbar}>
                <button disabled={step === 0} onClick={() => {
                    step !== 0 && setStep(step - 1);
                }} className={classes.arrowButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>

                <button disabled={step === (qA.length - 1)} onClick={() => {
                    (step < (qA.length - 1)) && setStep(step + 1)
                }} className={classes.arrowButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
            </div>
        </>
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

export default connect(state => state)(Results)