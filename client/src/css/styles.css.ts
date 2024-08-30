import { style, globalStyle } from "@vanilla-extract/css";

export const navbar = style({
  backgroundColor: "#3182CE",
  height: "50px",
});

export const calendar = style({
  backgroundColor: "#E6FFFA",
  padding: "3rem",
  paddingTop: "5rem",
  height: "100%",

});

globalStyle('.fc', {
  height: '100%',
});

globalStyle('.fc-view-harness', { 
  display: 'flex', 
  flexDirection: 'column', 
  height: '100%', 
  minHeight: 'auto',
  width: '100%',
});


// .fullcalendar-custom .fc-view-harness {
//   display: flex;
//   flex-direction: column;
//   height: "100%";
//   min-height: "auto";
//}

// .fullvalendar-custom .fc-view-harness .fc-view {
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   min-height: auto;
// }

// .fullvalendar-custom .fc-view-harness .fc-view .fc-view-body {
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   min-height: auto;
// }

// .fullvalendar-custom .fc-view-harness .fc-view .fc-view-body .fc-daygrid-view {
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   min-height: auto;
// }

// .fullvalendar-custom .fc-view-harness .fc-view .fc-view-body .fc-daygrid-view .fc-daygrid-body {
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   min-height: auto;
// }

// .fullvalendar-custom .fc-view-harness .fc-view .fc-view-body .fc-daygrid-view .fc-daygrid-body .fc-daygrid-day {
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   min-height: auto;
// }

// .fullvalendar-custom .fc-view-harness .fc-view .fc-view-body .fc-daygrid-view .fc-daygrid-body .fc-daygrid-day .fc-daygrid-day-top {
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   min-height: auto;
// }

// .fullvalendar-custom .fc-view-harness .fc-view .fc-view-body .fc-daygrid-view .fc-daygrid-body .fc-daygrid-day .fc-daygrid-day-top .fc-daygrid-day-number {
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   min-height: auto;
// }

// .fullvalendar-custom .fc-view-harness .fc-view .fc-view-body .fc-daygrid-view .fc-daygrid-body .fc-daygrid-day .fc-daygrid-day-top .fc-daygrid-day-number .fc-daygrid-day-events {
//   display: flex;
// }