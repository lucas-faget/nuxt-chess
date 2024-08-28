import { type ChessboardColor } from "~/types/ChessboardColor";

const colors = ref([
    { name: "slate", lightClassName: "bg-slate-100", darkClassName: "bg-slate-400" },
    { name: "gray", lightClassName: "bg-gray-100", darkClassName: "bg-gray-400" },
    { name: "zinc", lightClassName: "bg-zinc-100", darkClassName: "bg-zinc-400" },
    { name: "stone", lightClassName: "bg-stone-100", darkClassName: "bg-stone-400" },
    { name: "red", lightClassName: "bg-red-100", darkClassName: "bg-red-400" },
    { name: "orange", lightClassName: "bg-orange-100", darkClassName: "bg-orange-400" },
    { name: "amber", lightClassName: "bg-amber-100", darkClassName: "bg-amber-400" },
    { name: "yellow", lightClassName: "bg-yellow-100", darkClassName: "bg-yellow-400" },
    { name: "lime", lightClassName: "bg-lime-100", darkClassName: "bg-lime-400" },
    { name: "green", lightClassName: "bg-green-100", darkClassName: "bg-green-400" },
    { name: "emerald", lightClassName: "bg-emerald-100", darkClassName: "bg-emerald-400" },
    { name: "teal", lightClassName: "bg-teal-100", darkClassName: "bg-teal-400" },
    { name: "cyan", lightClassName: "bg-cyan-100", darkClassName: "bg-cyan-400" },
    { name: "sky", lightClassName: "bg-sky-100", darkClassName: "bg-sky-400" },
    { name: "blue", lightClassName: "bg-blue-100", darkClassName: "bg-blue-400" },
    { name: "indigo", lightClassName: "bg-indigo-100", darkClassName: "bg-indigo-400" },
    { name: "violet", lightClassName: "bg-violet-100", darkClassName: "bg-violet-400" },
    { name: "purple", lightClassName: "bg-purple-100", darkClassName: "bg-purple-400" },
    { name: "fuchsia", lightClassName: "bg-fuchsia-100", darkClassName: "bg-fuchsia-400" },
    { name: "pink", lightClassName: "bg-pink-100", darkClassName: "bg-pink-400" },
    { name: "rose", lightClassName: "bg-rose-100", darkClassName: "bg-rose-400" },
]);

const defaultSettings = {
    darkMode: true,
    chessboardColor: colors.value.find((color) => color.name === "blue") ?? colors.value[0],
    chessboardSpin: false,
};

const userSettings = ref({ ...defaultSettings });

export function useSettings() {
    const isDarkMode = () => {
        return userSettings.value.darkMode;
    };

    const toggleDarkMode = () => {
        userSettings.value.darkMode = !userSettings.value.darkMode;
    };

    const getColors = () => {
        return colors.value;
    };

    const getChessboardColor = () => {
        return userSettings.value.chessboardColor;
    };

    const setChessboardColor = (color: ChessboardColor) => {
        userSettings.value.chessboardColor = color;
    };

    const isChessboardSpinAutomatic = () => {
        return userSettings.value.chessboardSpin;
    };

    const toggleChessboardSpin = () => {
        userSettings.value.chessboardSpin = !userSettings.value.chessboardSpin;
    };

    const resetSettings = () => {
        userSettings.value = { ...defaultSettings };
    };

    return {
        userSettings,
        isDarkMode,
        toggleDarkMode,
        getChessboardColor,
        setChessboardColor,
        isChessboardSpinAutomatic,
        toggleChessboardSpin,
        resetSettings,
        getColors,
    };
}
