export const LANGUAGES: Record<string, string> = {
    "en": "English",
    "es": "Spanish",
    "pt": "Portuguese",
    "fr": "French",
    "ja": "Japanese",
};

export const getLanguageFromCode = (code: string) => LANGUAGES[code] ?? "English";

export const OPENAI_API_KEY = Bun.env.OPENAI_API_KEY;
export const PORT = Number.parseInt(process.env.PORT as string);

export const translatePrompt = (options: {
    fromLanguage: string;
    toLanguage: string;
    horizontalReadingDirection: string;
    verticalReadingDirection: string;
    separateDialogs: boolean;
}): string => {
    const { fromLanguage, toLanguage, horizontalReadingDirection, verticalReadingDirection, separateDialogs } = options;
    const promptHorizontalReadingDirection = horizontalReadingDirection === "LR" ? "from left to right" : "from right to left";
    const promptVerticalReadingDirection = verticalReadingDirection === "TB" ? "from top to bottom" : "from bottom to top";
    const promptSeparateDialogs = (
        separateDialogs
            ? "The result must be ordered by the position of the text in the image and reading direction."
            : `Call function returnSingleTranslation()
SeparateDialogs: false.
All the text in the image must be considered in the same dialog.
The result must be of length 1 containing 1 single element, consider all the text the same dialog.
All the texts in the image even if visible appart must be put together in the result as part of the same sentence`
    );
    return `Translate the text in the image from ${fromLanguage} to ${toLanguage}.
Respond with this format so a parser can understand you.
If there is no text in the image respond with [].
Reading direction: ${promptHorizontalReadingDirection} and ${promptVerticalReadingDirection}.
${promptSeparateDialogs}`;
};
