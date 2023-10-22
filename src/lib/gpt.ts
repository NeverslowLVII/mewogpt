import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const askGPT = (
  messages: { role: 'user' | 'assistant'; content: string }[]
) => {
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve({
      role: 'assistant',
      content: 'Hello, I am a bot.',
    });
  }

  return openai.chat.completions
    .create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then((res) => {
      const [message] = res.choices;
      return {
        role: 'assistant',
        content: message.message.content as string,
      };
    });
};
