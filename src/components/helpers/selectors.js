export function getAppointmentsForDay(state, day) {
    const days = state.days;

    //get the day index from the days array for the given day by name
    const dayIndex = days.findIndex((d) => d.name === day);

    //check if day is not found
    if (dayIndex === -1) {
        //return empty array
        return [];
    }

    //get the appointments array from the dayindex
    const appointments = days[dayIndex].appointments;

    //return the appointments array maping the id to the appointment object
    return appointments.map((id) => state.appointments[id]);
}
