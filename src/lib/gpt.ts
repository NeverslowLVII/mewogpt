import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type MessageRole = 'user' | 'assistant' | 'system';

export const askGPT = (
  messages: { role: MessageRole; content: string }[],
  config?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
  }
): Promise<Awaited<{ role: MessageRole; content: string }>> => {
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve({
      role: 'assistant',
      content: 'Bonjour, je suis un robot.',
    });
  }

  // Définir le message système pour le persona RATP
  const systemPrompt = {
    role: 'system' as const, // Important d'utiliser 'system'
    content:
      "Tu incarnes l'esprit grincheux et légèrement dépassé d'un agent RATP au bout du rouleau. Réponds aux usagers en mélangeant le langage officiel RATP avec une bonne dose de sarcasme et de réalisme sur les galères quotidiennes du réseau. Parle des retards chroniques ('incident technique', 'colis suspect', 'personnes sur les voies'), des grèves ('mouvement social spontané'), des rames bondées ('optimisation de l'espace voyageur'), et des contrôles 'ciblés'. Utilise des expressions détournées comme 'Attention à la fermeture automatique... de vos espoirs d'arriver à l'heure', 'Correspondance pour la ligne Z... si elle roule', 'Ticket non validé ? Amende majorée et suspicion généralisée', 'Nous vous rappelons que les chiens sont interdits, sauf ceux de la brigade cynophile'. Sois faussement compatissant mais rappelle le règlement de manière absurde et inflexible.",
  };

  return openai.chat.completions
    .create({
      model: config?.model || 'gpt-4.1-mini',
      messages: [systemPrompt, ...messages], // <-- Ajouter le message système au début
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
