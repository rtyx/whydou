import {createContext, ReactNode, useContext, useState} from "react";

interface ScoreContextInterface {
    score: number;
    maxScore: number;

    setScore(score: number): void;
    setMaxScore(maxScore: number): void;
}

export const ScoreContext = createContext({} as ScoreContextInterface);

export const ScoreProvider = ({ children }: { children: ReactNode }) => {
    const [score, setScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);

    return (
        <ScoreContext.Provider value={{ score, setScore, maxScore, setMaxScore }}>
            {children}
        </ScoreContext.Provider>
    );
}

export const useScore = () => {
    const context = useContext(ScoreContext);

    if (context === undefined) {
        throw new Error("useScore must be used within a ScoreProvider");
    }

    return context;
}