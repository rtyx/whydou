import * as React from 'react';
import {useEffect, useState} from "react";
import styles from "../styles/Home.module.css";
import {ArticleInput} from "./ArticleInput";
import {OriginalInput} from "./OriginalInput";
import {useScore} from "../contexts/ScoreContext";

const singleArticleRegex = /([dD]ie|[dD]er|[dD]as)/gm;
const articlesRegex = /([dD]ie|[dD]er|[dD]as)\b/gm;

type Props = {

};

export function Processor(_props: Props) {
    const [original, setOriginal] = useState("");
    const [chunks, setChunks] = useState<string[]>([]);
    const [obscured, setObscured] = useState<any>([]);
    const [submitted, setSubmitted] = useState(false);
    const { setScore, setMaxScore } = useScore()

    const processOriginal = (original: string) => {
        setMaxScore(0);
        setScore(0);

        let maxScore = 0;

        const chunks = original.split(articlesRegex);

        setChunks(chunks)
        setObscured(chunks.map((chunk, index) => {
            if (chunk.match(singleArticleRegex)) {
                maxScore++;
                return <ArticleInput key={index} index={index} article={chunk}/>
            } else {
                return <span key={index}>{chunk}</span>
            }
        }))

        setMaxScore(maxScore);
    };

    useEffect(() => {
        processOriginal(original);
    }, [original])

    const handleFormSubmit = (e: any) => {
        e.preventDefault();
        setSubmitted(true);
        let score = 0;

        for (const input of e.target) {
            if (input.type === "text") {
                const index = input.name;
                const expected = chunks[index];
                const given = input.value;

                if (given !== expected) {
                    input.className = "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500";
                } else {
                    score++;
                    input.className = "bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-gray-700 dark:border-green-500";
                }
            }
        }

        setScore(score);
    };

    return (
        <div>
            { !original && <OriginalInput setOriginal={setOriginal}/>}

            {
                obscured && <div className={styles.description}>
                    <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Work fast from anywhere</h5>

                    <form onSubmit={e => handleFormSubmit(e)}>
                        <div className="flex flex-col items-stretch">
                            <p>
                                { obscured }
                            </p>
                            { !submitted && <button type="submit"
                                                    className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2 mr-2 mb-2 self-center">
                                Next!
                            </button> }
                        </div>
                    </form>
                </div>
            }
        </div>
    );
};