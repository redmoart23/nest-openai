import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}
export const translateUseCase = async (
  openai: OpenAI,
  { prompt, lang }: Options,
) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `
        Traduce el siguiente texto al idioma ${lang}:${prompt}
        `,
      },
    ],
    temperature: 0.3,
    max_tokens: 500,
  });

  return {
    response: response.choices[0].message.content,
  };
};
