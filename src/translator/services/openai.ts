import OpenAI from "openai";
import { OPENAI_API_KEY } from "../../common/constants";

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export const promptGPT = async (prompt: string, imageData: string, contextId?: string): Promise<{ originalText: string, translatedText: string }[]> => {
    const response = await openai.chat.completions.create({
        tools: [
            {
                type: "function",
                function: {
                    name: "returnTranslations",
                    parameters: {
                        type: "object",
                        properties: {
                            result: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                    originalText: { type: "string" },
                                        translatedText: { type: "string" },
                                    },
                                    required: ["originalText", "translatedText"],
                                },
                            },
                        },
                    },
                },
            },
            {
                type: "function",
                function: {
                    name: "returnSingleTranslation",
                    parameters: {
                        type: "object",
                        properties: {
                            result: {
                                type: "object",
                                properties: {
                                originalText: { type: "string" },
                                    translatedText: { type: "string" },
                                },
                                required: ["originalText", "translatedText"],
                            },
                        },
                    },
                },
            },
        ],
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: prompt,
                    },
                    {
                        type: "image_url",
                        image_url: {
                            detail: "auto",
                            url: imageData,
                        }
                    },
                ],
            },
        ],
    });

    console.log(JSON.stringify(response, null, 2));

    const results = response.choices.flatMap(v => v.message.tool_calls?.map(call => call.function) ?? []).map(v => {
        const list = JSON.parse(v.arguments);
        return list.result;
    }).flat(100);

    return results.map(v => ({ originalText: v.originalText, translatedText: v.translatedText }));
};
