from pathlib import Path
import json
O=Path('outputs')
qs=[
{'id':'goal','title':'Was führt dich heute zu deiner Herzlinie?','pt':'O que te trouxe hoje à sua linha do coração?','why':'Escolhe a intenção; não presume sofrimento. R01–R05, YouTube 7 e 11.','options':[['connection','Ich möchte eine bestimmte Verbindung besser verstehen.','Quero entender melhor uma conexão específica.'],['closure','Ich möchte mit einer vergangenen Liebe Frieden schließen.','Quero fazer as pazes com um amor do passado.'],['new','Ich möchte mich für eine neue Liebe öffnen.','Quero me abrir para um novo amor.']]},
{'id':'context','title':'Wie fühlt sich deine Situation gerade an?','pt':'Como você sente sua situação neste momento?','why':'Contextualiza o capítulo principal. As alternativas mudam com Q1.','branches':{
'connection':[['mixed','Mal spüre ich Nähe, dann wieder Abstand.','Às vezes sinto proximidade, depois distância.'],['silence','Wir haben gerade keinen Kontakt.','Estamos sem contato.'],['together','Wir sind zusammen, aber etwas bleibt für mich offen.','Estamos juntos, mas algo permanece em aberto para mim.'],['good','Es fühlt sich gut an. Ich bin einfach neugierig.','Está tudo bem. Estou apenas curiosa.']],
'closure':[['thoughts','Ich denke noch oft an diese Person.','Ainda penso muito nessa pessoa.'],['questions','Für mich sind Fragen offen geblieben.','Algumas perguntas ficaram sem resposta.'],['ready','Ich bin bereit für einen neuen Anfang.','Estou pronta para um recomeço.'],['meaning','Ich möchte verstehen, was diese Geschichte für mich bedeutet.','Quero entender o que essa história significa para mim.']],
'new':[['trust','Ich wünsche mir Nähe, aber Vertrauen fällt mir schwer.','Quero proximidade, mas tenho dificuldade de confiar.'],['repeat','Ich möchte alte Beziehungsmuster hinter mir lassen.','Quero deixar antigos padrões de relacionamento para trás.'],['open','Ich bin offen und neugierig auf das, was kommt.','Estou aberta e curiosa pelo que vem.'],['space','Ich möchte der Liebe wieder mehr Raum geben.','Quero dar mais espaço ao amor.']] }},
{'id':'tension','title':'Welcher Gedanke beschäftigt dich am meisten?','pt':'Qual pensamento mais ocupa sua cabeça?','why':'Escolhe a tensão sem atribuir diagnóstico. F10, R03, R11, YouTube 6.','options':[['intuition','Ist das mein Bauchgefühl — oder meine Unsicherheit?','É minha intuição ou minha insegurança?'],['chosen','Ich möchte spüren, dass ich wirklich gewählt werde.','Quero sentir que sou realmente escolhida.'],['again','Werde ich mich noch einmal so verbunden fühlen?','Será que vou sentir uma conexão assim novamente?'],['enough','Ich möchte mich so, wie ich bin, angenommen fühlen.','Quero me sentir aceita como sou.'],['curious','Keiner davon. Ich möchte mich einfach besser kennenlernen.','Nenhum desses. Só quero me conhecer melhor.']]},
{'id':'wish','title':'Was wünschst du dir für dein nächstes Kapitel in der Liebe?','pt':'O que você deseja para seu próximo capítulo no amor?','why':'Faz a transição da dor para o desejo. R02, R05, R12.','options':[['home','Eine Liebe, die sich wie Zuhause anfühlt.','Um amor que pareça um lar.'],['mutual','Nähe, die von beiden Seiten kommt.','Proximidade que venha dos dois lados.'],['peace','Mehr Ruhe in meinem Herzen.','Mais paz no meu coração.'],['confidence','Mehr Vertrauen in mich und meine Entscheidungen.','Mais confiança em mim e nas minhas decisões.'],['light','Leichtigkeit und neue Möglichkeiten.','Leveza e novas possibilidades.']]},
{'id':'style','title':'Wie begegnest du spirituellen Deutungen?','pt':'Como você se relaciona com interpretações espirituais?','why':'Ajusta o tom, nunca a suposta precisão. R06, R08. É a primeira pergunta a retirar se causar abandono.','options':[['mystic','Ich mag ihre Symbolik und spirituelle Tiefe.','Gosto do simbolismo e da profundidade espiritual.'],['open','Ich bin offen, auch wenn ich nicht alles glaube.','Estou aberta, mesmo sem acreditar em tudo.'],['simple','Ich bin neugierig und mag klare, einfache Erklärungen.','Sou curiosa e gosto de explicações claras e simples.']]},
{'id':'name','title':'Wie dürfen wir dich nennen?','pt':'Como podemos te chamar?','why':'Primeiro nome opcional; não aumenta a interpretação da mão.','placeholder':'Dein Vorname (optional)'},
{'id':'hand','title':'Welche Hand möchtest du fotografieren?','pt':'Qual mão você quer fotografar?','why':'Elimina confusão entre as mãos e garante legenda correta. F05–F07, YouTube 17–18.','options':[['right','Meine rechte Hand.','Minha mão direita.'],['left','Meine linke Hand.','Minha mão esquerda.']]}]
branches={
'connection':{'title':'Nähe, die sich für dich stimmig anfühlt','pt':'Uma proximidade que faça sentido para você','intro':'Du möchtest eine bestimmte Verbindung besser verstehen. Dein Porträt greift deshalb auf, was dir in dieser Verbindung wichtig ist und welche Form von Nähe du dir wünschst.','chapter':'Deine Verbindung: Nähe, Erwartungen und Gegenseitigkeit','question':'Woran würdest du im Alltag erkennen, dass Nähe von beiden Seiten kommt?'},
'closure':{'title':'Ein neues Kapitel, in dem deine Geschichte Platz hat','pt':'Um novo capítulo em que sua história tem lugar','intro':'Du möchtest mit einer vergangenen Liebe Frieden schließen. Dein Porträt gibt dieser Geschichte Raum und richtet den Blick auf das, was du für dich mitnehmen oder hinter dir lassen möchtest.','chapter':'Dein Übergang: Erinnerungen, Abschied und neuer Raum','question':'Was möchtest du aus dieser Geschichte bewahren — und was nicht weitertragen?'},
'new':{'title':'Raum für eine Liebe, in der du du selbst sein kannst','pt':'Espaço para um amor em que você possa ser você mesma','intro':'Du möchtest dich für eine neue Liebe öffnen. Dein Porträt stellt deshalb deine Wünsche an Nähe, Vertrauen und einen neuen Anfang in den Mittelpunkt.','chapter':'Dein Neubeginn: Vertrauen, Wünsche und Möglichkeiten','question':'Welche kleine Erfahrung würde dir zeigen, dass du dich bei jemandem wohl und frei fühlst?'}}
(O/'quiz-copy-data.json').write_text(json.dumps({'questions':qs,'branches':branches,'price':34.90,'expressFee':9,'standardHours':24,'expressHours':1},ensure_ascii=False,indent=2))
md='''# Manual de copy — Herzlinien-Porträt · versão 1

**Status:** proposta criativa baseada na pesquisa; nenhuma pergunta, preço ou promessa foi validada por vendas. Mercado de trabalho: público adulto de língua alemã. Texto em alemão para a cliente, tradução e orientação em português para a equipe.

## 1. Oferta em uma frase

**DE:** Deine Hand. Deine Geschichte in der Liebe. Dein persönliches Herzlinien-Porträt.

**PT:** Sua mão. Sua história no amor. Seu retrato personalizado da linha do coração.

A cliente recebe sua fotografia com as linhas visíveis mapeadas, uma leitura simbólica contextualizada pelas respostas, um capítulo sobre a situação escolhida e um áudio narrado. A transformação proposta é uma experiência de reconhecimento e reflexão sobre a própria história amorosa. O impacto inicial vem da imagem; o valor pago depende de um texto que faça sentido para a situação informada.

Mecanismo de trabalho: **Handbild + Herzfrage + persönliche Deutung** — imagem da mão + questão do coração + interpretação pessoal. É um nome descritivo de processo, não uma descoberta científica ou tradição exclusiva inventada.

## 2. Rosto e expert

**Nome de trabalho recomendado: Clara Falk.** Alternativas criativas: Helena Winter e Nora Stein. São propostas de identidade, sem verificação de disponibilidade comercial ou associação a uma pessoa real. Não são especialistas pesquisadas.

Para a versão de produção, contratar uma apresentadora ou profissional real, usar sua imagem autorizada e atribuir apenas o trabalho que ela realmente fizer. Clara Falk pode ser um nome artístico adotado por essa pessoa. Se for somente uma personagem virtual, identificar essa condição e apresentá-la como guia, sem inventar carreira, clientes ou revisão humana.

**Direção de casting:** mulher com aparência entre 40 e 50 anos, expressão tranquila, olhar direto, cabelo natural, roupa verde escura ou creme, ambiente com luz de janela e poucos elementos. Retrato editorial próximo, mãos visíveis em peças secundárias, sem figurino de vidente. Aparência sugerida é decisão criativa, não conclusão demográfica da pesquisa.

**Apresentação quando houver profissional real responsável:**

DE: „Ich bin Clara. Ich begleite dich durch dein Herzlinien-Porträt — von deiner Frage bis zu deiner persönlichen symbolischen Deutung.“

PT: “Sou Clara. Vou te acompanhar pelo seu retrato da linha do coração — da sua pergunta à sua interpretação simbólica personalizada.”

Usar essa versão apenas se a pessoa de fato assumir esse papel. Se a produção for automática, trocar por: „Dein Herzlinien-Porträt verbindet dein Handfoto mit deinen Antworten. Die symbolische Deutung wird KI-gestützt erstellt.“ / “Seu retrato combina a foto da sua mão com suas respostas. A interpretação simbólica é produzida com auxílio de IA.”

O preview usa uma silhueta marcada como espaço para retrato. O nome está identificado como conceito fictício; nenhum depoimento, diploma ou histórico foi inventado.

## 3. Estrutura e economia do funil

Entrada → intenção → contexto → tensão → desejo → tom → nome → mão → foto → preparação → prévia → oferta → pagamento → confirmação → entrega.

São cinco perguntas de conteúdo e dois campos de personalização. Uma pergunta por tela; voltar preserva respostas compatíveis. Mudar intenção limpa a resposta de contexto. Nome é opcional. Todas as dores são alternativas escolhidas pela pessoa: não impor feridas ou abandono a quem entrou por curiosidade.

**Condições comerciais no rascunho:**

| Opção | Preço de teste | Entrega proposta |
|---|---:|---|
| Padrão | 34,90 € | Até 24 horas após pagamento e recebimento de foto utilizável |
| Expressa | 43,90 € | Até 1 hora, incluindo adicional de 9,00 € |

O usuário definiu 24 horas e adicional de €9. Preço base de €34,90 e prazo expresso de 1 hora são hipóteses propostas aqui. O expresso só entra em produção se a operação conseguir cumpri-lo. Mesmo conteúdo nas duas opções; muda apenas a prioridade de entrega. Padrão pré-selecionado, adicional voluntário, total visível antes de pagar. Compra única como proposta desta versão.

## 4. Tela de entrada

**Selo:** Dein persönliches Herzlinien-Porträt / Seu retrato personalizado da linha do coração.

**Headline:** Welche Geschichte möchtest du in deiner Herzlinie entdecken?

**Tradução:** Que história você gostaria de descobrir na sua linha do coração?

**Corpo:** Beantworte ein paar Fragen zu dem, was dich in der Liebe bewegt. Lade anschließend ein Foto deiner Hand hoch und entdecke deine persönliche Vorschau.

**Tradução:** Responda algumas perguntas sobre o que te move no amor. Depois envie uma foto da sua mão e descubra sua prévia personalizada.

**CTA:** Mein Porträt beginnen / Começar meu retrato.

**Microcopy:** Quiz und Vorschau kostenlos. Das vollständige Porträt ist kostenpflichtig. / Quiz e prévia gratuitos. O retrato completo é pago.

**Enquadramento próximo ao CTA:** Symbolische Handlesung zur Selbstreflexion. / Leitura simbólica da mão para autorreflexão.

A promessa inicial deixa claro que existe prévia gratuita e produto pago. Sem percentual de precisão, contagem fictícia de clientes ou oferta prestes a acabar.

## 5. Perguntas — copy pronta

'''
for i,q in enumerate(qs,1):
 md+=f"### Q{i}. {q['title']}\n\n**PT:** {q['pt']}\n\n"
 if q.get('options'):
  for key,de,pt in q['options']:md+=f"- `{key}` — **{de}** / {pt}\n"
 if q.get('branches'):
  for k,opts in q['branches'].items():
   md+=f"\n**Ramo `{k}`:**\n\n"
   for key,de,pt in opts:md+=f"- `{key}` — **{de}** / {pt}\n"
 if q.get('placeholder'):md+=f"Campo: **{q['placeholder']}**. Botão secundário: **Ohne Namen weiter** / Continuar sem nome.\n"
 md+=f"\n**Função:** {q['why']}\n\n"
md+='''## 6. Envio da foto

**DE:** Jetzt bekommt dein Porträt deine persönliche Form.

**PT:** Agora seu retrato ganha a sua forma pessoal.

**DE:** Fotografiere deine {rechte/linke} Handfläche bei gleichmäßigem Licht. Halte die Hand entspannt und zeige die gesamte Handfläche. Achte darauf, dass die Linien scharf zu erkennen sind.

**PT:** Fotografe a palma da sua mão {direita/esquerda} com iluminação uniforme. Mantenha a mão relaxada e mostre toda a palma. Confira se as linhas estão nítidas.

**Botões:** Foto aufnehmen oder auswählen / Tirar ou escolher foto; Anderes Foto wählen / Escolher outra foto; Meine Vorschau vorbereiten / Preparar minha prévia.

**Falha real de qualidade:** Die Linien sind auf diesem Foto noch nicht deutlich genug zu erkennen. Bitte versuche es bei mehr Licht und ohne Bewegungsunschärfe erneut. / Ainda não é possível distinguir bem as linhas nesta foto. Tente novamente com mais luz e sem tremido.

A seleção de mão serve à identificação da imagem; não afirmar que uma mão mostra destino e outra escolhas como um fato. Permitir qualquer uma, manter a legenda consistente e nunca gerar uma linha inexistente para justificar um texto.

Produção: antes do envio, informar o uso real da foto, o prazo de retenção e como pedir exclusão. Essa copy depende da operação efetivamente implementada; não inserir uma promessa de apagamento sem suporte. No preview, a imagem fica apenas na memória da página, sem upload, armazenamento persistente ou análise de IA.

## 7. Preparação / análise

**Headline:** Deine persönliche Vorschau wird vorbereitet. / Sua prévia personalizada está sendo preparada.

Estados previstos para produção, exibidos apenas quando a etapa correspondente realmente ocorrer:

1. **Foto auf Lesbarkeit prüfen.** / Verificar se a foto permite leitura.
2. **Sichtbare Handlinien markieren.** / Marcar as linhas visíveis.
3. **Deine Antworten einordnen.** / Organizar suas respostas.
4. **Deine Vorschau zusammenstellen.** / Preparar sua prévia.

Sem mensagens como “conexão cármica detectada”, “chance de reconciliação: 97%” ou “Clara está pessoalmente analisando” quando isso não ocorre. A animação não é prova de análise. Se algo falhar, informar e permitir nova foto; não preencher com falso resultado.

O preview mostra uma demonstração breve identificada, sem simular uma análise real da mão. A prévia gratuita fica pronta na sessão; o prazo de 24h/1h é do produto completo após a compra.

## 8. Prévia personalizada e regras de composição

**Estrutura:** nome opcional → título do ramo → contexto escolhido → tensão escolhida → desejo escolhido → foto → amostra simbólica válida, quando disponível → conteúdo do retrato completo.

Prefixar os trechos de questionário com **Aus deinen Antworten** / A partir das suas respostas. Reservar **Auf deinem Handfoto** / Na foto da sua mão para observações visuais reais e verificáveis. Não transformar o que a cliente contou numa suposta descoberta da foto.

'''
for k,b in branches.items():
 md+=f"### Ramo {k}\n\n**Título DE:** {b['title']}\n\n**PT:** {b['pt']}\n\n**Prévia DE:** {b['intro']}\n\n**Capítulo prometido:** {b['chapter']}\n\n**Pergunta de reflexão:** {b['question']}\n\n"
md+='''### Exemplo composto — cliente fictícia Lena

Respostas: conexão específica + aproximação e afastamento + querer ser escolhida + reciprocidade + linguagem simples + mão direita.

**DE:**

Lena, dein Thema ist Nähe, auf die du dich verlassen kannst.

Du hast beschrieben, dass sich Nähe und Abstand abwechseln. Gleichzeitig wünschst du dir, wirklich gewählt zu werden und Nähe von beiden Seiten zu erleben. Dein Porträt nimmt deshalb Gegenseitigkeit als roten Faden auf.

Ein erster Impuls für dich: Woran würdest du im Alltag erkennen, dass du diese Verbindung nicht allein tragen musst?

**PT:**

Lena, seu tema é uma proximidade com a qual você possa contar.

Você descreveu uma alternância entre proximidade e distância. Ao mesmo tempo, deseja ser realmente escolhida e viver uma aproximação dos dois lados. Por isso, seu retrato terá a reciprocidade como fio condutor.

Uma primeira reflexão: como você perceberia, no dia a dia, que não precisa sustentar essa conexão sozinha?

Esse exemplo não é inferido de uma mão. Para a produção, acrescentar imagem anotada e um parágrafo de simbolismo somente depois de verificar a linha mostrada. Quando não houver confiança visual, pedir nova imagem.

**Controle de personalização:** Q1 muda título e capítulo; Q2 muda contexto; Q3 muda a questão central; Q4 muda o encerramento e a reflexão; Q5 muda apenas o registro do texto; Q6 muda o tratamento; Q7 muda a legenda da imagem. Nenhuma resposta aumenta a chance de um resultado favorável.

## 9. Oferta — copy pronta

**Headline DE:** Dein vollständiges Herzlinien-Porträt.

**Apoio DE:** Ein persönliches Gesamtbild aus deinem Handfoto, deiner Geschichte und deiner Frage an die Liebe.

**PT:** Seu retrato completo da linha do coração. Uma visão pessoal construída com a foto da sua mão, sua história e sua pergunta sobre o amor.

**Conteúdo DE / PT:**

- **Dein Handfoto mit markierten, erkennbaren Linien.** / Sua foto com as linhas identificáveis marcadas.
- **Eine verständliche symbolische Deutung.** / Uma interpretação simbólica fácil de entender.
- **Dein persönliches Kapitel: {chapter}.** / Seu capítulo pessoal conforme o ramo.
- **Drei Impulse für dein nächstes Kapitel in der Liebe.** / Três reflexões para o próximo capítulo amoroso.
- **Dein Porträt als PDF und vertonte Zusammenfassung.** / Seu retrato em PDF e resumo narrado.

**Padrão:** Standard · 34,90 € · Innerhalb von 24 Stunden.

**Adicional:** Express hinzufügen: +9,00 € · Innerhalb von 1 Stunde.

**Microcopy:** Gleicher Inhalt. Schnellere Bereitstellung. Einmalige Zahlung, kein Abonnement. / Mesmo conteúdo. Entrega mais rápida. Pagamento único, sem assinatura.

**Prazo:** Die Lieferzeit beginnt nach Zahlungseingang und sobald ein geeignetes Handfoto vorliegt. / O prazo começa após confirmação do pagamento e recebimento de uma foto adequada.

**Resumo junto ao CTA:** Dein Gesamtpreis: {34,90/43,90} €. / Seu preço total: {34,90/43,90} €.

**CTA comercial DE:** Jetzt für {total} € bestellen. / Pedir agora por {total} €.

No preview, o botão é “Demo-Bestellung ansehen” para não sugerir uma compra real. Em produção, checkout, tributos e documentos comerciais exigem configuração própria; este manual não é implementação nem revisão jurídica de checkout.

**FAQ:**

- **Was macht mein Porträt persönlich?** Dein Foto, deine gewählte Frage und deine Antworten bestimmen die Darstellung und den Schwerpunkt deiner Deutung. / Sua foto, sua pergunta e suas respostas determinam a apresentação e o foco.
- **Erfahre ich, was eine andere Person fühlt?** Das Porträt deutet deine Hand symbolisch und greift deine Sicht auf die Verbindung auf. Die Gefühle anderer Menschen lassen sich daraus nicht feststellen. / O retrato interpreta sua mão simbolicamente e usa a sua perspectiva; não determina sentimentos de outras pessoas.
- **Muss ich fest daran glauben?** Nein. Du kannst die Deutung auch als persönlichen Impuls zur Selbstreflexion nutzen. / Não. Você também pode usar como reflexão pessoal.
- **Wird das Porträt mit KI erstellt?** Ja, die Ausarbeitung wird KI-gestützt erstellt. / Sim, a produção usa auxílio de IA. Acrescentar revisão humana somente se for real.
- **Was ist bei Express anders?** Nur die Lieferzeit. Du erhältst denselben vollständigen Inhalt. / Apenas o prazo. O conteúdo completo é o mesmo.

## 10. Entrega final — escopo que sustenta a oferta

Proposta de PDF de 8–12 páginas; extensão e áudio são especificações a produzir, não produtos existentes. Resumo narrado de aproximadamente 5–8 minutos, com identificação de voz sintética se utilizada. Incluir tudo em ambas as modalidades.

1. **Capa:** primeiro nome opcional, foto e título do ramo.
2. **Sua questão:** resumo fiel e editável das respostas, sem diagnóstico.
3. **Mapa da mão:** foto original com sobreposição de linhas realmente identificadas, legenda da mão e áreas sem leitura suficiente.
4. **Linha do coração:** observação visual, interpretação tradicional explicitamente simbólica e conexão com a pergunta escolhida.
5. **Outras linhas identificáveis:** cabeça e vida, quando visíveis, como temas simbólicos de reflexão. Nenhuma previsão de doença, morte ou duração da vida. Não prometer mapear linhas finas que a fotografia não captura.
6. **Capítulo específico:** conexão / encerramento / novo amor, com referências concretas às respostas.
7. **Três reflexões aplicáveis:** reconhecer uma necessidade, observar uma situação cotidiana e definir uma pequena escolha pessoal.
8. **Fechamento:** o que a cliente deseja levar para o próximo capítulo; link para baixar PDF e áudio novamente.

**Bloco-modelo para cada linha:** “Na imagem observamos {descrição visual verificada}. Nesta leitura simbólica, usamos essa característica como convite para pensar sobre {tema}. Você informou {resposta}; por isso, a reflexão que propomos é {pergunta}.” Não preencher observações visuais com um gerador de texto sem verificação de imagem.

**Confirmação de pedido DE:** Danke, {name}. Dein vollständiges Porträt wird vorbereitet. Du erhältst es innerhalb von {24 Stunden/1 Stunde}, sobald deine Zahlung und ein geeignetes Foto vorliegen. / Obrigada, {nome}. Seu retrato completo será preparado. Você o receberá em até {24 horas/1 hora} após pagamento e foto adequada.

Coletar e-mail para entrega no checkout, não inventar necessidade de e-mail antes da prévia. Confirmar endereço, modalidade, total, hora limite real e canal de suporte. Não acrescentar newsletter automaticamente.

## 11. Direção visual do preview

Verde profundo, marfim e dourado discreto; tipografia editorial, espaços amplos, foco na mão. A pessoa deve entender a pergunta em uma leitura rápida. O retrato da expert aparece na entrada e na oferta, sem ocupar todas as telas. Mostrar o preço sem esconder o total na opção expressa.

O HTML é uma maquete navegável local: perguntas ramificadas, tradução e notas opcionais, foto local, preparação demonstrativa, prévia com as respostas, oferta com total atualizado e amostra da entrega. Não possui IA, pagamento, e-mail nem envio da foto. O mapa ilustrativo da entrega não representa linhas extraídas da imagem da visitante.

## 12. O que esta pesquisa permite testar

Apoio qualitativo: tensão entre intuição e medo; desejo de reciprocidade; persistência de uma história passada; dúvida sobre leituras genéricas; interesse em explicações compreensíveis. Não há dados para dizer que essas perguntas já convertem.

Primeiro teste: manter a mesma oferta e comparar entrada pela conexão atual, recomeço e curiosidade sobre a mão. Medir conclusão por pergunta, conclusão do envio, visualização da oferta, compra, adesão ao expresso, cumprimento do prazo e satisfação. Evitar avaliar sucesso só pelo clique na animação.

Revisão antes de publicação: alemão por redator nativo; identidade e imagem da apresentadora; capacidade real de mapear linhas; produção de PDF/áudio; prazo expresso; tratamento da foto; preço e checkout. Isso é uma lista de implementação, não um pedido de permissão para continuar este rascunho.

## Referências usadas

- [Banco qualitativo: Reddit e fóruns](pesquisa-reddit-foruns-amor-alemao.md): R01–R12 e F01–F12, usados como referências internas neste manual.
- [Pesquisa anterior: YouTube](pesquisa-youtube-alemao-amor-quiromancia.md): evidências numeradas 1–20.
- [Intuição e insegurança](https://www.esoterikforum.at/threads/neue-beziehung-und-schon-bald-zu-ende.248286/).
- [Desejo de pertencimento](https://www.reddit.com/r/FragtMaenner/comments/1qxgty1/wie_findet_man_in_der_heutigen_komischen_welt/).
- [Frustração com leituras que prolongam espera](https://www.esoterikforum.at/threads/kartenlegen-erfahrungen-lines.231706/).
- [Dúvidas sobre análise escrita da mão](https://www.esoterikforum.de/threads/1095702-frage-zum-handlesen).
- [Personalização versus leitura coletiva](https://www.gutefrage.net/frage/kartenlegen-ueber-youtube-videos).

Todas as headlines, opções e textos comerciais deste manual são criação nova, não transcrição de consumidores. A entrega padrão de 24h e o adicional de €9 foram fornecidos pelo usuário como referência; não foram novamente verificados no concorrente nesta etapa.
'''
(O/'manual-copy-quiz-herzlinien.md').write_text(md)
print('Manual e dados criados:',len(md.split()),'palavras')
