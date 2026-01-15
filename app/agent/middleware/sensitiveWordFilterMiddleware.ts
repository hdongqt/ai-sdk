import { wrapLanguageModel } from 'ai';

const SENSITIVE_WORDS = ['alo', 'blo'];

export const getFilteredModel = (baseModel: any) =>
  wrapLanguageModel({
    model: baseModel,
    middleware: {
      specificationVersion: 'v3',
      wrapStream: async ({ model, params }) => {
        const { stream, ...rest } = await model.doStream(params);

        return {
          ...rest,
          stream: stream.pipeThrough(
            new TransformStream({
              transform(chunk, controller) {
                if (chunk.type === 'text-delta') {
                  let filteredText = chunk.delta?.toLowerCase();
                  SENSITIVE_WORDS.forEach((word) => {
                    const regex = new RegExp(word.toLowerCase(), 'gi');
                    filteredText = filteredText.replace(regex, '***');
                  });
                  controller.enqueue({
                    ...chunk,
                    delta: filteredText,
                  });
                } else {
                  controller.enqueue(chunk);
                }
              },
            })
          ),
        };
      },
    },
  });
