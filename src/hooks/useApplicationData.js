import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

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

            //get the days array
            days = [...state.days];

            //go through each day
            days.forEach((day) => {
                //map list of days appointments to appointments array
                const daysAppointments = day.appointments.map(
                    (id) => appointments[id]
                );

                //count the number of appointments interviews spots remaining (null spots remaining)
                const spots = daysAppointments.filter(
                    (appointment) => appointment.interview == null
                ).length;

                //set the day's spots
                day.spots = spots;
            });

            return {
                ...state,
                appointments,
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

        ws.onopen = (event) => {};

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Message Received:", data);

            //check if data type is SET_INTERVIEW
            if (data.type === "SET_INTERVIEW") {
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

    async function bookInterview(id, interview) {
        const res = await axios.put(`/api/appointments/${id}`, { interview });

        dispatch({
            type: SET_INTERVIEW,
            value: {
                id,
                interview,
            },
        });

        return res;
    }

    async function cancelInterview(id) {
        const res = await axios.delete(`/api/appointments/${id}`);
        dispatch({
            type: SET_INTERVIEW,
            value: {
                id,
                interview: null,
            },
        });

        return res;
    }

    return { state, setDay, bookInterview, cancelInterview };
}
