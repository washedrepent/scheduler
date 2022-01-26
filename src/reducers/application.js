const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

//named exports
export { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW };

//default export
export default function reducer(state, action) {
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
