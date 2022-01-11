import { useState } from "react";

export default function useVisualMode(initial) {
    const [state, setState] = useState(initial);
    const [history, setHistory] = useState([initial]);

    const transition = (mode, replace = false) => {
        if (replace) {
            setHistory((prev) => [...prev.slice(0, prev.length - 1), mode]);
        } else {
            setHistory((prev) => [...prev, mode]);
        }

        setState(mode);
    };

    const back = () => {
        if (history.length > 1) {
            setState(history[history.length - 2]);
            setHistory((prev) => prev.slice(0, -1));
        }
    };

    return { mode: state, transition, back };
}
