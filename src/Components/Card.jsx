import classes from "./Card.module.css";
import React from "react";
import User from "./User";
import { Link } from "react-router-dom";

const Card = ({ course }) => (
    <Link to={`/dashboard/course/${course.id}/`} className={classes.Card}>
        <div>
            <div className={classes.courseTitle}>{course.name}</div>
            <div className={classes.courseDescription}>{course.description}</div>
        </div>
        <User small user={course.teacher} />
    </Link>
)

export default Card;