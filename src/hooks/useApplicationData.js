import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
    const [state, setState] = useState({
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
            setState({
                days: all[0].data,
                appointments: all[1].data,
                interviewers: all[2].data,
            });
        });
    }, []);
    const setDay = (day) => setState({ ...state, day: day });

    const updateSpots = (type) => {
        const day = state.days.find((day) => day.name === state.day);

        console.log(day);

        if (type === "add") {
            day.spots += 1;
        }

        if (type === "remove") {
            day.spots -= 1;
        }
    };

    const bookInterview = function (id, interview, edit) {
        const appointment = {
            ...state.appointments[id],
            interview: { ...interview },
        };

        const appointments = {
            ...state.appointments,
            [id]: appointment,
        };

        return axios
            .put(`/api/appointments/${id}`, { interview })
            .then((res) => {
                //only update spots if the appointment is not being edited
                if (edit === false) {
                    updateSpots("remove");
                }
                const days = [...state.days];
                setState({
                    ...state,
                    appointments,
                    days,
                });
            });
    };

    const cancelInterview = function (id) {
        const appointment = {
            ...state.appointments[id],
            interview: null,
        };

        const appointments = {
            ...state.appointments,
            [id]: appointment,
        };

        return axios.delete(`/api/appointments/${id}`).then((res) => {
            updateSpots("add");
            const days = [...state.days];

            setState({
                ...state,
                appointments,
                days,
            });
        });
    };

    return { state, setDay, bookInterview, cancelInterview };
}
