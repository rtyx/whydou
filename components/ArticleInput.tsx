// @flow
import * as React from 'react';
import {LegacyRef, MutableRefObject, useRef, useState} from "react";

type Props = {
    article: string;
    index: number;
};

export function ArticleInput({article, index}: Props) {
    const ref = useRef(null);

    const [value, setValue] = useState(article[0]);

    const handleChange = (change: React.ChangeEvent<HTMLInputElement>) => {
        if (change.target.value.length < 1) {
            return;
        }

        setValue(change.target.value)
    };

    function handleFocus(focus: React.FocusEvent<HTMLInputElement>) {
        // TODO should actually skip the first character
        console.log(focus);
        document.dispatchEvent(new KeyboardEvent('keypress', {
            key: 'ArrowLeft',
        }));
    }

    return (
        <input ref={ref} name={String(index)} onChange={(change) => handleChange(change)} value={value} onFocus={focus => handleFocus(focus)}/>
    );
};