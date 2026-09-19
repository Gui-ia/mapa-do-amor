# Mapa do Amor — versão 3

Abra `preview-quiz-herzlinien.html` no navegador. Funciona sem instalação ou conexão com a internet. Use o seletor no topo para alternar entre alemão e português; respostas e etapa são preservadas.

## Alterações aplicadas

- Promessa e mapa organizados em passado, presente e futuro.
- Quatro caminhos: novo amor, história passada, relação atual e trajetória inteira.
- Três perguntas com avanço ao selecionar, preservação ao voltar e limpeza de respostas incompatíveis ao mudar de caminho.
- Amostra visual com marcações e explicação antes da foto.
- Nome opcional e identificação da mão junto da foto.
- Prévia demonstrativa com foco conforme o caminho e a pergunta escolhidos.
- Oferta única de €34,90 como hipótese, sem expresso.
- Resumo da oferta sem cobrança ou pedido real.

## O que esta versão faz

É um preview navegável para revisar copy e experiência. Aceita JPG, PNG e WebP de até 10 MB, verifica se o arquivo pode ser aberto como imagem e mostra a foto somente no navegador. Não verifica se a imagem contém uma mão ou linhas legíveis. Respostas, nome e foto permanecem apenas na memória da página; recarregar ou recomeçar limpa a sessão.

A amostra de leitura é editorial e está identificada. Não há análise automática da mão, geração de PDF/áudio, envio de e-mail ou checkout. Como a foto não alimenta uma análise nesta demonstração, ela é opcional. O preço e o prazo exibidos descrevem a oferta planejada.

## Editar a copy

`quiz-copy-data.json` é a fonte dos textos comerciais, perguntas, opções e ramificações, nos dois idiomas.

Depois de editar, execute nesta pasta:

```sh
python3 sync-copy.py
```

Isso atualiza `copy-data.js`, carregado pela página para funcionar inclusive com abertura direta do HTML. Não editar o arquivo gerado manualmente. `app.js` contém a navegação e `style.css` contém o visual.

## Verificação realizada

Testado em Chrome automatizado: quatro caminhos nos dois idiomas, voltar e editar, troca de ramo, reinício, nome com caracteres especiais, tipos e tamanho de arquivo, imagem inválida, identificação da mão, remoção da foto, troca de idioma sem perder informações, teclado, abertura offline e telas de 390 e 320 pixels. Nenhum erro de JavaScript ou pedido de rede externo nos percursos testados. Layout revisado por capturas no desktop e celular.

Análise e decisões detalhadas: `mapa-do-amor-analise-e-decisoes.md`.
Roteiro da copy e escopo de produção: `mapa-do-amor-copy-completa-v3.md`.

A versão anterior está preservada em `../work/backup-antes-v3/`. Os manuais v1/v2 e scripts antigos ficam como histórico; para atualizar esta versão, use `quiz-copy-data.json` e `sync-copy.py`.
