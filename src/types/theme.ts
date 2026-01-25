// Theme type definitions

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  colors: ThemeColors;
  isPremium?: boolean;
}

export interface ThemeSettings {
  presetId: string;
  customColors?: ThemeColors;
  font: 'inter' | 'poppins' | 'roboto' | 'outfit' | 'playfair';
  buttonStyle: 'rounded' | 'pill' | 'square';
  darkMode: boolean;
}

// 10 color palette presets
export const themePresets: ThemePreset[] = [
  {
    id: 'sunset',
    name: 'Pôr do Sol',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7C59F',
      background: '#FFFAF5',
      text: '#1A1A1A',
      accent: '#E8390E',
    },
  },
  {
    id: 'ocean',
    name: 'Oceano',
    colors: {
      primary: '#0077B6',
      secondary: '#90E0EF',
      background: '#F0F9FF',
      text: '#023E8A',
      accent: '#00B4D8',
    },
  },
  {
    id: 'forest',
    name: 'Floresta',
    colors: {
      primary: '#2D6A4F',
      secondary: '#95D5B2',
      background: '#F0FDF4',
      text: '#1B4332',
      accent: '#40916C',
    },
  },
  {
    id: 'lavender',
    name: 'Lavanda',
    colors: {
      primary: '#7C3AED',
      secondary: '#C4B5FD',
      background: '#FAF5FF',
      text: '#4C1D95',
      accent: '#8B5CF6',
    },
  },
  {
    id: 'coral',
    name: 'Coral',
    colors: {
      primary: '#F472B6',
      secondary: '#FBCFE8',
      background: '#FDF2F8',
      text: '#831843',
      accent: '#EC4899',
    },
  },
  {
    id: 'midnight',
    name: 'Meia-noite',
    colors: {
      primary: '#60A5FA',
      secondary: '#1E3A5F',
      background: '#0F172A',
      text: '#F1F5F9',
      accent: '#3B82F6',
    },
  },
  {
    id: 'ember',
    name: 'Brasa',
    colors: {
      primary: '#EF4444',
      secondary: '#FCA5A5',
      background: '#FEF2F2',
      text: '#7F1D1D',
      accent: '#DC2626',
    },
  },
  {
    id: 'mint',
    name: 'Menta',
    colors: {
      primary: '#10B981',
      secondary: '#A7F3D0',
      background: '#ECFDF5',
      text: '#064E3B',
      accent: '#34D399',
    },
  },
  {
    id: 'slate',
    name: 'Ardósia',
    colors: {
      primary: '#64748B',
      secondary: '#CBD5E1',
      background: '#F8FAFC',
      text: '#1E293B',
      accent: '#475569',
    },
  },
  {
    id: 'neon',
    name: 'Neon',
    colors: {
      primary: '#22D3EE',
      secondary: '#A855F7',
      background: '#18181B',
      text: '#FAFAFA',
      accent: '#F97316',
    },
    isPremium: true,
  },
];

// Font options
export const fontOptions = [
  { id: 'inter', name: 'Inter', className: 'font-sans' },
  { id: 'poppins', name: 'Poppins', className: 'font-poppins' },
  { id: 'roboto', name: 'Roboto', className: 'font-roboto' },
  { id: 'outfit', name: 'Outfit', className: 'font-outfit' },
  { id: 'playfair', name: 'Playfair Display', className: 'font-playfair' },
];

// Button style options
export const buttonStyleOptions = [
  { id: 'rounded', name: 'Arredondado', borderRadius: '0.75rem' },
  { id: 'pill', name: 'Pílula', borderRadius: '9999px' },
  { id: 'square', name: 'Quadrado', borderRadius: '0.25rem' },
];

// Default theme settings
export const defaultThemeSettings: ThemeSettings = {
  presetId: 'sunset',
  font: 'inter',
  buttonStyle: 'rounded',
  darkMode: false,
};

// Helper to get CSS variables from theme colors
export function getThemeCSSVariables(colors: ThemeColors): Record<string, string> {
  return {
    '--theme-primary': colors.primary,
    '--theme-secondary': colors.secondary,
    '--theme-background': colors.background,
    '--theme-text': colors.text,
    '--theme-accent': colors.accent,
  };
}

// Helper to generate contrasting color
export function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
