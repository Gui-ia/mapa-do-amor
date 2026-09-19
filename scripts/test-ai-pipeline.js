// scripts/test-ai-pipeline.js
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const PDFDocument = require('pdfkit');

// Carrega .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length > 0) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  });
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function runTest() {
  console.log('--- TESTE DO PIPELINE DE IA DO MAPA DO AMOR ---');
  console.log('OpenAI Key presente:', !!process.env.OPENAI_API_KEY);

  const clientName = 'Maria Elisa da Silva';
  const birthDate = '1995-06-14';
  const birthTime = '14:30';

  console.log(`1. Testando Agente de Astrologia para ${clientName}...`);
  const astroRes = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.7,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `Você é um astrólogo especialista em Sinastria Amorosa para o Mapa do Amor. Retorne JSON: {"sunSign":"Gêmeos", "element":"Ar", "loveArchetype":"A Buscadora de Afinidade e Diálogo Sincero", "emotionalNeeds":["Troca intelectual e presença", "Espaço com lealdade", "Reciprocidade"], "relationshipChallenges":["Ansiedade na indefinição"], "astrologicalAdvice":"Valorize a paz mental acima da euforia fugaz."}`,
      },
      {
        role: 'user',
        content: `Data: ${birthDate}, Horário: ${birthTime} para ${clientName}`,
      },
    ],
  });

  const astroData = JSON.parse(astroRes.choices[0].message.content);
  console.log('Astrologia concluída:', astroData.sunSign, '-', astroData.loveArchetype);

  console.log('2. Testando Agente Clara Falk (Síntese e Capítulos)...');
  const claraRes = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.75,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `Você é Clara Falk, criadora do Mapa do Amor. Escreva uma versão condensada de teste em JSON com:
{
  "meta": {"clientName": "${clientName}", "birthDate": "${birthDate}", "birthTime": "${birthTime}", "generatedAt": "19/09/2026", "sunSign": "${astroData.sunSign}", "archetype": "${astroData.loveArchetype}"},
  "chapters": [
    {"chapterNumber": 1, "title": "Abertura dos Seus Caminhos", "subtitle": "Onde seu coração está hoje", "content": "Querida Maria Elisa, seu coração traz a marca de quem não tem medo de se entregar, mas aprendeu o valor do respeito mútuo."},
    {"chapterNumber": 2, "title": "O Desenho das Suas Linhas", "subtitle": "A Linha do Coração e o anseio por reciprocidade", "content": "Suas linhas mostram uma sensibilidade aguçada: você percebe detalhes e nuances que muitos ignoram."},
    {"chapterNumber": 3, "title": "Seu Arquétipo de Vênus", "subtitle": "${astroData.loveArchetype}", "content": "Sob a regência do seu signo, o amor para você precisa começar no diálogo honesto."},
    {"chapterNumber": 4, "title": "Padrões que Ficam no Passado", "subtitle": "O que você não precisa mais carregar", "content": "Deixe para trás a obrigação de consertar quem não quer ser ajudado."},
    {"chapterNumber": 5, "title": "Sua Bússola Afetiva", "subtitle": "O amor que vale a sua presença", "content": "O amor que combina de verdade com você traz calma e certeza mútua."}
  ],
  "summaryKeyTakeaways": ["Priorize a reciprocidade imediata.", "Comunicação clara é seu termômetro.", "Não minimize suas necessidades."],
  "claraPersonalMessage": "Guarde este mapa com carinho, Maria Elisa. O amor pleno é seu direito de nascimento. Com carinho, Clara Falk."
}`,
      },
      {
        role: 'user',
        content: 'Gerar síntese de teste',
      },
    ],
  });

  const report = JSON.parse(claraRes.choices[0].message.content);
  console.log('Síntese da Clara Falk gerada com sucesso! Capítulos:', report.chapters.length);

  console.log('3. Testando Diagramação e Geração de PDF com PDFKit...');
  const outPdfPath = path.join(__dirname, '..', 'outputs', 'teste-mapa-do-amor.pdf');

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    bufferPages: true,
  });

  const writeStream = fs.createWriteStream(outPdfPath);
  doc.pipe(writeStream);

  // Moldura dourada
  doc.rect(20, 20, 555, 802).lineWidth(1.5).strokeColor('#c5a059').stroke();
  doc.rect(25, 25, 545, 792).lineWidth(0.5).strokeColor('#e2b380').stroke();

  doc.moveDown(6);
  doc.font('Times-Roman').fontSize(11).fillColor('#8e4b5d').text('SUA JORNADA AFETIVA PESSOAL', { align: 'center', characterSpacing: 3 });
  doc.moveDown(1.5);
  doc.font('Times-Bold').fontSize(32).fillColor('#171321').text('MAPA DO AMOR', { align: 'center' });
  doc.moveDown(0.5);
  doc.font('Times-Italic').fontSize(14).fillColor('#6d422a').text('O que seu coração precisa e o amor que você merece viver', { align: 'center' });
  doc.moveDown(4);
  doc.font('Times-Bold').fontSize(22).fillColor('#8e4b5d').text(report.meta.clientName, { align: 'center' });
  doc.moveDown(1);
  doc.font('Times-Roman').fontSize(11).fillColor('#6d422a').text(`Signo & Arquétipo: ${report.meta.sunSign} — ${report.meta.archetype}`, { align: 'center' });
  doc.moveDown(6);
  doc.font('Times-Italic').fontSize(12).fillColor('#171321').text('Por Clara Falk', { align: 'center' });

  for (const ch of report.chapters) {
    doc.addPage();
    doc.font('Times-Bold').fontSize(18).fillColor('#171321').text(`Capítulo 0${ch.chapterNumber}: ${ch.title}`);
    doc.moveDown(0.5);
    doc.font('Times-Italic').fontSize(12).fillColor('#c5a059').text(ch.subtitle);
    doc.moveDown(1.5);
    doc.font('Times-Roman').fontSize(12).fillColor('#2d2d2d').lineGap(5).text(ch.content, { align: 'justify' });
  }

  doc.end();

  writeStream.on('finish', () => {
    console.log(`PDF de teste gerado com sucesso em: ${outPdfPath}`);
    console.log('--- TESTE CONCLUÍDO COM SUCESSO TOTAL ---');
  });
}

runTest().catch((err) => {
  console.error('Erro no teste:', err);
});
