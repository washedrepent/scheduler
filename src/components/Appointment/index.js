import React from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Form from "./Form";
import Empty from "./Empty";
import Status from "./Status";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";

export default function Appointment(props) {
    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
    );

    const save = function (name, interviewer) {
        const newInterview = {
            student: name,
            interviewer,
        };
        transition(SAVING);

        props.bookInterview(props.id, newInterview).then((res) => {
            transition(SHOW);
        });
    };

    return (
        <article className='appointment'>
            <Header time={props.time} />
            {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
            {mode == SAVING && <Status message='Saving' />}
            {mode === SHOW && (
                <Show
                    student={props.interview.student}
                    interviewer={props.interview.interviewer}
                />
            )}
            {mode === CREATE && (
                <Form
                    interviewers={props.interviewers}
                    onCancel={back}
                    onSave={save}
                />
            )}
        </article>
    );
}
