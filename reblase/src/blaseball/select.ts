import { Theme } from 'react-select';

// Overrides colors in react-select's default theme with CSS custom properties,
// which are in turn defined in style/style.css, in order to support dark mode.
export function selectTheme(theme: Theme): Theme {
    return {
        ...theme,
        colors: {
            primary: 'var(--theme-blue-600)',
            primary75: 'var(--theme-blue-500)',
            primary50: 'var(--theme-blue-300)',
            primary25: 'var(--theme-blue-100)',
            danger: 'var(--theme-red-600)',
            dangerLight: 'var(--theme-red-300)',
            neutral0: 'var(--theme-white)',
            neutral5: 'var(--theme-gray-100)',
            neutral10: 'var(--theme-gray-100)',
            neutral20: 'var(--theme-gray-200)',
            neutral30: 'var(--theme-gray-300)',
            neutral40: 'var(--theme-gray-400)',
            neutral50: 'var(--theme-gray-500)',
            neutral60: 'var(--theme-gray-600)',
            neutral70: 'var(--theme-gray-700)',
            neutral80: 'var(--theme-gray-800)',
            neutral90: 'var(--theme-gray-900)',
        }
    };
}
