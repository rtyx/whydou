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
                    input.className = "invalid";
                } else {
                    score++;
                    input.className = "valid";
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
                    <form onSubmit={e => handleFormSubmit(e)}>
                        { obscured }
                        <hr/>
                        { !submitted && <button>Next</button> }
                    </form>
                </div>
            }
        </div>
    );
};