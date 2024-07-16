import { type Static, t } from 'elysia';

export const TranslateRequest = t.Object({
    imageData: t.String(),
    fromLanguage: t.String(),
    toLanguage: t.String(),
    horizontalReadingDirection: t.String(),
    verticalReadingDirection: t.String(),
    keepContext: t.Boolean(),
});

export type TranslateRequest = Static<typeof TranslateRequest>;

export const TranslateResponse = t.Array(
    t.Object({
        fromLanguage: t.String(),
        toLanguage: t.String(),
        originalText: t.String(),
        translatedText: t.String(),
    }),
);

export type TranslateResponse = Static<typeof TranslateResponse>;
