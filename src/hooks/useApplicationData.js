import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_SPOTS = "SET_SPOTS";

function reducer(state, action) {
    let days = [];

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

            days = [...state.days];

            return {
                ...state,
                appointments,
                days,
            };
        case SET_SPOTS:
            const day = state.days.find((day) => day.name === state.day);

            //update value of spots
            if (action.value.type === "add") {
                day.spots += 1;
            } else if (action.value.type === "remove") {
                day.spots -= 1;
            }

            //set days array to current days state
            days = [...state.days];

            //update days array with new day spots data
            days[days.indexOf(day)] = day;

            //update the state
            return {
                ...state,
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
        edit: {},
    });

    useEffect(() => {
        const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

        ws.onopen = (event) => {
            console.log("connected to websocket");
            ws.send("ping");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Message Received:", data);

            //check if data type is SET_INTERVIEW
            if (data.type === "SET_INTERVIEW") {
                //update the spots
                if (data.interview === null) {
                    dispatch({
                        type: SET_SPOTS,
                        value: {
                            type: "add",
                        },
                    });
                } else {
                    dispatch({
                        type: SET_SPOTS,
                        value: {
                            type: "remove",
                        },
                    });
                }

                dispatch({
                    type: SET_INTERVIEW,
                    value: {
                        id: data.id,
                        interview: data.interview,
                    },
                });
            }
        };

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

        return () => ws.close();
    }, []);

    const setDay = (day) => dispatch({ type: SET_DAY, value: day });

    const bookInterview = function (id, interview, edit) {
        return axios
            .put(`/api/appointments/${id}`, { interview })
            .then((res) => {
                //only update spots if the appointment is not being edited
                if (edit === false) {
                    // dispatch({
                    //     type: SET_SPOTS,
                    //     value: {
                    //         type: "remove",
                    //     },
                    // });
                }

                dispatch({
                    type: SET_INTERVIEW,
                    value: {
                        id,
                        interview,
                    },
                });
            });
    };

    const cancelInterview = function (id) {
        return axios.delete(`/api/appointments/${id}`).then((res) => {
            // dispatch({
            //     type: SET_SPOTS,
            //     value: {
            //         type: "add",
            //     },
            // });

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
