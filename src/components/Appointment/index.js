import React from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Form from "./Form";
import Empty from "./Empty";
import Status from "./Status";
import Confirm from "./Confirm";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

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

    const deleteInterview = function () {
        transition(DELETING, true);
        props.cancelInterview(props.id).then((res) => {
            transition(EMPTY);
        });
    };

    return (
        <article className='appointment'>
            <Header time={props.time} />
            {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
            {mode === SAVING && <Status message='Saving' />}
            {mode === SHOW && (
                <Show
                    student={props.interview.student}
                    interviewer={props.interview.interviewer}
                    onDelete={() => transition(CONFIRM)}
                    onEdit={() => transition(EDIT)}
                />
            )}
            {mode === CONFIRM && (
                <Confirm
                    message='Are you sure you would like to delete?'
                    onCancel={back}
                    onConfirm={deleteInterview}
                />
            )}
            {mode === DELETING && <Status message='Deleting' />}
            {mode === CREATE && (
                <Form
                    interviewers={props.interviewers}
                    onCancel={back}
                    onSave={save}
                />
            )}
            {mode === EDIT && (
                <Form
                    name={props.interview.student}
                    interviewer={props.interview.interviewer.id}
                    interviewers={props.interviewers}
                    onCancel={back}
                    onSave={save}
                    edit={true}
                />
            )}
        </article>
    );
}
