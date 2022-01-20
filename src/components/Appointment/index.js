import React, { useEffect } from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Form from "./Form";
import Empty from "./Empty";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
    );

    useEffect(() => {
        if (props.interview && mode === EMPTY) {
            transition(SHOW);
        }
        if (props.interview === null && mode === SHOW) {
            transition(EMPTY);
        }
    }, [props.interview, transition, mode]);

    const save = function (name, interviewer) {
        let edit = false;
        const newInterview = {
            student: name,
            interviewer,
        };

        //check if we are in edit mode
        if (mode === EDIT) {
            edit = true;
        }

        transition(SAVING);

        props
            .bookInterview(props.id, newInterview, edit)
            .then((res) => {
                transition(SHOW);
            })
            .catch((err) => {
                transition(ERROR_SAVE, true);
            });
    };

    const deleteInterview = function () {
        transition(DELETING, true);
        props
            .cancelInterview(props.id)
            .then((res) => {
                transition(EMPTY);
            })
            .catch((err) => {
                transition(ERROR_DELETE, true);
            });
    };

    return (
        <article className='appointment'>
            <Header time={props.time} />
            {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
            {mode === SAVING && <Status message='Saving' />}
            {mode === SHOW && props.interview && (
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
            {mode === ERROR_SAVE && (
                <Error message='Could not save appointment' onClose={back} />
            )}
            {mode === ERROR_DELETE && (
                <Error message='Could not delete appointment' onClose={back} />
            )}
        </article>
    );
}
