// Shared colors and sizes so every screen looks the same.
export const colors = {
  background: '#0F1222',
  surface: '#1A1F36',
  surfaceRaised: '#242A47',
  border: '#343B60',
  text: '#F4F5FA',
  textMuted: '#A9AEC8',
  correct: '#2FBF71',
  correctBg: '#123A28',
  wrong: '#F0566A',
  wrongBg: '#41161F',
  accent: '#7C8CFF',
};

// Loaded in App.js with useFonts; custom fonts have one family per weight.
export const font = {
  medium: 'Rubik_500Medium',
  semibold: 'Rubik_600SemiBold',
  bold: 'Rubik_700Bold',
  extrabold: 'Rubik_800ExtraBold',
  black: 'Rubik_900Black',
  arabic: 'NotoKufiArabic_500Medium',
};

export const radius = { sm: 12, md: 16, lg: 24 };
export const touch = { minHeight: 56 }; // big enough for one thumb
