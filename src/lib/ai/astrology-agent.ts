import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AstrologyAnalysis {
  sunSign: string;
  element: string;
  loveArchetype: string;
  emotionalNeeds: string[];
  relationshipChallenges: string[];
  astrologicalAdvice: string;
}

export async function analyzeAstrologyProfile(
  clientName: string,
  birthDate: string,
  birthTime?: string
): Promise<AstrologyAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Você é um astrólogo especialista em Sinastria Amorosa, Arquétipos de Vênus e Psicologia dos Relacionamentos.
Sua tarefa é analisar os dados de nascimento de ${clientName} (Data: ${birthDate}${birthTime ? `, Horário informado: ${birthTime}` : ''}) para o Mapa do Amor.

Diretrizes da análise:
1. Determine o Signo Solar e o Elemento correspondente (Fogo, Terra, Ar, Água).
2. Se o horário for informado, use-o para contextualizar ascendente e nuances da casa 7 (casas de relacionamento) e arquétipos venusianos.
3. Elabore o "Arquétipo do Amor" correspondente a essa configuração.
4. Linguagem elegante, madura e psicológica. Nada de clichês simplistas de horóscopo de jornal.

Retorne EXCLUSIVAMENTE um objeto JSON com a seguinte estrutura:
{
  "sunSign": "Nome do Signo (ex: Touro, Escorpião, etc.)",
  "element": "Elemento (ex: Terra, Água, etc.)",
  "loveArchetype": "Título do arquétipo de Vênus (ex: A Guardiã da Devoção Sincera)",
  "emotionalNeeds": [
    "Necessidade emocional primordial 1",
    "Necessidade emocional primordial 2",
    "Necessidade emocional primordial 3"
  ],
  "relationshipChallenges": [
    "Desafio típico da sua energia no amor 1",
    "Desafio típico 2"
  ],
  "astrologicalAdvice": "Conselho astrológico e reflexão profunda sobre o momento atual de relacionamentos."
}`,
        },
        {
          role: 'user',
          content: `Por favor, faça a leitura astrológica amorosa para ${clientName}, nascido(a) em ${birthDate} ${birthTime ? `às ${birthTime}` : ''}.`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Não foi possível obter resposta do agente de astrologia');
    }

    return JSON.parse(content) as AstrologyAnalysis;
  } catch (error: any) {
    console.error('[Astrology Agent] Erro na análise astrológica:', error);
    return {
      sunSign: 'Energia Estelar Pessoal',
      element: 'Sensibilidade e Terra',
      loveArchetype: 'A Buscadora do Amor Verdadeiro e Recíproco',
      emotionalNeeds: [
        'Segurança emocional para se expressar sem medo de julgamentos',
        'Demonstrações consistentes de cuidado e presença diária',
        'Alinhamento de valores e planos de vida a dois',
      ],
      relationshipChallenges: [
        'Dificuldade em desapegar de expectativas ideais sobre o outro',
        'Tendência a suportar silêncios incômodos para evitar conflito',
      ],
      astrologicalAdvice: 'O céu atual pede que você coloque limites claros desde o início. A reciprocidade não é favor, é o ponto de partida de qualquer laço que mereça o seu tempo.',
    };
  }
}
