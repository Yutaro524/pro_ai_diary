import { style, globalStyle } from "@vanilla-extract/css";

export const navbar = style({
  backgroundColor: "#343a40", // Navbarの背景色
  height: "60px", // 高さ
});

export const navbarToggle = style({
  fontSize: '1.5rem', // トグルボタンのサイズ
  border: 'none',
  padding: '0.5rem',
});

export const offcanvasStyle = style({
  backgroundColor: '#343a40', // Offcanvasの背景色
  color: '#fff', // テキスト色
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