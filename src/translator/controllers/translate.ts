import { getLanguageFromCode, translatePrompt } from "../../common/constants";
import type { TranslateRequest, TranslateResponse } from "../types/translate";
import { promptGPT } from "../services/openai";

export const translate = async (body: TranslateRequest): Promise<TranslateResponse> => {
    const fromLanguage = getLanguageFromCode(body.fromLanguage);
    const toLanguage = getLanguageFromCode(body.toLanguage);
    console.log({ fromLanguage, toLanguage });

    const contextId = body.keepContext ? "contextId" : undefined;

    const prompt = translatePrompt({
        fromLanguage,
        toLanguage,
        horizontalReadingDirection: body.horizontalReadingDirection,
        verticalReadingDirection: body.verticalReadingDirection,
        separateDialogs: body.separateDialogs,
    });

    console.log({ prompt });

    const translations = await promptGPT(prompt, body.imageData, contextId);

    console.log({ translations });

    return translations.map(({ originalText, translatedText }) => ({
        fromLanguage: body.fromLanguage,
        toLanguage: body.toLanguage,
        originalText,
        translatedText,
    }));
};
