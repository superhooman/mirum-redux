import classes from "./TeacherResults.module.css";
import React from "react";
import { useState } from "react";
import clsx from "clsx";
import Loader from "./Loader";
import { useEffect } from "react";
import Axios from "axios";
import { server } from "../config";
import { connect } from "react-redux";
import { useTable, useBlockLayout } from "react-table";
import { useSticky } from "react-table-sticky";
import Empty from "./Empty";

const Table = ({ columns, data }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable(
        {
            columns,
            data,
            defaultColumn: {
                width: 256,
                maxWidth: 400
            }
        },
        useBlockLayout,
        useSticky
    );
    return (
        <div
            {...getTableProps()}
            className={clsx(classes.table, classes.sticky)}
        >
            <div className={classes.header}>
                {headerGroups.map(headerGroup => (
                    <div {...headerGroup.getHeaderGroupProps()} className={classes.tr}>
                        {headerGroup.headers.map(column => (
                            <div {...column.getHeaderProps()} className={classes.th}>
                                {column.render("Header")}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div {...getTableBodyProps()} className={classes.body}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <div {...row.getRowProps()} className={classes.tr}>
                            {row.cells.map(cell => {
                                return (
                                    <div {...cell.getCellProps()} className={classes.td}>
                                        {cell.render("Cell")}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

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

    const getDataFromUsers = (users) => {
        const res = [];
        users.forEach((row, i) => {
            const user = {
                email: row.user.email,
            };
            let score = 0;
            row.questions.forEach((q, i) => {
                if (q.user_answer === q.right_answer) {
                    score += 1;
                }
                user[`q-${i}`] = q.user_answer;
            });
            user.score = score;
            res.push(user)
        })
        return res;
    }
    return (
        <>
            {result ? (
                result.length ? (
                    /*<table>
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
                                    </table>*/
                    <Table columns={[
                        {
                            Header: "Email",
                            sticky: "left",
                            accessor: "email"
                        },
                        ...result[0].questions.map((q, i) => ({
                            Header: `${i + 1}. ${q.right_answer}`,
                            width: 44,
                            accessor: `q-${i}`,
                            Cell: (data, i) => {
                                return (
                                    <div style={{
                                        color: data.cell.value ? (data.cell.value === q.right_answer ? 'var(--green)' : 'var(--red)') : "var(--textSecondary)"
                                    }} className={classes.cell}>
                                        {data.cell.value}
                                    </div>
                                )
                                //row.styles['color'] = 
                                //return row.value.toUpperCase();
                            }
                        })),
                        {
                            Header: "Score",
                            accessor: "score",
                            sticky: "right",
                            width: 56
                        }
                    ]} data={getDataFromUsers(result)} />
                ) : (
                        <Empty />
                    )
            ) : <Loader />}
        </>
    )
}





export default connect(state => state)(Results)