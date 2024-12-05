import plugin from 'tailwindcss/plugin'

const config = {
	darkMode: 'class',
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
	],
	theme: {
		extend: {
			// fontFamily: {
			// 	'sans': ['ui-sans-serif', 'system-ui',],
			// 	'serif': ['ui-serif', 'Georgia',],
			// 	'mono': ['ui-monospace', 'SFMono-Regular',],
			// 	'display': ['Oswald',],
			// 	'body': ['"Open Sans"',],
			// },
			fontSize: {
				sm: '0.8rem',
				base: '1rem',
				xl: '1.25rem',
				'2xl': '1.563rem',
				'3xl': '1.953rem',
				'4xl': '2.441rem',
				'5xl': '3.052rem',
			},
			borderRadius: {
				DEFAULT: '.25rem',
				'none': '0',
				'sm': '.125rem',
				'lg': '.5rem',
				'full': '9999px',
			},
			transitionDuration: {
				// 'default': '100ms', // Default transition duration
			},
			colors: {
				primary: {
					50: '#E3F2FD',
					100: '#BBDEFB',
					200: '#90CAF9',
					300: '#64B5F6',
					400: '#42A5F5',
					500: '#2196F3',
					600: '#1E88E5',
					700: '#1976D2',
					800: '#1565C0',
					900: '#0D47A1',
				},
				secondary: {
					50: '#F1F8E9',
					100: '#DCEDC8',
					200: '#C5E1A5',
					300: '#AED581',
					400: '#9CCC65',
					500: '#8BC34A',
					600: '#7CB342',
					700: '#689F38',
					800: '#558B2F',
					900: '#33691E',
				},
				accent: {
					50: '#FFF3E0',
					100: '#FFE0B2',
					200: '#FFCC80',
					300: '#FFB74D',
					400: '#FFA726',
					500: '#FF9800',
					600: '#FB8C00',
					700: '#F57C00',
					800: '#EF6C00',
					900: '#E65100',
				},
				gray: {
					100: "#e6e9ed",
					200: "#ced3db",
					300: "#b5beca",
					400: "#9da8b8",
					500: "#8492a6",
					600: "#6a7585",
					700: "#4f5864",
					800: "#353a42",
					900: "#1a1d21"
				},
				neutral: {
					50: '#FAFAFA',
					100: '#F5F5F5',
					200: '#EEEEEE',
					300: '#E0E0E0',
					400: '#BDBDBD',
					500: '#9E9E9E',
					600: '#757575',
					700: '#616161',
					800: '#424242',
					900: '#212121',
				},
				info: {
					50: '#E3F8FF',
					100: '#B3ECFF',
					200: '#81DEFD',
					300: '#5ED0FA',
					400: '#40C3F7',
					500: '#2BB0ED',
					600: '#1992D4',
					700: '#127FBF',
					800: '#0B69A3',
					900: '#035388',
				},
				success: {
					50: '#E3F9E5',
					100: '#C1EAC5',
					200: '#A3D9A5',
					300: '#7BC47F',
					400: '#57AE5B',
					500: '#3F9142',
					600: '#2F8132',
					700: '#207227',
					800: '#0E5814',
					900: '#05400A',
				},
				warning: {
					50: '#FFFBEA',
					100: '#FFF3C4',
					200: '#FCE588',
					300: '#FADB5F',
					400: '#F7C948',
					500: '#F0B429',
					600: '#DE911D',
					700: '#CB6E17',
					800: '#B44D12',
					900: '#8D2B0B',
				},
				danger: {
					50: '#FFE3E3',
					100: '#FFBDBD',
					200: '#FF9B9B',
					300: '#F86A6A',
					400: '#EF4E4E',
					500: '#E12D39',
					600: '#CF1124',
					700: '#AB091E',
					800: '#8A041A',
					900: '#610316',
				},
			},
		},
	},
	plugins: [
		plugin(function ({ addBase, theme, addUtilities }) {
			const newUtilities = {
				'.text-h1': {
					fontSize: 'var(--tw-text-h1-font-size)',
				},
				'.text-h2': {
					fontSize: 'var(--tw-text-h2-font-size)',
				},
				'.text-h3': {
					fontSize: 'var(--tw-text-h3-font-size)',
				},
				'.text-h4': {
					fontSize: 'var(--tw-text-h4-font-size)',
				},
				'.text-h5': {
					fontSize: 'var(--tw-text-h5-font-size)',
				},
			};

			addUtilities(newUtilities);
			addBase({
				'*': {
					// borderRadius: theme('borderRadius.global'),
					transition: `all ${theme('transitionDuration.default')} ease-in-out`,
				},

			});
		}),
	],
}

export default config