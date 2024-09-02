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

export const Stories = style({
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

export const dropdownContainer = style({
  position: 'absolute',
  paddingTop: "5rem",
  top: '0px', // カレンダーの上に配置
  left: '250px', // 左からの距離を調整
  zIndex: 1000, // カレンダーの上に配置するためのz-index
});