import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
    button: {
        width: 120,
        height: 100,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: (({ color }: { color: string }) => color),
        transition: 'transform 0.2s ease',
        '&:hover $label': {
            opacity: 1,
        },
        '&:active $label': {
            opacity: 1,
            transition: 'transform 0.2s ease',
        },
    },
    first: {
        borderBottomLeftRadius: '0.5rem',
    },
    last: {
        borderBottomRightRadius: '0.5rem',
    },
    label: {
        position: 'absolute',
        inset: '-1px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        fontWeight: 600,
        fontSize: '0.875rem',
        color: '#fff',
        background: 'rgba(0, 0, 0, 0.15)',
        borderRadius: '0.375rem',
        opacity: 0,
        transition: 'opacity 0.6s ease',
        pointerEvents: 'none',
    },
    ripple: {
        position: 'absolute',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.5)',
        transform: 'scale(0)',
        animation: `$rippleEffect 1000ms ease-out`,
        pointerEvents: 'none',
        zIndex: 1,
    },
    '@keyframes rippleEffect': {
        to: {
            transform: 'scale(4)',
            opacity: 0,
        },
    },
})


export { useStyles }