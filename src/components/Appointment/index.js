import React from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

export default function Appointment(props) {
    return (
        <article className='appointment'>
            <Header time={props.time} />
            {props.interview && props.interview.interviewer ? (
                <Show
                    student={props.interview.student}
                    interviewer={props.interview.interviewer}
                    onDelete={props.onDelete}
                    onEdit={props.onEdit}
                />
            ) : (
                <Empty onAdd={props.onAdd} />
            )}
        </article>
    );
}
