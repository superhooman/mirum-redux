import classes from "./Tasks.module.css";
import Axios from "axios";
import clsx from "clsx";
import React, { useState } from "react";
import { useToasts } from "react-toast-notifications"
import { server } from "../config";
import Button from "./Button";
import { useEffect } from "react";
import Empty from "./Empty";

const Tasks = ({ lessonTasks, token, lesson, type, asTeacher }) => {
    const { addToast } = useToasts()
    const [tasks, setTasks] = useState(lessonTasks);
    const [step, setStep] = useState(0);
    const [text, setText] = useState("");
    const [result, setResult] = useState({});
    const task = tasks[step];
    useEffect(() => {
        setTasks(lessonTasks);
        setStep(0);
        setText("");
    }, [type])
    useEffect(() => {
        if(type !== "homework" || !asTeacher){
            return;
        }
        Axios({
            url: server + `api/v1/lessons/${lesson.id}/get_answers/`,
            headers: {
                Authorization: `Token ${token}`
            }
        }).then((res) => {
            if(res.data){
                setResult(res.data)
            }
        })
    }, [asTeacher, type, lesson.id])
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
                    <div className={classes.content} dangerouslySetInnerHTML={{ __html: task.description }} />
                    {asTeacher ? (result && result[task.id] ? <ShowAnswers data={result[task.id]} /> : null) : (task.answered ? null : <textarea placeholder="Введите ответ..." value={text} onChange={e => setText(e.target.value)} />)}
                    <Toolbar asTeacher={asTeacher} sendAnswer={sendAnswer} step={step} setStep={setStep} tasks={tasks} />
                </>
            ) : null}
        </div>
    )
}

const ShowAnswers = ({data}) => {
    return(
        <div className={classes.answers}>
            <div className={classes.label}>Ответы</div>
            {data.answers.length ? (data.answers.map((row, i) => (
                <div key={i} className={classes.answerRow}>
                    <div className={classes.answerRowStudent}>{row[0]}</div>
                    <div className={classes.answerRowContent}>{row[1]}</div>
                </div>
            )) ) : (<Empty/>)}
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

const Toolbar = ({ sendAnswer, step, tasks, setStep, asTeacher }) => (
    <div className={classes.Toolbar}>
        <button disabled={step === 0} onClick={() => {
            step !== 0 && setStep(step - 1);
        }} className={classes.arrowButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        {asTeacher ? null : (<Button onClick={sendAnswer} disabled={tasks[step].answered}>Ответить</Button>)}
        <button disabled={step === tasks.length - 1} onClick={() => {
            step < tasks.length - 1 && setStep(step + 1);
        }} className={classes.arrowButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
    </div>
)

export default Tasks;