import classes from "./TeacherResults.module.css";
import React from "react";
import { useState } from "react";
import clsx from "clsx";
import Loader from "./Loader";
import { useEffect } from "react";
import Axios from "axios";
import { server } from "../config";
import { connect } from "react-redux";
import Empty from "./Empty";

const Results = ({ quiz, token, open }) => {
    const [result, setResult] = useState(null);
    useEffect(() => {
        if (!quiz) {
            return
        }
        if (!open) {
            return
        }
        setResult(null);
        Axios({
            url: `${server}api/v1/quiz/${quiz.id}/student_scores/`,
            headers: {
                Authorization: `Token ${token}`
            }
        }).then((res) => {
            if (res.data) {
                setResult(res.data)
            }
        })
    }, [quiz, open])
    return (
        <div className={classes.results}>
            {result ? (
                result.length ? (
                    <table>
                        <thead>
                            <th>№</th>
                            <th>Email</th>
                            {result[0].questions.map((q, i) => (
                                <th key={q.id}>
                                    {i + 1}. {q.right_answer}
                                </th>
                            ))}
                        </thead>
                        <tbody>
                            {result.map((row, i) => (
                                <tr key={row.user.email}>
                                <td>{i + 1}</td>
                                <td>{row.user.email}</td>
                                {row.questions.map((q, i) => (
                                    <td className={clsx({
                                        [classes.cell]: true,
                                        [classes.right]: q.user_answer === q.right_answer,
                                        [classes.wrong]: q.user_answer && (q.user_answer !== q.right_answer)
                                    })} key={q.id}>
                                        {q.user_answer}
                                    </td>
                                ))}
                            </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                        <Empty />
                    )
            ) : <Loader />}
        </div>
    )
}



export default connect(state => state)(Results)