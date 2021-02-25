import classes from "./Tasks.module.css";
import Axios from "axios";
import clsx from "clsx";
import React, { useState } from "react";
import { useToasts } from "react-toast-notifications"
import { server } from "../config";
import Button from "./Button";
import { useEffect } from "react";
import Empty from "./Empty";
import Checkbox from './Checkbox';
import Input from './Input';

const Tasks = ({ lessonTasks, token, lesson, type, asTeacher, email }) => {
    const { addToast } = useToasts()
    const [tasks, setTasks] = useState(lessonTasks);
    const [step, setStep] = useState(0);
    const [text, setText] = useState("");
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState({});
    const task = tasks[step];
    const changeAnswers = (task) => (id, field) => (value) => {
        const answrs = { ...answers };
        answrs[task][id][field] = value;
        setAnswers(answrs);
    }
    useEffect(() => {
        setTasks(lessonTasks);
        setStep(0);
        setText("");
    }, [type])
    useEffect(() => {
        if (type !== "homework") {
            return;
        }
        if (!asTeacher) {
            Axios({
                url: server + `api/v1/lessons/${lesson.id}/get_answers/`,
                headers: {
                    Authorization: `Token ${token}`
                }
            }).then((res) => {
                setResult(res.data);
            })
            return;
        }
        Axios({
            url: server + `api/v1/lessons/${lesson.id}/get_answers/`,
            headers: {
                Authorization: `Token ${token}`
            }
        }).then((res) => {
            if (res.data) {
                const answrs = {}
                Object.keys(res.data).forEach((key) => {
                    answrs[key] = res.data[key].answers.map((a, i) => ({
                        id: a[0],
                        correct: a[4],
                        comment: a[3],
                        checked: a[5]
                    }));
                })

                setAnswers(answrs);
                setResult(res.data);
            }
        })
    }, [asTeacher, type, lesson.id])
    const checkAnswers = () => {
        if (type !== "homework" || !asTeacher) {
            return;
        }
        Axios({
            url: server + `api/v1/lessons/${lesson.id}/check_answers/`,
            method: "POST",
            data: answers[task.id].filter(el => el.correct || el.comment).map((el) => [el.id, el.correct, el.comment]),
            headers: {
                Authorization: `Token ${token}`
            }
        }).then((res) => {
            return addToast("Проверка сохранена", { appearance: 'success' })
        })
    }
    const sendAnswer = () => {
        if (!text) {
            return addToast("Ответ не может быть пустым", { appearance: 'error' })
        }
        Axios({
            url: `${server}api/v1/lessons/${lesson.id}/submit_${type}/`,
            method: "POST",
            headers: {
                Authorization: "Token " + token,
            },
            data: {
                answer: text,
                [type]: task.id,
            },
        }).then((res) => {
            if (res.data) {
                const arr = [...tasks];
                arr.forEach((el, i) => {
                    if (el.id === task.id) {
                        arr[i].answered = true;
                    }
                });
                setTasks(arr);
                setText("");
            }
        });
    };
    return (
        <div className={classes.Tasks}>
            <Header tasks={tasks} setStep={setStep} step={step} />
            {task ? (
                <>
                    <div className={classes.content} dangerouslySetInnerHTML={{ __html: task.description.split("&nbsp;").join("") }} />
                    {!asTeacher && type === "homework" && result[task.id] ? (
                        result[task.id].answers.filter(answer => (answer[1] === email)).map((answer) => (
                            <div key={answer[0]} className={classes.answerBlock}>
                                <div className={classes.answerText}>{answer[2]}</div>
                                <div className={clsx(classes.answerStatus, {
                                    [classes.ok]: answer[5] && answer[4],
                                    [classes.bad]: answer[5] && !answer[4]
                                })}>{answer[5] ? (answer[4] ? "Верно" : "Неверно") : "На проверке"}</div>
                                {answer[3] ? <div className={classes.answerComment}>{answer[3]}</div> : null}
                            </div>
                        ))
                    ) : null}
                    {asTeacher ? (result && result[task.id] ? <ShowAnswers answers={answers[task.id]} changeAnswers={changeAnswers(task.id)} data={result[task.id]} /> : null) : (task.answered ? null : <textarea placeholder="Введите ответ..." value={text} onChange={e => setText(e.target.value)} />)}
                    <Toolbar asTeacher={asTeacher} checkAnswers={checkAnswers} sendAnswer={sendAnswer} step={step} setStep={setStep} tasks={tasks} />
                </>
            ) : null}
        </div>
    )
}

const ShowAnswers = ({ data, changeAnswers, answers }) => {
    return (
        <div className={classes.answers}>
            <div className={classes.label}>Ответы ({data.answers.length})</div>
            {data.answers.length ? (data.answers.map((row, i) => (
                <div key={i} className={classes.answerRow}>
                    <div className={classes.answerRowStudent}>{row[1]}</div>
                    <div className={classes.answerRowContent}>{row[2]}</div>
                    <div className={clsx(classes.answerRowControls, {
                        [classes.checked]: answers[i].checked
                    })}>
                        <div className={classes.answerRowCheckbox}>{answers[i] ? <Checkbox value={answers[i].correct} onChange={changeAnswers(i, 'correct')} label="Правильно" /> : null}</div>
                        {answers[i] ? <Input value={answers[i].comment} onChange={e => changeAnswers(i, 'comment')(e.target.value)} placeholder="Комментарий" /> : null}
                    </div>
                </div>
            ))) : (<Empty />)}
        </div>
    )
}

const Header = ({ tasks, setStep, step }) => (
    <div className={classes.taskHeader}>
        <div>
            <div className={classes.stepWrap}>
                {tasks.map((el, i) => (
                    <React.Fragment key={i}>
                        {i > 0 ? <div className={classes.divider} /> : null}
                        <div onClick={() => setStep(i)} className={clsx(classes.taskHeaderItem, {
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
)

const Toolbar = ({ sendAnswer, step, tasks, setStep, asTeacher, checkAnswers }) => (
    <div className={classes.Toolbar}>
        <button disabled={step === 0} onClick={() => {
            step !== 0 && setStep(step - 1);
        }} className={classes.arrowButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        {asTeacher ? (<Button onClick={checkAnswers}>Проверить</Button>) : (<Button onClick={sendAnswer} disabled={tasks[step].answered}>Ответить</Button>)}
        <button disabled={step === tasks.length - 1} onClick={() => {
            step < tasks.length - 1 && setStep(step + 1);
        }} className={classes.arrowButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
    </div>
)

export default Tasks;