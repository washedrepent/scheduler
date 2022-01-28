# Interview Scheduler

## About

This React Project is a SPA that allows students to book an interview time with an interviewer. Appointments can be booked from 12pm to 5pm in 1 hour blocks. Up to 5 appointments can be booked per day, from Monday to Friday.

-   React hooks are used to create this project
-   Uses websockets to sync changes across multiple clients

This was created for the Lighthouse Labs Frontend with React course.

## Screenshots

Main Dashboard (Empty)
!["Main Dashboard"](https://github.com/washedrepent/scheduler/blob/master/docs/empty-dashboard.png?raw=true)

Main Dashboard (With Items)
!["Main Dashboard with Items"](https://github.com/washedrepent/scheduler/blob/master/docs/adding-new-appointment.png?raw=true)

Create New Appointment
!["New Appointment"](https://github.com/washedrepent/scheduler/blob/master/docs/appointment-form.png?raw=true)

Edit Existing Appointment
!["Edit Appointment"](https://github.com/washedrepent/scheduler/blob/master/docs/edit-existing-appointment.png?raw=true)

Mobile Dashboard
!["Mobile Dashboard"](https://github.com/washedrepent/scheduler/blob/master/docs/mobile-dashboard.png?raw=true)

## Local Setup Instructions

Requires the scheduler-api to work locally.
Install dependencies with `npm install`.

### Running Webpack Development Server

```sh
npm start
```

### Running Jest Test Framework

```sh
npm test
```

### Running Cypress for E2E Testing

```sh
npm run cypress
```

### Running Storybook Visual Testbed

```sh
npm run storybook
```
