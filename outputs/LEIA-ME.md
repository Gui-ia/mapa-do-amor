# Mapa do Amor · versão 6

Prévia local em alemão e português. Abra `index.html`, ou use o servidor local em http://127.0.0.1:8876/?lang=pt&v=6. A versão aparece no topo para facilitar a identificação de uma aba antiga.

## Funil

Momento amoroso → tema escolhido → conexão → motivo da procura → pergunta pessoal → transição → desejo → conexão emocional → depoimentos, quando disponíveis → nome → data de nascimento → cidade natal → foto da mão → apresentação animada com duas perguntas → e-mail → página personalizada → resumo da oferta.

O progresso acompanha cada tela: 17 etapas, ou 18 quando houver depoimentos. Quatro caminhos contemplam novo amor, pessoa do passado, relação atual e trajetória inteira. Voltar preserva dados; mudar o caminho limpa respostas incompatíveis. Nome, nascimento, cidade e escolhas reaparecem na apresentação.

A mão de exemplo tem traços dourados e pontos animados em SVG. As transições respeitam a preferência por redução de movimento. A apresentação usa as respostas; não analisa a foto nem afirma detectar linhas na imagem enviada.

## Dados e integrações

Nome, nascimento, cidade, mão, foto e e-mail são obrigatórios neste percurso de demonstração. Há validação de data real e idade mínima de 18 anos. Aceita JPG, PNG e WebP até 10 MB e verifica a decodificação da imagem. Não detecta se ela contém uma mão.

O progresso fica na sessão da aba e a foto no IndexedDB local. Recarregar recupera o ponto salvo; Recomeçar limpa os dados e a foto. Nenhum desses dados é enviado para um servidor. Não há envio de dados, e-mail, geração de PDF/áudio ou cobrança. Preço de €34,90 e prazo de 24 horas são hipóteses da oferta. Clara é uma personagem virtual.

## Depoimentos reais

O carrossel já está integrado, mas permanece oculto enquanto `testimonials.json` estiver vazio. Os textos do cliente ainda estão pendentes. Não foram inseridos números de clientes, avaliações, fotos ou selos inventados.

Para inserir um depoimento, adicione um objeto com `name` e `text`. `text` pode conter os campos `pt` e `de` para as versões aprovadas em cada idioma. Execute `python3 render-testimonials.py` com Pillow instalado. O script cria PNGs na identidade do produto e atualiza a copy. Texto sem tradução é preservado no idioma original.

## Editar textos

A fonte é `quiz-copy-data.json`. Após editar, execute `python3 sync-copy.py` para gerar `copy-data.js`. O comportamento está em `app.js` e o visual em `style.css`. Não editar o bundle de copy manualmente.

## Validação

Percurso completo com dados fictícios, validação de campos obrigatórios, data inexistente, upload local, modais da apresentação, e-mail e resultado personalizado. Troca de idioma preservando dados, navegação entre os quatro caminhos e inspeção de layout no celular. Checagem de sintaxe JavaScript e Python.

A análise da referência e as decisões desta versão estão em `../mapa-do-amor-decisoes-v4.md`.

## Atualização da foto · 4.6

“Tirar foto agora” é a primeira opção. No celular, um seletor com `capture="environment"` solicita a câmera traseira; no computador, a página usa uma prévia de vídeo via `getUserMedia`, com botão Fotografar e cancelamento. A galeria permanece separada. Um SVG próprio demonstra palma voltada à câmera, mão inteira e enquadramento.

A câmera não solicita áudio. Os tracks são encerrados ao capturar, cancelar, renderizar outra tela ou sair da página; uma permissão concedida depois de cancelar também encerra o stream. Falhas de permissão e indisponibilidade exibem alternativa pela galeria. Os arquivos continuam locais.

Verificado: seleção pela galeria, preview e remoção, abertura e cancelamento do modal, layout em 390 px e testes isolados de captura, permissão negada e liberação tardia. A captura por hardware real em Android/iOS não foi testada nesta máquina.

Referências técnicas: [HTML capture](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture) e [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).

## Atualização 5 · ASK e oferta final

A pergunta inicial agora identifica o momento amoroso. A pergunta de contexto identifica o motivo da procura, com opções por caminho. Durante a apresentação, uma pergunta sobre a dificuldade substitui a de crença e altera a explicação final. Os títulos finais também variam por caminho. A análise está em `../mapa-do-amor-ASK-analise-v5.md`.

A imagem da apresentação e da página final é `assets/mapa-final-rosa.png`, com traçados SVG exclusivos. A abertura usa a mão anterior. A legenda sobre a visualização saiu da arte; a informação sobre a foto não ser analisada permanece na etapa da foto e no FAQ.

O botão fixo na página final leva ao pacote. Base: €34,90; expressa: +€9,99 e prazo proposto de 6 horas em vez de 24; total expresso: €44,89. A escolha reflete no topo, pacote e resumo e é preservada ao trocar o idioma ou voltar do resumo. Garantia proposta de reembolso integral em até 14 dias após recebimento, inclusive para expressa. Ainda não há compra nem prestação de serviço conectada.

A configuração `offer.availability` contém as três vagas informadas pelo usuário para 16/09/2026. O prazo é fixo: 17/09/2026 00:00 no fuso Europe/Berlin. `offer-state.js` calcula tempo restante e total. Ao expirar, o CTA para prosseguir fica desabilitado; a data não muda automaticamente para o dia seguinte. Não existe contagem artificial decrescente de vagas. Produção depende de disponibilidade compartilhada e validação do prazo pelo servidor, pois o protótipo usa o relógio do dispositivo.

Não foi inventado preço anterior ou valor avulso para produzir desconto. A apresentação mostra os componentes incluídos no pacote. Os depoimentos continuam aguardando os textos do usuário.

Validação adicional: percurso até resultado e resumo, pergunta condicional durante a apresentação, total padrão/expresso, idioma, largura de 320 px, proporções da nova imagem e posição do título. Testes isolados cobrem cálculo em centavos, instante de expiração, indisponibilidade e ausência de renovação diária; testes de câmera continuam passando.

## Ajuste 5.1 · ritmo da apresentação

A apresentação intermediária não mostra mais a mão. Os três trechos duram 8, 8 e 9 segundos, além do tempo de resposta nos modais. Os textos surgem em 8%, 42% e 76%, com tempo para leitura antes da próxima pergunta. A preferência por redução de movimento continua respeitada. A nova mão aparece na página final; a amostra da abertura permanece.

## Atualização 6 · reescrita da copy e segmentação

A abertura, as perguntas, as transições e a oferta foram reescritas em português e alemão. A pergunta central é se o grande amor já passou pela vida da pessoa ou ainda está por chegar. O texto final combina tema e dificuldade declarada; quem escolhe apenas conhecer a leitura recebe uma abertura de curiosidade, sem presumir sofrimento. Há 12 aberturas por dificuldade, quatro padrões por tema e quatro versões de curiosidade.

O documento `../mapa-do-amor-copy-v6.md` reúne a redação e como os princípios estudados foram aplicados. Preço, prazos, disponibilidade, garantia, upload e ritmo da apresentação foram preservados. A etapa final não exibe contagem de etapas nem barra de progresso.

Validação: percurso completo de novo amor até a oferta, troca de idioma com dados preservados, layout de 390 px sem transbordamento, seleção condicional nos quatro temas, prioridade para curiosidade e alternativa neutra para respostas privadas. Checagem de sintaxe e testes existentes de câmera e condições da oferta passaram.

## Atualização 6.12: continuar após atualizar

A etapa, respostas, campos parcialmente preenchidos, idioma, foto, opção expressa, posição da página e estado da apresentação são recuperados após F5. O progresso usa sessionStorage, separado por aba; a foto é guardada como Blob no IndexedDB, sem compressão ou envio a servidor. A sessão tem validade de 24 horas desde o último salvamento, e fotos com mais de 24 horas são removidas na próxima inicialização. Recomeçar limpa o progresso e exclui a foto associada.

A câmera não reabre ao restaurar a página. Dados de sessão incompatíveis ou corrompidos são descartados, e etapas com respostas essenciais ausentes voltam ao primeiro campo pendente. Navegadores que bloqueiem o armazenamento local continuam permitindo o percurso, mas podem não recuperar dados/fotos no F5. A disponibilidade da oferta mantém o prazo fixo e não é renovada pela restauração.

Verificado no navegador: F5 na segunda pergunta, nome parcialmente preenchido, foto e mão escolhida, modal aos 33%, continuação da animação, página final com expressa e total €44,89, idioma alemão e posição de rolagem. Recomeçar seguido de F5 permanece na abertura. Testes isolados cobrem expiração, dados corrompidos, formato incompatível, limpeza e armazenamento bloqueado; os testes de câmera e disponibilidade continuam passando.

## Atualização 6.13: ancoragem com valores informados

Valores avulsos fornecidos pelo usuário: mapa €74,90, leitura €9,90 e áudio €12,90. Soma €97,70; pacote €34,90; economia €62,80. A comparação é identificada como valor dos itens separados. Os valores aparecem riscados por item e no total. Com expressa, os totais comparados passam a €107,69 e €44,89, preservando a economia de €62,80. Cálculos realizados em centavos e testados nas duas opções.

## Atualização 6.14: moeda por idioma e preço somente na oferta

Português usa BRL (R$), alemão usa EUR (€), mantendo os valores numéricos configurados. Não há conversão cambial. Isso vale para itens avulsos, pacote, economia, expressa e resumo. O botão fixo do topo não exibe preço; os valores aparecem no bloco de compra ao final da página de resultado e no resumo posterior. A abertura e as perguntas não exibem valores.
