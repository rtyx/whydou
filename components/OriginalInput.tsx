// @flow
import * as React from 'react';

type Props = {
    setOriginal(value: string): void;
};
export const OriginalInput = ({ setOriginal }: Props) => {
    const onSubmit = (e: any) => {
        e.preventDefault();
        setOriginal(e.target.original.value);
    };

    return (
        <form onSubmit={(e) => onSubmit(e)}>
            <textarea name="original" id="original" cols={30} rows={10}>

            </textarea>
            <button>
                Let's go!
            </button>
        </form>
    );
};