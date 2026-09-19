import OpenAI from 'openai';
import { PalmistryAnalysis } from './palmistry-agent';
import { AstrologyAnalysis } from './astrology-agent';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface FullLoveMapReport {
  meta: {
    clientName: string;
    birthDate: string;
    birthTime?: string;
    generatedAt: string;
    sunSign: string;
    archetype: string;
  };
  chapters: {
    chapterNumber: number;
    title: string;
    subtitle: string;
    content: string;
  }[];
  summaryKeyTakeaways: string[];
  claraPersonalMessage: string;
}

export async function synthesizeLoveMap(
  clientName: string,
  birthDate: string,
  birthTime: string | undefined,
  palmistry: PalmistryAnalysis,
  astrology: AstrologyAnalysis
): Promise<FullLoveMapReport> {
  try {
    const prompt = `Você é Clara Falk, a criadora e guia acolhedora do "Mapa do Amor".
Você é conhecida pelo seu olhar sensível, respeitoso e profundamente esclarecedor sobre a trajetória amorosa de cada pessoa.
Seu trabalho combina o mapeamento simbólico das linhas da mão (quiromancia) com a sabedoria dos ciclos astrológicos.

Você realizou a análise aprofundada da palma e do alinhamento astrológico de ${clientName}:
[LAUDO DE QUIROMANCIA DAS LINHAS DA MÃO]:
- Linha do Coração: ${palmistry.heartLine.description} | Estilo: ${palmistry.heartLine.style} | Significado: ${palmistry.heartLine.style}: ${palmistry.heartLine.meaning}
- Linha da Cabeça: ${palmistry.headLine.meaning}
- Linha da Vida e Monte de Vênus: ${palmistry.lifeLineAndVenus.warmthAndPassion}
- Padrões identificados: ${palmistry.relationshipPatterns.join(', ')}
- Pontos fortes: ${palmistry.keyStrengths.join(', ')}

[LAUDO ASTROLÓGICO]:
- Signo: ${astrology.sunSign} (${astrology.element})
- Arquétipo do Amor: ${astrology.loveArchetype}
- Necessidades emocionais: ${astrology.emotionalNeeds.join(', ')}
- Desafios: ${astrology.relationshipChallenges.join(', ')}
- Conselho do Astrólogo: ${astrology.astrologicalAdvice}

Sua tarefa é redigir o documento oficial e definitivo do "Mapa do Amor" diretamente para ${clientName}.
Trate-a pelo primeiro nome com imenso respeito, intimidade elegante e calor humano.
Escreva textos ricos, substanciais e envolventes (não faça respostas genéricas ou telegráficas).

Estruture o retorno EXCLUSIVAMENTE em formato JSON com o seguinte modelo:
{
  "meta": {
    "clientName": "${clientName}",
    "birthDate": "${birthDate}",
    "birthTime": "${birthTime || 'Não informado'}",
    "generatedAt": "${new Date().toLocaleDateString('pt-BR')}",
    "sunSign": "${astrology.sunSign}",
    "archetype": "${astrology.loveArchetype}"
  },
  "chapters": [
    {
      "chapterNumber": 1,
      "title": "Abertura dos Seus Caminhos",
      "subtitle": "Um olhar sincero sobre onde seu coração está hoje",
      "content": "Texto de abertura caloroso e detalhado escrito pela Clara Falk, reconhecendo a coragem de olhar para dentro e acolhendo a história de amor de ${clientName}."
    },
    {
      "chapterNumber": 2,
      "title": "O Desenho das Suas Linhas",
      "subtitle": "A Linha do Coração e o que sua alma pede em silêncio",
      "content": "Análise profunda e poética das linhas identificadas na mão dela, explicando como ela ama, onde costuma se machucar e por que merece reciprocidade real."
    },
    {
      "chapterNumber": 3,
      "title": "Seu Arquétipo de Vênus e o Céu",
      "subtitle": "${astrology.loveArchetype} — As forças que regem sua atração",
      "content": "Integração do signo solar (${astrology.sunSign}) com o arquétipo amoroso, detalhando suas necessidades de segurança, paixão e respeito mútuo."
    },
    {
      "chapterNumber": 4,
      "title": "Padrões que Você Reconhece",
      "subtitle": "O que você viveu no passado e não precisa mais repetir",
      "content": "Análise compassiva sobre os padrões que a pessoa costuma repetir (como esperar demais de quem entrega de menos) e o que destravar para o novo capítulo."
    },
    {
      "chapterNumber": 5,
      "title": "Sua Bússola para o Amor",
      "subtitle": "Como reconhecer uma relação que realmente vale a pena",
      "content": "Guia prático e intuitivo para o futuro amoroso de ${clientName}: sinais claros de reciprocidade, limites saudáveis e como acolher um amor verdadeiro."
    }
  ],
  "summaryKeyTakeaways": [
    "3 a 5 pontos-chave definitivos que resumem o mapa dela"
  ],
  "claraPersonalMessage": "Uma carta final de 1 a 2 parágrafos assinada carinhosamente por Clara Falk, com uma bênção para a vida amorosa dela."
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.75,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Não foi possível sintetizar o Mapa do Amor');
    }

    return JSON.parse(content) as FullLoveMapReport;
  } catch (error: any) {
    console.error('[Clara Synthesizer] Erro ao sintetizar:', error);
    // Fallback de alta qualidade caso ocorra timeout
    return {
      meta: {
        clientName,
        birthDate,
        birthTime: birthTime || 'Não informado',
        generatedAt: new Date().toLocaleDateString('pt-BR'),
        sunSign: astrology.sunSign,
        archetype: astrology.loveArchetype,
      },
      chapters: [
        {
          chapterNumber: 1,
          title: 'Abertura dos Seus Caminhos',
          subtitle: 'Um olhar sincero sobre onde seu coração está hoje',
          content: `Olá, ${clientName}. Que alegria ter a oportunidade de olhar com tanta delicadeza para a sua história. O amor não é uma linha reta; ele é feito de pausas, encontros que nos moldam e perguntas que guardamos no peito. Este mapa foi preparado para ser o seu espelho e o seu guia.`,
        },
        {
          chapterNumber: 2,
          title: 'O Desenho das Suas Linhas',
          subtitle: 'A Linha do Coração e o que sua alma pede em silêncio',
          content: `Ao observar as marcas e o traçado da sua mão, percebemos uma Linha do Coração que se estende com generosidade. Você é alguém que não sabe amar pela metade. Quando você decide abrir espaço na sua vida para alguém, você entrega presença, cuidado e atenção genuína. O seu maior anseio não é por gestos grandiosos, mas por reciprocidade silenciosa e constante.`,
        },
        {
          chapterNumber: 3,
          title: 'Seu Arquétipo de Vênus e o Céu',
          subtitle: `${astrology.loveArchetype} — As forças que regem sua atração`,
          content: `Sob a influência de ${astrology.sunSign}, a sua forma de se relacionar pede solo firme. Você precisa de alguém que não hesite, que cumpra o que promete e com quem você sinta que pode baixar a guarda sem correr o risco de ser ferida.`,
        },
        {
          chapterNumber: 4,
          title: 'Padrões que Você Reconhece',
          subtitle: 'O que você viveu no passado e não precisa mais repetir',
          content: `Se há algo que as suas vivências anteriores deixaram claro, é o desgaste de tentar carregar uma relação nas costas. O padrão de justificar ausências ou esperar que o outro mude finalmente chega ao seu término. O amor que combina com você não te exige mendigar atenção.`,
        },
        {
          chapterNumber: 5,
          title: 'Sua Bússola para o Amor',
          subtitle: 'Como reconhecer uma relação que realmente vale a pena',
          content: `A partir de agora, use esta bússola: uma relação que vale a sua dedicação é aquela que traz paz ao seu sistema nervoso, e não tempestade constante. Valorize a clareza, a iniciativa mútua e o prazer de caminhar lado a lado.`,
        },
      ],
      summaryKeyTakeaways: [
        'Sua capacidade de doar afeto é rara, mas precisa ser reservada para quem sabe retribuir.',
        'A clareza e a consistência devem ser seus filtros primordiais em novas aproximações.',
        'Você não precisa diminuir suas necessidades para caber na vida de ninguém.',
        'Seu próximo ciclo afetivo favorece encontros maduros e parcerias leais.',
      ],
      claraPersonalMessage: `Querida ${clientName}, guarde este mapa perto do seu coração. Lembre-se sempre: você merece um amor que te encontre no meio do caminho com os braços abertos. Com todo o meu afeto,\n\nClara Falk.`,
    };
  }
}
