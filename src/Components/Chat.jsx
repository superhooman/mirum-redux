import classes from "./Chat.module.css";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { server } from "../config";
import moment from "moment";
import "moment/locale/ru";
import clsx from "clsx";
import { useRef } from "react";
import { useInterval } from "../utils"
import Empty from "./Empty";

moment.locale("ru");

const getInitials = (name) => {
    const words = name.split(" ");
    return words.length < 2 ? words[0][0] : (words[1] === "" ? `${words[0][0]}${words[2][0]}` : `${words[0][0]}${words[1][0]}`);
};

const Chat = ({ room, token }) => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState({
        isFetching: true,
        items: []
    })
    const container = useRef();
    const getMessages = () => {
        Axios({
            url: server + `api/v1/chat/all/`,
            headers: {
                Authorization: `Token ${token}`
            },
            params: {
                room: room
            }
        }).then((res) => {
            if (res.data) {
                const oldLength = messages.items.length
                setMessages({
                    isFetching: false,
                    items: res.data.sort((a, b) => {
                        return (new Date(a.timestamp)).getTime() - (new Date(b.timestamp)).getTime()
                    })
                })
                if (oldLength < res.data.length) {
                    container.current && container.current.scrollTo(0, container.current.scrollHeight)
                }
            }
        })
    }
    const send = () => {
        Axios({
            url: server + `api/v1/chat/send/`,
            headers: {
                Authorization: `Token ${token}`
            },
            method: "POST",
            data: {
                room: room,
                message: text
            }
        }).then((res) => {
            if (res.data) {
                setMessages({
                    isFetching: false,
                    items: [
                        ...messages.items,
                        res.data
                    ]
                })
                container.current && container.current.scrollTo(0, container.current.scrollHeight)
                setText("");
                getMessages();
            }
        })
    }
    useEffect(() => {
        getMessages();
    }, [room])

    useInterval(() => {
        getMessages()
    }, 2000)

    return (
        <div className={classes.Chat}>
            <div className={clsx(classes.window, {
                [classes.open]: open,
            })}>
                <div className={classes.header}>
                    Чат
                </div>
                <div ref={container} className={classes.messages}>
                    {
                        messages.items.length ? messages.items.map((el, i) => (
                            <div key={i} className={clsx(classes.message, {
                                [classes.me]: el.me
                            })}>
                                <div style={{
                                    backgroundImage: el.author.avatar ? `url(${el.author.avatar})` : null
                                }} className={classes.avatar}>
                                    {el.author.avatar ? null : <span>{getInitials(el.author.name)}</span>}
                                </div>
                                <div className={classes.messageBody}>
                                    <div className={classes.messageText}>
                                        <div className={classes.messageName}>{el.author.name}</div>
                                        <div>{el.message}</div>
                                    </div>

                                    <div className={classes.messageDate}>{moment(el.timestamp).format('lll')}</div>
                                </div>
                            </div>
                        )) : <Empty height="100%"/>
                    }
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    send();
                }} className={classes.toolbar}>
                    <input placeholder="Написать..." type="text" value={text} onChange={e => setText(e.target.value)} />
                    <button disabled={!text}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
                </form>
            </div>
            <div onClick={() => setOpen(!open)} className={clsx(classes.fab, {
                [classes.open]: open
            })}>
                <svg className={classes.icon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                <svg className={classes.close} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </div>
        </div>
    )
}

export default connect(state => state)(Chat);