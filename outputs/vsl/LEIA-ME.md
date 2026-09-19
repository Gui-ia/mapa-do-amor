# Página da mini VSL 1

Página independente em português com headline, player VTurb informado pelo usuário e botão de foto. O botão aparece ao atingir 30 segundos do vídeo, pela API do player, e permanece disponível durante a visita. Não é um contador de tempo na página.

A câmera tem confirmação, nova captura e alternativa pela galeria. A imagem fica no navegador, com recuperação na mesma aba e validade de 24 horas; não há envio da foto para servidor nem análise de mãos. Ao confirmar a foto, a visitante segue para `preparando.html`, informa o primeiro nome entre as etapas das três linhas e então chega a `oferta.html`. A página de oferta usa o segundo player VTurb informado pelo usuário.

Para usar a câmera, sirva a página por HTTPS ou localhost. A prévia local desta sessão usa http://127.0.0.1:8892/ . Todos os arquivos devem permanecer juntos. O vídeo precisa de internet e das permissões de domínio configuradas na VTurb.

Players atualizados em 17/09/2026: primeira página `6aac2f6f17052e6db12238cb` (82,02 segundos); oferta `6aac506d76eb195e3e5f046c` (502,17 segundos). Os preloads do vídeo antigo foram removidos.

Verificação em navegador: layouts de computador e celular (390 px sem rolagem horizontal), botão oculto aos 29 s e visível aos 31 s, captura com câmera simulada, confirmação e recuperação da foto ao recarregar. A câmera real de um telefone não foi testada.

## Página de oferta

`oferta.html` segue a referência indicada pelo usuário, com a identidade visual do quiz, leitura das mãos, bônus Animal Espiritual e Limpeza Energética, total avulso R$ 166 e pacote R$ 29 em pagamento único. A garantia é integral, solicitada por mensagem. Não foram adicionados depoimentos, contador de expiração ou assinatura da referência.

O usuário informou que ainda não tem o checkout. `offer-config.js` mantém `paymentUrl` vazio; os botões de compra abrem um aviso de prévia sem cobrança. Quando o usuário fornecer o link HTTPS, basta configurar esse campo. Nenhum dado de foto é enviado ao destino de pagamento.

Validado: 320, 390, 768 e 1280 px sem transbordamento, FAQ, aviso de pagamento indisponível, percurso vídeo → câmera → confirmação → oferta, foto preservada ao atualizar e troca da foto.

## Liberação da oferta aos 8 minutos

`oferta.html` mostra inicialmente a marca, a headline personalizada com o primeiro nome e o segundo player VTurb. O evento de reprodução aos 480 segundos libera o conteúdo da oferta, o botão superior e o rodapé. O primeiro bloco abaixo do vídeo é “Sua leitura completa + 2 presentes”; a apresentação ilustrada e as demais seções vêm depois. A regra da primeira página continua sendo 30 segundos para liberar a câmera.

A autorização da oferta fica no localStorage, com chave exclusiva desta oferta e sem prazo de expiração. É restaurada antes de renderizar a página, funciona entre abas e em visitas futuras no mesmo navegador/origem, enquanto esse armazenamento não for apagado. Não é sincronizada entre dispositivos. Não é um temporizador desde a abertura da página; usa a posição de reprodução do player.

Verificado no player real: oferta oculta aos 479 s e liberada aos 481 s; pacote em primeiro lugar; atualização e nova sessão com dados preservados continuam liberadas mesmo sem carregar o player; visitante novo começa bloqueado; FAQ e prévia de pagamento preservados; sem transbordamento entre 320 e 1280 px.

## Transição entre a foto e a oferta

`preparando.html`, `preparando.css` e `preparando.js` apresentam três etapas: coração, cabeça e vida. Após a primeira, a pergunta original “Como posso te chamar?” pausa a sequência até a visitante informar um nome. O progresso dessa apresentação é visual, sem serviço de análise de imagem conectado. A foto continua apenas no navegador.

O nome e a etapa são guardados no sessionStorage da aba. Recarregar retoma a etapa; uma nova foto reinicia a sequência. Sem foto válida, a página volta ao início. O nome é inserido como texto, nunca HTML. A oferta exibe “Nome, sua leitura está pronta.” acima do vídeo; sem nome salvo, usa a versão genérica. O bloqueio da oferta aos 480 segundos e sua persistência permanecem independentes.

## Reprodução automática na oferta

Abaixo da headline aparece “Assista ao vídeo abaixo para entender.”. Quando o VTurb dispara `player:ready`, a página tenta reproduzir com som; se bloqueado, tenta sem som e mostra um botão para ativar o áudio. Se ambas as tentativas forem bloqueadas, o botão permite iniciar por toque. A regra de 480 segundos permanece baseada na posição de reprodução e a pausa manual é respeitada. A primeira VSL não foi alterada.

Verificado no Chrome com player real: reprodução sem clique ao abrir a oferta, pausa manual e conteúdo ainda oculto no início. Os dois cenários de bloqueio foram verificados com simulação da API.

Ao retornar à primeira página com uma foto válida salva, a visitante avança automaticamente para a preparação (ou para a oferta, se já concluiu as etapas). Não aparece “Ver foto da minha mão”. O link explícito de troca de foto na oferta continua abrindo a edição. Fotos ausentes ou expiradas mantêm a captura inicial.

A pergunta do nome aparece em um popup modal centralizado, com fundo escurecido e desfocado, ao finalizar a primeira etapa (33%). A sequência aguarda a resposta. Confirmar fecha o popup e continua; Escape permite fechar e reabrir pelo botão de continuidade. Validado em 320, 390 e 1280 px, incluindo retomada após atualizar.

Publicado em https://lecturalunar.com pela Cloudflare Workers Static Assets, projeto `lecturalunar-mapa-do-amor`. A configuração de publicação fica em `../cloudflare/wrangler.jsonc`. O domínio público usa URLs sem extensão (`/oferta`, `/preparando`) e também aceita os links `.html`, com redirecionamento automático. `LEIA-ME.md` é excluído da publicação. O checkout continua pendente em `offer-config.js`.
