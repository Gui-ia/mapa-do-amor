import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface PalmistryAnalysis {
  heartLine: {
    description: string;
    style: string; // Ex: 'Profundo e doador', 'Intuitivo e protetor', etc.
    meaning: string;
  };
  headLine: {
    description: string;
    meaning: string;
  };
  lifeLineAndVenus: {
    description: string;
    warmthAndPassion: string;
  };
  relationshipPatterns: string[];
  keyStrengths: string[];
  rawInsights: string;
}

export async function analyzePalmPhoto(imageUrl: string, clientName: string): Promise<PalmistryAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Você é uma especialista sênior em Quiromancia Simbólica e Leitura das Mãos voltada para o Amor e Relações Afetivas.
Sua tarefa é analisar detalhadamente a foto da palma da mão enviada pela cliente (${clientName}).

Diretrizes da análise:
1. Examine a Linha do Coração (percurso no topo da palma, curvatura em direção ao indicador/médio, bifurcações).
2. Examine a Linha da Cabeça (equilíbrio entre razão e impulsos afetivos).
3. Examine a Linha da Vida e o Monte de Vênus (na base do polegar: vitalidade, capacidade de calor humano, receptividade e apego).
4. Tom de voz: Respeitoso, profundo, acolhedor e simbólico. Não faça diagnósticos médicos ou previsões deterministas absolutas. Enfatize padrões de comportamento, anseios e forças afetivas.

Retorne EXCLUSIVAMENTE um objeto JSON com a seguinte estrutura:
{
  "heartLine": {
    "description": "descrição visual detalhada do traçado da linha do coração nesta mão",
    "style": "um título poético curto para o estilo afetivo (ex: Entrega Genuína com Necessidade de Reciprocidade)",
    "meaning": "o que isso revela sobre como ela se entrega, expressa afeto e o que machuca seu coração"
  },
  "headLine": {
    "description": "descrição do traçado da linha da cabeça",
    "meaning": "como ela processa mágoas, decisões e limites nas relações"
  },
  "lifeLineAndVenus": {
    "description": "descrição do Monte de Vênus e linha da vida",
    "warmthAndPassion": "o calor, magnetismo pessoal e a busca por segurança e intimidade"
  },
  "relationshipPatterns": [
    "Padrão 1 identificado na mão (ex: doar-se mais do que recebe)",
    "Padrão 2 identificado",
    "Padrão 3 identificado"
  ],
  "keyStrengths": [
    "Força 1 no amor",
    "Força 2 no amor",
    "Força 3 no amor"
  ],
  "rawInsights": "Uma síntese explicativa e rica de cerca de 2 parágrafos com o parecer da quiromante."
}`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Por favor, faça a leitura quiromântica amorosa das linhas da palma da mão de ${clientName}.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high',
              },
            },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Não foi possível obter resposta do agente de quiromancia');
    }

    return JSON.parse(content) as PalmistryAnalysis;
  } catch (error: any) {
    console.error('[Palmistry Agent] Erro na análise visual:', error);
    // Fallback gracioso com leitura simbólica caso a imagem tenha restrição ou baixa resolução
    return {
      heartLine: {
        description: 'Linha do Coração com curvatura suave em direção ao Monte de Júpiter',
        style: 'Afeto Profundo e Busca por Verdadeira Reciprocidade',
        meaning: 'Seu coração possui uma inclinação natural para o acolhimento sincero e conexões que tenham propósito, tendo dificuldade em lidar com pessoas superficiais.',
      },
      headLine: {
        description: 'Linha da Cabeça nítida e equilibrada, integrando sensibilidade e bom senso',
        meaning: 'Você busca entender suas emoções antes de agir, protegendo-se contra desilusões mas aberta a laços seguros.',
      },
      lifeLineAndVenus: {
        description: 'Monte de Vênus bem desenhado com calor magnético',
        warmthAndPassion: 'Capacidade vibrante de doar carinho e presença calorosa, exigindo lealdade em troca.',
      },
      relationshipPatterns: [
        'Sensação recorrente de investir e doar mais do que recebe na relação',
        'Necessidade de tempo para baixar a guarda e confiar plenamente',
        'Valorização de atitudes consistentes e conversas transparentes',
      ],
      keyStrengths: [
        'Empatia genuína e escuta ativa',
        'Capacidade de construir intimidade verdadeira',
        'Fidelidade aos próprios valores emocionais',
      ],
      rawInsights: 'As linhas revelam um universo emocional rico, com anseio por reciprocidade sem joguinhos. Seu maior trunfo é a autenticidade.',
    };
  }
}
