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
  height: "100vh",
  width: "100vw",

});

export const Stories = style({
  backgroundColor: "#E6FFFA",
  padding: "3rem",
  paddingTop: "5rem",
});

globalStyle('.fc', {
  height: '100%',
});

globalStyle('.fc-view-harness', { 
  display: 'flex', 
  flexDirection: 'column', 
  height: '100%', 
  minHeight: 'auto',
});

export const dropdownContainer = style({
  position: 'absolute',
  paddingTop: "5rem",
  top: '0px', // カレンダーの上に配置
  left: '250px', // 左からの距離を調整
  zIndex: 1000, // カレンダーの上に配置するためのz-index
});

globalStyle('.fc-toolbar.fc-header-toolbar', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 1rem',

  // メディアクエリの追加
  '@media': {
    'screen and (max-width: 767px)': {
      flexDirection: 'column',
      padding: '0.5rem',  // パディングを調整
      justifyContent: 'center',  // 中央寄せ
    },
    'screen and (min-width: 768px) and (max-width: 1024px)': {
      padding: '0.75rem',  // タブレット用のパディング調整
    },
  },
});