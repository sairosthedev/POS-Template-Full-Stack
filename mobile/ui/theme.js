// Belcit Trading brand palette: deep forest green base with the logo's leaf-green accent.
// Typography: Manrope (loaded in App.js) — use theme.fonts, not fontWeight, so every
// platform renders the same typeface.
export const theme = {
  colors: {
    bg: '#0B1F12',
    bg2: '#102A18',
    surface: '#143020',
    card: '#173726',
    text: '#F0F7EE',
    muted: 'rgba(240, 247, 238, 0.70)',
    border: 'rgba(240, 247, 238, 0.10)',
    primary: '#2E8B3A',
    accent: '#8DC63F',
    accentDark: '#6FA52C',
    danger: '#FF4D4F',
  },
  fonts: {
    regular: 'Manrope_400Regular',
    medium: 'Manrope_500Medium',
    semibold: 'Manrope_600SemiBold',
    bold: 'Manrope_700Bold',
    extrabold: 'Manrope_800ExtraBold',
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
  },
  space: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 28,
  },
  text: {
    title: { fontSize: 22, fontFamily: 'Manrope_800ExtraBold' },
    h1: { fontSize: 18, fontFamily: 'Manrope_700Bold' },
    body: { fontSize: 15, fontFamily: 'Manrope_400Regular' },
    small: { fontSize: 13, fontFamily: 'Manrope_400Regular' },
  },
};
