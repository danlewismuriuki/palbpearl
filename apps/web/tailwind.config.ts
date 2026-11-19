import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#BC6C25',
        'brand-secondary': '#2D6A4F',
        accent: '#40916C',
        background: '#F8F6F1',
        surface: '#FFFFFF',
        'surface-elevated': '#FBF9F4',
        'text-primary': '#1A2E24',
        'text-secondary': '#5C6F65',
        'text-on-brand': '#FFFFFF',
        border: '#DDE5E1',
        divider: '#E8EDEA',
        success: '#15803D',
        warning: '#D9930A',
        error: '#C53030',
        info: '#3B82F6',
        'focus-ring': '#40916C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      spacing: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 12px rgba(0,0,0,0.08)',
        lg: '0 12px 32px rgba(0,0,0,0.12)',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      maxWidth: {
        'layout-content': '1152px',
      },
    },
  },
  plugins: [],
};

export default config;