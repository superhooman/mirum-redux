import classes from "./Tournaments.module.css";
import React, { useState, useEffect, useMemo } from "react";
import Axios from "axios";
import { server } from "../config";
import { Collapse } from 'react-collapse';
import { connect } from "react-redux";
import clsx from "clsx";
import User from "../Components/User"
import Loader from "../Components/Loader";
import Empty from "../Components/Empty";
import moment from "moment";
import Button from "../Components/Button";
import { useToasts } from "react-toast-notifications";
import Modal from "../Components/Modal";
import Input from "../Components/Input";

const getWord = (number, titles) => {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

const Tournaments = ({ token, user, history }) => {
    const { addToast } = useToasts()
    const [tournaments, setTournaments] = useState({
        isFetching: true,
        items: []
    })
    const [more, setMore] = useState({
        open: false,
        tournament: null
    });
    const closeMore = () => {
        setMore({
            ...more,
            open: false,
            team: ""
        })
    }
    const [selected, setSelected] = useState({})
    const [name, setName] = useState("")
    const [modal, setModal] = useState(false)
    const [info, setInfo] = useState({})
    const [tab, setTab] = useState(0);
    const openMore = (tournament, team) => {
        setMore({
            open: true,
            team,
            tournament
        })
    }
    const getData = () => {
        setTournaments({
            isFetching: true,
            data: []
        })
        Axios({
            url: `${server}api/v1/tournament/`,
            headers: {
                Authorization: "Token " + token
            }
        }).then((res) => {
            if (res.data) {
                setTournaments({
                    isFetching: false,
                    items: res.data
                })
            }
        })
    }
    useEffect(() => {
        getData();
        Axios({
            url: `${server}api/v1/tournament_statistic/`,
            headers: {
                Authorization: "Token " + token
            }
        }).then((res) => {
            setInfo(res.data)
        })
    }, [])
    const registerToTeam = (tournament) => (team) => {
        Axios({
            url: `${server}api/v1/tournament/register_to_team/`,
            method: "POST",
            headers: {
                Authorization: "Token " + token
            },
            data: {
                team_name: team.name,
                tournament_name: tournament.name
            }
        }).then((res) => {
            if (res.data) {
                getData()
            }
        }).catch((err) => {
            if (err.response && err.response.data && (typeof err.response.data === "string")) {
                addToast(err.response.data, { appearance: 'error' })
            }
        })
    }
    const registerTeam = (tournament) => () => {
        setSelected(tournament)
        setModal(true)
    }
    const createTeam = () => {
        if (!name) {
            return addToast("Название команды не может быть пустым", { appearance: 'error' })
        }
        setModal(false);
        Axios({
            url: `${server}api/v1/tournament/create_team/`,
            method: "POST",
            headers: {
                Authorization: "Token " + token
            },
            data: {
                name,
                tournament_name: selected.name
            }
        }).then((res) => {
            if (res.data) {
                getData();
                setName("");
                addToast("Успешное создание команды", { appearance: 'success' })
            }
        }).catch((err) => {
            setName("")
            if (err.response && err.response.data && (typeof err.response.data === "string")) {
                addToast(err.response.data, { appearance: 'error' })
            }
        })
    }
    return (
        <div className={classes.Tournaments}>
            <h1>Турниры</h1>
            {info.tournament ? <div className={classes.userInfo}>
                <div className={classes.boxesWrap}>
                    <div className={classes.infoBox}>
                        <div className={classes.infoBoxLabel}>
                            Призовой фонд
                            </div>
                        <div className={classes.infoBoxValue}>
                            {info.edcoin} EdCoins
                        </div>
                    </div>
                    <div className={classes.infoBox}>
                        <div className={classes.infoBoxLabel}>
                            Количество команд
                        </div>
                        <div className={classes.infoBoxValue}>
                            {info.all_team} {getWord(info.all_team, ['команда', 'команды', 'команд'])}
                        </div>
                    </div>
                    <div className={classes.infoBox}>
                        <div className={classes.infoBoxLabel}>
                            Активные Турниры
                        </div>
                        <div className={classes.infoBoxValue}>
                            {info.tournament} {getWord(info.tournament, ['турнир', 'турнира', 'турниров'])}
                        </div>
                    </div>
                </div>
            </div> : null}
            <div className={classes.tabs}>
                <div onClick={() => setTab(0)} className={clsx(classes.tab, {
                    [classes.active]: tab === 0
                })}>Все турниры</div>
                <div onClick={() => setTab(1)} className={clsx(classes.tab, {
                    [classes.active]: tab === 1
                })}>Мои турниры</div>
            </div>
            {tournaments.isFetching || !user ? <Loader /> : tournaments.items.length ? (
                <div className={classes.tournaments}>
                    {tournaments.items.map((el, i) => (
                        <TournamentItem openMore={openMore} data={el} token={token} user={user} my={tab === 1} getData={getData} registerTeam={registerTeam(el)} registerToTeam={registerToTeam(el)} key={i} />
                    ))}
                </div>
            ) : <Empty />}
            <Modal open={modal} close={() => setModal(false)} title="Добавить команду">
                <form onSubmit={e => {
                    e.preventDefault()
                    createTeam()
                }}>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Введите название..." label="Название" type="text" name="name" />
                    <Button style={{
                        marginTop: 24
                    }}>Создать</Button>
                </form>
            </Modal>
            <Modal open={more.open} close={closeMore} title="Этапы">
                {more.tournament ? <TournamentSteps history={history} team={more.team} token={token} tournament={more.tournament} /> : null}
            </Modal>
        </div>
    )
}

const TournamentSteps = ({ history, tournament, token, team }) => {
    const [steps, setSteps] = useState({
        isFetching: true,
        items: []
    })
    const [step, setStep] = useState(0)
    useEffect(() => {
        setSteps({
            isFetching: true,
            items: []
        })
        Axios({
            url: server + `api/v1/stage/get_stages/`,
            params: {
                tournament_name: tournament.name
            },
            headers: {
                Authorization: `Token ${token}`
            }
        }).then((res) => {
            if (res.data) {
                setSteps({
                    isFetching: false,
                    items: res.data
                })
            }
        })
    }, [tournament])
    return steps.isFetching ? <Loader /> : (
        steps.items.length ? (
            <div>
                <div className={classes.stepsHeader}>
                    <div>
                        <div className={classes.stepWrap}>
                            {steps.items.map((el, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 ? <div className={classes.divider} /> : null}
                                    <div tabIndex="-1" onClick={() => setStep(i)} className={clsx(classes.stepsHeaderItem, {
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
                <div className={classes.stepsContent}>
                    <Field label="Название Этапа" value={steps.items[step].description} />
                    <Field label="Начало" value={moment(steps.items[step].start_time).fromNow()} />
                    <Field label="Конец" value={moment(steps.items[step].end_time).fromNow()} />
                    <Field label="Тип" value={steps.items[step].type} />
                    <Field label="Время" value={`${steps.items[step].duration} мин.`} />
                    <Field label="Edcoins" value={steps.items[step].N} />
                </div>
                <Toolbar goTo={() => history.push(`/dashboard/stage/${steps.items[step].id}/${team}`)} step={step} steps={steps.items} setStep={setStep} />
            </div>
        ) : <Empty />
    )
}

const Field = ({ label, value }) => (
    <div className={classes.field}>
        <div className={classes.fieldLabel}>{label}</div>
        <div className={classes.fieldValue}>{value}</div>
    </div>
)

const Toolbar = ({ goTo, step, steps, setStep }) => (
    <div className={classes.Toolbar}>
        <button disabled={step === 0} onClick={() => {
            step !== 0 && setStep(step - 1);
        }} className={classes.arrowButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <Button onClick={goTo} disabled={!steps[step].distributed || moment().isAfter(steps[step].end_time)}>Начать</Button>
        <button disabled={step === steps.length - 1} onClick={() => {
            step < steps.length - 1 && setStep(step + 1);
        }} className={classes.arrowButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
    </div>
)

const TournamentItem = ({ openMore, data, registerToTeam, user, registerTeam, my, token, getData }) => {
    const inTeam = useMemo(() => {
        let allMembers = []
        data.teams.forEach((team) => {
            allMembers.push(team.captain.email)
            allMembers.push(...team.mates.map((mate) => mate.email))
        })
        return allMembers.indexOf(user.email) > -1
    }, [data])
    const deleteUser = (email, team_name) => {
        if (!window.confirm("Вы уверены, что хотите удалить пользователя?")) {
            return
        }
        Axios({
            url: `${server}/api/v1/tournament/delete_user/`,
            method: "POST",
            headers: {
                Authorization: "Token " + token
            },
            data: {
                email,
                team_name,
                tournament_name: data.name
            }
        }).then(() => {
            getData()
        })
    }
    return !my || inTeam ? (
        <div className={classes.tournament}>
            <div className={classes.tournamentTitle}>{data.name}</div>
            <div className={classes.tournamentDate}>
                <div className={classes.label}>Дата окончания:</div>
                <div className={classes.value}>{moment(data.end_time).format('LLL')}</div>
            </div>
            {!my ? (
                <>
                    {data.teams.length ? <AccordionSimple header={(active) => (
                        <div className={classes.sectionTitle}>
                            <div className={classes.sectionTitleText}>Команды ({data.teams.length})</div>
                            <svg className={clsx({
                                [classes.active]: active
                            })} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                        </div>
                    )}>
                        {data.teams.map((el, i) => (
                            <div key={i} className={classes.team}>
                                <div className={classes.teamTitle}>{el.name}</div>
                                <div className={classes.teamLeader}>
                                    <User user={el.captain} />
                                </div>
                                {el.mates.length ? <div className={classes.teamMembers}>
                                    {el.mates.map((mate, i) => (
                                        <div className={classes.teamMember} key={i}>
                                            <User user={mate} small />
                                        </div>
                                    ))}
                                </div> : null}
                                {!inTeam ? <Button icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>} size="small" style={{
                                    marginTop: 16
                                }} onClick={() => registerToTeam(el)}>Вступить</Button> : null}
                            </div>
                        ))}
                    </AccordionSimple> : null}
                    {!inTeam ? <Button icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>} style={{
                        marginTop: 8
                    }} onClick={registerTeam}>Добавить команду</Button> : null}
                </>
            )
                : (
                    <div>
                        {data.teams.filter(team => (team.captain.email === user.email || team.mates.map((el) => el.email).indexOf(user.email) > -1)).map((el, i) => (
                            <div key={i} className={classes.team}>
                                <div className={classes.teamTitle}>Команда</div>
                                <div className={classes.teamLeader}>
                                    <User user={el.captain} />
                                </div>
                                {el.mates.length ? <div className={classes.teamMembers}>
                                    {el.mates.map((mate, i) => (
                                        <div key={i} className={clsx(classes.teamMember, {
                                            [classes.withButton]: user.email === el.captain.email
                                        })}>
                                            <User className={classes.user} user={mate} small />
                                            {user.email === el.captain.email ? <button onClick={() => deleteUser(mate.email, el.name)} className={classes.remove}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                            </button> : null}
                                        </div>

                                    ))}
                                </div> : null}
                                {!inTeam ? <Button onClick={() => registerToTeam(el)}>Вступить</Button> : null}
                            </div>
                        ))}
                        <Button onClick={() => {
                            openMore(data, data.teams.filter(team => (team.captain.email === user.email || team.mates.map((el) => el.email).indexOf(user.email) > -1))[0].name)
                        }}>Этапы</Button>
                    </div>
                )
            }
        </div>
    ) : null
}

const AccordionSimple = ({ children, header }) => {
    const [active, setActive] = useState(false);
    return (
        <>
            <div onClick={() => setActive(!active)}>
                {header(active)}
            </div>
            <Collapse theme={{ collapse: classes.collapse, content: classes.collapseContent }} isOpened={active}>
                {children}
            </Collapse>
        </>
    )
}

export default connect(state => state)(Tournaments);