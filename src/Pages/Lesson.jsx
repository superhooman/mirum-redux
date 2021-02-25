import classes from "./Lesson.module.css";
import Axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import Loader from "../Components/Loader";
import { server } from "../config";
import clsx from "clsx";
import Button from "../Components/Button";
import Tasks from "../Components/Tasks";
import Modal from "../Components/Modal"
import { Link } from "react-router-dom";

const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

const Lesson = ({ match, token, user }) => {
    const [modal, setModal] = useState({
        open: false,
        type: "task",
        title: "Classwork",
        asTeacher: false
    })
    const [lesson, setLesson] = useState({
        isFetching: true,
        data: null
    })
    useEffect(() => {
        Axios({
            url: `${server}api/v1/lessons/${match.params.lesson}/`,
            headers: {
                Authorization: `Token ${token}`
            }
        }).then((res) => {
            if (res.data) {
                setLesson({
                    isFetching: false,
                    data: res.data
                })
            }
        })
    }, [])
    return lesson.isFetching ? <Loader /> : (
        <div className={classes.lesson}>
            <div className={classes.lessonHeader}>
                <h1 className={classes.lessonTitle}>{stripHtml(lesson.data.name)}</h1>
                {lesson.data.description ? <p className={classes.lessonDescription}>{stripHtml(lesson.data.description)}</p> : null}
                {(user && user.type === "teacher" && lesson.data.homeworks.length > 0) ? (
                    <div style={{
                        marginTop: 8
                    }}>
                        <Button onClick={() => setModal({
                            open: true,
                            type: "homework",
                            title: "Homework",
                            asTeacher: true
                        })} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9" /><path d="M9 22V12h6v10M2 10.6L12 2l10 8.6" /></svg>} style={{
                            width: "auto"
                        }} size="small">Homeworks</Button>
                    </div>
                ) : null}
                {(user && user.type === "student") ? <div className={classes.buttons}>
                    {lesson.data.tasks.length ? <Button icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>} onClick={() => setModal({
                        open: true,
                        type: "task",
                        title: "Classwork",
                        asTeacher: false
                    })} size="small">Classwork</Button> : null}
                    {lesson.data.show_homework && lesson.data.homeworks.length ? <Button icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9" /><path d="M9 22V12h6v10M2 10.6L12 2l10 8.6" /></svg>} onClick={() => setModal({
                        open: true,
                        type: "homework",
                        title: "Homework",
                        asTeacher: false
                    })} size="small">Homework</Button> : null}
                </div> : null}
            </div>
            <div className={classes.card}>
                <div dangerouslySetInnerHTML={{ __html: lesson.data.body }} className={classes.content} />
                <div className={classes.resourses}>
                    {lesson.data.resources.map((el, i) => {
                        return el.type === "video" ? (
                            <video key={i} controls="controls" controlsList="nodownload">
                                <source src={el.src.replace("http://", "https://")} type="video/mp4"></source>
                            </video>
                        ) : (
                                <audio key={i} controls controlsList="nodownload">
                                    <source src={el.src.replace("http://", "https://")} type="audio/mpeg" />
                                </audio>
                            )
                    })}
                </div>
            </div>
            <Modal width={modal.asTeacher ? 720 : 480} open={modal.open} title={modal.title} close={() => setModal({
                ...modal,
                open: false
            })}>
                <Tasks email={user && user.email} asTeacher={modal.asTeacher} token={token} lessonTasks={modal.type === "task" ? lesson.data.tasks : lesson.data.homeworks} type={modal.type} lesson={lesson.data} />
            </Modal>
        </div>
    )
}

export default connect(state => state)(Lesson)