const THEMES = {
    green: {
        text: 'text-green-800',
        bg: 'bg-green-200',
        ring: 'ring-green-300',
        hover: 'hover:bg-green-300',
    },
    blue: {
        text: 'text-blue-800',
        bg: 'bg-blue-200',
        ring: 'ring-blue-300',
        hover: 'hover:bg-blue-300',
    },
    purple: {
        text: 'text-purple-500',
        bg: 'bg-purple-200',
        ring: 'ring-purple-300',
        hover: 'hover:bg-purple-300',
    },
    gray: {
        text: 'text-gray-500',
        bg: 'bg-gray-200',
        ring: 'ring-gray-300',
        hover: 'hover:bg-gray-300',
    }
};

const BasicButton = ({ label, color, handleClick }: { label: string, color: keyof typeof THEMES, handleClick: () => void }) => {
    const styles = THEMES[color] || THEMES.blue;

    return (
        <button
            onClick={handleClick}
            className={`px-4 py-2 text-base font-semibold ${styles.text} ${styles.bg} ${styles.hover} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.ring}`}
        >
            {label}
        </button>
    );
};

export { BasicButton }