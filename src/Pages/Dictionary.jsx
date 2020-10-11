import classes from "./Dictionary.module.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import Input from "../Components/Input";
import Modal from "../Components/Modal"
import Button from "../Components/Button"
import Loader from "../Components/Loader"
import Empty from "../Components/Empty"
import { useEffect } from "react";
import Axios from "axios";
import { server } from "../config"
import moment from "moment";
import { useToasts } from "react-toast-notifications";

const Dictionary = ({ token }) => {
    const {addToast} = useToasts()
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState({
        open: false,
        example: "",
        meaning: "",
        original: "",
        translation: "",
        id: 0
    })
    const closeEdit = () => {
        setEdit({
            ...edit,
            open: false
        })
    }
    const [words, setWords] = useState({
        isFetching: true,
        items: []
    })
    const [state, changeState] = useState({
        example: "",
        meaning: "",
        original: "",
        translation: ""
    })
    const handleChange = (field) => (e) => {
        changeState({
            ...state,
            [field]: e.target.value
        })
    }
    const handleChangeEdit = (field) => (e) => {
        setEdit({
            ...edit,
            [field]: e.target.value
        })
    }
    const addWord = () => {
        if(!state.original){
            return addToast("Введите слово", { appearance: 'error' })
        }
        if(!state.translation){
            return addToast("Введите перевод", { appearance: 'error' })
        }
        Axios({
            url: server + `api/v1/vocabulary/`,
            headers: {
                Authorization: `Token ${token}`
            },
            method: "POST",
            data: state
        }).then((res) => {
            if (res.data) {
                changeState({
                    example: "",
                    meaning: "",
                    original: "",
                    translation: ""
                })
                setOpen(false)
                setWords({
                    isFetching: false,
                    items: [
                        ...words.items,
                        res.data
                    ]
                })
            }
        })
    }
    const editWord = () => {
        Axios({
            url: server + `api/v1/vocabulary/${edit.id}/`,
            headers: {
                Authorization: `Token ${token}`
            },
            method: "PATCH",
            data: edit
        }).then((res) => {
            if (res.data) {
                closeEdit()
                getWords()
            }
        })
    }
    const deleteWord = (id) => {
        if(!window.confirm("Вы уверены, что хотите удалить это слово?")){
            return
        }
        Axios({
            url: server + `api/v1/vocabulary/${id}/`,
            headers: {
                Authorization: `Token ${token}`
            },
            method: "DELETE",
        }).then((res) => {
            getWords()
        })
    }
    const getWords = () => {
        Axios({
            url: server + `api/v1/vocabulary/`,
            headers: {
                Authorization: `Token ${token}`
            }
        }).then((res) => {
            if (res.data) {
                setWords({
                    isFetching: false,
                    items: res.data
                })
            }
        })
    }
    useEffect(() => {
        getWords()
    }, [])
    return (
        <div className={classes.Dictionary}>
            <h1>Словарь</h1>
            <div className={classes.cards}>
                {words.isFetching ? <Loader /> : (
                    words.items.length ? words.items.map((el) => (
                        <div key={el.id} className={classes.card}>
                            <div className={classes.actions}>
                                <button onClick={() => setEdit({
                                    ...el,
                                    open: true
                                })} className={classes.iconButton}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                                </button>
                                <button onClick={() => deleteWord(el.id)} className={classes.iconButton}>
                                    <svg className={classes.delete} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            </div>
                            <div className={classes.wordOriginal}>{el.original}</div>
                            <div className={classes.wordTranslation}>{el.translation}</div>
                            <div className={classes.wordMeaning}>{el.meaning}</div>
                            <div className={classes.wordExample}>{el.example}</div>
                            <div className={classes.date}>{moment(el.timestamp).format("ll")}</div>
                        </div>
                    )) : <Empty/>
                )}
            </div>
            <button onClick={() => setOpen(true)} className={classes.fab}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <Modal open={open} close={() => setOpen(false)} title="Добавить слово">
                <form onSubmit={e => {
                    e.preventDefault();
                    addWord();
                }}>
                    <div className={classes.field}>
                        <Input
                            name="original"
                            label="Слово"
                            placeholder="Cookie"
                            type="text"
                            value={state.original}
                            onChange={handleChange("original")}
                        />
                    </div>
                    <div className={classes.field}>
                        <Input
                            name="translation"
                            label="Перевод"
                            placeholder="Печенье"
                            type="text"
                            value={state.translation}
                            onChange={handleChange("translation")}
                        />
                    </div>
                    <div className={classes.field}>
                        <Input
                            name="meaning"
                            label="Значение"
                            placeholder="Кондитерское изделие из кусочков сладкого теста"
                            type="textarea"
                            value={state.meaning}
                            onChange={handleChange("meaning")}
                        />
                    </div>
                    <div className={classes.field}>
                        <Input
                            name="example"
                            label="Пример"
                            placeholder="Can I have a cookie?"
                            type="textarea"
                            value={state.example}
                            onChange={handleChange("example")}
                        />
                    </div>
                    <Button style={{
                        marginTop: 24
                    }}>Добавить</Button>
                </form>
            </Modal>
            <Modal open={edit.open} close={closeEdit} title="Редактировать слово">
                <form onSubmit={e => {
                    e.preventDefault();
                    editWord();
                }}>
                    <div className={classes.field}>
                        <Input
                            name="original"
                            label="Слово"
                            placeholder="Cookie"
                            type="text"
                            value={edit.original}
                            onChange={handleChangeEdit("original")}
                        />
                    </div>
                    <div className={classes.field}>
                        <Input
                            name="translation"
                            label="Перевод"
                            placeholder="Печенье"
                            type="text"
                            value={edit.translation}
                            onChange={handleChangeEdit("translation")}
                        />
                    </div>
                    <div className={classes.field}>
                        <Input
                            name="meaning"
                            label="Значение"
                            placeholder="Кондитерское изделие из кусочков сладкого теста"
                            type="textarea"
                            value={edit.meaning}
                            onChange={handleChangeEdit("meaning")}
                        />
                    </div>
                    <div className={classes.field}>
                        <Input
                            name="example"
                            label="Пример"
                            placeholder="Can I have a cookie?"
                            type="textarea"
                            value={edit.example}
                            onChange={handleChangeEdit("example")}
                        />
                    </div>
                    <Button style={{
                        marginTop: 24
                    }}>Изменить</Button>
                </form>
            </Modal>
        </div>
    )
}

export default connect(state => state)(Dictionary)