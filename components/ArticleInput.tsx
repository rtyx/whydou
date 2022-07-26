import * as React from 'react';
import {useRef, useState} from "react";

type Props = {
    article: string;
    index: number;
};

export function ArticleInput({article, index}: Props) {
    const ref = useRef(null);

    const [placeholder] = useState(article[0]);
    const [value, setValue] = useState("");

    const handleChange = (change: React.ChangeEvent<HTMLInputElement>) => {
        if (change.target.value.length < 1) {
            return;
        }

        setValue(change.target.value)
    };

    return (
        <input ref={ref}
               name={String(index)}
               onChange={(change) => handleChange(change)}
               placeholder={placeholder}
               value={value}
               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 m-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
    );
};