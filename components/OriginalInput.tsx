import * as React from 'react';

type Props = {
    setOriginal(value: string): void;
};
export const OriginalInput = ({ setOriginal }: Props) => {
    const onSubmit = (e: any) => {
        e.preventDefault();
        setOriginal(e.target.original.value);
    };

    const randomText = "Russland hat die Verantwortung für den Angriff auf den Hafen Odessa eingeräumt. Bei dem Beschuss des wichtigsten ukrainischen Schwarzmeerhafens am Samstag seien ein ukrainisches Kriegsschiff sowie ein Lager mit von den USA gelieferten Harpoon-Raketen zerstört worden, teilte die Sprecherin des russischen Außenministeriums, Marija Sacharowa, mit. Nach ukrainischen Angaben wurden bei dem Angriff auch Hafenanlagen getroffen, darunter auch Anlagen zur Verarbeitung von Getreide. Der Angriff war nur einen Tag später erfolgt, nachdem die Regierungen in Moskau und Kiew einem Abkommen über den Export von blockiertem ukrainischem Getreide zugestimmt hatten.";

    return (

            <form onSubmit={(e) => onSubmit(e)}>
                <div className="flex flex-col items-stretch">
                <textarea id="original" rows={4}
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Your message...">


            </textarea>
                    <div className="buttons self-center">
                        <button type="button" onClick={() => setOriginal(randomText)}
                            className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
  <span
      className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
      Random
  </span>
                        </button>
                        <button type="submit"
                                className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2 mr-2 mb-2">
                            Let's go!
                        </button>
                    </div>
                </div>
            </form>
    );
};