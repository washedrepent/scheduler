import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_SPOTS = "SET_SPOTS";

function reducer(state, action) {
    switch (action.type) {
        case SET_DAY:
            return {
                ...state,
                day: action.value,
            };

        case SET_APPLICATION_DATA:
            return {
                ...state,
                days: action.value.days,
                appointments: action.value.appointments,
                interviewers: action.value.interviewers,
            };

        case SET_INTERVIEW:
            const appointments = {
                ...state.appointments,
            };
            appointments[action.value.id] = {
                ...appointments[action.value.id],
                interview: action.value.interview,
            };

            const days = [...state.days];
            return {
                ...state,
                appointments,
                days,
            };
        case SET_SPOTS:
            const spots = {
                ...state.spots,
            };
            const day = state.days.find((day) => day.name === state.day);

            if (action.value.type === "add") {
                day.spots += 1;
            } else if (action.value.type === "remove") {
                day.spots -= 1;
            }

            return {
                ...state,
                spots,
                days,
            };
        default:
            throw new Error(
                `Tried to reduce with unsupported action type: ${action.type}`
            );
    }
}

export default function useApplicationData() {
    const [state, dispatch] = useReducer(reducer, {
        day: "Monday",
        days: [],
        appointments: {},
        interviewers: {},
    });

    useEffect(() => {
        Promise.all([
            axios.get("/api/days"),
            axios.get("/api/appointments"),
            axios.get("/api/interviewers"),
        ]).then((all) => {
            dispatch({
                type: SET_APPLICATION_DATA,
                value: {
                    days: all[0].data,
                    appointments: all[1].data,
                    interviewers: all[2].data,
                },
            });
        });
    }, []);

    const setDay = (day) => dispatch({ type: SET_DAY, value: day });

    // const updateSpots = (type) => {
    //     const day = state.days.find((day) => day.name === state.day);

    //     console.log(day);

    //     if (type === "add") {
    //         day.spots += 1;
    //     }

    //     if (type === "remove") {
    //         day.spots -= 1;
    //     }
    // };

    const bookInterview = function (id, interview, edit) {
        return axios
            .put(`/api/appointments/${id}`, { interview })
            .then((res) => {
                //only update spots if the appointment is not being edited
                if (edit === false) {
                    //updateSpots("remove");
                }

                dispatch({
                    type: SET_INTERVIEW,
                    value: {
                        id,
                        interview: null,
                    },
                });
            });
    };

    const cancelInterview = function (id) {
        return axios.delete(`/api/appointments/${id}`).then((res) => {
            //updateSpots("add");

            dispatch({
                type: SET_INTERVIEW,
                value: {
                    id,
                    interview: null,
                },
            });
        });
    };

    return { state, setDay, bookInterview, cancelInterview };
}
