import Axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { server } from "../config";
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from "@fullcalendar/interaction"
import ruLocale from '@fullcalendar/core/locales/ru';
import listPlugin from '@fullcalendar/list';
import Loader from "../Components/Loader"
import "./Calendar.css";

const Calendar = ({token}) => {
    const [events, setEvents] = useState({
        isFetching: true,
        items: []
    });
    useEffect(() => {
        Axios({
            url: server + `api/v1/calendar/`,
            headers: {
                Authorization: `Token ${token}`
            }
        }).then(res => {
            if(res.data){
                setEvents({
                    isFetching: false,
                    items: res.data
                })
            }
        })
    }, [])
    return(
        <div>
            <h1>Календарь</h1>
            {events.isFetching ? (<Loader/>) : <FullCalendar
                plugins={[ listPlugin, interactionPlugin ]}
                initialView="listWeek"
                events={events.items}
                locale={ruLocale}
                dateClick={(e, i) => {
                    console.log(e, i)
                }}
            />}
        </div>
    )
}

function renderEventContent(eventInfo) {
    // <b>{eventInfo.timeText}</b>
    //<i>{eventInfo.event.title}</i>
    return (
        <i>{eventInfo.event.title}</i>
    )
  }

export default connect(state => state)(Calendar)