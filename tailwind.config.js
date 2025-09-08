/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Calming Blues
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Therapeutic Greens
        healing: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Warm Support Colors
        support: {
          50: '#fef7ff',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        // Privacy Shield
        privacy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      backgroundImage: {
        'privacy-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'healing-gradient': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'support-gradient': 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      },
      boxShadow: {
        'shield-glow': '0 0 30px rgba(102, 126, 234, 0.3)',
        'healing-glow': '0 0 30px rgba(34, 197, 94, 0.2)',
        'gentle': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'therapeutic': '0 8px 40px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      animation: {
        'gentle-fade-in': 'gentleFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'shield-activate': 'shieldActivate 1.2s ease-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        gentleFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shieldActivate: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
      },
      spacing: {
        'healing': '4rem', // 64px - for therapeutic breathing room
      },
      fontFamily: {
        'therapeutic': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'empathy': ['1.125rem', { lineHeight: '1.7' }],
      },
    },
  },
  plugins: [],
}
