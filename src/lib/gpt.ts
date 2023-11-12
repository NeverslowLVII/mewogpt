import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const askGPT = (
  messages: { role: 'user' | 'assistant'; content: string }[],
  config?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
  }
): Promise<Awaited<{ role: 'assistant'; content: string }>> => {
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve({
      role: 'assistant',
      content: 'Hello, I am a bot.',
    });
  }

  return openai.chat.completions
    .create({
      model: config?.model || 'gpt-4',
      messages,
      temperature: config?.temperature || 1,
      max_tokens: config?.max_tokens || 1024,
      top_p: config?.top_p || 1,
      frequency_penalty: config?.frequency_penalty || 0,
      presence_penalty: config?.presence_penalty || 0,
    })
    .then((res) => {
      const [message] = res.choices;
      return {
        role: 'assistant',
        content: message.message.content as string,
      };
    });
};
