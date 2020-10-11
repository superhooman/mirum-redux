import Axios from "axios";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Collapse } from 'react-collapse';
import Loader from "../Components/Loader";
import User from "../Components/User";
import { server } from "../config";
import classes from "./Course.module.css";
import clsx from "clsx";
import Button from "../Components/Button";
import Empty from "../Components/Empty";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import "moment/locale/ru";
import Modal from "../Components/Modal";
import Results from "../Components/Results";
import Chat from "../Components/Chat";

moment.locale("ru")

const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

const Course = ({ match, token }) => {
    const [scrolled, setScrolled] = useState(false);
    const [results, setResults] = useState({
        modal: false,
        quiz: null,
    })
    const [course, setCourse] = useState({
        isFetching: true,
        data: null
    })
    const [quizzes, setQuizzes] = useState({
        isFetching: true,
        data: []
    })
    const [top10, setTop10] = useState({
        isFetching: false,
        data: []
    })
    const [modal, setModal] = useState(false)
    useEffect(() => {
        setCourse({
            isFetching: true,
            data: null
        })
        setQuizzes({
            isFetching: true,
            data: []
        })
        setTop10({
            isFetching: true,
            data: []
        })
        Axios({
            url: server + `api/v1/courses/${match.params.id}/`,
            headers: {
                Authorization: `Token ${token}`
            }
        }).then((res) => {
            if (res.data) {
                setCourse({
                    isFetching: false,
                    data: res.data
                })
            }
        })
        Axios({
            url: `${server}api/v1/courses/${match.params.id}/get_quizzes/`,
            headers: {
                Authorization: `Token ${token}`
            }
        }).then((res) => {
            if (res.data) {
                setQuizzes({
                    isFetching: false,
                    data: res.data
                })
            }
        })
        Axios({
            url: `${server}api/v1/top5/`,
            params: {
                course_id: match.params.id
            },
            headers: {
                Authorization: `Token ${token}`
            }
        }).then((res) => {
            if (res.data) {
                setTop10({
                    isFetching: false,
                    data: res.data.top5
                })
            }
        })
    }, [match.params.id])
    const seeResults = (quiz) => {
        setResults({
            modal: true,
            quiz
        })
    }
    return course.isFetching ? (<Skeleton />) : (
        <div className={classes.Course}>
            <div className={classes.courseHeader}>
                <h1 className={classes.courseTitle}>{course.data.name}</h1>
                <p className={classes.courseDescription}>{course.data.description}</p>
                <div className={classes.label}>Учитель</div>
                <User user={course.data.teacher} />
            </div>
            {course.data.weeks.length ? (<div className={classes.card}>
                <div className={classes.label}>Разделы</div>
                {course.data.weeks.map((week) => (
                    <Week key={week.week} week={week} />
                ))}
            </div>) : null}
            <div className={classes.grid}>
                <div className={classes.card}>
                    <div className={classes.label}>Топ 10</div>
                    {top10.isFetching ? <Loader /> : (top10.data.length ? top10.data.map((student, i) => (
                        <TopItem key={i} i={i} student={student} />
                    )) : <Empty />)}
                    <Button style={{
                        marginTop: 24
                    }} type="default" onClick={() => setModal(true)} size="small">Все участники</Button>
                </div>
                <div className={clsx(classes.card, classes.quizzesCard)}>
                    <div className={clsx(classes.label, {
                        [classes.borderBottom]: scrolled
                    })}>Тесты</div>
                    <div onScroll={e => {
                        setScrolled(e.target.scrollTop > 1)
                    }} className={classes.quizzesWrap}>
                        {quizzes.isFetching ? <Loader /> : quizzes.data.map((quiz) => (
                            <Quiz seeResults={seeResults} quiz={quiz} key={quiz.id} />
                        ))}
                    </div>
                </div>

            </div>
            <Modal open={modal} close={() => setModal(false)} title="Участники курса">
                {course.data.students.map((el, i) => (
                    <div key={i} className={classes.student}>
                        <User user={el} small />
                    </div>
                ))}
            </Modal>
            <Modal open={results.modal} close={() => setResults({
                ...results,
                modal: false
            })} title="Результаты теста">
                <Results open={results.modal} quiz={results.quiz} />
            </Modal>
            <Chat room={course.data.room} />
        </div>
    )
}

const Skeleton = () => (
    <div className={classes.CourseSkeleton}>
        <div className={classes.sHeader}>
            <div className={classes.sHeaderTitle} />
            <div className={classes.sHeaderDescription} />
            <div className={classes.label}>Учитель</div>
            <User />
        </div>
        <div className={classes.card}>
            <div className={classes.label}>Разделы</div>
            <Loader height={128} />
        </div>
        <div className={classes.grid}>
            <div className={classes.card}>
                <div className={classes.label}>Топ 10</div>
                <Loader height={128} />
            </div>
            <div className={classes.card}>
                <div className={classes.label}>Тесты</div>
                <Loader height={128} />
            </div>
        </div>
    </div>
)

const TopItem = ({ student, i }) => (
    <div className={classes.topItem}>
        <div className={classes.topItemName}>
            {i * 1 + 1}. {student.user}
        </div>
        <div className={classes.topItemValue}>
            {student.total_sum}
        </div>
    </div>
)

const Quiz = ({ quiz, seeResults }) => {
    const history = useHistory();
    return (
        <div className={classes.quiz}>
            <div className={classes.quizTitle}>{quiz.description}</div>
            <div className={classes.quizInfo}>
                <div className={classes.quizInfoLabel}>Начало:</div>
                <div className={classes.quizInfoValue}>{moment(quiz.start_time).format('lll')}</div>
            </div>
            <div className={classes.quizInfo}>
                <div className={classes.quizInfoLabel}>Окончание:</div>
                <div className={classes.quizInfoValue}>{moment(quiz.end_time).format('lll')}</div>
            </div>
            <div className={classes.quizInfo}>
                <div className={classes.quizInfoLabel}>Время:</div>
                <div className={classes.quizInfoValue}>{quiz.duration} мин</div>
            </div>
            <div className={classes.quizButtons}>
                <Button disabled={moment().isAfter(quiz.end_time)} onClick={() => history.push(`quiz/${quiz.id}`)} size="small">Пройти тест</Button>
                <Button onClick={() => seeResults(quiz)} size="small">Ответы</Button>
            </div>
        </div>
    )
}

const Week = ({ week }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={clsx(classes.week, {
            [classes.open]: open
        })}>
            <div onClick={() => setOpen(!open)} className={classes.weekHeader}>
                <span>{week.week_name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </div>
            <Collapse theme={{ collapse: classes.collapse, content: classes.collapseContent }} isOpened={open}>
                <p className={classes.weekDescription}>{week.week_description}</p>
                {week.lessons.map((lesson) => (
                    <Lesson lesson={lesson} key={lesson.id} />
                ))}
            </Collapse>
        </div>
    )
}

const Lesson = ({ lesson }) => (
    <div className={classes.lesson}>
        <div className={classes.lessonNumber}>№{lesson.number}</div>
        <div className={classes.lessonName}>{stripHtml(lesson.name)}</div>
        <p>{stripHtml(lesson.description)}</p>
        <Link style={{
            display: "block",
            width: "fit-content"
        }} to={`lesson/${lesson.id}`}><Button size="small" style={{
            width: "fit-content"
        }}>Открыть</Button></Link>
    </div>
)

export default connect(state => state)(Course)